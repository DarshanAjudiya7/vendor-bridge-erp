"use server";

import { db } from "@/lib/db";
import { vendors, rfqs, quotations, purchaseOrders, invoices } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getDashboardStats() {
  const [vendorCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(vendors);
  const [rfqCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(rfqs);
  const [openRfqCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(rfqs).where(eq(rfqs.status, 'OPEN'));
  const [quotationCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(quotations);
  const [poCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(purchaseOrders);
  const [invoiceCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(invoices);

  // Total Spend
  const [totalSpendRaw] = await db.select({ sum: sql<number>`sum(CAST(${purchaseOrders.totalAmount} AS NUMERIC))` }).from(purchaseOrders);

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
  const [quotationsCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(quotations).where(eq(quotations.vendorId, vendorId));
  const [acceptedCount] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(quotations).where(eq(quotations.vendorId, vendorId)).where(eq(quotations.status, 'ACCEPTED'));
  
  // Actually we need to filter by accepted status for that vendor
  const [wonAmountRaw] = await db.select({ sum: sql<number>`sum(CAST(${quotations.totalAmount} AS NUMERIC))` })
    .from(quotations)
    .where(eq(quotations.vendorId, vendorId))
    .where(eq(quotations.status, 'ACCEPTED'));

  return {
    submittedQuotations: quotationsCount?.count || 0,
    wonBids: acceptedCount?.count || 0,
    totalEarned: wonAmountRaw?.sum || 0,
  };
}
