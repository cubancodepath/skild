import type React from "react";
import { authClient } from "#/lib/auth-client";

type Props = {
	children: React.ReactNode;
	when?: "sign-in" | "sign-out";
};

const Show = ({ children, when = "sign-in" }: Props) => {
	const { data: isSigIn } = authClient.useSession();

	const showContent =
		(isSigIn && when === "sign-in") || (!isSigIn && when === "sign-out");

	if (!showContent) return null;

	return <>{children}</>;
};

export default Show;
