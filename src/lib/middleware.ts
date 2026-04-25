import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { auth } from "./auth";

export const fetchSessionMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		return await next({ context: { session } });
	},
);

export const authMiddleware = createMiddleware()
	.middleware([fetchSessionMiddleware])
	.server(async ({ next, context }) => {
		if (!context.session) {
			throw redirect({ to: "/sign-in" });
		}
		return await next({ context });
	});

export const getAuthSession = createServerFn({ method: "GET" })
	.middleware([fetchSessionMiddleware])
	.handler(async ({ context }) => {
		return context.session;
	});
