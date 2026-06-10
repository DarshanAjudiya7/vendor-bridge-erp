"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createVendor } from "@/lib/actions/vendor";

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
          alert(data.error || "Upload failed");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      // clear input
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
      alert("Failed to create vendor");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full font-body-md text-on-background selection:bg-secondary-container">
      <div className="max-w-5xl mx-auto p-6">
        <form onSubmit={handleSave}>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
            <div>
              <h2 className="font-headline-lg text-[32px] text-on-background mb-1 font-semibold">Create New Vendor</h2>
              <p className="text-on-surface-variant font-body-lg">Onboard a new strategic partner to your procurement network.</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-surface-container-highest border border-outline-variant text-on-surface font-label-md text-[12px] font-bold rounded-lg hover:bg-surface-dim transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSaving || uploading}
                className="px-6 py-2 bg-primary text-on-primary font-label-md text-[12px] font-bold rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>autorenew</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                    Save Vendor
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="space-y-6">
            {/* Section: Company Information */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">business</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Company Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 font-label-md text-[12px] font-medium text-on-surface-variant">
                    Legal Name <span className="text-error">*</span>
                  </label>
                  <input required name="companyName" className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent" placeholder="e.g. Acme Corp Int'l" type="text"/>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 font-label-md text-[12px] font-medium text-on-surface-variant">
                    Registration Number / GST <span className="text-error">*</span>
                  </label>
                  <input required name="gstNumber" className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono-sm text-[12px] bg-transparent" placeholder="REG-123456789" type="text"/>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Business Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="border border-outline-variant rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-container-lowest transition-colors">
                      <input className="text-primary focus:ring-primary" name="biz_type" value="Manufacturer" type="radio"/>
                      <span className="font-body-md">Manufacturer</span>
                    </label>
                    <label className="border border-outline-variant rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-container-lowest transition-colors">
                      <input className="text-primary focus:ring-primary" name="biz_type" value="Distributor" type="radio"/>
                      <span className="font-body-md">Distributor</span>
                    </label>
                    <label className="border border-outline-variant rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-surface-container-lowest transition-colors">
                      <input className="text-primary focus:ring-primary" name="biz_type" value="Service Provider" type="radio"/>
                      <span className="font-body-md">Service Provider</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Contact Information */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">contact_page</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Work Email <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                    </span>
                    <input required name="contactEmail" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent" placeholder="contact@acme.com" type="email"/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Phone Number <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                    </span>
                    <input required name="contactPhone" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent" placeholder="+1 (555) 000-0000" type="tel"/>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block font-label-md text-[12px] font-medium text-on-surface-variant">Company Address <span className="text-error">*</span></label>
                <textarea required name="address" className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-transparent" placeholder="123 Industrial Way, Suite 400, Silicon Valley, CA 94025" rows={3}></textarea>
              </div>
            </section>

            {/* Documents / Attachments */}
            <section className="bg-surface-container-lowest rounded-xl p-8 border-dashed border-2 border-outline-variant flex flex-col items-center justify-center text-center relative">
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload Files"
              />
              {uploading ? (
                <>
                  <span className="material-symbols-outlined text-primary animate-spin mb-3" style={{ fontSize: '48px' }}>autorenew</span>
                  <h4 className="font-title-lg text-[18px] font-semibold text-on-background">Uploading...</h4>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline mb-3" style={{ fontSize: '48px' }}>upload_file</span>
                  <h4 className="font-title-lg text-[18px] font-semibold text-on-background">Upload Compliance Documents</h4>
                  <p className="text-on-surface-variant font-body-md mb-4">Drag and drop your PDF licenses or registration certificates here.</p>
                  <button type="button" className="px-4 py-2 border border-primary text-primary font-label-md text-[12px] font-bold rounded-lg hover:bg-primary-container/10 transition-colors pointer-events-none">
                    Browse Files
                  </button>
                  <p className="mt-4 text-[11px] text-outline italic">Max file size 10MB. Accepted formats: PDF, JPG, PNG.</p>
                </>
              )}
            </section>

            {/* Uploaded Files List */}
            {attachments.length > 0 && (
              <section className="bg-white rounded-xl p-6 border border-outline-variant/30">
                <h4 className="font-title-lg text-[16px] font-semibold mb-4 text-on-background">Uploaded Documents</h4>
                <div className="space-y-3">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <a href={file.url} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline text-secondary">{file.filename}</a>
                        <span className="text-xs text-outline ml-2">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                      <button type="button" onClick={() => removeAttachment(idx)} className="text-error hover:bg-error/10 p-1 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Form Actions Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant">
              <button 
                type="reset"
                className="px-8 py-3 text-on-surface-variant font-label-md text-[12px] font-bold hover:text-on-surface transition-colors"
                onClick={() => setAttachments([])}
              >
                Reset Form
              </button>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3 bg-white border border-outline-variant text-on-surface font-label-md text-[12px] font-bold rounded-xl hover:bg-surface-container transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || uploading}
                  className="px-8 py-3 bg-primary text-on-primary font-label-md text-[12px] font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>autorenew</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                      Save &amp; Create Vendor
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Simple Feedback Toast */}
      <div 
        className={`fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transform transition-all duration-300 z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      >
        <span className="material-symbols-outlined text-primary-fixed-dim">check_circle</span>
        <div>
          <p className="font-bold text-label-md text-[12px]">Vendor Saved</p>
          <p className="text-[12px] opacity-80">Profile has been successfully updated.</p>
        </div>
      </div>
    </div>
  );
}
