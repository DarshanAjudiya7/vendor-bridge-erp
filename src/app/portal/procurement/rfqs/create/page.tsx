"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRfq } from "@/lib/actions/rfq";
import { getVendors } from "@/lib/actions/vendor";
import { toast } from "sonner";

export default function CreateRFQWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<"submit" | "draft">("submit");
  const [uploading, setUploading] = useState(false);
  
  // Data State
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [assignedVendors, setAssignedVendors] = useState<number[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([{ productName: "", quantity: "", unit: "units", sku: "" }]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "Medium",
    department: "",
    requestor: "",
    description: "",
    datePart: "",
    timePart: ""
  });

  useEffect(() => {
    async function loadVendors() {
      const v = await getVendors();
      setVendorsList(v);
    }
    loadVendors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productName: "", quantity: "", unit: "units", sku: "" }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const toggleVendor = (vendorId: number) => {
    if (assignedVendors.includes(vendorId)) {
      setAssignedVendors(prev => prev.filter(id => id !== vendorId));
    } else {
      setAssignedVendors(prev => [...prev, vendorId]);
    }
  };

  const removeAttachment = (index: number) => setAttachments(prev => prev.filter((_, i) => i !== index));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setAttachments(prev => [...prev, data]);
        else toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.category || !formData.department || !formData.description) {
        toast.error("Please fill in all required RFQ details.");
        return false;
      }
    }
    if (currentStep === 2) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i].productName || !items[i].quantity) {
          toast.error(`Item #${i + 1} is missing a name or quantity.`);
          return false;
        }
      }
    }
    if (currentStep === 3) {
      if (!formData.datePart || !formData.timePart) {
        toast.error("Deadline Date and Time are required.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep(p => Math.min(p + 1, 5));
  };
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  const handleSubmit = async (action: "submit" | "draft") => {
    if (action === "submit" && !validateStep()) return;
    
    setIsSubmitting(true);
    setActionType(action);
    
    try {
      const payload = new FormData();
      payload.append("action", action);
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("priority", formData.priority);
      payload.append("department", formData.department);
      payload.append("requestor", formData.requestor);
      payload.append("description", formData.description);
      
      if (formData.datePart && formData.timePart) {
        const deadline = new Date(`${formData.datePart}T${formData.timePart}`);
        payload.append("deadline", deadline.toISOString());
      } else {
        // Fallback for drafts
        const d = new Date();
        d.setDate(d.getDate() + 7);
        payload.append("deadline", d.toISOString());
      }
      
      payload.append("items", JSON.stringify(items));
      payload.append("attachments", JSON.stringify(attachments));
      payload.append("assignedVendors", JSON.stringify(assignedVendors));

      const result = await createRfq(payload);
      
      if (result?.success && result.data) {
        toast.success(action === "draft" ? "Draft saved successfully." : "RFQ Published and Sent to Vendors!");
        router.push(`/portal/procurement/rfqs`);
      } else {
        toast.error(`RFQ creation failed: ${result?.error}`);
      }
    } catch (error: any) {
      toast.error(`Failed: ${error?.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: "Details", icon: "edit_note" },
    { num: 2, label: "Items", icon: "inventory_2" },
    { num: 3, label: "Schedule", icon: "schedule" },
    { num: 4, label: "Vendors", icon: "groups" },
    { num: 5, label: "Review", icon: "send" }
  ];

  return (
    <div className="w-full font-body-md text-on-background selection:bg-secondary-container bg-surface min-h-screen pb-12">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8 pt-6 px-4">
          <button 
            onClick={() => router.back()}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="font-title-lg text-[28px] font-bold text-on-background">Create Request for Quotation</h2>
            <p className="text-on-surface-variant text-[14px]">Follow the wizard to generate and publish an RFQ to vendors.</p>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-high -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
            
            {steps.map(step => (
              <div key={step.num} className="flex flex-col items-center gap-2 bg-surface px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${currentStep >= step.num ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'}`}>
                  <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${currentStep >= step.num ? 'text-primary' : 'text-outline'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm min-h-[500px] flex flex-col mx-4 md:mx-0">
          <div className="p-6 md:p-8 flex-1">
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-title-lg text-[20px] font-semibold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">feed</span> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[12px] font-bold text-on-surface-variant">RFQ Title <span className="text-error">*</span></label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g., Q3 Office IT Equipment Supply" type="text"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-on-surface-variant">Category <span className="text-error">*</span></label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none">
                      <option value="">Select Category</option>
                      <option value="Hardware & Electronics">Hardware & Electronics</option>
                      <option value="Software">Software</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Professional Services">Professional Services</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-on-surface-variant">Priority <span className="text-error">*</span></label>
                    <select required name="priority" value={formData.priority} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-on-surface-variant">Department <span className="text-error">*</span></label>
                    <input required name="department" value={formData.department} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. IT Department" type="text"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-on-surface-variant">Requestor Name</label>
                    <input name="requestor" value={formData.requestor} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Your Name or Manager" type="text"/>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[12px] font-bold text-on-surface-variant">General Description <span className="text-error">*</span></label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Provide an overview of the requirements..." rows={4}></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-title-lg text-[20px] font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">inventory_2</span> Requested Items
                  </h3>
                  <button onClick={addItem} type="button" className="text-primary text-[12px] font-bold hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Row
                  </button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest relative group">
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} type="button" className="absolute -right-3 -top-3 w-7 h-7 bg-error text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 space-y-1.5">
                          <label className="text-[11px] font-bold text-outline uppercase tracking-wide">Item Name <span className="text-error">*</span></label>
                          <input required value={item.productName} onChange={(e) => handleItemChange(idx, 'productName', e.target.value)} className="w-full border-b border-outline-variant focus:border-primary outline-none py-1.5 text-sm bg-transparent" placeholder="MacBook Pro 16-inch M3" type="text"/>
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                          <label className="text-[11px] font-bold text-outline uppercase tracking-wide">SKU / Code</label>
                          <input value={item.sku} onChange={(e) => handleItemChange(idx, 'sku', e.target.value)} className="w-full border-b border-outline-variant focus:border-primary outline-none py-1.5 text-sm bg-transparent font-mono-sm" placeholder="OPTIONAL" type="text"/>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-[11px] font-bold text-outline uppercase tracking-wide">Quantity <span className="text-error">*</span></label>
                          <input required value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} min="1" className="w-full border-b border-outline-variant focus:border-primary outline-none py-1.5 text-sm bg-transparent font-mono-sm" placeholder="0" type="number"/>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-[11px] font-bold text-outline uppercase tracking-wide">Unit</label>
                          <select value={item.unit} onChange={(e) => handleItemChange(idx, 'unit', e.target.value)} className="w-full border-b border-outline-variant focus:border-primary outline-none py-1.5 text-sm bg-transparent">
                            <option value="units">Units</option>
                            <option value="pcs">Pcs</option>
                            <option value="kg">Kg</option>
                            <option value="liters">Liters</option>
                            <option value="boxes">Boxes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-title-lg text-[20px] font-semibold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">schedule</span> Schedule & Attachments
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h4 className="font-label-md text-[14px] font-bold border-b border-surface-container pb-2">Submission Deadline <span className="text-error">*</span></h4>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-on-surface-variant">Closing Date</label>
                      <input required name="datePart" value={formData.datePart} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="date"/>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-on-surface-variant">Closing Time (Local)</label>
                      <input required name="timePart" value={formData.timePart} onChange={handleChange} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" type="time"/>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-label-md text-[14px] font-bold border-b border-surface-container pb-2">Technical Documents / BOQ</h4>
                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 bg-surface-container-lowest hover:border-primary transition-colors text-center relative">
                      <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Upload Files" />
                      {uploading ? (
                        <span className="material-symbols-outlined animate-spin text-primary text-[32px] mb-2">autorenew</span>
                      ) : (
                        <span className="material-symbols-outlined text-outline text-[32px] mb-2">upload_file</span>
                      )}
                      <p className="text-[13px] font-bold">{uploading ? "Uploading..." : "Click or Drag Files here"}</p>
                      <p className="text-[11px] text-outline mt-1 uppercase">PDF, Excel, Word (Max 25MB)</p>
                    </div>
                    {attachments.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-surface border border-outline-variant rounded-lg text-sm">
                            <span className="truncate max-w-[200px] font-medium text-secondary">{file.filename}</span>
                            <button type="button" onClick={() => removeAttachment(idx)} className="text-error hover:bg-error/10 p-1 rounded"><span className="material-symbols-outlined text-[16px]">close</span></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-title-lg text-[20px] font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">groups</span> Vendor Assignment
                  </h3>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] font-bold">
                    {assignedVendors.length} Selected
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex-1 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                    <input className="w-full bg-white border-outline-variant border rounded-lg px-4 py-2 text-sm focus:border-primary outline-none" placeholder="Search vendors by name or category..." type="text"/>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[300px] p-2 space-y-1">
                    {vendorsList.map(vendor => (
                      <label key={vendor.id} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border ${assignedVendors.includes(vendor.id) ? 'bg-primary/5 border-primary/30' : 'border-transparent hover:bg-surface-container'}`}>
                        <input 
                          type="checkbox" 
                          checked={assignedVendors.includes(vendor.id)}
                          onChange={() => toggleVendor(vendor.id)}
                          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" 
                        />
                        <div className="flex-1">
                          <div className="font-bold text-sm text-on-surface">{vendor.companyName}</div>
                          <div className="text-[11px] text-outline mt-0.5">{vendor.category || 'Uncategorized'} • {vendor.status}</div>
                        </div>
                      </label>
                    ))}
                    {vendorsList.length === 0 && (
                      <div className="text-center py-8 text-outline text-sm">No vendors available.</div>
                    )}
                  </div>
                </div>
                <p className="text-[12px] text-outline mt-3">If no vendors are selected, the RFQ will be saved as an open invitation (if supported) or draft.</p>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-title-lg text-[20px] font-semibold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">task_alt</span> Review & Submit
                </h3>
                
                <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant space-y-6">
                  
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-outline mb-2 tracking-wider">RFQ Configuration</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container p-4 rounded-lg">
                      <div><span className="text-[11px] text-outline block">Title</span><span className="text-sm font-bold truncate block">{formData.title}</span></div>
                      <div><span className="text-[11px] text-outline block">Category</span><span className="text-sm font-bold">{formData.category}</span></div>
                      <div><span className="text-[11px] text-outline block">Priority</span><span className="text-sm font-bold">{formData.priority}</span></div>
                      <div><span className="text-[11px] text-outline block">Deadline</span><span className="text-sm font-bold">{formData.datePart}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-outline mb-2 tracking-wider">Requested Items ({items.length})</h4>
                    <div className="border border-outline-variant rounded-lg divide-y divide-outline-variant">
                      {items.map((it, i) => (
                        <div key={i} className="p-3 text-sm flex justify-between">
                          <span className="font-medium">{it.productName}</span>
                          <span className="font-mono-sm text-outline">{it.quantity} {it.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-outline mb-2 tracking-wider">Vendors Assigned ({assignedVendors.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {assignedVendors.length === 0 ? <span className="text-sm text-outline italic">None Selected</span> : assignedVendors.map(vid => {
                        const v = vendorsList.find(x => x.id === vid);
                        return v ? <span key={vid} className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[12px] font-bold">{v.companyName}</span> : null;
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
          
          {/* Footer Controls */}
          <div className="border-t border-outline-variant bg-surface-container-lowest p-4 md:p-6 flex items-center justify-between rounded-b-2xl">
            <button 
              type="button" 
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-on-surface border border-outline-variant hover:bg-surface-container'}`}
            >
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-on-surface font-bold text-sm hover:bg-surface-container rounded-lg transition-colors border border-transparent hover:border-outline-variant"
              >
                Save Draft
              </button>
              
              {currentStep < 5 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Next Step <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => handleSubmit("submit")}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 shadow-md transition-opacity flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && actionType === "submit" ? (
                    <><span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span> Sending...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px]">send</span> Send for Approval</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
