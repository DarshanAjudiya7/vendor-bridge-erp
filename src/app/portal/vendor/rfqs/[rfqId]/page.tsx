"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRfqWithDetails } from "@/lib/actions/rfq";
import { submitQuotation } from "@/lib/actions/quotation";
import { getVendorByUserId } from "@/lib/actions/vendor";
import { useSession } from "next-auth/react";

export default function VendorRFQDetailsPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [rfq, setRfq] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [price, setPrice] = useState<number | string>("");
  const [deliveryDays, setDeliveryDays] = useState<number | string>("");
  const [remarks, setRemarks] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!session?.user) return;
      const userId = Number((session.user as any).id);
      const v = await getVendorByUserId(userId);
      setVendor(v);

      const unwrappedParams = await params;
      const data = await getRfqWithDetails(Number(unwrappedParams.rfqId));
      setRfq(data);
      setLoading(false);
    }
    loadData();
  }, [params, session]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setAttachments(prev => [...prev, data]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vendor) {
      alert("Vendor profile not found");
      return;
    }
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const unwrappedParams = await params;
      formData.append("rfqId", unwrappedParams.rfqId);
      formData.append("vendorId", vendor.id.toString());
      
      const totalQuantity = rfq.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1;
      const totalAmount = Number(price) * totalQuantity;
      formData.append("totalAmount", totalAmount.toString());

      formData.append("attachments", JSON.stringify(attachments));

      await submitQuotation(formData);
      
      alert('Quotation submitted successfully!');
      router.push('/portal/vendor/rfqs');
    } catch (error) {
      console.error(error);
      alert('Failed to submit quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading RFQ details...</div>;
  if (!rfq) return <div className="p-8 text-center">RFQ not found</div>;

  const totalQuantity = rfq.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const totalAmount = (Number(price || 0) * totalQuantity).toFixed(2);

  return (
    <div className="w-full text-on-background font-body-md bg-surface min-h-screen pb-12 selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase">
                  {rfq.category || "General"}
                </span>
                <span className="text-outline text-sm font-mono">RFQ-{new Date(rfq.createdAt).getFullYear()}-{rfq.id.toString().padStart(3, '0')}</span>
              </div>
              <h1 className="text-headline-md font-bold text-on-background leading-tight">
                {rfq.title}
              </h1>
              <p className="text-on-surface-variant text-sm mt-1">
                Published by Procurement Dept. • Closing on {new Date(rfq.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm">
              <h2 className="text-title-md font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Requirements Description
              </h2>
              <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed">
                <p>{rfq.description}</p>
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-2xl p-0 border border-outline-variant shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant bg-surface-container-low/30">
                <h2 className="text-title-md font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  Requested Items
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-lowest border-b border-outline-variant">
                    <tr>
                      <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Qty</th>
                      <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {rfq.items?.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-on-surface">{item.productName}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm text-on-surface-variant">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm">
              <h2 className="text-title-md font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">attach_file</span>
                Reference Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rfq.attachments?.length > 0 ? rfq.attachments.map((doc: any, i: number) => (
                  <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface line-clamp-1">{doc.filename}</div>
                      <div className="text-xs text-outline font-mono">{Math.round(doc.size/1024)} KB</div>
                    </div>
                  </a>
                )) : (
                  <p className="text-outline text-sm">No attachments provided.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-4">
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 sticky top-24">
              <h2 className="text-title-md font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">request_quote</span>
                Submit Your Quotation
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Unit Price (Total Avg)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-on-surface font-mono font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Delivery Time (Days)</label>
                  <input 
                    type="number" 
                    name="deliveryDays"
                    required
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="e.g. 15" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Payment Terms</label>
                  <select name="paymentTerms" className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Net 90">Net 90 Days</option>
                    <option value="Advance">Advance Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Additional Remarks</label>
                  <textarea 
                    name="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" 
                    placeholder="Any conditions or notes..." 
                    rows={3}
                  ></textarea>
                </div>

                {/* File Upload for Quotation */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Quotation Document</label>
                  <div className="relative border-2 border-dashed border-outline-variant rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer bg-white">
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploading ? (
                      <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                    ) : (
                      <span className="material-symbols-outlined text-primary text-xl mb-1">upload_file</span>
                    )}
                    <p className="text-xs font-bold text-on-surface-variant">Click to upload quote</p>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-surface p-2 rounded text-xs border border-outline-variant">
                          <span className="truncate max-w-[180px]">{file.filename}</span>
                          <button type="button" onClick={() => removeAttachment(idx)} className="text-error hover:bg-error/10 p-0.5 rounded"><span className="material-symbols-outlined text-sm">close</span></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-primary/10 rounded-xl p-4 mt-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Total Value</span>
                    <span className="text-xs text-outline font-mono">Qty: {totalQuantity}</span>
                  </div>
                  <div className="text-[28px] font-bold text-primary font-mono tracking-tight">
                    ${totalAmount}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="w-full py-4 mt-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">autorenew</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Final Quotation
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-outline px-4 mt-3">
                  This submission is legally binding. Please double-check your rates.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
