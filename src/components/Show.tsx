import { useRouteContext } from "@tanstack/react-router";
import type React from "react";

type Props = {
	children: React.ReactNode;
	when?: "sign-in" | "sign-out";
};

const Show = ({ children, when = "sign-in" }: Props) => {
	const { session } = useRouteContext({ from: "__root__" });

	const isSignIn = !!session?.user;

	const showContent =
		(isSignIn && when === "sign-in") || (!isSignIn && when === "sign-out");

	if (!showContent) return null;

	return <>{children}</>;
};

export default Show;
