import React from "react";
import Link from "next/link";
import { getVendors } from "@/lib/actions/vendor";
import { VendorRowActions } from "./_components/VendorRowActions";
import { ExportVendorsButton } from "./_components/ExportVendorsButton";

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

      {/* Main Data Table Container */}
      <div className="bg-transparent md:bg-surface md:rounded-2xl md:border md:border-outline-variant md:shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4">
                  <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox"/>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">GST</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
              {vendorsList.map((vendor) => (
                <tr key={vendor.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors group relative p-4 md:p-0">
                  <td className="hidden md:table-cell px-6 py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox"/></td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-lg bg-secondary-fixed flex items-center justify-center font-bold text-secondary text-lg md:text-base shrink-0">
                        {vendor.companyName.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-on-surface text-base md:text-sm">{vendor.companyName}</div>
                        <div className="text-[12px] md:text-[11px] text-outline">ID: VEN-{vendor.id}</div>
                      </div>
                      {/* Mobile Actions Overlay */}
                      <div className="md:hidden">
                        <VendorRowActions vendorId={vendor.id} />
                      </div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none mt-3 md:mt-0 pt-3 md:pt-4">
                    <div className="flex flex-col md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden mb-1">Contact</span>
                      <div className="text-body-md text-sm">{vendor.contactEmail}</div>
                      <div className="text-[12px] md:text-[11px] text-outline mt-0.5">{vendor.contactPhone}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">GST</span>
                      <span className="font-mono-sm text-sm">{vendor.gstNumber}</span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-center">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Status</span>
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 w-fit ${vendor.status === 'APPROVED' ? 'bg-primary/10 text-primary' : vendor.status === 'PENDING' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                        {vendor.status}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 text-on-surface-variant border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Registered</span>
                      <div className="text-body-md font-mono-sm text-sm">{vendor.createdAt?.toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-right">
                    <VendorRowActions vendorId={vendor.id} />
                  </td>
                </tr>
              ))}
              {vendorsList.length === 0 && (
                <tr className="block md:table-row bg-surface rounded-xl border border-outline-variant md:border-none">
                  <td colSpan={7} className="block md:table-cell text-center py-10 md:py-8 text-outline text-sm md:text-base">No vendors found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
