import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "drizzle-orm";
import { db } from "./src/lib/db";

async function run() {
  try {
    await db.execute(sql`TRUNCATE TABLE rfqs CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE vendors CASCADE;`);
    console.log("Successfully truncated rfqs, vendors and dependent tables to allow schema push.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to truncate:", error);
    process.exit(1);
  }
}

run();
