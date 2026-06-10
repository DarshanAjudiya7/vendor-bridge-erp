"use server";

import { db } from "@/lib/db";
import { rfqs, rfqItems, vendorAssignments, vendors } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { createActivityLog, createNotification } from "./shared";
import { auth } from "@/lib/auth";

export async function createRfq(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized: Please log in." };
    const userId = Number((session.user as any).id);
    if (!userId) return { success: false, error: "Invalid user session: missing user ID." };

    const title = formData.get("title") as string;
    if (!title) return { success: false, error: "RFQ Title is required." };
    
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const deadlineRaw = formData.get("deadline") as string;
    if (!deadlineRaw) return { success: false, error: "Deadline is required." };
    const deadline = new Date(deadlineRaw);
    if (isNaN(deadline.getTime())) return { success: false, error: "Invalid deadline date format." };
    
    // Attachments
    const attachmentsRaw = formData.get("attachments") as string;
    const attachments = attachmentsRaw ? JSON.parse(attachmentsRaw) : [];

    // Items (JSON array)
    const itemsRaw = formData.get("items") as string;
    const items = itemsRaw ? JSON.parse(itemsRaw) : [];

    // Vendors assigned (JSON array of IDs)
    const assignedVendorsRaw = formData.get("assignedVendors") as string;
    const assignedVendors = assignedVendorsRaw ? JSON.parse(assignedVendorsRaw) : [];

    // 1. Create RFQ
    const [newRfq] = await db.insert(rfqs).values({
      title,
      category,
      description,
      deadline,
      attachments,
      userId: userId,
      status: "OPEN", // Change to OPEN since it is published
    }).returning();

    // 2. Create Items
    if (items.length > 0) {
      const rfqItemsData = items.map((item: any) => ({
        rfqId: newRfq.id,
        productName: item.productName || "Unnamed Item",
        quantity: Number(item.quantity) || 1,
        unit: item.unit || "units",
      }));
      await db.insert(rfqItems).values(rfqItemsData);
    }

    // 3. Assign Vendors and Notify
    if (assignedVendors.length > 0) {
      const assignments = assignedVendors.map((vendorId: number) => ({
        rfqId: newRfq.id,
        vendorId: Number(vendorId),
      }));
      await db.insert(vendorAssignments).values(assignments);

      // Get vendor user ids to notify them
      for (const vId of assignedVendors) {
        const vendorData = await db.select({ userId: vendors.userId }).from(vendors).where(eq(vendors.id, Number(vId)));
        if (vendorData[0] && vendorData[0].userId) {
          await createNotification({
            userId: vendorData[0].userId,
            title: "New RFQ Assigned",
            message: `You have been invited to quote for: ${title}`,
            type: "INFO",
            link: `/portal/vendor/rfqs/${newRfq.id}`,
          });
        }
      }
    }

    // 4. Log Activity
    await createActivityLog({
      userId,
      action: "CREATED",
      entityType: "RFQ",
      entityId: newRfq.id,
      details: `Created RFQ: ${title}`,
    });

    revalidatePath("/portal/procurement/rfqs");
    return { success: true, data: newRfq };
  } catch (error: any) {
    console.error("Backend Error in createRfq:", error);
    return { success: false, error: error.message || "An unexpected database error occurred during RFQ creation." };
  }
}

export async function getRfqs() {
  const session = await auth();
  if (!session?.user) return [];
  const userId = Number((session.user as any).id);

  // STRICT ISOLATION: Only return RFQs created by this exact user
  const allRfqs = await db.select().from(rfqs).where(eq(rfqs.userId, userId)).orderBy(desc(rfqs.createdAt));

  // Add stats
  return await Promise.all(allRfqs.map(async (rfq) => {
    const items = await db.select().from(rfqItems).where(eq(rfqItems.rfqId, rfq.id));
    const assignments = await db.select().from(vendorAssignments).where(eq(vendorAssignments.rfqId, rfq.id));
    return {
      ...rfq,
      itemsCount: items.length,
      vendorsCount: assignments.length,
    };
  }));
}

export async function getRfqWithDetails(id: number) {
  const session = await auth();
  if (!session?.user) return null;
  const userId = Number((session.user as any).id);

  const rfqQuery = await db.select().from(rfqs).where(eq(rfqs.id, id));
  const rfq = rfqQuery[0];
  if (!rfq || rfq.userId !== userId) return null; // STRICT ISOLATION

  const items = await db.select().from(rfqItems).where(eq(rfqItems.rfqId, id));
  const assignments = await db.select().from(vendorAssignments).where(eq(vendorAssignments.rfqId, id));
  
  const assignedVendorDetails = await Promise.all(assignments.map(async (a) => {
    const v = await db.select().from(vendors).where(eq(vendors.id, a.vendorId!));
    return v[0];
  }));

  return { ...rfq, items, assignedVendors: assignedVendorDetails.filter(Boolean) };
}

export async function deleteRfq(id: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const userId = Number((session.user as any).id);

  // STRICT ISOLATION: Check if user owns it
  const rfqQuery = await db.select().from(rfqs).where(eq(rfqs.id, id));
  if (!rfqQuery[0] || rfqQuery[0].userId !== userId) {
    throw new Error("Unauthorized or RFQ not found");
  }

  // Delete dependencies first
  await db.delete(rfqItems).where(eq(rfqItems.rfqId, id));
  await db.delete(vendorAssignments).where(eq(vendorAssignments.rfqId, id));
  
  await db.delete(rfqs).where(eq(rfqs.id, id));

  await createActivityLog({
    userId,
    action: "DELETED",
    entityType: "RFQ",
    entityId: id,
  });

  revalidatePath("/portal/procurement/rfqs");
}
