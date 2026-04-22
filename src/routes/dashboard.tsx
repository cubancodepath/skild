import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "#/lib/middleware";

export const Route = createFileRoute("/dashboard")({
	server: {
		middleware: [authMiddleware],
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard"!</div>;
}
