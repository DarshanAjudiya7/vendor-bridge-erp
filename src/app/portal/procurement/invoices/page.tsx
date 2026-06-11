import React from "react";
import { getInvoices } from "@/lib/actions/invoice";

export default async function InvoicesPage() {
  const invoicesList = await getInvoices();

  return (
    <div className="w-full text-on-background font-body-md selection:bg-secondary-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-headline-lg text-[24px] sm:text-[32px] font-semibold text-on-background">Invoices</h3>
          <p className="text-on-surface-variant font-body-md text-sm sm:text-base">Manage vendor invoices and payment tracking.</p>
        </div>
      </div>

      <div className="bg-transparent md:bg-surface md:rounded-2xl md:border md:border-outline-variant md:shadow-sm overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">PO Reference</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Total Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
              {invoicesList.map(({ invoice, po, vendor }) => (
                <tr key={invoice.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors group relative p-4 md:p-0">
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4">
                    <div className="font-bold text-on-surface flex items-center gap-2 text-base md:text-sm">
                      <span className="material-symbols-outlined text-primary">receipt_long</span>
                      {invoice.invoiceNumber}
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none mt-3 md:mt-0 pt-3 md:pt-4">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">PO Reference</span>
                      <div className="text-sm font-mono">{po.poNumber}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Vendor</span>
                      <div className="font-bold text-on-surface text-sm">{vendor.companyName}</div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 md:text-right border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-end">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Total Amount</span>
                      <div className="text-right">
                        <div className="font-mono-sm font-bold text-sm">${Number(invoice.totalAmount).toLocaleString()}</div>
                        <div className="text-[10px] text-outline">Tax: ${Number(invoice.taxAmount).toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 text-on-surface-variant border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Date</span>
                      <div className="text-body-md font-mono-sm text-sm">{invoice.generatedAt?.toLocaleDateString()}</div>
                    </div>
                  </td>
                </tr>
              ))}
              {invoicesList.length === 0 && (
                <tr className="block md:table-row bg-surface rounded-xl border border-outline-variant md:border-none">
                  <td colSpan={5} className="block md:table-cell text-center py-10 md:py-8 text-outline text-sm md:text-base">No Invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
