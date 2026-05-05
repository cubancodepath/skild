import Search from "#/components/Search";
import SkillCard from "#/components/SkillCard";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const DEFAULT__PAGE_SIZE = 10;

const productSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  q: z
    .string()
    .catch("")
    .transform((value) => value.trim()),
});

export const seacrhSkillsFn = createServerFn({ method: "GET" })
  .inputValidator(productSearchSchema)
  .handler(async ({ data }) => {
    try {
      const { GetSkills } = await import("#/db/queries/skills");
      const response = await GetSkills({
        searchTerm: data.q || undefined,
        limit: DEFAULT__PAGE_SIZE,
        offset: (data.page - 1) * DEFAULT__PAGE_SIZE,
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

export const Route = createFileRoute("/skills/")({
  component: RouteComponent,
  validateSearch: (search) => productSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q }),
  loader: async ({ deps }) => seacrhSkillsFn({ data: deps }),
});

function RouteComponent() {
  const { q } = Route.useSearch();
  const skills = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const handleQueryChange = (query: string) => {
    if (query === q) return;

    navigate({
      search: (prev) => ({ ...prev, q: query, page: 1 }),
      replace: true,
    });
  };
  return (
    <div id="skills-page">
      <section className="intro">
        <header>
          <h1>
            Explore <span className="text-gradient">Skills</span>
          </h1>
          <p>
            Browse, filter, and inspect reusable I capabilities, from an single
            registry
          </p>
        </header>
        <Search
          query={q}
          resultCount={skills.length}
          onQueryChange={handleQueryChange}
        />
      </section>
      <section className="results">
        {skills.length > 0 ? (
          <div className="skills-grid">
            {skills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            {q
              ? `No skill found for "${q}"`
              : "No skills have been created yet"}
          </p>
        )}
      </section>
    </div>
  );
}
