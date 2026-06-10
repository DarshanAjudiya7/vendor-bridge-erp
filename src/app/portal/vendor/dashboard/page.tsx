import React from "react";
import { getVendorDashboardStats } from "@/lib/actions/dashboard";
import { getVendorByUserId } from "@/lib/actions/vendor";
import { auth } from "@/lib/auth";

export default async function VendorDashboard() {
  const session = await auth();
  const userId = Number((session?.user as any)?.id || 1);
  const vendor = await getVendorByUserId(userId);
  
  let stats = {
    submittedQuotations: 0,
    wonBids: 0,
    totalEarned: 0
  };

  if (vendor) {
    stats = await getVendorDashboardStats(vendor.id);
  }

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Vendor Portal Dashboard</h2>
          <p className="text-on-surface-variant text-sm">Welcome back, {vendor?.companyName || "Vendor"}!</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Submitted Quotes */}
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-primary">request_quote</span>
          </div>
          <div className="relative z-10">
            <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">request_quote</span> Submitted Bids
            </div>
            <div className="text-[32px] font-bold text-on-surface mb-2">{stats.submittedQuotations}</div>
          </div>
        </div>

        {/* Won Bids */}
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-secondary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-secondary">workspace_premium</span>
          </div>
          <div className="relative z-10">
            <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">workspace_premium</span> Won Contracts
            </div>
            <div className="text-[32px] font-bold text-on-surface mb-2">{stats.wonBids}</div>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-error/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-error">payments</span>
          </div>
          <div className="relative z-10">
            <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-error">payments</span> Total Earned
            </div>
            <div className="text-[32px] font-bold text-on-surface mb-2 font-mono tracking-tight">${Number(stats.totalEarned).toLocaleString()}</div>
          </div>
        </div>

      </div>

    </div>
  );
}
