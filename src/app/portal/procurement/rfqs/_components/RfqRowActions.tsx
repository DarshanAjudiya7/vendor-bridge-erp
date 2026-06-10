"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteRfq } from "@/lib/actions/rfq";

export function RfqRowActions({ rfqId }: { rfqId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this RFQ?")) return;
    setIsDeleting(true);
    try {
      await deleteRfq(rfqId);
    } catch (e) {
      alert("Failed to delete RFQ");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link href={`/portal/procurement/comparison/${rfqId}`} className="p-1.5 text-outline hover:text-primary transition-colors" title="Compare Bids">
        <span className="material-symbols-outlined">compare_arrows</span>
      </Link>
      <button className="p-1.5 text-outline hover:text-secondary transition-colors" title="Edit">
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button onClick={handleDelete} disabled={isDeleting} className="p-1.5 text-outline hover:text-error transition-colors" title="Delete">
        <span className="material-symbols-outlined">{isDeleting ? "hourglass_empty" : "delete"}</span>
      </button>
    </div>
  );
}
