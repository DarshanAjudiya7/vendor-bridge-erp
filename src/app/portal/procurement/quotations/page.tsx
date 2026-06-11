import React from "react";
import Link from "next/link";
import { getAllQuotationsForProcurement } from "@/lib/actions/approval";

const STATUS_CLASS: Record<string, string> = {
  SUBMITTED: "bg-secondary/10 text-secondary",
  ACCEPTED: "bg-primary/10 text-primary",
  REJECTED: "bg-error/10 text-error",
};

export default async function QuotationsPage() {
  const quotations = await getAllQuotationsForProcurement();

  return (
    <div className="w-full text-on-background font-body-md">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Quotations</h2>
          <p className="text-on-surface-variant text-sm">All vendor bids received across your RFQs.</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">RFQ</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Total Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
              {quotations.map(({ quotation, vendorName, rfqTitle, rfqId }) => (
                <tr key={quotation.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors p-4 md:p-0">
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">RFQ</span>
                      <div className="font-bold text-sm text-on-surface">{rfqTitle}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none mt-2 md:mt-0 pt-2 md:pt-4">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Vendor</span>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {vendorName?.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-on-surface">{vendorName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 md:text-right border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-end">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Amount</span>
                      <span className="font-mono font-bold text-sm">${Number(quotation.totalAmount).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Delivery</span>
                      <span className="text-sm text-on-surface-variant">{quotation.deliveryDays} days</span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-center">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Status</span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold w-fit ${STATUS_CLASS[quotation.status ?? "SUBMITTED"] ?? "bg-surface-container text-on-surface"}`}>
                        {quotation.status}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none text-right">
                    <div className="flex justify-between md:justify-end">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Actions</span>
                      <Link
                        href={`/portal/procurement/comparison/${rfqId}`}
                        className="px-4 py-1.5 border border-primary/30 text-primary hover:bg-primary/10 rounded-lg text-[12px] font-bold transition-colors"
                      >
                        Compare Bids
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {quotations.length === 0 && (
                <tr className="block md:table-row">
                  <td colSpan={6} className="block md:table-cell text-center py-12 text-outline">
                    <span className="material-symbols-outlined text-[48px] opacity-30 block mb-3">request_quote</span>
                    No quotations received yet. Publish RFQs to invite vendor bids.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
