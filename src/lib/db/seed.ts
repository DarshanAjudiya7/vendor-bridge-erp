import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding mock users...");

  const mockUsers = [
    { id: 1, name: "Admin User", username: "admin", email: "admin@vendorbridge.com", role: "ADMIN" as const, passwordHash: "admin" },
    { id: 2, name: "Procurement Officer", username: "procurement", email: "procurement@vendorbridge.com", role: "PROCUREMENT_OFFICER" as const, passwordHash: "procurement" },
    { id: 3, name: "Manager User", username: "manager", email: "manager@vendorbridge.com", role: "MANAGER" as const, passwordHash: "manager" },
    { id: 4, name: "Vendor User", username: "vendor", email: "vendor@vendorbridge.com", role: "VENDOR" as const, passwordHash: "vendor" },
  ];

  for (const user of mockUsers) {
    const existing = await db.select().from(users).where(eq(users.email, user.email));
    if (existing.length === 0) {
      await db.insert(users).values(user);
      console.log(`Inserted user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  console.log("Seeding complete.");
}

seed().catch(console.error).finally(() => process.exit(0));
