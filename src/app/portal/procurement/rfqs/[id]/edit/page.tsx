import React from "react";
import { getRfqWithDetails } from "@/lib/actions/rfq";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditRfqForm } from "./_components/EditRfqForm";

export default async function EditRfqPage({ params }: { params: { id: string } }) {
  const rfqId = parseInt(params.id, 10);
  if (isNaN(rfqId)) return notFound();

  const rfq = await getRfqWithDetails(rfqId);
  if (!rfq) return notFound();

  return (
    <div className="w-full font-body-md text-on-background max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/portal/procurement/rfqs"
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-[24px] font-bold text-primary">Edit RFQ</h2>
          <p className="text-on-surface-variant text-sm">{rfq.rfqNumber || `RFQ-${rfq.id}`} — {rfq.title}</p>
        </div>
      </div>

      <EditRfqForm rfq={rfq} />
    </div>
  );
}
