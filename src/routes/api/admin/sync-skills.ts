import { createFileRoute } from "@tanstack/react-router";
import { syncSkillsFromRepo } from "#/lib/skills-sync";

export const Route = createFileRoute("/api/admin/sync-skills")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedToken = process.env.SYNC_SKILLS_ADMIN_TOKEN?.trim();
        if (!expectedToken) {
          return new Response("Missing SYNC_SKILLS_ADMIN_TOKEN", { status: 500 });
        }

        const auth = request.headers.get("authorization") || "";
        const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";

        if (token !== expectedToken) {
          return new Response("Unauthorized", { status: 401 });
        }

        const result = await syncSkillsFromRepo();

        return new Response(JSON.stringify({ ok: true, result }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
