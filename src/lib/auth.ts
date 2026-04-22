import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth, keycloak } from "better-auth/plugins/generic-oauth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";
import * as schema from "@/db/schema/auth-schema";

function getRequiredEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		tanstackStartCookies(),
		genericOAuth({
			config: [
				keycloak({
					clientId: getRequiredEnv("KEYCLOAK_CLIENT_ID"),
					clientSecret: getRequiredEnv("KEYCLOAK_CLIENT_SECRET"),
					issuer: getRequiredEnv("KEYCLOAK_ISSUER"),
					redirectURI: `${getRequiredEnv("BETTER_AUTH_URL")}/api/auth/oauth2/callback/keycloak`,
				}),
			],
		}),
	],
});
