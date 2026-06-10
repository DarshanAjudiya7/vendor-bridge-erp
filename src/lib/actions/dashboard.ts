"use server";

import { db } from "@/lib/db";
import { vendors, rfqs, quotations, purchaseOrders, invoices } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user) return { totalVendors: 0, totalRfqs: 0, openRfqs: 0, totalQuotations: 0, totalPos: 0, totalInvoices: 0, totalSpend: 0 };
  const userId = Number((session.user as any).id);

  // STRICT ISOLATION: Only fetch stats for this specific user
  const [vendorCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(vendors).where(eq(vendors.userId, userId));
  const [rfqCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(rfqs).where(eq(rfqs.userId, userId));
  const [openRfqCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(rfqs).where(and(eq(rfqs.status, 'OPEN'), eq(rfqs.userId, userId)));
  const [quotationCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(quotations).where(eq(quotations.userId, userId));
  const [poCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(purchaseOrders).where(eq(purchaseOrders.userId, userId));
  const [invoiceCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(invoices).where(eq(invoices.userId, userId));
  const [totalSpendRaw] = await db.select({ sum: sql<number>`sum(CAST(${purchaseOrders.totalAmount} AS NUMERIC))` }).from(purchaseOrders).where(eq(purchaseOrders.userId, userId));

  return {
    totalVendors: vendorCount?.count || 0,
    totalRfqs: rfqCount?.count || 0,
    openRfqs: openRfqCount?.count || 0,
    totalQuotations: quotationCount?.count || 0,
    totalPos: poCount?.count || 0,
    totalInvoices: invoiceCount?.count || 0,
    totalSpend: totalSpendRaw?.sum || 0,
  };
}

export async function getVendorDashboardStats(vendorId: number) {
  const session = await auth();
  if (!session?.user) return { submittedQuotations: 0, wonBids: 0, totalEarned: 0 };
  const userId = Number((session.user as any).id);

  // Ensure this vendor belongs to the user
  const vendorData = await db.select().from(vendors).where(and(eq(vendors.id, vendorId), eq(vendors.userId, userId)));
  if (!vendorData.length) return { submittedQuotations: 0, wonBids: 0, totalEarned: 0 };

  const [quotationsCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(quotations).where(eq(quotations.vendorId, vendorId));
  const [acceptedCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(quotations).where(and(eq(quotations.vendorId, vendorId), eq(quotations.status, 'ACCEPTED')));
  
  const [wonAmountRaw] = await db.select({ sum: sql<number>`sum(CAST(${quotations.totalAmount} AS NUMERIC))` })
    .from(quotations)
    .where(and(eq(quotations.vendorId, vendorId), eq(quotations.status, 'ACCEPTED')));

  return {
    submittedQuotations: quotationsCount?.count || 0,
    wonBids: acceptedCount?.count || 0,
    totalEarned: wonAmountRaw?.sum || 0,
  };
}
