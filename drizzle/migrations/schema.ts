import { pgTable, varchar, foreignKey, serial, text, timestamp, integer, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	uid: varchar({ length: 255 }).primaryKey().notNull(),
	userRole: varchar("user_role", { length: 50 }).notNull(),
});

export const projects = pgTable("projects", {
	projectId: serial("project_id").primaryKey().notNull(),
	projectName: varchar("project_name", { length: 255 }).notNull(),
	projectDescription: text("project_description"),
	projectLink: varchar("project_link", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	createdByUid: varchar("created_by_uid", { length: 255 }),
	customDomain: varchar("custom_domain", { length: 255 }),
	contactInstagram: varchar("contact_instagram", { length: 255 }),
	contactLinkedin: varchar("contact_linkedin", { length: 255 }),
	contactEmail: varchar("contact_email", { length: 255 }),
	contactWhatsapp: varchar("contact_whatsapp", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.createdByUid],
			foreignColumns: [users.uid],
			name: "fk_projects_created_by"
		}).onDelete("set null"),
]);

export const teamMembers = pgTable("team_members", {
	memberId: serial("member_id").primaryKey().notNull(),
	projectId: integer("project_id"),
	name: varchar({ length: 100 }),
	linkedin: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.projectId],
			name: "fk_team_members_project"
		}).onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	categoryId: serial("category_id").primaryKey().notNull(),
	category: varchar({ length: 100 }).notNull(),
});

export const categoryOptionValues = pgTable("category_option_values", {
	optionId: serial("option_id").primaryKey().notNull(),
	optionName: varchar("option_name", { length: 255 }).notNull(),
	categoryId: integer("category_id"),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.categoryId],
			name: "fk_category_option_values_category"
		}).onDelete("cascade"),
]);

export const projectOptions = pgTable("project_options", {
	id: serial().primaryKey().notNull(),
	projectId: integer("project_id"),
	categoryId: integer("category_id"),
	optionId: integer("option_id"),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.projectId],
			name: "fk_project_options_project"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.categoryId],
			name: "fk_project_options_category"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.optionId],
			foreignColumns: [categoryOptionValues.optionId],
			name: "fk_project_options_option"
		}).onDelete("cascade"),
	unique("unique_project_option").on(table.projectId, table.optionId),
]);
