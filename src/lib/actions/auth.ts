"use server";

import { db } from "@/lib/db";
import { users, vendors } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as any;

    // Optional fields
    const phone = formData.get("phone") as string;
    const companyName = formData.get("companyName") as string;
    const avatarUrl = formData.get("avatarUrl") as string;

    if (!name || !username || !email || !password || !role) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" };
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(
      or(
        eq(users.email, email),
        eq(users.username, username)
      )
    );

    if (existingUser.length > 0) {
      const isEmailTaken = existingUser.some(u => u.email === email);
      if (isEmailTaken) return { success: false, error: "User with this email already exists" };
      return { success: false, error: "Username is already taken" };
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into database and get back the generated row
    const [newUser] = await db.insert(users).values({
      name,
      username,
      email,
      passwordHash,
      role,
      avatarUrl: avatarUrl || null,
      themePreference: "system",
      language: "en",
    }).returning();

    // If role is VENDOR, initialize a corresponding vendor profile
    if (role === "VENDOR") {
      const vendorCompanyName = companyName || `${name}'s Company`;
      const vendorPhone = phone || "N/A";
      const gstNumber = `GST-PENDING-${newUser.id}-${Date.now().toString().slice(-4)}`;

      await db.insert(vendors).values({
        userId: newUser.id,
        companyName: vendorCompanyName,
        companyType: "Proprietorship",
        verificationStatus: "UNVERIFIED",
        gstNumber: gstNumber,
        contactEmail: email,
        contactPhone: vendorPhone,
        address: "Address Pending Profile Update",
        status: "APPROVED", // Approved by default to allow immediate operation
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return { success: false, error: "An unexpected error occurred during registration" };
  }
}
