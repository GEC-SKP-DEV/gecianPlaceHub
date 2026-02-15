import { db } from "./db";
import { users, projects } from "./schema";

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    // ================= USERS =================
    await db.insert(users).values([
      { uid: "admin-placement", userRole: "admin" },
      { uid: "student-john", userRole: "student" },
      { uid: "student-priya", userRole: "student" },
      { uid: "student-rahul", userRole: "student" },
    ]).onConflictDoNothing();

    // ================= JOB POSTINGS =================
    await db.insert(projects).values([
      {
        companyName: "Google",
        roleName: "Software Engineer",
        companyDescription: "Work on distributed systems at scale.",
        googleFormLink: "https://forms.google.com/google",
        jobType: "Full-Time",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "No Backlog",
        passoutYear: "2025",
        venue: "Bangalore",
        ctc: "25-40 LPA",
        driveDate: new Date("2026-02-20"),
        registrationDeadline: new Date("2026-02-15"),
        createdByUid: "admin-placement",
      },
      {
        companyName: "Microsoft",
        roleName: "Cloud Solutions Architect",
        companyDescription: "Design Azure cloud solutions.",
        googleFormLink: "https://forms.google.com/microsoft",
        jobType: "Full-Time",
        department: "IT",
        qualification: "M.Tech",
        backlog: "No Backlog",
        passoutYear: "2025",
        venue: "Hyderabad",
        ctc: "15-25 LPA",
        driveDate: new Date("2026-03-05"),
        registrationDeadline: new Date("2026-02-28"),
        createdByUid: "admin-placement",
      },
      {
        companyName: "Amazon",
        roleName: "Data Engineer",
        companyDescription: "Build scalable data platforms.",
        googleFormLink: "https://forms.google.com/amazon",
        jobType: "Full-Time",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "Max 1",
        passoutYear: "2025",
        venue: "Bangalore",
        ctc: "15-25 LPA",
        driveDate: new Date("2026-03-15"),
        registrationDeadline: new Date("2026-03-10"),
        createdByUid: "admin-placement",
      },
      {
        companyName: "TCS",
        roleName: "Intern",
        companyDescription: "Enterprise internship program.",
        googleFormLink: "https://forms.google.com/tcs",
        jobType: "Internship",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "No Backlog",
        passoutYear: "2026",
        venue: "Delhi",
        ctc: "5-10 LPA",
        driveDate: new Date("2026-04-01"),
        registrationDeadline: new Date("2026-03-25"),
        createdByUid: "admin-placement",
      },
    ]).onConflictDoNothing();

    console.log("✅ Seed completed successfully.\n");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
