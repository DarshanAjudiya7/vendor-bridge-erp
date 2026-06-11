"use server";

import { db } from "@/lib/db";
import { quotations, rfqs, vendorAssignments, vendors, approvals } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc, and } from "drizzle-orm";
import { createActivityLog, createNotification } from "./shared";
import { auth } from "@/lib/auth";

export async function submitQuotation(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);
  const role = (session.user as any).role;

  if (role !== "VENDOR") {
    throw new Error("Unauthorized: Only vendors can submit quotations.");
  }

  const rfqId = Number(formData.get("rfqId"));
  const vendorId = Number(formData.get("vendorId"));
  const totalAmount = Number(formData.get("totalAmount"));
  const deliveryDays = Number(formData.get("deliveryDays"));
  const paymentTerms = formData.get("paymentTerms") as string;
  const remarks = formData.get("remarks") as string;

  // Security Check: Verify vendor belongs to user
  const vendorRecord = await db.select().from(vendors).where(eq(vendors.userId, userId));
  if (!vendorRecord[0] || vendorRecord[0].id !== vendorId) {
    throw new Error("Unauthorized: Vendor ID mismatch.");
  }

  // Attachments
  const attachmentsRaw = formData.get("attachments") as string;
  const attachments = attachmentsRaw ? JSON.parse(attachmentsRaw) : [];

  const actionType = formData.get("actionType") as string;
  const isDraft = actionType === "draft";

  const [newQuotation] = await db.insert(quotations).values({
    rfqId,
    vendorId: vendorRecord[0].id,
    userId, // STRICT ISOLATION
    totalAmount: totalAmount.toString(),
    deliveryDays,
    paymentTerms,
    remarks,
    attachments,
    status: isDraft ? "DRAFT" : "SUBMITTED",
  }).returning();

  if (!isDraft) {
    // Notify RFQ creator only if submitted
    const rfqData = await db.select({ userId: rfqs.userId, title: rfqs.title }).from(rfqs).where(eq(rfqs.id, rfqId));
    if (rfqData[0] && rfqData[0].userId) {
      await createNotification({
        userId: rfqData[0].userId,
        title: "New Quotation Received",
        message: `A new quotation was submitted for RFQ: ${rfqData[0].title}`,
        type: "SUCCESS",
        link: `/portal/procurement/comparison/${rfqId}`,
      });
    }
  }

  await createActivityLog({
    userId,
    action: "CREATED",
    entityType: "QUOTATION",
    entityId: newQuotation.id,
    details: `${isDraft ? 'Saved draft' : 'Submitted'} quotation for RFQ ${rfqId}`,
  });

  revalidatePath(`/portal/vendor/rfqs`);
  return newQuotation;
}

export async function updateQuotation(quotationId: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  const totalAmount = Number(formData.get("totalAmount"));
  const deliveryDays = Number(formData.get("deliveryDays"));
  const paymentTerms = formData.get("paymentTerms") as string;
  const remarks = formData.get("remarks") as string;
  const actionType = formData.get("actionType") as string;
  const isDraft = actionType === "draft";

  // Verify ownership
  const existingQuotation = await db.select().from(quotations).where(and(eq(quotations.id, quotationId), eq(quotations.userId, userId)));
  if (!existingQuotation.length) throw new Error("Quotation not found or unauthorized.");

  const attachmentsRaw = formData.get("attachments") as string;
  const attachments = attachmentsRaw ? JSON.parse(attachmentsRaw) : [];

  const [updatedQuotation] = await db.update(quotations).set({
    totalAmount: totalAmount.toString(),
    deliveryDays,
    paymentTerms,
    remarks,
    attachments,
    status: isDraft ? "DRAFT" : "SUBMITTED",
  }).where(eq(quotations.id, quotationId)).returning();

  if (!isDraft) {
    const rfqId = updatedQuotation.rfqId!;
    const rfqData = await db.select({ userId: rfqs.userId, title: rfqs.title }).from(rfqs).where(eq(rfqs.id, rfqId));
    if (rfqData[0] && rfqData[0].userId) {
      await createNotification({
        userId: rfqData[0].userId,
        title: "New Quotation Received",
        message: `A new quotation was submitted for RFQ: ${rfqData[0].title}`,
        type: "SUCCESS",
        link: `/portal/procurement/comparison/${rfqId}`,
      });
    }
  }

  await createActivityLog({
    userId,
    action: "UPDATED",
    entityType: "QUOTATION",
    entityId: updatedQuotation.id,
    details: `${isDraft ? 'Updated draft' : 'Submitted'} quotation for RFQ ${updatedQuotation.rfqId}`,
  });

  revalidatePath(`/portal/vendor/rfqs`);
  return updatedQuotation;
}

export async function getVendorDraftQuotation(rfqId: number) {
  const session = await auth();
  if (!session?.user) return null;
  const userId = Number((session.user as any).id);

  const drafts = await db.select().from(quotations).where(and(eq(quotations.rfqId, rfqId), eq(quotations.userId, userId), eq(quotations.status, 'DRAFT')));
  return drafts[0] || null;
}

export async function getVendorRfqs(vendorId: number) {
  // STRICT ISOLATION: A vendor user should only see RFQs assigned to them.
  // Wait, vendorId must belong to the current user.
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);

  // First verify this vendor belongs to the user
  const vendorData = await db.select().from(vendors).where(and(eq(vendors.id, vendorId), eq(vendors.userId, userId)));
  if (!vendorData.length) return [];

  const assignments = await db.select({
    rfq: rfqs
  })
  .from(vendorAssignments)
  .innerJoin(rfqs, eq(vendorAssignments.rfqId, rfqs.id))
  .where(eq(vendorAssignments.vendorId, vendorId));

  return assignments.map(a => a.rfq);
}

export async function getQuotationsForRfq(rfqId: number) {
  if (!rfqId || isNaN(rfqId)) return [];
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);
  const role = (session.user as any).role;

  if (role === "VENDOR") {
    return await db.select().from(quotations).where(and(eq(quotations.rfqId, rfqId), eq(quotations.userId, userId)));
  }

  if (["ADMIN", "MANAGER", "PROCUREMENT_OFFICER"].includes(role)) {
    return await db.select().from(quotations).where(eq(quotations.rfqId, rfqId));
  }

  return [];
}

export async function acceptQuotation(quotationId: number, rfqId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);
  const role = (session.user as any).role;

  if (role !== "ADMIN" && role !== "PROCUREMENT_OFFICER" && role !== "MANAGER") {
    throw new Error("Unauthorized: Only Admins, Managers, and Procurement Officers can accept quotations.");
  }

  const rfqQuery = await db.select().from(rfqs).where(eq(rfqs.id, rfqId));
  if (!rfqQuery.length) throw new Error("RFQ not found.");

  // Mark all other quotations for this RFQ as rejected
  await db.update(quotations).set({ status: "REJECTED" }).where(eq(quotations.rfqId, rfqId));
  
  // Mark this one as accepted
  await db.update(quotations).set({ status: "ACCEPTED" }).where(eq(quotations.id, quotationId));
  
  // Update RFQ status
  await db.update(rfqs).set({ status: "AWARD_PENDING_APPROVAL" }).where(eq(rfqs.id, rfqId));

  await db.insert(approvals).values({
    referenceId: rfqId,
    referenceType: "VENDOR_SELECTION",
    userId: userId,
    status: "PENDING",
    remarks: `Vendor Selection pending manager approval for Quotation ${quotationId}`,
  });

  await createActivityLog({
    userId,
    action: "UPDATED",
    entityType: "QUOTATION",
    entityId: quotationId,
    details: `Selected Quotation ${quotationId} for RFQ ${rfqId}. Pending Manager Approval.`,
  });

  revalidatePath(`/portal/procurement/comparison/${rfqId}`);
}
