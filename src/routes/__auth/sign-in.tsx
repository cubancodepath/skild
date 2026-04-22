import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "#/components/login-form";

export const Route = createFileRoute("/__auth/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<section id="sign-in">
			<LoginForm />
		</section>
	);
}
