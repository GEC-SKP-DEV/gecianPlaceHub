import { db } from "@/lib/db";
import { projects, teamMembers, projectOptions, categories, categoryOptionValues, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

async function verifyPostLogic() {
  console.log("🚀 Starting POST logic verification...");

  // Mock data mimicking what the frontend sends
  const firebaseUid = "student1"; // Use an existing seeded user
  const projectName = "Test Project " + Date.now();
  const projectDescription = "This is a test project to verify DB insertion.";
  const projectLink = "https://example.com";
  const createdAt = new Date().toISOString();
  const customDomain = "test.domain.com";
  const contactInstagram = "@test";
  const contactLinkedIn = "linkedin.com/test";
  const contactEmail = "test@example.com";
  const contactWhatsApp = "1234567890";

  const members = [{ name: "Test Member", linkedin: "linkedin.com/testmember" }];
  
  // Mock category options
  const projectCategoryOptions = [
    { categoryName: "Project Type", optionName: "Personal Project" },
    { categoryName: "Department", optionName: "CSE" },
    { categoryName: "Year of Submission", optionName: "2025" },
    { categoryName: "Domain", optionName: "Web Development" }
  ];

  try {
    // 1. Ensure user exists (already seeded, but running logic anyway)
    await db
      .insert(users)
      .values({
        uid: firebaseUid,
        userRole: 'member',
      })
      .onConflictDoNothing();
    console.log("✅ User check/insert passed");

    // 2. Insert Project
    const [newProject] = await db.insert(projects).values({
      projectName,
      projectDescription,
      projectLink,
      createdAt: new Date(createdAt),
      customDomain,
      createdByUid: firebaseUid, 
      contactInstagram,
      contactLinkedIn,
      contactEmail,
      contactWhatsApp,
    }).returning({ projectId: projects.projectId });

    if (!newProject || !newProject.projectId) {
      throw new Error("Failed to insert project");
    }
    console.log(`✅ Project inserted with ID: ${newProject.projectId}`);

    // 3. Insert Members
    if (members && members.length > 0) {
      for (const member of members) {
        await db.insert(teamMembers).values({
          projectId: newProject.projectId,
          name: member.name,
          linkedin: member.linkedin,
        });
      }
      console.log('✅ Team members inserted.');
    }

    // 4. Link Categories
    if (projectCategoryOptions) {
      for (const mapping of projectCategoryOptions) {
        if (mapping.optionName) { 
          const category = await db.select({ categoryId: categories.categoryId }).from(categories).where(eq(categories.category, mapping.categoryName));
          
          if (category.length > 0 && category[0].categoryId) {
            const actualOptionNameForLinking = (mapping.categoryName === 'Domain' && customDomain && mapping.optionName === 'Other') ? 'Other' : mapping.optionName;

            const option = await db.select({ optionId: categoryOptionValues.optionId }).from(categoryOptionValues)
                                   .where(and(
                                       eq(categoryOptionValues.optionName, actualOptionNameForLinking),
                                       eq(categoryOptionValues.categoryId, category[0].categoryId)
                                   ));

            if (option.length > 0 && option[0].optionId) {
              await db.insert(projectOptions).values({
                projectId: newProject.projectId,
                categoryId: category[0].categoryId,
                optionId: option[0].optionId,
              });
              console.log(`✅ Linked category: ${mapping.categoryName} - ${mapping.optionName}`);
            } else {
              console.warn(`⚠️ Option not found for ${actualOptionNameForLinking} in category ${mapping.categoryName}`);
            }
          } else {
            console.warn(`⚠️ Category not found: ${mapping.categoryName}`);
          }
        }
      }
    }

    console.log("🎉 Verification script completed successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

verifyPostLogic();
