"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteRfq } from "@/lib/actions/rfq";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function RfqRowActions({ rfqId }: { rfqId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRfq(rfqId);
      toast.success("RFQ deleted successfully");
    } catch (e) {
      toast.error("Failed to delete RFQ");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/portal/procurement/comparison/${rfqId}`} className="p-1.5 text-outline hover:text-primary transition-colors" title="Compare Bids">
          <span className="material-symbols-outlined">compare_arrows</span>
        </Link>
        <button className="p-1.5 text-outline hover:text-secondary transition-colors" title="Edit">
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button onClick={() => setShowConfirm(true)} disabled={isDeleting} className="p-1.5 text-outline hover:text-error transition-colors" title="Delete">
          <span className="material-symbols-outlined">{isDeleting ? "hourglass_empty" : "delete"}</span>
        </button>
      </div>

      <ConfirmDialog 
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete RFQ"
        description="Are you sure you want to delete this RFQ? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
}
