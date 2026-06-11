import React, { Suspense } from "react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

async function StatsGrid() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in duration-500">
      {/* Total Vendors */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-primary">groups</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">groups</span> Total Vendors
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2">{stats.totalVendors}</div>
          <div className="text-[12px] font-bold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +12% from last month
          </div>
        </div>
      </div>

      {/* Total RFQs */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-secondary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-secondary">request_quote</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">request_quote</span> Active RFQs
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2">{stats.openRfqs} <span className="text-sm font-normal text-outline">/ {stats.totalRfqs} total</span></div>
          <div className="text-[12px] font-bold text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> {stats.totalQuotations} Bids Received
          </div>
        </div>
      </div>

      {/* Total POs */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-tertiary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-tertiary">shopping_cart</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shopping_cart</span> Purchase Orders
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2">{stats.totalPos}</div>
          <div className="text-[12px] font-bold text-tertiary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> All Processed
          </div>
        </div>
      </div>

      {/* Total Spend */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-error/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-error">payments</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-error">payments</span> Total Spend
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2 font-mono tracking-tight">${Number(stats.totalSpend).toLocaleString()}</div>
          <div className="text-[12px] font-bold text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> YTD Value
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">System Overview</h2>
          <p className="text-on-surface-variant text-sm">Real-time metrics across all ERP modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-3 py-1.5 rounded-lg text-sm font-bold text-on-surface shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live Data
          </div>
          <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid />
      </Suspense>
    </div>
  );
}
