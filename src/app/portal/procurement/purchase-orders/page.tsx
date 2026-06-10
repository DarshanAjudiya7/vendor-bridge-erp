import React from "react";
import { getPurchaseOrders, createPurchaseOrder } from "@/lib/actions/purchaseOrder";
import { getQuotationsForRfq } from "@/lib/actions/quotation";
import { revalidatePath } from "next/cache";

export default async function PurchaseOrdersPage() {
  const posList = await getPurchaseOrders();

  // Create a server action inside the component if we want to handle inline actions
  // But since we want to trigger PO generation from comparison page, we already have the Generate PO button there.
  // We'll just display POs here.

  return (
    <div className="w-full text-on-background font-body-md selection:bg-secondary-container">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-lg text-[32px] font-semibold text-on-background">Purchase Orders</h3>
            <p className="text-on-surface-variant font-body-md">Manage and track generated Purchase Orders.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">RFQ Reference</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Total Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {posList.map(({ po, vendor, rfq }) => (
                <tr key={po.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">shopping_cart</span>
                      {po.poNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-on-surface">{vendor.companyName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-outline">{rfq.title}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono-sm font-bold">${Number(po.totalAmount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    <div className="text-body-md font-mono-sm">{po.createdAt?.toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
              {posList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-outline">No Purchase Orders generated yet. Award an RFQ to generate one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
