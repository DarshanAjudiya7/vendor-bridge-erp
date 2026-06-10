"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRfq } from "@/lib/actions/rfq";
import { getVendors } from "@/lib/actions/vendor";

export default function CreateRFQPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [assignedVendors, setAssignedVendors] = useState<number[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showVendorSelect, setShowVendorSelect] = useState(false);

  useEffect(() => {
    async function loadVendors() {
      const v = await getVendors();
      setVendorsList(v);
    }
    loadVendors();
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
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleVendor = (vendorId: number) => {
    if (assignedVendors.includes(vendorId)) {
      setAssignedVendors(prev => prev.filter(id => id !== vendorId));
    } else {
      setAssignedVendors(prev => [...prev, vendorId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Combine date and time
      const date = formData.get("datePart") as string;
      const time = formData.get("timePart") as string;
      if (!date || !time) {
        alert("RFQ creation failed: Deadline date and time are required.");
        setIsSubmitting(false);
        return;
      }
      const deadline = new Date(`${date}T${time}`);
      formData.set("deadline", deadline.toISOString());

      // Prepare items (from the single UI inputs)
      const productName = formData.get("productName") as string;
      const quantity = formData.get("quantity") as string;
      if (!productName) {
        alert("RFQ creation failed: Product Name is required.");
        setIsSubmitting(false);
        return;
      }
      
      const items = [{
        productName: productName,
        quantity: quantity,
        unit: "units"
      }];
      formData.append("items", JSON.stringify(items));
      
      formData.append("attachments", JSON.stringify(attachments));
      formData.append("assignedVendors", JSON.stringify(assignedVendors));

      const result = await createRfq(formData);
      
      if (result && result.success) {
        alert('RFQ created successfully!');
        router.push(`/portal/procurement/comparison/${result.data.id}`);
      } else {
        alert(`RFQ creation failed: ${result?.error || 'Unknown error occurred.'}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(`RFQ creation failed: ${error?.message || 'Unexpected client error.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-body-md text-on-background selection:bg-secondary-container bg-surface min-h-screen pb-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="font-title-lg text-[24px] font-bold text-primary">Create New RFQ</h2>
        </div>

        {/* Stepper Indicator */}
        <div className="flex justify-between items-center mb-10 px-4 md:px-12 overflow-x-auto">
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <span className="text-label-md text-[12px] text-primary font-bold">Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-outline-variant mx-4 -mt-6 min-w-[50px]"></div>
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <span className="text-label-md text-[12px] text-on-surface-variant">Vendors</span>
          </div>
          <div className="flex-1 h-0.5 bg-outline-variant mx-4 -mt-6 min-w-[50px]"></div>
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined">send</span>
            </div>
            <span className="text-label-md text-[12px] text-on-surface-variant">Review</span>
          </div>
        </div>

        {/* Bento Layout Content */}
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-6" onSubmit={handleSubmit}>
          
          {/* Left Column: Primary Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section: General Info */}
            <section className="bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">description</span>
                <h3 className="text-title-lg text-[18px] font-semibold">RFQ Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">RFQ Title</label>
                  <input required name="title" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="e.g., Annual Supply of IT Infrastructure Hardware 2024" type="text"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">Category</label>
                    <select required name="category" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none appearance-none">
                      <option value="">Select Category</option>
                      <option value="hardware">Hardware &amp; Electronics</option>
                      <option value="office">Office Supplies</option>
                      <option value="services">Professional Services</option>
                      <option value="raw">Raw Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">Product Name</label>
                    <input required name="productName" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="Item Name" type="text"/>
                  </div>
                  <div>
                    <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">Quantity</label>
                    <input required name="quantity" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md font-mono-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="0" type="number" min="1"/>
                  </div>
                </div>
                <div>
                  <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">Product Details &amp; Specifications</label>
                  <textarea required name="description" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="Describe the items, technical requirements, quality standards, and any other relevant specs..." rows={6}></textarea>
                </div>
              </div>
            </section>

            {/* Section: Vendor Selection */}
            <section className="bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 p-6 rounded-xl border border-outline-variant shadow-sm relative">
              <div className="flex justify-between items-center mb-6 border-b border-surface-container pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">group_add</span>
                  <h3 className="text-title-lg text-[18px] font-semibold">Vendor Selection</h3>
                </div>
                <button 
                  onClick={() => setShowVendorSelect(!showVendorSelect)}
                  className="text-secondary text-[12px] font-bold hover:underline flex items-center gap-1" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">list_alt</span> Select from Directory
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 mb-4 min-h-[30px] items-center">
                  {assignedVendors.length === 0 && (
                    <div className="flex flex-col items-start gap-2 w-full">
                      <span className="text-outline text-sm">No vendors selected. Open to all if left empty.</span>
                      <button 
                        onClick={() => setShowVendorSelect(true)} 
                        className="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-primary/10 transition-colors flex items-center gap-1 mt-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span> Add Specific Vendors
                      </button>
                    </div>
                  )}
                  {assignedVendors.map(vId => {
                    const vendor = vendorsList.find(v => v.id === vId);
                    if (!vendor) return null;
                    return (
                      <span key={vId} className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-label-md text-[12px] flex items-center gap-2">
                        {vendor.companyName} 
                        <button type="button" onClick={() => toggleVendor(vId)} className="hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    )
                  })}
                </div>
                
                {showVendorSelect && (
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 max-h-60 overflow-y-auto">
                    <h4 className="text-sm font-bold mb-3">Available Vendors</h4>
                    <div className="space-y-2">
                      {vendorsList.map(vendor => (
                        <label key={vendor.id} className="flex items-center gap-3 p-2 hover:bg-surface-container rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={assignedVendors.includes(vendor.id)}
                            onChange={() => toggleVendor(vendor.id)}
                            className="rounded border-outline-variant text-primary focus:ring-primary" 
                          />
                          <span className="text-sm font-medium">{vendor.companyName}</span>
                          <span className="text-xs text-outline ml-auto">{vendor.status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Right Column: Metadata & Controls (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Deadlines */}
            <section className="bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <h3 className="text-title-lg text-[18px] font-semibold">Submission Deadlines</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">Closing Date</label>
                  <div className="relative">
                    <input required name="datePart" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="date"/>
                  </div>
                </div>
                <div>
                  <label className="block text-label-md text-[12px] font-medium text-on-surface-variant mb-1.5">Closing Time</label>
                  <div className="relative">
                    <input required name="timePart" className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="time"/>
                  </div>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section className="bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">attach_file</span>
                <h3 className="text-title-lg text-[18px] font-semibold">Attachments</h3>
              </div>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-4 bg-surface-container hover:bg-surface-container-high transition-all text-center cursor-pointer group relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Upload Files"
                  />
                  {uploading ? (
                    <span className="material-symbols-outlined animate-spin text-primary text-2xl mb-1">autorenew</span>
                  ) : (
                    <span className="material-symbols-outlined text-primary text-2xl mb-1 transition-transform group-hover:scale-110">upload_file</span>
                  )}
                  <p className="text-label-md text-[12px] font-medium text-on-surface">{uploading ? "Uploading..." : "Click to upload files"}</p>
                  <p className="text-[10px] text-outline uppercase tracking-tighter mt-1">MAX 25MB (PDF, DOCX, XLSX)</p>
                </div>
                <div className="space-y-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-surface-container-lowest border border-outline-variant rounded group hover:border-error/50 transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="material-symbols-outlined text-primary text-[18px]">picture_as_pdf</span>
                        <a href={file.url} target="_blank" rel="noreferrer" className="text-[12px] truncate font-medium text-on-surface hover:underline">{file.filename}</a>
                      </div>
                      <button type="button" onClick={() => removeAttachment(idx)} className="opacity-0 group-hover:opacity-100 text-error transition-opacity hover:bg-error/10 p-1 rounded"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Action Area */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-title-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isSubmitting || uploading}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>autorenew</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit RFQ <span className="material-symbols-outlined">send</span>
                  </>
                )}
              </button>
              <button className="w-full bg-white border border-outline-variant text-on-surface-variant py-3 rounded-lg font-label-md text-[12px] font-bold hover:bg-surface-container-low transition-all active:scale-[0.98]" type="button">
                Save as Draft
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
