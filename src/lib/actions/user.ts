"use server";

import { db } from "@/lib/db";
import { users, vendors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getUserProfileDetails() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const userRecord = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!userRecord) {
    throw new Error("User not found");
  }

  let vendorDetails = null;
  if (userRecord.role === "VENDOR") {
    vendorDetails = await db.query.vendors.findFirst({
      where: eq(vendors.userId, userRecord.id),
    });
  }

  // Mock activity and notification counts for now
  const activityCount = Math.floor(Math.random() * 20) + 1;
  const notificationsCount = Math.floor(Math.random() * 10);
  const savedItemsCount = Math.floor(Math.random() * 5);

  return {
    ...userRecord,
    vendorDetails,
    activityCount,
    notificationsCount,
    savedItemsCount,
    profileCompletion: vendorDetails ? 90 : 70, // Mock
  };
}

export async function updateUserPreferences(data: { themePreference?: string, language?: string }) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const userRecord = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!userRecord) {
    throw new Error("User not found");
  }

  const updateData: any = {};
  if (data.themePreference !== undefined) updateData.themePreference = data.themePreference;
  if (data.language !== undefined) updateData.language = data.language;

  await db.update(users)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(users.id, userRecord.id));

  return { success: true };
}
