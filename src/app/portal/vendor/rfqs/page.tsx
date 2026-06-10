import React from "react";
import Link from "next/link";
import { getVendorRfqs } from "@/lib/actions/quotation";
import { getVendorByUserId } from "@/lib/actions/vendor";
import { auth } from "@/lib/auth";

export default async function VendorRfqsPage() {
  const session = await auth();
  const userId = Number((session?.user as any)?.id || 1);
  const vendor = await getVendorByUserId(userId);
  
  let rfqsList: any[] = [];
  if (vendor) {
    rfqsList = await getVendorRfqs(vendor.id);
  }

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-[32px] font-semibold text-on-background">My RFQs</h3>
            <p className="text-on-surface-variant font-body-md">View and submit quotations for Requests for Quotations assigned to you.</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">RFQ ID & Title</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {rfqsList.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">request_quote</span>
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{rfq.title}</div>
                        <div className="text-[11px] text-outline">RFQ-{new Date(rfq.createdAt || new Date()).getFullYear()}-{rfq.id.toString().padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-surface-container-highest rounded text-on-surface-variant text-[12px] font-medium capitalize">
                      {rfq.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 ${
                        rfq.status === 'OPEN' ? 'bg-primary/10 text-primary' : 
                        rfq.status === 'AWARDED' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    <div className="text-body-md font-mono-sm">{rfq.deadline ? rfq.deadline.toLocaleDateString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/portal/vendor/rfqs/${rfq.id}`} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all text-sm">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {rfqsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-outline">No RFQs assigned to you yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
