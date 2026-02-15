import { relations } from "drizzle-orm/relations";
import { users, projects, teamMembers, categories, categoryOptionValues, projectOptions } from "./schema";

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(users, {
		fields: [projects.createdByUid],
		references: [users.uid]
	}),
	teamMembers: many(teamMembers),
	projectOptions: many(projectOptions),
}));

export const usersRelations = relations(users, ({many}) => ({
	projects: many(projects),
}));

export const teamMembersRelations = relations(teamMembers, ({one}) => ({
	project: one(projects, {
		fields: [teamMembers.projectId],
		references: [projects.projectId]
	}),
}));

export const categoryOptionValuesRelations = relations(categoryOptionValues, ({one, many}) => ({
	category: one(categories, {
		fields: [categoryOptionValues.categoryId],
		references: [categories.categoryId]
	}),
	projectOptions: many(projectOptions),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	categoryOptionValues: many(categoryOptionValues),
	projectOptions: many(projectOptions),
}));

export const projectOptionsRelations = relations(projectOptions, ({one}) => ({
	project: one(projects, {
		fields: [projectOptions.projectId],
		references: [projects.projectId]
	}),
	category: one(categories, {
		fields: [projectOptions.categoryId],
		references: [categories.categoryId]
	}),
	categoryOptionValue: one(categoryOptionValues, {
		fields: [projectOptions.optionId],
		references: [categoryOptionValues.optionId]
	}),
}));