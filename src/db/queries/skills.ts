import { desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { skills, user } from "@/db/schema";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

type SearchSkillsParams = {
	searchTerm?: string;
	limit?: number;
};

export async function GetSkills({
	searchTerm,
	limit = DEFAULT_LIMIT,
}: SearchSkillsParams) {
	const term = searchTerm?.trim() ?? "";
	const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);

	if (!term) {
		return db
			.select({
				id: skills.id,
				title: skills.title,
				description: skills.description,
				tags: skills.tags,
				createdAt: skills.createdAt,
				installCommand: skills.installCommand,
				author: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			})
			.from(skills)
			.leftJoin(user, eq(skills.authorId, user.id))
			.orderBy(desc(skills.createdAt))
			.limit(safeLimit);
	}

	return db
		.select({
			id: skills.id,
			title: skills.title,
			description: skills.description,
			tags: skills.tags,
			createdAt: skills.createdAt,
			installCommand: skills.installCommand,
			author: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		})
		.from(skills)
		.leftJoin(user, eq(skills.authorId, user.id))
		.where(
			or(
				ilike(skills.title, `%${term}%`),
				ilike(skills.description, `%${term}%`),
			),
		)
		.orderBy(desc(skills.createdAt))
		.limit(safeLimit);
}

export type GetSkillsData = Awaited<ReturnType<typeof GetSkills>>;
