"use server";

import { db } from "@/lib/db";
import { approvals, rfqs, quotations, vendors } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createActivityLog } from "./shared";

export async function getApprovals() {
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);

  // Fetch all approvals belonging to this manager's users
  const allApprovals = await db.select().from(approvals).orderBy(desc(approvals.createdAt));
  return allApprovals;
}

export async function approveRequest(approvalId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  const approvalRecord = await db.select().from(approvals).where(eq(approvals.id, approvalId));
  if (!approvalRecord[0]) throw new Error("Approval not found");

  await db.update(approvals)
    .set({ status: "APPROVED", updatedAt: new Date() })
    .where(eq(approvals.id, approvalId));

  const refType = approvalRecord[0].referenceType;
  const refId = approvalRecord[0].referenceId;

  if (refType === "RFQ") {
    await db.update(rfqs).set({ status: "PUBLISHED", updatedAt: new Date() }).where(eq(rfqs.id, refId));
  } else if (refType === "VENDOR_SELECTION") {
    await db.update(rfqs).set({ status: "AWARDED", updatedAt: new Date() }).where(eq(rfqs.id, refId));
  }

  await createActivityLog({
    userId,
    action: "APPROVED",
    entityType: "APPROVAL",
    entityId: approvalId,
    details: `Approval #${approvalId} approved (${refType})`,
  });

  revalidatePath("/portal/manager/approvals");
  return { success: true };
}

export async function rejectRequest(approvalId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  const approvalRecord = await db.select().from(approvals).where(eq(approvals.id, approvalId));
  if (!approvalRecord[0]) throw new Error("Approval not found");

  await db.update(approvals)
    .set({ status: "REJECTED", updatedAt: new Date() })
    .where(eq(approvals.id, approvalId));

  const refType = approvalRecord[0].referenceType;
  const refId = approvalRecord[0].referenceId;

  if (refType === "RFQ") {
    await db.update(rfqs).set({ status: "DRAFT", updatedAt: new Date() }).where(eq(rfqs.id, refId));
  } else if (refType === "VENDOR_SELECTION") {
    await db.update(rfqs).set({ status: "OPEN", updatedAt: new Date() }).where(eq(rfqs.id, refId));
  }

  await createActivityLog({
    userId,
    action: "REJECTED",
    entityType: "APPROVAL",
    entityId: approvalId,
    details: `Approval #${approvalId} rejected (${refType})`,
  });

  revalidatePath("/portal/manager/approvals");
  return { success: true };
}

export async function getAllQuotationsForProcurement() {
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);

  const result = await db.select({
    quotation: quotations,
    vendorName: vendors.companyName,
    rfqTitle: rfqs.title,
    rfqId: rfqs.id,
  })
  .from(quotations)
  .innerJoin(rfqs, eq(quotations.rfqId, rfqs.id))
  .innerJoin(vendors, eq(quotations.vendorId, vendors.id))
  .where(eq(rfqs.userId, userId))
  .orderBy(desc(quotations.createdAt));

  return result;
}
