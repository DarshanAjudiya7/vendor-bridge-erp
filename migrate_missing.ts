import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

const main = async () => {
  try {
    console.log("Running missing tables migration...");

    // Create activity_logs table if missing
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id INTEGER NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("activity_logs table: OK");

    // Create notification_type enum if missing
    await sql`
      DO $$ BEGIN
        CREATE TYPE notification_type AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'ALERT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log("notification_type enum: OK");

    // Create notifications table if missing
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type notification_type DEFAULT 'INFO',
        is_read BOOLEAN DEFAULT FALSE,
        link TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("notifications table: OK");

    // Ensure verification_status enum exists
    await sql`
      DO $$ BEGIN
        CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Add verification_status column to vendors if missing
    await sql`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'UNVERIFIED';`;

    console.log("All missing tables and columns created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

main();
