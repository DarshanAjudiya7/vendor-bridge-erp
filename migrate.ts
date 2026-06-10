import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

const main = async () => {
  try {
    console.log("Running custom schema updates...");
    
    // 1. Update Users Table
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username text;`;
    await sql`UPDATE users SET username = 'user_' || id WHERE username IS NULL;`;
    await sql`ALTER TABLE users ALTER COLUMN username SET NOT NULL;`;
    await sql`ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);`.catch(() => console.log("Constraint exists"));

    // 2. Vendors Table
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS company_type text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'UNVERIFIED';`;

    // 3. RFQs Table (Rename created_by to user_id)
    await sql`ALTER TABLE rfqs RENAME COLUMN created_by TO user_id;`.catch(() => console.log("Already renamed"));

    // 4. Quotations Table (Add user_id)
    await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS user_id integer REFERENCES users(id);`;

    // 5. Purchase Orders Table (Rename generated_by to user_id)
    await sql`ALTER TABLE purchase_orders RENAME COLUMN generated_by TO user_id;`.catch(() => console.log("Already renamed"));

    // 6. Invoices Table (Add user_id)
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS user_id integer REFERENCES users(id);`;

    // 7. Approvals Table (Rename manager_id to user_id)
    await sql`ALTER TABLE approvals RENAME COLUMN manager_id TO user_id;`.catch(() => console.log("Already renamed"));

    console.log("Custom migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error performing custom migration: ", error);
    process.exit(1);
  }
};

main();
