import { createFileRoute } from "@tanstack/react-router";
import { syncSkillsFromRepo } from "#/lib/skills-sync";
import { verifyGitHubSignature } from "#/lib/webhook";

type GitHubPushPayload = {
  repository?: {
    html_url?: string;
    clone_url?: string;
  };
};

export const Route = createFileRoute("/api/webhooks/github")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.GITHUB_WEBHOOK_SECRET?.trim();
        if (!secret) {
          return new Response("Missing GITHUB_WEBHOOK_SECRET", { status: 500 });
        }

        const event = request.headers.get("x-github-event");
        if (event !== "push") {
          return new Response(JSON.stringify({ ok: true, ignored: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        const payload = await request.text();
        const signature = request.headers.get("x-hub-signature-256");

        if (!verifyGitHubSignature(payload, signature, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const body = JSON.parse(payload) as GitHubPushPayload;
        const expectedRepo = process.env.SKILLS_REPO_URL?.trim();
        const incomingRepo = body.repository?.clone_url || body.repository?.html_url;

        if (expectedRepo && incomingRepo && !expectedRepo.includes(incomingRepo.replace(/\.git$/, ""))) {
          return new Response(JSON.stringify({ ok: true, ignored: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
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
