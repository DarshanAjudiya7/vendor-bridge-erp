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
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-[32px] font-semibold text-on-background">Vendor Directory</h3>
            <p className="text-on-surface-variant font-body-md">Manage relationships and monitor performance of {vendorsList.length} registered partners.</p>
          </div>
          <div className="flex gap-3">
            <ExportVendorsButton vendors={vendorsList} />
            <Link href="/portal/procurement/vendors/create" className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Vendor
            </Link>
          </div>
        </div>
      </div>

      {/* Main Data Table Container */}
      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4">
                  <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">GST</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {vendorsList.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center font-bold text-secondary">
                        {vendor.companyName.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{vendor.companyName}</div>
                        <div className="text-[11px] text-outline">ID: VEN-{vendor.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-body-md">{vendor.contactEmail}</div>
                    <div className="text-[11px] text-outline">{vendor.contactPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono-sm">{vendor.gstNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 ${vendor.status === 'APPROVED' ? 'bg-primary/10 text-primary' : vendor.status === 'PENDING' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                        {vendor.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    <div className="text-body-md font-mono-sm">{vendor.createdAt?.toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <VendorRowActions vendorId={vendor.id} />
                  </td>
                </tr>
              ))}
              {vendorsList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-outline">No vendors found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
