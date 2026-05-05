ALTER TABLE "skills" DROP CONSTRAINT IF EXISTS "skills_author_id_user_id_fk";
ALTER TABLE "skills" DROP COLUMN IF EXISTS "author_id";

ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "slug" varchar(255);
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "source_repo" text;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "source_path" text;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "source_sha" text;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "last_synced_at" timestamp;

UPDATE "skills"
SET
  "slug" = COALESCE("slug", lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'))),
  "source_repo" = COALESCE("source_repo", 'legacy'),
  "source_path" = COALESCE("source_path", CONCAT('skills/', COALESCE("slug", lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'))))),
  "is_active" = COALESCE("is_active", true)
WHERE "slug" IS NULL OR "source_repo" IS NULL OR "source_path" IS NULL;

ALTER TABLE "skills" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "skills" ALTER COLUMN "source_repo" SET NOT NULL;
ALTER TABLE "skills" ALTER COLUMN "source_path" SET NOT NULL;

DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_slug_unique" UNIQUE("slug");
EXCEPTION
 WHEN duplicate_table THEN null;
 WHEN duplicate_object THEN null;
END $$;
