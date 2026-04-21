interface SkillRecord{
  id: string, 
  title: string,
  slug: string,
  description: string,
  category: string,
  tags: string[],
  installCommand: string,
  create_at: string | null
  authorUserId: string | null
  authorEmail: string | null
}
