"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { deleteRfq } from "@/lib/actions/rfq";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function RfqRowActions({ rfqId }: { rfqId: number }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteRfq(rfqId);
        toast.success("RFQ deleted successfully.");
      } catch (e: any) {
        toast.error(e.message || "Failed to delete RFQ.");
      }
    });
  };

  return (
    <>
      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/portal/procurement/comparison/${rfqId}`}
          className="p-2 rounded-lg text-outline hover:text-primary hover:bg-primary/10 transition-colors"
          title="Compare Bids"
        >
          <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
        </Link>
        <Link
          href={`/portal/procurement/rfqs/${rfqId}/edit`}
          className="p-2 rounded-lg text-outline hover:text-secondary hover:bg-secondary/10 transition-colors"
          title="Edit RFQ"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="p-2 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
          title="Delete RFQ"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isPending ? "hourglass_empty" : "delete"}
          </span>
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete RFQ"
        description="Are you sure you want to permanently delete this RFQ? This cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
