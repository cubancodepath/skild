import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL. Set it in .env.local or .env");
}

const client = new Client({ connectionString });

try {
  await client.connect();
  await client.query("DROP SCHEMA IF EXISTS public CASCADE;");
  await client.query("CREATE SCHEMA public;");
  await client.query("GRANT ALL ON SCHEMA public TO public;");
  console.log("Database schema reset completed.");
} finally {
  await client.end();
}
