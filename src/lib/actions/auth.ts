"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as any; // "VENDOR" or "PROCUREMENT_OFFICER"

    if (!name || !email || !password || !role) {
      return { success: false, error: "All fields are required" };
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into database
    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return { success: false, error: "An unexpected error occurred during registration" };
  }
}
