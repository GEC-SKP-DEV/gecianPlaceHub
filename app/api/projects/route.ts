import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { projects, users } from '../../../lib/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Failed to fetch projects.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('__session')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - Missing Token' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (authError) {
      console.error('Firebase Auth Verification Failed:', authError);
      return NextResponse.json({ message: 'Unauthorized - Invalid Token' }, { status: 401 });
    }

    const firebaseUid = decodedToken.uid;

    const {
      companyName,
      roleName,
      companyDescription,
      googleFormLink,
      jobType,
      department,
      qualification,
      backlog,
      passoutYear,
      venue,
      ctc,
      driveDate,
      registrationDeadline,
    } = await req.json();

    // Ensure user exists
    await db
      .insert(users)
      .values({
        uid: firebaseUid,
        userRole: 'member',
      })
      .onConflictDoNothing();

    // Insert job posting
    const [newProject] = await db
      .insert(projects)
      .values({
        companyName,
        roleName,
        companyDescription,
        googleFormLink,
        jobType,
        department,
        qualification,
        backlog,
        passoutYear,
        venue,
        ctc,
        driveDate: driveDate ? new Date(driveDate) : null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        createdByUid: firebaseUid,
        isActive: true,
      })
      .returning({ projectId: projects.projectId });

    if (!newProject || !newProject.projectId) {
      return NextResponse.json({ message: 'Failed to create job posting.' }, { status: 500 });
    }

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error adding job posting:', error);
    return NextResponse.json({ message: 'Failed to add job posting.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const {
      projectId,
      companyName,
      roleName,
      companyDescription,
      googleFormLink,
      jobType,
      department,
      qualification,
      backlog,
      passoutYear,
      venue,
      ctc,
      driveDate,
      registrationDeadline,
    } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required for update.' }, { status: 400 });
    }

    await db
      .update(projects)
      .set({
        companyName,
        roleName,
        companyDescription,
        googleFormLink,
        jobType,
        department,
        qualification,
        backlog,
        passoutYear,
        venue,
        ctc,
        driveDate: driveDate ? new Date(driveDate) : null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      })
      .where(eq(projects.projectId, projectId));

    return NextResponse.json({ message: 'Job posting updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating job posting:', error);
    return NextResponse.json({ message: 'Failed to update job posting.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { projectId } = await req.json();

    await db.delete(projects).where(eq(projects.projectId, projectId));

    return NextResponse.json({ message: 'Job posting deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return NextResponse.json({ message: 'Failed to delete job posting.' }, { status: 500 });
  }
} 