import React from "react";
import Link from "next/link";
import { getRfqs } from "@/lib/actions/rfq";
import { RfqRowActions } from "./_components/RfqRowActions";

export default async function RFQsPage() {
  const rfqsList = await getRfqs();

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-headline-lg text-[24px] sm:text-[32px] font-semibold text-on-background">RFQ Management</h3>
          <p className="text-on-surface-variant font-body-md text-sm sm:text-base">Create, track, and manage all your Request for Quotations.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2.5 bg-surface border border-outline-variant text-on-surface rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95 text-sm sm:text-base">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            Filter
          </button>
          <Link href="/portal/procurement/rfqs/create" className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 text-sm sm:text-base whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">add</span>
            Create RFQ
          </Link>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-transparent md:bg-surface md:rounded-2xl md:border md:border-outline-variant md:shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">RFQ ID & Title</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
              {rfqsList.map((rfq) => (
                <tr key={rfq.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors group relative p-4 md:p-0">
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">request_quote</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-on-surface text-base md:text-sm">{rfq.title}</div>
                        <div className="text-[12px] md:text-[11px] text-outline">RFQ-{new Date(rfq.createdAt || new Date()).getFullYear()}-{rfq.id.toString().padStart(3, '0')}</div>
                      </div>
                      {/* Mobile Actions Overlay */}
                      <div className="md:hidden">
                        <RfqRowActions rfqId={rfq.id} />
                      </div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none mt-3 md:mt-0 pt-3 md:pt-4">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Category</span>
                      <span className="px-2.5 py-1 bg-surface-container-highest rounded text-on-surface-variant text-[12px] font-medium capitalize">
                        {rfq.category || "Uncategorized"}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-center">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Status</span>
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 w-fit ${
                        rfq.status === 'OPEN' ? 'bg-primary/10 text-primary' : 
                        rfq.status === 'DRAFT' ? 'bg-surface-variant/20 text-on-surface-variant' : 
                        rfq.status === 'AWARDED' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 text-on-surface-variant border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Deadline</span>
                      <div className="text-body-md font-mono-sm text-sm">{rfq.deadline ? rfq.deadline.toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-right">
                    <RfqRowActions rfqId={rfq.id} />
                  </td>
                </tr>
              ))}
              {rfqsList.length === 0 && (
                <tr className="block md:table-row bg-surface rounded-xl border border-outline-variant md:border-none">
                  <td colSpan={5} className="block md:table-cell text-center py-10 md:py-8 text-outline text-sm md:text-base">No RFQs found. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
