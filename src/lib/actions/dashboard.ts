"use server";

import { db } from "@/lib/db";
import { vendors, rfqs, quotations, purchaseOrders, invoices, activityLogs } from "@/lib/db/schema";
import { eq, sql, and, count, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { cache } from "react";

export const getDashboardStats = cache(async () => {
  const session = await auth();
  if (!session?.user) return { totalVendors: 0, totalRfqs: 0, openRfqs: 0, totalQuotations: 0, totalPos: 0, totalInvoices: 0, totalSpend: 0 };
  const userId = Number((session.user as any).id);

  try {
    // PERFORMANCE: Execute queries concurrently using Promise.all to avoid N+1 waterfall
    const [vendorCount, rfqCount, openRfqCount, quotationCount, poCount, invoiceCount, totalSpendRaw] = await Promise.all([
      db.select({ count: count() }).from(vendors).where(eq(vendors.userId, userId)),
      db.select({ count: count() }).from(rfqs).where(eq(rfqs.userId, userId)),
      db.select({ count: count() }).from(rfqs).where(and(eq(rfqs.status, 'OPEN'), eq(rfqs.userId, userId))),
      db.select({ count: count() }).from(quotations).where(eq(quotations.userId, userId)),
      db.select({ count: count() }).from(purchaseOrders).where(eq(purchaseOrders.userId, userId)),
      db.select({ count: count() }).from(invoices).where(eq(invoices.userId, userId)),
      db.select({ sum: sql<number>`coalesce(sum(CAST(${purchaseOrders.totalAmount} AS NUMERIC)), 0)` }).from(purchaseOrders).where(eq(purchaseOrders.userId, userId))
    ]);

    return {
      totalVendors: vendorCount[0]?.count ?? 0,
      totalRfqs: rfqCount[0]?.count ?? 0,
      openRfqs: openRfqCount[0]?.count ?? 0,
      totalQuotations: quotationCount[0]?.count ?? 0,
      totalPos: poCount[0]?.count ?? 0,
      totalInvoices: invoiceCount[0]?.count ?? 0,
      totalSpend: totalSpendRaw[0]?.sum ?? 0,
    };
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return { totalVendors: 0, totalRfqs: 0, openRfqs: 0, totalQuotations: 0, totalPos: 0, totalInvoices: 0, totalSpend: 0 };
  }
});

export const getVendorDashboardStats = cache(async (vendorId: number) => {
  const session = await auth();
  if (!session?.user) return { submittedQuotations: 0, wonBids: 0, totalEarned: 0 };
  const userId = Number((session.user as any).id);

  try {
    // Ensure this vendor belongs to the user
    const vendorData = await db.select().from(vendors).where(and(eq(vendors.id, vendorId), eq(vendors.userId, userId)));
    if (!vendorData.length) return { submittedQuotations: 0, wonBids: 0, totalEarned: 0 };

    const [quotationsCount, acceptedCount, wonAmountRaw] = await Promise.all([
      db.select({ count: count() }).from(quotations).where(eq(quotations.vendorId, vendorId)),
      db.select({ count: count() }).from(quotations).where(and(eq(quotations.vendorId, vendorId), eq(quotations.status, 'ACCEPTED'))),
      db.select({ sum: sql<number>`coalesce(sum(CAST(${quotations.totalAmount} AS NUMERIC)), 0)` })
        .from(quotations)
        .where(and(eq(quotations.vendorId, vendorId), eq(quotations.status, 'ACCEPTED')))
    ]);

    return {
      submittedQuotations: quotationsCount[0]?.count ?? 0,
      wonBids: acceptedCount[0]?.count ?? 0,
      totalEarned: wonAmountRaw[0]?.sum ?? 0,
    };
  } catch (err) {
    console.error("getVendorDashboardStats error:", err);
    return { submittedQuotations: 0, wonBids: 0, totalEarned: 0 };
  }
});

export const getRecentActivities = cache(async (limitCount = 5) => {
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);

  try {
    const activities = await db.select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limitCount);

    return activities;
  } catch (err) {
    console.error("getRecentActivities error:", err);
    return [];
  }
});
