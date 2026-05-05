import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	sourceRepo: text("source_repo").notNull(),
	sourcePath: text("source_path").notNull(),
	sourceSha: text("source_sha"),
	isActive: boolean("is_active").default(true).notNull(),
	lastSyncedAt: timestamp("last_synced_at"),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	tags: text("tags").array(),
	installCommand: text("install_command"),
	promptConfig: text("prompt_config"),
	usageExample: text("usage_example"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
