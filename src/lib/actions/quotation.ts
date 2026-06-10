"use server";

import { db } from "@/lib/db";
import { quotations, rfqs, vendorAssignments } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc, and } from "drizzle-orm";
import { createActivityLog, createNotification } from "./shared";
import { auth } from "@/lib/auth";

export async function submitQuotation(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  const rfqId = Number(formData.get("rfqId"));
  const vendorId = Number(formData.get("vendorId"));
  const totalAmount = Number(formData.get("totalAmount"));
  const deliveryDays = Number(formData.get("deliveryDays"));
  const paymentTerms = formData.get("paymentTerms") as string;
  const remarks = formData.get("remarks") as string;

  // Attachments
  const attachmentsRaw = formData.get("attachments") as string;
  const attachments = attachmentsRaw ? JSON.parse(attachmentsRaw) : [];

  const [newQuotation] = await db.insert(quotations).values({
    rfqId,
    vendorId,
    totalAmount: totalAmount.toString(),
    deliveryDays,
    paymentTerms,
    remarks,
    attachments,
    status: "SUBMITTED",
  }).returning();

  // Notify RFQ creator
  const rfqData = await db.select({ createdBy: rfqs.createdBy, title: rfqs.title }).from(rfqs).where(eq(rfqs.id, rfqId));
  if (rfqData[0] && rfqData[0].createdBy) {
    await createNotification({
      userId: rfqData[0].createdBy,
      title: "New Quotation Received",
      message: `A new quotation was submitted for RFQ: ${rfqData[0].title}`,
      type: "SUCCESS",
      link: `/portal/procurement/comparison/${rfqId}`,
    });
  }

  await createActivityLog({
    userId,
    action: "CREATED",
    entityType: "QUOTATION",
    entityId: newQuotation.id,
    details: `Submitted quotation for RFQ ${rfqId}`,
  });

  revalidatePath(`/portal/vendor/rfqs`);
  return newQuotation;
}

export async function getVendorRfqs(vendorId: number) {
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
  return await db.select().from(quotations).where(eq(quotations.rfqId, rfqId));
}

export async function acceptQuotation(quotationId: number, rfqId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  // Mark all other quotations for this RFQ as rejected
  await db.update(quotations).set({ status: "REJECTED" }).where(eq(quotations.rfqId, rfqId));
  
  // Mark this one as accepted
  await db.update(quotations).set({ status: "ACCEPTED" }).where(eq(quotations.id, quotationId));
  
  // Update RFQ status
  await db.update(rfqs).set({ status: "AWARDED" }).where(eq(rfqs.id, rfqId));

  await createActivityLog({
    userId,
    action: "APPROVED",
    entityType: "QUOTATION",
    entityId: quotationId,
    details: `Awarded RFQ ${rfqId}`,
  });

  revalidatePath(`/portal/procurement/comparison/${rfqId}`);
}
