"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { RfqRowActions } from "./RfqRowActions";

const STATUS_OPTIONS = ["ALL", "DRAFT", "PENDING_APPROVAL", "OPEN", "AWARDED", "CLOSED", "CANCELLED"];

export function RfqsClient({ initialRfqs }: { initialRfqs: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return initialRfqs.filter(rfq => {
      const matchSearch =
        rfq.title?.toLowerCase().includes(search.toLowerCase()) ||
        rfq.rfqNumber?.toLowerCase().includes(search.toLowerCase()) ||
        rfq.category?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || rfq.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [initialRfqs, search, statusFilter]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-primary/10 text-primary";
      case "DRAFT": return "bg-surface-variant/20 text-on-surface-variant";
      case "AWARDED": return "bg-secondary/10 text-secondary";
      case "CLOSED":
      case "CANCELLED": return "bg-error/10 text-error";
      case "PENDING_APPROVAL": return "bg-[#f59e0b]/10 text-[#b45309]";
      default: return "bg-surface-container text-on-surface";
    }
  };

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-headline-lg text-[24px] sm:text-[28px] font-bold text-on-background">RFQ Management</h3>
          <p className="text-on-surface-variant text-sm">Create, track, and manage all your Requests for Quotations.</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex-1 sm:flex-none px-4 py-2.5 border rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95 text-sm ${showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-surface border-outline-variant text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            Filter {showFilters && statusFilter !== "ALL" && `(1)`}
          </button>
          <Link
            href="/portal/procurement/rfqs/create"
            className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create RFQ
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-4 items-end shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1 space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Search RFQs</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-outline">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                placeholder="Title, RFQ number, or category..."
              />
            </div>
          </div>
          <div className="flex-1 sm:max-w-[180px] space-y-1.5">
            <label className="text-[12px] font-bold text-on-surface-variant">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "ALL" ? "All Statuses" : s.replace("_", " ")}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
            className="px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:text-error border border-outline-variant rounded-xl hover:border-error/30 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-transparent md:bg-surface md:rounded-2xl md:border md:border-outline-variant md:shadow-sm overflow-hidden flex flex-col mb-6">
        {/* Stats bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 bg-surface-container-low border-b border-outline-variant">
          <span className="text-[12px] font-bold text-outline">{filtered.length} results</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-outline-variant">
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">RFQ ID & Title</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
              {filtered.map((rfq) => (
                <tr key={rfq.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors group relative p-4 md:p-0">
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">request_quote</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-on-surface text-base md:text-sm">{rfq.title}</div>
                        <div className="text-[12px] md:text-[11px] text-outline font-mono">{rfq.rfqNumber || `RFQ-${rfq.id}`}</div>
                      </div>
                      <div className="md:hidden">
                        <RfqRowActions rfqId={rfq.id} />
                      </div>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none mt-3 md:mt-0 pt-3 md:pt-4">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Category</span>
                      <span className="px-2.5 py-1 bg-surface-container-highest rounded text-on-surface-variant text-[12px] font-medium">
                        {rfq.category || "Uncategorized"}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:justify-center">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Status</span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold w-fit ${getStatusClass(rfq.status ?? "")}`}>
                        {rfq.status?.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="block md:table-cell px-0 py-2 md:px-6 md:py-4 text-on-surface-variant border-t border-outline-variant/30 md:border-none">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[10px] uppercase font-bold text-outline md:hidden">Deadline</span>
                      <div className="text-sm font-mono">{rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : "N/A"}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-right">
                    <RfqRowActions rfqId={rfq.id} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="block md:table-row">
                  <td colSpan={5} className="block md:table-cell text-center py-12 text-outline">
                    <span className="material-symbols-outlined text-[48px] opacity-30 block mb-3">search_off</span>
                    {initialRfqs.length === 0 ? "No RFQs yet. Create one to get started." : "No RFQs match your filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
