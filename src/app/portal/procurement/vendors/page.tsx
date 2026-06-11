import React from "react";
import Link from "next/link";
import { getVendors } from "@/lib/actions/vendor";
import { ExportVendorsButton } from "./_components/ExportVendorsButton";
import { VendorTable } from "./_components/VendorTable";

export default async function VendorsPage() {
  const vendorsList = await getVendors();

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header Actions & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-headline-lg text-[24px] sm:text-[32px] font-semibold text-on-background">Vendor Directory</h3>
          <p className="text-on-surface-variant font-body-md text-sm sm:text-base">Manage relationships and monitor performance of {vendorsList.length} registered partners.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <ExportVendorsButton vendors={vendorsList} />
          </div>
          <Link href="/portal/procurement/vendors/create" className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 text-sm sm:text-base whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Vendor
          </Link>
        </div>
      </div>

      <VendorTable initialVendors={vendorsList} />
    </div>
  );
}
