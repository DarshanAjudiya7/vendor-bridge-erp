import React from "react";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function ManagerDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Manager Overview</h2>
          <p className="text-on-surface-variant text-sm">Approve RFQs and Monitor Spend.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Spend */}
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-error/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-error">payments</span>
          </div>
          <div className="relative z-10">
            <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-error">payments</span> Total Spend
            </div>
            <div className="text-[32px] font-bold text-on-surface mb-2 font-mono tracking-tight">${Number(stats.totalSpend).toLocaleString()}</div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-secondary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-secondary">fact_check</span>
          </div>
          <div className="relative z-10">
            <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">fact_check</span> Pending Approvals
            </div>
            <div className="text-[32px] font-bold text-on-surface mb-2">{stats.openRfqs}</div>
          </div>
        </div>

        {/* PO Count */}
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-tertiary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-tertiary">receipt_long</span>
          </div>
          <div className="relative z-10">
            <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">receipt_long</span> Total POs
            </div>
            <div className="text-[32px] font-bold text-on-surface mb-2">{stats.totalPos}</div>
          </div>
        </div>

      </div>

    </div>
  );
}
