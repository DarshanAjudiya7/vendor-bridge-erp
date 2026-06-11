"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRfqWithDetails } from "@/lib/actions/rfq";
import { getQuotationsForRfq, acceptQuotation } from "@/lib/actions/quotation";
import { getVendors } from "@/lib/actions/vendor";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ComparisonPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const router = useRouter();
  const [rfq, setRfq] = useState<any>(null);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState<number | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    async function loadData() {
      const unwrappedParams = await params;
      const rfqId = Number(unwrappedParams.rfqId);
      const [r, q, v] = await Promise.all([
        getRfqWithDetails(rfqId),
        getQuotationsForRfq(rfqId),
        getVendors()
      ]);
      setRfq(r);
      setQuotations(q);
      setVendors(v);
      setLoading(false);
    }
    loadData();
  }, [params]);

  const lowestPrice = quotations.length > 0 ? Math.min(...quotations.map(q => Number(q.totalAmount))) : null;
  const fastestDelivery = quotations.length > 0 ? Math.min(...quotations.map(q => Number(q.deliveryDays))) : null;

  const handleAccept = (quotationId: number) => {
    setConfirmConfig({
      open: true,
      title: "Award Contract",
      description: "Are you sure you want to award the RFQ to this quotation?",
      onConfirm: async () => {
        setIsAccepting(quotationId);
        try {
          const unwrappedParams = await params;
          await acceptQuotation(quotationId, Number(unwrappedParams.rfqId));
          toast.success("Quotation accepted successfully! RFQ is now Awarded.");
          // Reload data
          const q = await getQuotationsForRfq(Number(unwrappedParams.rfqId));
          setQuotations(q);
        } catch (e) {
          toast.error("Failed to accept quotation");
        } finally {
          setIsAccepting(null);
        }
      }
    });
  };

  if (loading) return <div className="p-8 text-center">Loading comparison data...</div>;
  if (!rfq) return <div className="p-8 text-center">RFQ not found</div>;

  return (
    <div className="w-full text-on-background font-body-md selection:bg-secondary-container">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-headline-lg text-[32px] font-semibold text-on-background">Quotation Comparison</h3>
              <span className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase ${rfq.status === 'AWARDED' ? 'bg-secondary text-on-secondary' : 'bg-primary-container text-on-primary-container'}`}>
                {rfq.status}
              </span>
            </div>
            <p className="text-on-surface-variant font-body-md mt-1">
              Evaluating <span className="font-bold text-on-surface">{quotations.length}</span> bids for <span className="font-mono text-sm">RFQ-{new Date(rfq.createdAt).getFullYear()}-{rfq.id.toString().padStart(3, '0')}</span>: {rfq.title}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 w-64 border-r border-outline-variant/50">
                <div className="text-[11px] font-bold text-outline uppercase tracking-wider mb-1">Evaluation Matrix</div>
                <div className="text-sm font-medium text-on-surface">Criteria / Vendor</div>
              </th>
              {quotations.map(q => {
                const vendor = vendors.find(v => v.id === q.vendorId);
                return (
                  <th key={q.id} className="px-6 py-4 w-72 text-center relative border-r border-outline-variant/50 last:border-0 group">
                    {q.status === 'ACCEPTED' && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
                    )}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-bold text-on-surface mb-3 shadow-inner">
                        {vendor?.companyName.substring(0,2).toUpperCase() || 'V'}
                      </div>
                      <div className="font-bold text-on-surface text-base">{vendor?.companyName || 'Unknown Vendor'}</div>
                      <div className="text-[11px] text-outline font-mono mt-1">ID: QUT-{q.id}</div>
                      {q.status === 'ACCEPTED' && (
                        <div className="mt-2 px-3 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                          Awarded Bid
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              {quotations.length === 0 && <th className="px-6 py-4 text-center">No quotations received yet.</th>}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-outline-variant">
            {/* Total Value Row */}
            <tr className="hover:bg-surface-container-lowest transition-colors">
              <td className="px-6 py-5 bg-surface-container-lowest/50 border-r border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">payments</span>
                  <span className="font-bold text-on-surface text-sm">Total Quote Value</span>
                </div>
              </td>
              {quotations.map(q => (
                <td key={q.id} className={`px-6 py-5 text-center border-r border-outline-variant/50 last:border-0 ${Number(q.totalAmount) === lowestPrice ? "bg-secondary/5" : ""}`}>
                  <div className="font-mono text-xl font-bold text-on-background flex flex-col items-center gap-1">
                    ${Number(q.totalAmount).toLocaleString()}
                    {Number(q.totalAmount) === lowestPrice && (
                      <span className="text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">workspace_premium</span> Lowest Price</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Delivery Time Row */}
            <tr className="hover:bg-surface-container-lowest transition-colors">
              <td className="px-6 py-4 bg-surface-container-lowest/50 border-r border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">local_shipping</span>
                  <span className="font-bold text-on-surface text-sm">Lead / Delivery Time</span>
                </div>
              </td>
              {quotations.map(q => (
                <td key={q.id} className={`px-6 py-4 text-center border-r border-outline-variant/50 last:border-0 ${Number(q.deliveryDays) === fastestDelivery ? "bg-primary/5" : ""}`}>
                  <div className="font-medium text-sm text-on-surface flex flex-col items-center gap-1">
                    {q.deliveryDays} Days
                    {Number(q.deliveryDays) === fastestDelivery && (
                      <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">bolt</span> Fastest</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Payment Terms Row */}
            <tr className="hover:bg-surface-container-lowest transition-colors">
              <td className="px-6 py-4 bg-surface-container-lowest/50 border-r border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">account_balance</span>
                  <span className="font-bold text-on-surface text-sm">Payment Terms</span>
                </div>
              </td>
              {quotations.map(q => (
                <td key={q.id} className="px-6 py-4 text-center border-r border-outline-variant/50 last:border-0">
                  <div className="text-sm text-on-surface-variant">{q.paymentTerms || "Standard"}</div>
                </td>
              ))}
            </tr>

            {/* Documents */}
            <tr className="hover:bg-surface-container-lowest transition-colors">
              <td className="px-6 py-4 bg-surface-container-lowest/50 border-r border-outline-variant/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-sm">attach_file</span>
                  <span className="font-bold text-on-surface text-sm">Attachments</span>
                </div>
              </td>
              {quotations.map(q => (
                <td key={q.id} className="px-6 py-4 border-r border-outline-variant/50 last:border-0">
                  <div className="flex flex-col items-center gap-2">
                    {q.attachments?.length > 0 ? q.attachments.map((doc: any, i: number) => (
                      <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline text-xs">
                        <span className="material-symbols-outlined text-[14px]">description</span> {doc.filename}
                      </a>
                    )) : (
                      <span className="text-outline text-xs">No attachments</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="px-6 py-6 bg-surface-container-lowest/80 border-r border-outline-variant/50">
                <div className="font-bold text-on-surface text-sm">Final Decision</div>
                <div className="text-xs text-outline mt-1">Requires manager approval if &gt;$50k</div>
              </td>
              {quotations.map(q => (
                <td key={q.id} className="px-6 py-6 bg-surface-container-lowest/30 border-r border-outline-variant/50 last:border-0 text-center align-middle">
                  {rfq.status !== 'AWARDED' && rfq.status !== 'AWARD_PENDING_APPROVAL' && q.status !== 'REJECTED' ? (
                    <button 
                      onClick={() => handleAccept(q.id)}
                      disabled={isAccepting === q.id}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] w-full max-w-[200px]"
                    >
                      {isAccepting === q.id ? "Processing..." : "Select Vendor"}
                    </button>
                  ) : q.status === 'ACCEPTED' ? (
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-secondary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Winner</span>
                        <button 
                          onClick={() => {
                            setConfirmConfig({
                              open: true,
                              title: "Generate Purchase Order",
                              description: "Generate Purchase Order for this vendor?",
                              onConfirm: async () => {
                                try {
                                  const { createPurchaseOrder } = await import("@/lib/actions/purchaseOrder");
                                  await createPurchaseOrder(q.id, Number(q.totalAmount), Number(rfq.id));
                                  toast.success("PO Generated!");
                                  router.push("/portal/procurement/purchase-orders");
                                } catch (e) {
                                  toast.error("Failed to generate PO");
                                }
                              }
                            });
                          }}
                          className="px-4 py-2 border border-secondary text-secondary rounded font-bold text-xs hover:bg-secondary/10 transition-colors"
                        >
                          Generate PO
                        </button>
                      </div>
                  ) : rfq.status === 'AWARD_PENDING_APPROVAL' ? (
                    <span className="text-outline font-bold flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">hourglass_empty</span> Pending Approval</span>
                  ) : (
                    <span className="text-error font-bold flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">cancel</span> Rejected</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <ConfirmDialog 
        open={confirmConfig.open}
        onOpenChange={(open) => setConfirmConfig({ ...confirmConfig, open })}
        title={confirmConfig.title}
        description={confirmConfig.description}
        onConfirm={confirmConfig.onConfirm}
        variant={confirmConfig.title === "Award Contract" ? "default" : "default"}
      />
    </div>
  );
}
