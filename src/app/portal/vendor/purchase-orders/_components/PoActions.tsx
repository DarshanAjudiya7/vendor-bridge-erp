"use client";

import React, { useState } from "react";
import { acceptPurchaseOrder, deliverPurchaseOrder } from "@/lib/actions/purchaseOrder";
import { toast } from "sonner";

export function PoActions({ poId, status }: { poId: number; status: string }) {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptPurchaseOrder(poId);
      toast.success("Purchase Order accepted.");
    } catch (e: any) {
      toast.error(e.message || "Failed to accept PO");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async () => {
    setLoading(true);
    try {
      await deliverPurchaseOrder(poId);
      toast.success("Purchase Order marked as delivered.");
    } catch (e: any) {
      toast.error(e.message || "Failed to mark as delivered");
    } finally {
      setLoading(false);
    }
  };

  if (status === "GENERATED") {
    return (
      <button 
        onClick={handleAccept} 
        disabled={loading}
        className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
      >
        {loading ? "Accepting..." : "Accept PO"}
      </button>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <button 
        onClick={handleDeliver} 
        disabled={loading}
        className="px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
      >
        {loading ? "Updating..." : "Mark Delivered"}
      </button>
    );
  }

  if (status === "DELIVERED") {
    return <span className="text-secondary font-bold text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_shipping</span> Delivered</span>;
  }

  return null;
}
