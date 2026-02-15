import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { jobPostings, jobContacts, jobFilters, categories, categoryOptionValues, users } from '../../../lib/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

// GET all active job postings with their filters
export async function GET(req: NextRequest) {
  try {
    const allJobs = await db.select().from(jobPostings).leftJoin(jobContacts, eq(jobPostings.jobId, jobContacts.jobId));
    
    // Group contacts by job
    const jobsWithContacts: any[] = allJobs.reduce((acc: any[], row) => {
      const existingJob = acc.find(j => j.jobId === row.job_postings.jobId);
      if (existingJob) {
        if (row.job_contacts) {
          existingJob.jobContacts.push(row.job_contacts);
        }
      } else {
        acc.push({
          ...row.job_postings,
          jobContacts: row.job_contacts ? [row.job_contacts] : [],
        });
      }
      return acc;
    }, []);

    // Fetch filter criteria for each job posting
    const finalJobs = await Promise.all(jobsWithContacts.map(async (job) => {
      const jobFilterOptions: { categoryName: string; optionName: string }[] = [];

      const filters = await db.select({
        categoryId: jobFilters.categoryId,
        optionId: jobFilters.optionId
      })
        .from(jobFilters)
        .where(eq(jobFilters.jobId, job.jobId));

      for (const filter of filters) {
        const category = await db.select({ categoryName: categories.category }).from(categories).where(eq(categories.categoryId, filter.categoryId!));
        if (category.length > 0) {
          const optionValue = await db.select({ optionName: categoryOptionValues.optionName }).from(categoryOptionValues).where(eq(categoryOptionValues.optionId, filter.optionId!));
          
          if (optionValue.length > 0) {
            jobFilterOptions.push({
              categoryName: category[0].categoryName!,
              optionName: optionValue[0].optionName!,
            });
          }
        }
      }

      return {
        ...job,
        filters: jobFilterOptions,
      };
    }));

    console.log('GET /api/job-postings - Final jobs data sent:', JSON.stringify(finalJobs, null, 2));

    return NextResponse.json(finalJobs);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return NextResponse.json({ message: 'Failed to fetch job postings.' }, { status: 500 });
  }
}

// POST - Create new job posting (Admin only)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('__session')?.value;
    console.log('Token from cookie:', token ? 'Found (hidden)' : 'Missing');

    if (!token) {
      console.warn('No token found in cookies');
      return NextResponse.json({ message: 'Unauthorized - Missing Token' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (authError) {
      console.error('Firebase Auth Verification Failed:', authError);
      return NextResponse.json({ message: 'Unauthorized - Invalid Token' }, { status: 401 });
    }

    console.log('Decoded Firebase UID:', decodedToken.uid);
    const firebaseUid = decodedToken.uid;

    const {
      companyName,
      roleTitle,
      roleDescription,
      venue,
      salary,
      ctc,
      lastDate,
      companyLink,
      jobContacts: contacts,
      jobFilterOptions,
      contactEmail,
      contactPhone,
      contactWhatsApp,
    } = await req.json();

    console.log('POST /api/job-postings - Incoming data:', { companyName, roleTitle, jobFilterOptions });

    // Ensure user exists
    await db
      .insert(users)
      .values({
        uid: firebaseUid,
        userRole: 'admin',
      })
      .onConflictDoNothing();

    // Create job posting
    const [newJob] = await db.insert(jobPostings).values({
      companyName,
      roleTitle,
      roleDescription,
      venue,
      salary,
      ctc,
      lastDate: lastDate ? new Date(lastDate) : null,
      companyLink,
      createdByUid: firebaseUid,
      contactEmail,
      contactPhone,
      contactWhatsApp,
    }).returning({ jobId: jobPostings.jobId });

    if (!newJob || !newJob.jobId) {
      console.error('Failed to insert new job posting:', companyName);
      return NextResponse.json({ message: 'Failed to create job posting.' }, { status: 500 });
    }

    console.log('POST /api/job-postings - New job created with ID:', newJob.jobId);

    // Add job contacts
    if (contacts && contacts.length > 0) {
      for (const contact of contacts) {
        await db.insert(jobContacts).values({
          jobId: newJob.jobId,
          name: contact.name,
          designation: contact.designation,
          email: contact.email,
          phone: contact.phone,
        });
      }
      console.log('POST /api/job-postings - Job contacts inserted.');
    }

    // Link job to filter criteria
    if (jobFilterOptions && newJob.jobId) {
      for (const mapping of jobFilterOptions) {
        console.log(`POST /api/job-postings - Processing filter mapping: ${mapping.categoryName} = ${mapping.optionName}`);

        const category = await db.select({ categoryId: categories.categoryId }).from(categories).where(eq(categories.category, mapping.categoryName));
        console.log(`POST /api/job-postings - Category lookup result for ${mapping.categoryName}:`, category);

        if (category.length > 0 && category[0].categoryId) {
          // Handle both single values and arrays (for multi-select)
          const optionNames = Array.isArray(mapping.optionName) ? mapping.optionName : [mapping.optionName];

          for (const optionName of optionNames) {
            if (optionName) {
              const option = await db.select({ optionId: categoryOptionValues.optionId }).from(categoryOptionValues)
                .where(and(
                  eq(categoryOptionValues.optionName, optionName),
                  eq(categoryOptionValues.categoryId, category[0].categoryId)
                ));
              console.log(`POST /api/job-postings - Option lookup result for ${optionName}:`, option);

              if (option.length > 0 && option[0].optionId) {
                await db.insert(jobFilters).values({
                  jobId: newJob.jobId,
                  categoryId: category[0].categoryId,
                  optionId: option[0].optionId,
                });
                console.log('POST /api/job-postings - Inserted into jobFilters.');
              }
            }
          }
        }
      }
    }

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error adding job posting:', error);
    return NextResponse.json({ message: 'Failed to add job posting.' }, { status: 500 });
  }
}

// PUT - Update job posting (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('__session')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - Missing Token' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (authError) {
      return NextResponse.json({ message: 'Unauthorized - Invalid Token' }, { status: 401 });
    }

    const {
      jobId,
      companyName,
      roleTitle,
      roleDescription,
      venue,
      salary,
      ctc,
      lastDate,
      companyLink,
      jobContacts: contacts,
      jobFilterOptions,
      contactEmail,
      contactPhone,
      contactWhatsApp,
    } = await req.json();

    console.log('PUT /api/job-postings - Incoming data:', { jobId, companyName, roleTitle });

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required for update.' }, { status: 400 });
    }

    // Update job details
    await db.update(jobPostings).set({
      companyName,
      roleTitle,
      roleDescription,
      venue,
      salary,
      ctc,
      lastDate: lastDate ? new Date(lastDate) : null,
      companyLink,
      contactEmail,
      contactPhone,
      contactWhatsApp,
    }).where(eq(jobPostings.jobId, jobId));

    console.log('PUT /api/job-postings - Job details updated.');

    // Update contacts: clear existing and insert new ones
    await db.delete(jobContacts).where(eq(jobContacts.jobId, jobId));
    if (contacts && contacts.length > 0) {
      for (const contact of contacts) {
        await db.insert(jobContacts).values({
          jobId: jobId,
          name: contact.name,
          designation: contact.designation,
          email: contact.email,
          phone: contact.phone,
        });
      }
      console.log('PUT /api/job-postings - Job contacts updated.');
    }

    // Update job filter options: clear existing and insert new ones
    await db.delete(jobFilters).where(eq(jobFilters.jobId, jobId));
    if (jobFilterOptions && jobFilterOptions.length > 0) {
      for (const mapping of jobFilterOptions) {
        console.log(`PUT /api/job-postings - Processing filter mapping: ${mapping.categoryName}`);

        const category = await db.select({ categoryId: categories.categoryId }).from(categories).where(eq(categories.category, mapping.categoryName));

        if (category.length > 0 && category[0].categoryId) {
          const optionNames = Array.isArray(mapping.optionName) ? mapping.optionName : [mapping.optionName];

          for (const optionName of optionNames) {
            if (optionName) {
              const option = await db.select({ optionId: categoryOptionValues.optionId }).from(categoryOptionValues)
                .where(and(
                  eq(categoryOptionValues.optionName, optionName),
                  eq(categoryOptionValues.categoryId, category[0].categoryId)
                ));

              if (option.length > 0 && option[0].optionId) {
                await db.insert(jobFilters).values({
                  jobId: jobId,
                  categoryId: category[0].categoryId,
                  optionId: option[0].optionId,
                });
              }
            }
          }
        }
      }
      console.log('PUT /api/job-postings - Job filter options updated.');
    }

    return NextResponse.json({ message: 'Job posting updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating job posting:', error);
    return NextResponse.json({ message: 'Failed to update job posting.' }, { status: 500 });
  }
}

// DELETE - Delete job posting (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('__session')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - Missing Token' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (authError) {
      return NextResponse.json({ message: 'Unauthorized - Invalid Token' }, { status: 401 });
    }

    const { jobId } = await req.json();

    await db.delete(jobFilters).where(eq(jobFilters.jobId, jobId));
    await db.delete(jobContacts).where(eq(jobContacts.jobId, jobId));
    await db.delete(jobPostings).where(eq(jobPostings.jobId, jobId));

    return NextResponse.json({ message: 'Job posting deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return NextResponse.json({ message: 'Failed to delete job posting.' }, { status: 500 });
  }
}
