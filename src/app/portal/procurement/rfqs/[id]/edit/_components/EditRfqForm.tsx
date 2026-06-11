"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateRfq } from "../actions";

const CATEGORIES = ["IT Equipment", "Office Supplies", "Manufacturing Parts", "Services", "Logistics", "Furniture", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export function EditRfqForm({ rfq }: { rfq: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: rfq.title || "",
    category: rfq.category || "",
    priority: rfq.priority || "Medium",
    department: rfq.department || "",
    requestor: rfq.requestor || "",
    description: rfq.description || "",
    deadline: rfq.deadline ? new Date(rfq.deadline).toISOString().split("T")[0] : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      const result = await updateRfq(rfq.id, fd);
      if (result.success) {
        toast.success("RFQ updated successfully!");
        router.push("/portal/procurement/rfqs");
      } else {
        toast.error(result.error || "Failed to update RFQ.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm p-6">
        <h3 className="font-bold text-[16px] mb-6 flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">info</span> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">RFQ Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Enter RFQ title" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Category</label>
            <select name="category" value={formData.category} onChange={handleChange}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary outline-none">
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary outline-none">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Department</label>
            <input name="department" value={formData.department} onChange={handleChange}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary outline-none"
              placeholder="e.g. IT, Finance" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Requestor</label>
            <input name="requestor" value={formData.requestor} onChange={handleChange}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary outline-none"
              placeholder="Full name of requestor" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Deadline *</label>
            <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} required
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary outline-none" />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm bg-surface-container-lowest focus:border-primary outline-none resize-none"
              placeholder="Describe the requirements..." />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-outline-variant rounded-lg text-sm font-bold text-on-surface hover:bg-surface-container transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isPending}
          className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2 active:scale-95">
          {isPending && <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>}
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
