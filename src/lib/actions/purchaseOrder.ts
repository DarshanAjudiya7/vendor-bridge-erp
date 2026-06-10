"use server";

import { db } from "@/lib/db";
import { purchaseOrders, quotations, rfqs, vendorAssignments } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { createActivityLog, createNotification } from "./shared";
import { auth } from "@/lib/auth";

export async function createPurchaseOrder(quotationId: number, totalAmount: number, rfqId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  const [newPO] = await db.insert(purchaseOrders).values({
    poNumber,
    quotationId,
    rfqId,
    generatedBy: userId,
    totalAmount: totalAmount.toString(),
  }).returning();

  // Notify Vendor
  const qData = await db.select().from(quotations).where(eq(quotations.id, quotationId));
  if (qData[0]) {
    // get vendor userId
    const { vendors } = await import("@/lib/db/schema");
    const vData = await db.select().from(vendors).where(eq(vendors.id, qData[0].vendorId));
    if (vData[0] && vData[0].userId) {
      await createNotification({
        userId: vData[0].userId,
        title: "Purchase Order Received",
        message: `PO ${poNumber} has been generated for your quotation.`,
        type: "SUCCESS",
      });
    }
  }

  await createActivityLog({
    userId,
    action: "CREATED",
    entityType: "PO",
    entityId: newPO.id,
    details: `Generated PO ${poNumber}`,
  });

  revalidatePath("/portal/procurement/purchase-orders");
  return newPO;
}

export async function getPurchaseOrders() {
  const { vendors } = await import("@/lib/db/schema");
  // We need to join with quotations and vendors to get vendor details
  const results = await db.select({
    po: purchaseOrders,
    quotation: quotations,
    vendor: vendors,
    rfq: rfqs
  })
  .from(purchaseOrders)
  .innerJoin(quotations, eq(purchaseOrders.quotationId, quotations.id))
  .innerJoin(vendors, eq(quotations.vendorId, vendors.id))
  .innerJoin(rfqs, eq(purchaseOrders.rfqId, rfqs.id))
  .orderBy(desc(purchaseOrders.createdAt));

  return results;
}
