import React, { Suspense } from "react";
import { getDashboardStats, getRecentActivities } from "@/lib/actions/dashboard";
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
        </div>
      </div>

      {/* Active RFQs */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-secondary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-secondary">request_quote</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">request_quote</span> Active RFQs
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2">{stats.openRfqs}</div>
          <div className="text-[12px] font-bold text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">info</span> {stats.totalRfqs} total created
          </div>
        </div>
      </div>

      {/* Purchase Orders */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-tertiary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-tertiary">shopping_cart</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shopping_cart</span> Purchase Orders
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2">{stats.totalPos}</div>
        </div>
      </div>

      {/* Total Invoices */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-[#8b5cf6]/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-50 transition-opacity">
          <span className="material-symbols-outlined text-[64px] text-[#8b5cf6]">receipt_long</span>
        </div>
        <div className="relative z-10">
          <div className="text-on-surface-variant text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#8b5cf6]">receipt_long</span> Total Invoices
          </div>
          <div className="text-[32px] font-bold text-on-surface mb-2">{stats.totalInvoices}</div>
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

async function ActivitiesList() {
  const recentActivities = await getRecentActivities(5);
  
  return (
    <div className="col-span-4 bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-500">
      <div className="p-6 border-b border-outline-variant flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-on-surface">Recent Activities</h3>
        <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Live Data</span>
      </div>
      <div className="p-6 space-y-4">
        {recentActivities.length > 0 ? recentActivities.map((activity, i) => (
          <div key={activity.id} className={`flex items-center gap-4 ${i !== recentActivities.length - 1 ? 'border-b border-outline-variant/50 pb-4' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${activity.action.includes('Approved') ? 'bg-tertiary' : activity.action.includes('Created') ? 'bg-primary' : activity.action.includes('Deleted') ? 'bg-error' : 'bg-secondary'}`}></div>
            <div>
              <p className="text-sm font-medium text-on-surface">{activity.action} {activity.details ? `- ${activity.details}` : ''}</p>
              <p className="text-xs text-on-surface-variant">{activity.createdAt ? activity.createdAt.toLocaleString() : 'Just now'}</p>
            </div>
          </div>
        )) : (
          <div className="text-center text-outline text-sm py-4">No recent activities found.</div>
        )}
      </div>
    </div>
  );
}

function ActivitiesSkeleton() {
  return (
    <div className="col-span-4 bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-on-surface">Recent Activities</h3>
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="p-6 space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-2 w-2 rounded-full flex-shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProcurementDashboard() {
  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header (Loads Instantly) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Procurement Dashboard</h2>
          <p className="text-on-surface-variant text-sm">Monitor vendors, RFQs, and purchase orders.</p>
        </div>
      </div>

      {/* Stats Grid (Progressively Loaded) */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities (Progressively Loaded) */}
        <Suspense fallback={<ActivitiesSkeleton />}>
          <ActivitiesList />
        </Suspense>
      </div>
    </div>
  );
}
