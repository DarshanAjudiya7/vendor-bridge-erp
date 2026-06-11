"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createVendor } from "@/lib/actions/vendor";
import { toast } from "sonner";

export default function CreateVendorPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        } else {
          toast.error(data.error || "Upload failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("attachments", JSON.stringify(attachments));
      await createVendor(formData);
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/portal/procurement/vendors");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create vendor. GST or PAN might be duplicate.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full font-body-md text-on-background selection:bg-secondary-container bg-surface min-h-screen pb-12">
      <div className="max-w-5xl mx-auto p-6">
        <form onSubmit={handleSave}>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <h2 className="font-headline-lg text-[32px] text-on-background font-semibold">Vendor Registration</h2>
              </div>
              <p className="text-on-surface-variant font-body-lg ml-11">Complete the onboarding profile for a new vendor partner.</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-surface-container-highest border border-outline-variant text-on-surface font-label-md text-[13px] font-bold rounded-lg hover:bg-surface-dim transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSaving || uploading}
                className="px-6 py-2.5 bg-primary text-white font-label-md text-[13px] font-bold rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span> Registering...</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">how_to_reg</span> Complete Registration</>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* 1. Company Identity & Classification */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm transition-all duration-200">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">corporate_fare</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Company Identity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-1 font-label-md text-[12px] font-medium text-on-surface-variant">
                    Company Legal Name <span className="text-error">*</span>
                  </label>
                  <input required name="companyName" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="e.g. Acme Corp Int'l" type="text"/>
                </div>
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 font-label-md text-[12px] font-medium text-on-surface-variant">
                    Vendor Category <span className="text-error">*</span>
                  </label>
                  <select required name="category" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest appearance-none">
                    <option value="">Select Category</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Services">Services</option>
                    <option value="Technology">Technology</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Business Type <span className="text-error">*</span></label>
                  <select required name="biz_type" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest appearance-none">
                    <option value="">Select Type</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Company Website</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-[18px]">language</span>
                    </span>
                    <input name="website" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="https://www.example.com" type="url"/>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Tax & Compliance Details */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm transition-all duration-200">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Tax &amp; Compliance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 font-label-md text-[12px] font-medium text-on-surface-variant">
                    GST Number <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    </span>
                    <input required name="gstNumber" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono-sm uppercase text-[14px] bg-surface-container-lowest" placeholder="22AAAAA0000A1Z5" type="text" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Enter a valid 15-character GSTIN"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 font-label-md text-[12px] font-medium text-on-surface-variant">
                    PAN Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </span>
                    <input name="panNumber" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono-sm uppercase text-[14px] bg-surface-container-lowest" placeholder="ABCDE1234F" type="text" pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" title="Enter a valid 10-character PAN"/>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Contact & Address Details */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm transition-all duration-200">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">contacts</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Contact Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Primary Email <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </span>
                    <input required name="contactEmail" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="purchasing@acme.com" type="email"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Primary Phone <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </span>
                    <input required name="contactPhone" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="+1 (555) 000-0000" type="tel"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Alternate Phone</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined text-[18px]">phone_enabled</span>
                    </span>
                    <input name="alternatePhone" className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="+1 (555) 111-1111" type="tel"/>
                  </div>
                </div>
              </div>

              <h4 className="font-label-md text-[14px] font-bold text-on-surface mb-4">Location</h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Address Line <span className="text-error">*</span></label>
                  <input required name="address" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="123 Industrial Way, Building 4" type="text"/>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">City <span className="text-error">*</span></label>
                    <input required name="city" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="City" type="text"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">State/Province <span className="text-error">*</span></label>
                    <input required name="state" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="State" type="text"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Country <span className="text-error">*</span></label>
                    <input required name="country" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="Country" type="text"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Postal Code <span className="text-error">*</span></label>
                    <input required name="postalCode" className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-surface-container-lowest" placeholder="ZIP/Postal" type="text"/>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Documents / Attachments */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm transition-all duration-200">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">folder_open</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Verification Documents</h3>
              </div>
              
              <div className="bg-surface-container-lowest rounded-xl p-8 border-dashed border-2 border-outline-variant flex flex-col items-center justify-center text-center relative hover:bg-surface-container-low hover:border-primary/50 transition-colors">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload Files"
                />
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined text-primary animate-spin mb-3 text-[40px]">autorenew</span>
                    <h4 className="font-title-lg text-[16px] font-semibold text-on-background">Uploading Files...</h4>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-outline mb-3 text-[40px]">cloud_upload</span>
                    <h4 className="font-title-lg text-[16px] font-semibold text-on-background">Upload Compliance Documents</h4>
                    <p className="text-on-surface-variant text-[13px] mb-4 mt-1">Drag and drop your GST, PAN, and Registration certificates here.</p>
                    <button type="button" className="px-5 py-2 border border-primary text-primary font-label-md text-[13px] font-bold rounded-lg pointer-events-none">
                      Browse Files
                    </button>
                    <p className="mt-4 text-[11px] text-outline font-medium tracking-wide">MAX 10MB PER FILE (PDF, JPG, PNG)</p>
                  </>
                )}
              </div>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-label-md text-[13px] font-bold text-on-surface">Attached Documents</h4>
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface border border-outline-variant rounded-lg group hover:border-error/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">description</span>
                        </div>
                        <div>
                          <a href={file.url} target="_blank" rel="noreferrer" className="text-[13px] font-bold hover:underline text-secondary">{file.filename}</a>
                          <div className="text-[11px] text-outline mt-0.5">{Math.round(file.size / 1024)} KB</div>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeAttachment(idx)} className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </form>
      </div>

      <div 
        className={`fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transform transition-all duration-300 z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      >
        <span className="material-symbols-outlined text-primary-fixed-dim">check_circle</span>
        <div>
          <p className="font-bold text-label-md text-[12px]">Vendor Registered</p>
          <p className="text-[12px] opacity-80">Vendor profile has been successfully saved.</p>
        </div>
      </div>
    </div>
  );
}
