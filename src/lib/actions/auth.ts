"use server";

import { db } from "@/lib/db";
import { users, vendors, passwordResetTokens, activityLogs } from "@/lib/db/schema";
import { eq, or, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

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

export async function requestPasswordReset(email: string) {
  try {
    const targetEmail = email.toLowerCase().trim();
    const existingUser = await db.select().from(users).where(eq(users.email, targetEmail));
    
    // We do not return error if user doesn't exist to prevent email enumeration
    if (existingUser.length > 0) {
      const user = existingUser[0];
      
      // Generate a secure random token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Invalidate any existing unused tokens for this user
      await db.update(passwordResetTokens)
        .set({ used: true })
        .where(
          and(
            eq(passwordResetTokens.userId, user.id),
            eq(passwordResetTokens.used, false)
          )
        );

      // Store the new token
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token: token,
        expiresAt: expiresAt,
        used: false,
      });

      // Send the email
      await sendPasswordResetEmail(user.email, token);

      // Log the activity
      await db.insert(activityLogs).values({
        userId: user.id,
        action: "REQUEST_PASSWORD_RESET",
        entityType: "USER",
        entityId: user.id,
        details: "Password reset token generated and sent.",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" };
    }

    // Find the token
    const tokenRecords = await db.select().from(passwordResetTokens).where(
      and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    );

    if (tokenRecords.length === 0) {
      return { success: false, error: "Invalid or expired reset token. Please request a new one." };
    }

    const resetToken = tokenRecords[0];

    // Find the user
    const userRecords = await db.select().from(users).where(eq(users.id, resetToken.userId));
    if (userRecords.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = userRecords[0];

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

    // Mark the token as used
    await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, resetToken.id));

    // Log the successful reset
    await db.insert(activityLogs).values({
      userId: user.id,
      action: "PASSWORD_RESET_SUCCESS",
      entityType: "USER",
      entityId: user.id,
      details: "User successfully reset their password.",
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
