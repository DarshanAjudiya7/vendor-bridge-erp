"use client";

import React, { useState } from "react";
import { payInvoice } from "@/lib/actions/invoice";
import { toast } from "sonner";

export function InvoiceActions({ invoiceId, status }: { invoiceId: number; status: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await payInvoice(invoiceId);
      toast.success("Payment released successfully.");
    } catch (e: any) {
      toast.error(e.message || "Failed to release payment");
    } finally {
      setLoading(false);
    }
  };

  if (status === "GENERATED") {
    return (
      <button 
        onClick={handlePay} 
        disabled={loading}
        className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
      >
        {loading ? "Processing..." : "Release Payment"}
      </button>
    );
  }

  if (status === "PAID") {
    return <span className="text-secondary font-bold text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Paid</span>;
  }

  return null;
}
