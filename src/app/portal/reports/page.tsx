import React from "react";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function ReportsPage() {
  const stats = await getDashboardStats();

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Reports & Analytics</h2>
          <p className="text-on-surface-variant text-sm">Comprehensive breakdown of your procurement data.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-surface rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col justify-between min-h-[300px]">
          <h3 className="font-title-md font-bold mb-4">Total Spend Overview</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
            <div className="text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2 opacity-30">bar_chart</span>
              <p className="text-on-surface-variant text-sm">Visual charts are coming in the next update.</p>
              <h4 className="text-[32px] font-mono font-bold mt-2 text-primary">${Number(stats.totalSpend).toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col gap-4">
          <h3 className="font-title-md font-bold mb-2">Key Metrics</h3>
          
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex justify-between items-center">
            <div>
              <p className="text-[11px] text-outline uppercase font-bold tracking-wider">Total RFQs</p>
              <p className="text-[24px] font-bold text-on-surface">{stats.totalRfqs}</p>
            </div>
            <span className="material-symbols-outlined text-secondary text-[32px] opacity-50">request_quote</span>
          </div>

          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex justify-between items-center">
            <div>
              <p className="text-[11px] text-outline uppercase font-bold tracking-wider">Purchase Orders</p>
              <p className="text-[24px] font-bold text-on-surface">{stats.totalPos}</p>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[32px] opacity-50">shopping_cart</span>
          </div>

          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex justify-between items-center">
            <div>
              <p className="text-[11px] text-outline uppercase font-bold tracking-wider">Invoices</p>
              <p className="text-[24px] font-bold text-on-surface">{stats.totalInvoices}</p>
            </div>
            <span className="material-symbols-outlined text-[#8b5cf6] text-[32px] opacity-50">receipt_long</span>
          </div>
        </div>
      </div>
    </div>
  );
}
