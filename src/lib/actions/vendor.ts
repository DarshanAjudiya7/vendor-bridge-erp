"use server";

import { db } from "@/lib/db";
import { vendors, users } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { createActivityLog } from "./shared";
import { auth } from "@/lib/auth";

export async function createVendor(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const userId = Number((session.user as any).id);
  const companyName = formData.get("companyName") as string;
  const gstNumber = formData.get("gstNumber") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const address = formData.get("address") as string;

  const attachmentsRaw = formData.get("attachments") as string;
  const attachments = attachmentsRaw ? JSON.parse(attachmentsRaw) : [];

  const [newVendor] = await db.insert(vendors).values({
    userId,
    companyName,
    gstNumber,
    contactEmail,
    contactPhone,
    address,
    status: "APPROVED",
    attachments,
  }).returning();

  await createActivityLog({
    userId,
    action: "CREATED",
    entityType: "VENDOR",
    entityId: newVendor.id,
    details: `Created vendor ${companyName}`,
  });

  revalidatePath("/portal/procurement/vendors");
  return newVendor;
}

export async function getVendors() {
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);
  const role = (session.user as any).role;

  if (role === "ADMIN" || role === "MANAGER") {
    return await db.select().from(vendors).orderBy(desc(vendors.createdAt));
  } else {
    // Only return vendors created by this Procurement Officer
    return await db.select().from(vendors).where(eq(vendors.userId, userId)).orderBy(desc(vendors.createdAt));
  }
}

export async function getVendorByUserId(userId: number) {
  const v = await db.select().from(vendors).where(eq(vendors.userId, userId));
  return v[0] || null;
}

export async function deleteVendor(id: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  await db.delete(vendors).where(eq(vendors.id, id));

  await createActivityLog({
    userId,
    action: "DELETED",
    entityType: "VENDOR",
    entityId: id,
  });

  revalidatePath("/portal/procurement/vendors");
}
