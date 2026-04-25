import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const skills = pgTable("skills", {
	id: uuid("id").primaryKey().defaultRandom(),
	authorId: text("author_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	tags: text("tags").array(),
	installCommand: text("install_command"),
	promptConfig: text("prompt_config"),
	usageExample: text("usage_example"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skillsRelations = relations(skills, ({ one }) => ({
	author: one(user, {
		fields: [skills.authorId],
		references: [user.id],
	}),
}));
