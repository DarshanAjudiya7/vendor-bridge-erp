"use server";

import { db } from "@/lib/db";
import { rfqs, rfqItems, vendorAssignments, vendors, approvals } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc, inArray } from "drizzle-orm";
import { createActivityLog, createNotification } from "./shared";
import { auth } from "@/lib/auth";

export async function createRfq(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized: Please log in." };
    const userId = Number((session.user as any).id);
    const role = (session.user as any).role;
    if (!userId) return { success: false, error: "Invalid user session: missing user ID." };

    if (role !== "ADMIN" && role !== "PROCUREMENT_OFFICER") {
      return { success: false, error: "Unauthorized: Only Procurement Officers can create RFQs." };
    }

    const title = formData.get("title") as string;
    if (!title) return { success: false, error: "RFQ Title is required." };
    
    const rfqNumber = "RFQ-" + Math.floor(10000 + Math.random() * 90000).toString();
    const priority = formData.get("priority") as string;
    const department = formData.get("department") as string;
    const requestor = formData.get("requestor") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const deadlineRaw = formData.get("deadline") as string;
    if (!deadlineRaw) return { success: false, error: "Deadline is required." };
    const deadline = new Date(deadlineRaw);
    if (isNaN(deadline.getTime())) return { success: false, error: "Invalid deadline date format." };
    
    const isDraft = formData.get("action") === "draft";
    const status = isDraft ? "DRAFT" : "PENDING_APPROVAL";

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
      rfqNumber,
      category,
      description,
      priority,
      department,
      requestor,
      deadline,
      attachments,
      userId: userId,
      status, 
    }).returning();

    // 1.5. Create Approval Record if sent for approval
    if (!isDraft) {
      await db.insert(approvals).values({
        referenceId: newRfq.id,
        referenceType: "RFQ",
        userId: userId,
        status: "PENDING",
        remarks: "Initial RFQ creation pending manager approval",
      });
    }

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
  const role = (session.user as any).role;

  let allRfqs = [];

  if (role === "VENDOR") {
    // 1. Get vendor ID for this user
    const vendorRecord = await db.select().from(vendors).where(eq(vendors.userId, userId));
    if (!vendorRecord[0]) return [];
    
    // 2. Get assigned RFQs
    const assignments = await db.select().from(vendorAssignments).where(eq(vendorAssignments.vendorId, vendorRecord[0].id));
    if (assignments.length === 0) return [];
    
    const assignedRfqIds = assignments.map(a => a.rfqId as number);
    allRfqs = await db.select().from(rfqs).where(inArray(rfqs.id, assignedRfqIds)).orderBy(desc(rfqs.createdAt));
  } else {
    // Admin, Manager, Procurement Officer can see all
    allRfqs = await db.select().from(rfqs).orderBy(desc(rfqs.createdAt));
  }

  if (allRfqs.length === 0) return [];

  const rfqIds = allRfqs.map(r => r.id);

  // PERFORMANCE: Batch fetch all items and assignments in 2 queries instead of N*2
  const [allItems, allAssignments] = await Promise.all([
    db.select().from(rfqItems).where(inArray(rfqItems.rfqId, rfqIds)),
    db.select().from(vendorAssignments).where(inArray(vendorAssignments.rfqId, rfqIds)),
  ]);

  return allRfqs.map(rfq => ({
    ...rfq,
    itemsCount: allItems.filter(i => i.rfqId === rfq.id).length,
    vendorsCount: allAssignments.filter(a => a.rfqId === rfq.id).length,
  }));
}

export async function getRfqWithDetails(id: number) {
  const session = await auth();
  if (!session?.user) return null;
  const userId = Number((session.user as any).id);

  const role = (session.user as any).role;

  const rfqQuery = await db.select().from(rfqs).where(eq(rfqs.id, id));
  const rfq = rfqQuery[0];
  if (!rfq) return null;

  if (role === "VENDOR") {
    const vendorRecord = await db.select().from(vendors).where(eq(vendors.userId, userId));
    if (!vendorRecord[0]) return null;
    
    const assignment = await db.select().from(vendorAssignments).where(eq(vendorAssignments.rfqId, id));
    const isAssigned = assignment.some(a => a.vendorId === vendorRecord[0].id);
    if (!isAssigned) return null; // STRICT VENDOR ISOLATION
  }

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

  const role = (session.user as any).role;

  if (role !== "ADMIN" && role !== "PROCUREMENT_OFFICER") {
    throw new Error("Unauthorized to delete RFQs");
  }

  const rfqQuery = await db.select().from(rfqs).where(eq(rfqs.id, id));
  if (!rfqQuery[0]) {
    throw new Error("RFQ not found");
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
