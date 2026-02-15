import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";

// -------------------- Users --------------------
export const users = pgTable("users", {
  uid: varchar("uid", { length: 255 }).primaryKey(),
  userRole: varchar("user_role", { length: 50 }).notNull(),
});

// -------------------- Job Postings --------------------
export const projects = pgTable("projects", {
  projectId: serial("project_id").primaryKey(),

  companyName: varchar("company_name", { length: 255 }).notNull(),
  roleName: varchar("role_name", { length: 255 }).notNull(),
  companyDescription: text("company_description"),

  googleFormLink: varchar("google_form_link", { length: 255 }),

  jobType: varchar("job_type", { length: 100 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  qualification: varchar("qualification", { length: 100 }).notNull(),

  backlog: varchar("backlog", { length: 50 }),
  passoutYear: varchar("passout_year", { length: 10 }),

  venue: varchar("venue", { length: 255 }),
  ctc: varchar("ctc", { length: 100 }),

  driveDate: timestamp("drive_date"),
  registrationDeadline: timestamp("registration_deadline"),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  createdByUid: varchar("created_by_uid", { length: 255 }),
}, (table) => ({
  fk_createdBy: foreignKey({
    columns: [table.createdByUid],
    foreignColumns: [users.uid],
  }),
}));
