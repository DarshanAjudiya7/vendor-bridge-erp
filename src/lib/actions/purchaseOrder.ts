"use server";

import { db } from "@/lib/db";
import { purchaseOrders, quotations, rfqs, vendorAssignments, vendors } from "@/lib/db/schema";
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
    userId: userId,
    totalAmount: totalAmount.toString(),
  }).returning();

  // Notify Vendor
  const qData = await db.select().from(quotations).where(eq(quotations.id, quotationId));
  if (qData[0]) {
    // get vendor userId
    const vendorId = qData[0].vendorId;
    if (vendorId) {
      const vData = await db.select().from(vendors).where(eq(vendors.id, vendorId));
      if (vData[0] && vData[0].userId) {
        await createNotification({
          userId: vData[0].userId,
          title: "Purchase Order Received",
          message: `A new Purchase Order (PO-${newPO.id}) has been issued for RFQ ${qData[0].rfqId}.`,
          type: "INFO",
          link: `/portal/vendor/rfqs`,
        });
      }
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
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);

  const role = (session.user as any).role;

  if (role === "VENDOR") {
    const vendorRecord = await db.select().from(vendors).where(eq(vendors.userId, userId));
    if (!vendorRecord[0]) return [];

    let query = db.select({
      po: purchaseOrders,
      quotation: quotations,
      vendor: vendors,
      rfq: rfqs
    })
    .from(purchaseOrders)
    .innerJoin(quotations, eq(purchaseOrders.quotationId, quotations.id))
    .innerJoin(vendors, eq(quotations.vendorId, vendors.id))
    .innerJoin(rfqs, eq(purchaseOrders.rfqId, rfqs.id))
    .where(eq(vendors.id, vendorRecord[0].id));

    return await query.orderBy(desc(purchaseOrders.createdAt));
  }

  // Admin/Manager/PO: return all POs generated
  let query = db.select({
    po: purchaseOrders,
    quotation: quotations,
    vendor: vendors,
    rfq: rfqs
  })
  .from(purchaseOrders)
  .innerJoin(quotations, eq(purchaseOrders.quotationId, quotations.id))
  .innerJoin(vendors, eq(quotations.vendorId, vendors.id))
  .innerJoin(rfqs, eq(purchaseOrders.rfqId, rfqs.id))
  // Actually for Procurement Officers it should return all, or just theirs? Returning all for simplicity since this is a platform.
  // We'll remove the where(eq(purchaseOrders.userId, userId)) constraint so all procurement officers can see all POs.
  .orderBy(desc(purchaseOrders.createdAt));

  return await query;
}

export async function acceptPurchaseOrder(poId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  await db.update(purchaseOrders)
    .set({ status: "ACCEPTED" })
    .where(eq(purchaseOrders.id, poId));

  await createActivityLog({
    userId,
    action: "UPDATED",
    entityType: "PO",
    entityId: poId,
    details: `PO ${poId} accepted by Vendor`,
  });

  revalidatePath("/portal/vendor/purchase-orders");
}

export async function deliverPurchaseOrder(poId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  await db.update(purchaseOrders)
    .set({ status: "DELIVERED" })
    .where(eq(purchaseOrders.id, poId));

  await createActivityLog({
    userId,
    action: "UPDATED",
    entityType: "PO",
    entityId: poId,
    details: `PO ${poId} marked as Delivered`,
  });

  revalidatePath("/portal/vendor/purchase-orders");
}
