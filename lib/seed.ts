import { db } from "./db";
import { users, projects } from "./schema";

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    // ================= USERS =================
    console.log("📝 Inserting users...");
    await db.insert(users).values([
      { uid: "admin-placement", userRole: "admin" },
      { uid: "student-john", userRole: "student" },
      { uid: "student-priya", userRole: "student" },
      { uid: "student-rahul", userRole: "student" },
    ]).onConflictDoNothing();
    console.log("✅ Users inserted\n");

    // ================= JOB POSTINGS =================
    console.log("📝 Inserting job postings...");
    const now = new Date();
    await db.insert(projects).values([
      {
        companyName: "Google",
        roleName: "Software Engineer - Distributed Systems",
        companyDescription: "Work on distributed systems that impact billions of users. Join Google's engineering team and build cutting-edge technology at scale. We offer competitive compensation, comprehensive benefits, and a collaborative environment.",
        googleFormLink: "https://forms.google.com/google",
        jobType: "Job",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "Allowed",
        passoutYear: "2025",
        venue: "GEC",
        ctc: "25 Lakh+",
        driveDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        createdByUid: "admin-placement",
        isActive: true,
      },
      {
        companyName: "Microsoft Azure",
        roleName: "Cloud Solutions Architect",
        companyDescription: "Design and implement cloud solutions using Azure. Work with cutting-edge cloud technologies and mentor junior engineers. Microsoft offers excellent growth opportunities and a supportive work environment.",
        googleFormLink: "https://forms.google.com/microsoft",
        jobType: "Job",
        department: "IT",
        qualification: "M.Tech",
        backlog: "Not Allowed",
        passoutYear: "2026",
        venue: "SKP",
        ctc: "20 Lakh+",
        driveDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        createdByUid: "admin-placement",
        isActive: true,
      },
      {
        companyName: "Amazon Web Services",
        roleName: "Data Engineer",
        companyDescription: "Build scalable data platforms and data warehouses. Work with AWS services, Spark, and big data technologies. Join a team focused on solving complex data challenges for Amazon customers worldwide.",
        googleFormLink: "https://forms.google.com/amazon",
        jobType: "Job",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "Allowed",
        passoutYear: "2025",
        venue: "NSS College",
        ctc: "18 Lakh+",
        driveDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        createdByUid: "admin-placement",
        isActive: true,
      },
      {
        companyName: "Tata Consultancy Services (TCS)",
        roleName: "Software Development Intern",
        companyDescription: "Join TCS internship program and gain hands-on experience with enterprise software development. Work with experienced mentors on real-world projects. This is an excellent opportunity to launch your career in IT.",
        googleFormLink: "https://forms.google.com/tcs",
        jobType: "Internship",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "Not Allowed",
        passoutYear: "2026",
        venue: "GEC",
        ctc: "<5 Lakh",
        driveDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        createdByUid: "admin-placement",
        isActive: true,
      },
      {
        companyName: "Infosys Technologies",
        roleName: "Frontend Developer",
        companyDescription: "Develop responsive web applications using React and modern web technologies. Collaborate with UX/UI designers and backend engineers. Infosys provides excellent career growth and training opportunities.",
        googleFormLink: "https://forms.google.com/infosys",
        jobType: "Job",
        department: "IT",
        qualification: "B.Tech",
        backlog: "Allowed",
        passoutYear: "2025",
        venue: "SKP",
        ctc: "12 Lakh+",
        driveDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        createdByUid: "admin-placement",
        isActive: true,
      },
      {
        companyName: "Accenture Consulting",
        roleName: "DevOps Engineer",
        companyDescription: "Manage cloud infrastructure and CI/CD pipelines. Work with Docker, Kubernetes, and AWS services. Accenture offers flexible work arrangements and comprehensive professional development.",
        googleFormLink: "https://forms.google.com/accenture",
        jobType: "Job",
        department: "CSE",
        qualification: "B.Tech",
        backlog: "Allowed",
        passoutYear: "2025",
        venue: "NSS College",
        ctc: "15 Lakh+",
        driveDate: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        createdByUid: "admin-placement",
        isActive: true,
      },
    ]).onConflictDoNothing();
    console.log("✅ Job postings inserted\n");

    console.log("🎉 Database seed completed successfully!\n");
    console.log("📊 Summary:");
    console.log("   ✅ Users: 4");
    console.log("   ✅ Job Postings: 6\n");
    console.log("💼 Jobs Added:");
    console.log("   1. Google - Software Engineer");
    console.log("   2. Microsoft - Cloud Solutions Architect");
    console.log("   3. Amazon - Data Engineer");
    console.log("   4. TCS - Software Development Intern");
    console.log("   5. Infosys - Frontend Developer");
    console.log("   6. Accenture - DevOps Engineer\n");

  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
