"use server";

import { db } from "@/lib/db";
import { activityLogs, notifications } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createActivityLog({
  userId,
  action,
  entityType,
  entityId,
  details,
}: {
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  details?: string;
}) {
  try {
    await db.insert(activityLogs).values({
      userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Failed to create activity log", error);
  }
}

export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
  link,
}: {
  userId: number;
  title: string;
  message: string;
  type?: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  link?: string;
}) {
  try {
    await db.insert(notifications).values({
      userId,
      title,
      message,
      type,
      link,
    });
  } catch (error) {
    console.error("Failed to create notification", error);
  }
}
