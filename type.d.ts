interface SkillRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[] | null;
  installCommand: string | null;
  createdAt: string | Date | null;
}
