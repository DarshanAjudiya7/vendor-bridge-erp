import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

const main = async () => {
  try {
    console.log("Running audit schema updates...");

    // Update Enums
    await sql`ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'ACTIVE';`.catch(() => console.log('Enum ACTIVE exists'));
    await sql`ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'INACTIVE';`.catch(() => console.log('Enum INACTIVE exists'));
    await sql`ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'BLACKLISTED';`.catch(() => console.log('Enum BLACKLISTED exists'));
    await sql`ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'SUSPENDED';`.catch(() => console.log('Enum SUSPENDED exists'));

    await sql`ALTER TYPE rfq_status ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';`.catch(() => console.log('Enum PENDING_APPROVAL exists'));
    await sql`ALTER TYPE rfq_status ADD VALUE IF NOT EXISTS 'APPROVED';`.catch(() => console.log('Enum APPROVED exists'));
    await sql`ALTER TYPE rfq_status ADD VALUE IF NOT EXISTS 'PUBLISHED';`.catch(() => console.log('Enum PUBLISHED exists'));
    await sql`ALTER TYPE rfq_status ADD VALUE IF NOT EXISTS 'CANCELLED';`.catch(() => console.log('Enum CANCELLED exists'));

    // Update vendors table
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_code text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS category text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS alternate_phone text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS website text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS city text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS state text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS country text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS postal_code text;`;
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_number text;`;

    // Update rfqs table
    await sql`ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS rfq_number text;`;
    await sql`ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS priority text;`;
    await sql`ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS department text;`;
    await sql`ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS requestor text;`;

    console.log("Audit schema migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error performing audit migration: ", error);
    process.exit(1);
  }
};

main();
