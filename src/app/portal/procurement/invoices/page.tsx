import React from "react";
import { getInvoices } from "@/lib/actions/invoice";

export default async function InvoicesPage() {
  const invoicesList = await getInvoices();

  return (
    <div className="w-full text-on-background font-body-md selection:bg-secondary-container">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-lg text-[32px] font-semibold text-on-background">Invoices</h3>
            <p className="text-on-surface-variant font-body-md">Manage vendor invoices and payment tracking.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">PO Reference</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Total Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {invoicesList.map(({ invoice, po, vendor }) => (
                <tr key={invoice.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">receipt_long</span>
                      {invoice.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono">{po.poNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-on-surface">{vendor.companyName}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono-sm font-bold">${Number(invoice.totalAmount).toLocaleString()}</div>
                    <div className="text-[10px] text-outline">Tax: ${Number(invoice.taxAmount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    <div className="text-body-md font-mono-sm">{invoice.generatedAt?.toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
              {invoicesList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-outline">No Invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
