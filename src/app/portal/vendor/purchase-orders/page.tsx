import React from "react";
import { getPurchaseOrders } from "@/lib/actions/purchaseOrder";
import { PoActions } from "./_components/PoActions";

export default async function PurchaseOrdersPage() {
  const posList = await getPurchaseOrders();

  // Create a server action inside the component if we want to handle inline actions
  // But since we want to trigger PO generation from comparison page, we already have the Generate PO button there.
  // We'll just display POs here.

  return (
    <div className="w-full text-on-background font-body-md selection:bg-secondary-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-headline-lg text-[24px] sm:text-[32px] font-semibold text-on-background">Purchase Orders</h3>
          <p className="text-on-surface-variant font-body-md text-sm sm:text-base">Manage and track generated Purchase Orders.</p>
        </div>
      </div>

      <div className="bg-transparent md:bg-surface md:rounded-2xl md:border md:border-outline-variant md:shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">RFQ Reference</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Total Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
              {posList.map(({ po, vendor, rfq }) => (
                <tr key={po.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors group relative p-4 md:p-0">
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4">
                    <div className="font-bold text-on-surface flex items-center gap-2 text-base md:text-sm">
                      <span className="material-symbols-outlined text-primary">shopping_cart</span>
                      {po.poNumber}
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none mt-3 md:mt-0 pt-3 md:pt-4">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Vendor</span>
                      <div className="font-bold text-on-surface text-sm">{vendor.companyName}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">RFQ Reference</span>
                      <div className="text-sm text-outline">{rfq.title}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 md:text-right border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-end">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Total Amount</span>
                      <div className="font-mono-sm font-bold text-sm">${Number(po.totalAmount).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 text-on-surface-variant border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Date</span>
                      <div className="text-body-md font-mono-sm text-sm">{po.createdAt?.toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Status</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        po.status === 'GENERATED' ? 'bg-primary/10 text-primary' : 
                        po.status === 'ACCEPTED' ? 'bg-secondary/10 text-secondary' : 
                        'bg-surface-container-highest text-on-surface'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none text-right">
                    <div className="flex items-center justify-between md:justify-end">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Actions</span>
                      <PoActions poId={po.id} status={po.status ?? "GENERATED"} />
                    </div>
                  </td>
                </tr>
              ))}
              {posList.length === 0 && (
                <tr className="block md:table-row bg-surface rounded-xl border border-outline-variant md:border-none">
                  <td colSpan={7} className="block md:table-cell text-center py-10 md:py-8 text-outline text-sm md:text-base">No Purchase Orders received yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
