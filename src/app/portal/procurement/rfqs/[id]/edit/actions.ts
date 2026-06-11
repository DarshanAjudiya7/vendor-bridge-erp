"use server";

import { db } from "@/lib/db";
import { rfqs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createActivityLog } from "@/lib/actions/shared";

export async function updateRfq(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };
  const userId = Number((session.user as any).id);

  const rfqCheck = await db.select().from(rfqs).where(eq(rfqs.id, id));
  if (!rfqCheck[0] || rfqCheck[0].userId !== userId) {
    return { success: false, error: "RFQ not found or access denied." };
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const department = formData.get("department") as string;
  const requestor = formData.get("requestor") as string;
  const deadlineRaw = formData.get("deadline") as string;

  if (!title) return { success: false, error: "Title is required." };
  if (!deadlineRaw) return { success: false, error: "Deadline is required." };

  const deadline = new Date(deadlineRaw);

  await db.update(rfqs)
    .set({ title, category, description, priority, department, requestor, deadline, updatedAt: new Date() })
    .where(eq(rfqs.id, id));

  await createActivityLog({
    userId,
    action: "UPDATED",
    entityType: "RFQ",
    entityId: id,
    details: `Updated RFQ: ${title}`,
  });

  revalidatePath("/portal/procurement/rfqs");
  revalidatePath(`/portal/procurement/rfqs/${id}/edit`);
  return { success: true };
}
