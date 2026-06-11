"use client";

import React, { useState } from "react";
import { createInvoice } from "@/lib/actions/invoice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProcurementPoActions({ poId, status, totalAmount }: { poId: number; status: string; totalAmount: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerateInvoice = async () => {
    setLoading(true);
    try {
      const taxAmount = totalAmount * 0.18; // Example 18% tax
      const totalWithTax = totalAmount + taxAmount;
      await createInvoice(poId, totalWithTax, taxAmount);
      toast.success("Invoice generated successfully!");
      router.push("/portal/procurement/invoices");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  if (status === "DELIVERED") {
    return (
      <button 
        onClick={handleGenerateInvoice} 
        disabled={loading}
        className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
      >
        {loading ? "Generating..." : "Generate Invoice"}
      </button>
    );
  }

  return <span className="text-outline text-xs italic">Awaiting Vendor</span>;
}
