"use server";

import { db } from "@/lib/db";
import { invoices, purchaseOrders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { createActivityLog } from "./shared";
import { auth } from "@/lib/auth";

export async function createInvoice(poId: number, totalAmount: number, taxAmount: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  const [newInvoice] = await db.insert(invoices).values({
    poId,
    invoiceNumber,
    taxAmount: taxAmount.toString(),
    totalAmount: totalAmount.toString(),
  }).returning();

  await createActivityLog({
    userId,
    action: "CREATED",
    entityType: "INVOICE",
    entityId: newInvoice.id,
    details: `Generated Invoice ${invoiceNumber}`,
  });

  revalidatePath("/portal/procurement/invoices");
  return newInvoice;
}

export async function getInvoices() {
  const { vendors, quotations } = await import("@/lib/db/schema");
  const results = await db.select({
    invoice: invoices,
    po: purchaseOrders,
    vendor: vendors,
  })
  .from(invoices)
  .innerJoin(purchaseOrders, eq(invoices.poId, purchaseOrders.id))
  .innerJoin(quotations, eq(purchaseOrders.quotationId, quotations.id))
  .innerJoin(vendors, eq(quotations.vendorId, vendors.id))
  .orderBy(desc(invoices.generatedAt));

  return results;
}
