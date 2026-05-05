import { and, desc, eq, ilike, notInArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { skills } from "@/db/schema";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

type SearchSkillsParams = {
  searchTerm?: string;
  limit?: number;
  offset?: number;
};

type CreateSkillParams = {
  slug: string;
  sourceRepo: string;
  sourcePath: string;
  sourceSha?: string;
  title: string;
  description: string;
  tags?: string[];
  installCommand?: string;
  promptConfig?: string;
  usageExample?: string;
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
        slug: skills.slug,
        title: skills.title,
        description: skills.description,
        tags: skills.tags,
        createdAt: skills.createdAt,
        installCommand: skills.installCommand,
        promptConfig: skills.promptConfig,
        usageExample: skills.usageExample,
      })
      .from(skills)
      .where(eq(skills.isActive, true))
      .orderBy(desc(skills.createdAt))
      .limit(safeLimit)
      .offset(safeOffset);
  }

  return db
    .select({
      id: skills.id,
      slug: skills.slug,
      title: skills.title,
      description: skills.description,
      tags: skills.tags,
      createdAt: skills.createdAt,
      installCommand: skills.installCommand,
      promptConfig: skills.promptConfig,
      usageExample: skills.usageExample,
    })
    .from(skills)
    .where(
      and(
        eq(skills.isActive, true),
        or(
          ilike(skills.title, `%${term}%`),
          ilike(skills.description, `%${term}%`),
          sql`array_to_string(${skills.tags}, ' ') ILIKE ${`%${term}%`}`,
        ),
      ),
    )
    .orderBy(desc(skills.createdAt))
    .limit(safeLimit)
    .offset(safeOffset);
}

export async function CreateSkill({
  slug,
  sourceRepo,
  sourcePath,
  sourceSha,
  title,
  description,
  tags = [],
  installCommand,
  promptConfig,
  usageExample,
}: CreateSkillParams) {
  const [newSkill] = await db
    .insert(skills)
    .values({
      slug,
      sourceRepo,
      sourcePath,
      sourceSha,
      isActive: true,
      lastSyncedAt: new Date(),
      title: title.trim(),
      description: description.trim(),
      tags: tags,
      installCommand: installCommand?.trim(),
      promptConfig: promptConfig?.trim(),
      usageExample: usageExample?.trim(),
    })
    .returning({
      id: skills.id,
      slug: skills.slug,
      title: skills.title,
      description: skills.description,
      tags: skills.tags,
      createdAt: skills.createdAt,
      installCommand: skills.installCommand,
      promptConfig: skills.promptConfig,
      usageExample: skills.usageExample,
    });

  return newSkill;
}

export async function GetSkillById(id: string) {
  const [skill] = await db
    .select({
      id: skills.id,
      slug: skills.slug,
      title: skills.title,
      description: skills.description,
      tags: skills.tags,
      createdAt: skills.createdAt,
      installCommand: skills.installCommand,
      promptConfig: skills.promptConfig,
      usageExample: skills.usageExample,
    })
    .from(skills)
    .where(and(eq(skills.id, id), eq(skills.isActive, true)))
    .limit(1);

  return skill ?? null;
}

export type GetSkillsData = Awaited<ReturnType<typeof GetSkills>>;
export type GetSkillData = Awaited<ReturnType<typeof GetSkillById>>;
export type NewSkillData = Awaited<ReturnType<typeof CreateSkill>>;

export async function UpsertSkill(input: CreateSkillParams) {
  const [record] = await db
    .insert(skills)
    .values({
      slug: input.slug,
      sourceRepo: input.sourceRepo,
      sourcePath: input.sourcePath,
      sourceSha: input.sourceSha,
      isActive: true,
      lastSyncedAt: new Date(),
      title: input.title,
      description: input.description,
      tags: input.tags ?? [],
      installCommand: input.installCommand ?? null,
      promptConfig: input.promptConfig ?? null,
      usageExample: input.usageExample ?? null,
    })
    .onConflictDoUpdate({
      target: skills.slug,
      set: {
        sourceRepo: input.sourceRepo,
        sourcePath: input.sourcePath,
        sourceSha: input.sourceSha,
        isActive: true,
        lastSyncedAt: new Date(),
        title: input.title,
        description: input.description,
        tags: input.tags ?? [],
        installCommand: input.installCommand ?? null,
        promptConfig: input.promptConfig ?? null,
        usageExample: input.usageExample ?? null,
      },
    })
    .returning({ id: skills.id, slug: skills.slug });

  return record;
}

export async function MarkMissingSkillsInactive(
  sourceRepo: string,
  activeSlugs: string[],
) {
  if (activeSlugs.length === 0) {
    await db
      .update(skills)
      .set({ isActive: false, lastSyncedAt: new Date() })
      .where(and(eq(skills.sourceRepo, sourceRepo), eq(skills.isActive, true)));
    return;
  }

  await db
    .update(skills)
    .set({ isActive: false, lastSyncedAt: new Date() })
    .where(
      and(
        eq(skills.sourceRepo, sourceRepo),
        eq(skills.isActive, true),
        notInArray(skills.slug, activeSlugs),
      ),
    );
}
