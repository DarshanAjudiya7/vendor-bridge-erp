"use client";

import React, { useState } from "react";
import { deleteVendor } from "@/lib/actions/vendor";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function VendorRowActions({ vendorId }: { vendorId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVendor(vendorId);
      toast.success("Vendor deleted successfully");
    } catch (e) {
      toast.error("Failed to delete vendor");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-outline hover:text-primary transition-colors" title="View">
          <span className="material-symbols-outlined">visibility</span>
        </button>
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
        title="Delete Vendor"
        description="Are you sure you want to delete this vendor? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
}
