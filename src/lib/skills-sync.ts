import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  MarkMissingSkillsInactive,
  UpsertSkill,
} from "#/db/queries/skills";

const execFileAsync = promisify(execFile);

export type SyncResult = {
  sourceSha: string;
  processed: number;
  inactivated: number;
};

type SkillPayload = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  installCommand?: string;
  promptConfig?: string;
  usageExample?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    data[key] = value;
  }

  return data;
}

function parseTags(raw?: string): string[] {
  if (!raw) return [];
  const normalized = raw
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((t) => t.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
  return [...new Set(normalized)];
}

async function discoverSkills(repoDir: string, rootPath: string): Promise<SkillPayload[]> {
  const baseDir = join(repoDir, rootPath);
  const entries = await readdir(baseDir, { withFileTypes: true });
  const skills: SkillPayload[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const skillPath = join(baseDir, slug, "SKILL.md");

    try {
      const content = await readFile(skillPath, "utf-8");
      const fm = parseFrontmatter(content);
      const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();

      const title = fm.name || slug;
      const description = fm.description || body.slice(0, 240) || slug;

      skills.push({
        slug,
        title,
        description,
        tags: parseTags(fm.tags),
        installCommand: fm.installCommand,
        promptConfig: body || fm.promptConfig,
        usageExample: fm.usageExample,
      });
    } catch {
      // Ignore invalid/incomplete skill folders.
    }
  }

  return skills;
}

export async function syncSkillsFromRepo(): Promise<SyncResult> {
  const sourceRepo = getRequiredEnv("SKILLS_REPO_URL");
  const sourceRef = getOptionalEnv("SKILLS_REPO_REF", "main");
  const rootPath = getOptionalEnv("SKILLS_ROOT_PATH", "skills");

  const tempDir = await mkdtemp(join(tmpdir(), "skild-sync-"));

  try {
    await execFileAsync("git", [
      "clone",
      "--depth",
      "1",
      "--branch",
      sourceRef,
      sourceRepo,
      tempDir,
    ]);

    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
      cwd: tempDir,
    });
    const sourceSha = stdout.trim();

    const discovered = await discoverSkills(tempDir, rootPath);
    const activeSlugs: string[] = [];

    for (const skill of discovered) {
      await UpsertSkill({
        slug: skill.slug,
        sourceRepo,
        sourcePath: `${rootPath}/${skill.slug}`,
        sourceSha,
        title: skill.title,
        description: skill.description,
        tags: skill.tags,
        installCommand: skill.installCommand,
        promptConfig: skill.promptConfig,
        usageExample: skill.usageExample,
      });
      activeSlugs.push(skill.slug);
    }

    await MarkMissingSkillsInactive(sourceRepo, activeSlugs);

    return {
      sourceSha,
      processed: activeSlugs.length,
      inactivated: 0,
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
