import { desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { skills, user } from "@/db/schema";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

type SearchSkillsParams = {
  searchTerm?: string;
  limit?: number;
  offset?: number;
};

type CreateSkillParams = {
  authorId: string;
  title: string;
  description: string;
  tags: string[];
  installCommand: string;
  promptConfig: string;
  usageExample: string;
};

export async function GetSkills({
  searchTerm,
  limit = DEFAULT_LIMIT,
  offset = 0,
}: SearchSkillsParams) {
  const term = searchTerm?.trim() ?? "";
  const safeLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const safeOffset = Math.max(offset, 0);

  if (!term) {
    return db
      .select({
        id: skills.id,
        title: skills.title,
        description: skills.description,
        tags: skills.tags,
        createdAt: skills.createdAt,
        installCommand: skills.installCommand,
        promptConfig: skills.promptConfig,
        usageExample: skills.usageExample,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(skills)
      .leftJoin(user, eq(skills.authorId, user.id))
      .orderBy(desc(skills.createdAt))
      .limit(safeLimit)
      .offset(safeOffset);
  }

  return db
    .select({
      id: skills.id,
      title: skills.title,
      description: skills.description,
      tags: skills.tags,
      createdAt: skills.createdAt,
      installCommand: skills.installCommand,
      promptConfig: skills.promptConfig,
      usageExample: skills.usageExample,
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
    .limit(safeLimit)
    .offset(safeOffset);
}

export async function CreateSkill({
  authorId,
  title,
  description,
  tags,
  installCommand,
  promptConfig,
  usageExample,
}: CreateSkillParams) {
  const [newSkill] = await db
    .insert(skills)
    .values({
      authorId,
      title: title.trim(),
      description: description.trim(),
      tags: tags,
      installCommand: installCommand.trim(),
      promptConfig: promptConfig.trim(),
      usageExample: usageExample.trim(),
    })
    .returning({
      id: skills.id,
      title: skills.title,
      description: skills.description,
      tags: skills.tags,
      createdAt: skills.createdAt,
      installCommand: skills.installCommand,
      promptConfig: skills.promptConfig,
      usageExample: skills.usageExample,
      authorId: skills.authorId,
    });

  return newSkill;
}

export type GetSkillsData = Awaited<ReturnType<typeof GetSkills>>;
export type NewSkillData = Awaited<ReturnType<typeof CreateSkill>>;
