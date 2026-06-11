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
  
  const role = (session.user as any).role;
  const userId = Number((session.user as any).id);

  if (role !== "ADMIN" && role !== "PROCUREMENT_OFFICER") {
    throw new Error("Unauthorized to create vendors");
  }
  const companyName = formData.get("companyName") as string;
  const companyType = formData.get("biz_type") as string;
  const category = formData.get("category") as string;
  const vendorCode = "VEN-" + Math.floor(100000 + Math.random() * 900000).toString(); // Auto-generate
  const gstNumber = formData.get("gstNumber") as string;
  const panNumber = formData.get("panNumber") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const alternatePhone = formData.get("alternatePhone") as string;
  const website = formData.get("website") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const postalCode = formData.get("postalCode") as string;

  const attachmentsRaw = formData.get("attachments") as string;
  const attachments = attachmentsRaw ? JSON.parse(attachmentsRaw) : [];

  const [newVendor] = await db.insert(vendors).values({
    userId,
    vendorCode,
    category,
    companyName,
    companyType,
    gstNumber,
    panNumber,
    contactEmail,
    contactPhone,
    alternatePhone,
    website,
    address,
    city,
    state,
    country,
    postalCode,
    status: "ACTIVE", // Or APPROVED depending on workflow, let's use ACTIVE as requested
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
  
  const role = (session.user as any).role;
  const userId = Number((session.user as any).id);

  if (role === "VENDOR") {
    return await db.select().from(vendors).where(eq(vendors.userId, userId));
  }
  
  if (["ADMIN", "MANAGER", "PROCUREMENT_OFFICER"].includes(role)) {
    return await db.select().from(vendors).orderBy(desc(vendors.createdAt));
  }

  return [];
}

export async function getVendorByUserId(userId: number) {
  const session = await auth();
  if (!session?.user) return null;
  const currentUserId = Number((session.user as any).id);

  if (userId !== currentUserId) return null;

  const v = await db.select().from(vendors).where(eq(vendors.userId, currentUserId));
  return v[0] || null;
}

export async function getVendorById(id: number) {
  const session = await auth();
  if (!session?.user) return null;
  const currentUserId = Number((session.user as any).id);
  const role = (session.user as any).role;

  const v = await db.select().from(vendors).where(eq(vendors.id, id));
  if (!v[0]) return null;

  if (role === "VENDOR" && v[0].userId !== currentUserId) {
    return null; // Vendors can only see themselves
  }

  return v[0];
}

export async function deleteVendor(id: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const role = (session.user as any).role;
  const userId = Number((session.user as any).id);

  if (role !== "ADMIN") {
    throw new Error("Unauthorized: Only Admins can delete vendors");
  }

  await db.delete(vendors).where(eq(vendors.id, id));

  await createActivityLog({
    userId,
    action: "DELETED",
    entityType: "VENDOR",
    entityId: id,
  });

  revalidatePath("/portal/procurement/vendors");
}
