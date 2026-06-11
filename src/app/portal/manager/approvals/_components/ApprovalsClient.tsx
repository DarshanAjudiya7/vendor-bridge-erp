"use client";

import React, { useState, useTransition } from "react";
import { approveRequest, rejectRequest } from "@/lib/actions/approval";
import { toast } from "sonner";
import { Check, X, Eye, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Approval {
  id: number;
  referenceType: string;
  referenceId: number;
  status: string | null;
  remarks: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: number | null;
}

export function ApprovalsClient({ initialApprovals }: { initialApprovals: Approval[] }) {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = (id: number) => {
    setLoadingId(id);
    setLoadingAction("approve");
    startTransition(async () => {
      try {
        await approveRequest(id);
        setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED" } : a));
        toast.success("Request approved successfully.");
      } catch (e: any) {
        toast.error(e.message || "Failed to approve request.");
      } finally {
        setLoadingId(null);
        setLoadingAction(null);
      }
    });
  };

  const handleReject = (id: number) => {
    setLoadingId(id);
    setLoadingAction("reject");
    startTransition(async () => {
      try {
        await rejectRequest(id);
        setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
        toast.success("Request rejected.");
      } catch (e: any) {
        toast.error(e.message || "Failed to reject request.");
      } finally {
        setLoadingId(null);
        setLoadingAction(null);
      }
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "APPROVED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-error/10 text-error"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-secondary/10 text-secondary"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const pending = approvals.filter(a => a.status === "PENDING");
  const processed = approvals.filter(a => a.status !== "PENDING");

  return (
    <div className="w-full font-body-md text-on-background">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Approvals</h2>
          <p className="text-on-surface-variant text-sm">Review and act on pending requests from your team.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-3 py-1.5 rounded-lg text-sm font-bold text-on-surface shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            {pending.length} Pending
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <h3 className="font-bold text-[16px] text-on-surface">Pending Requests ({pending.length})</h3>
        </div>
        <div className="divide-y divide-outline-variant/50">
          {pending.length > 0 ? pending.map((req) => (
            <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-surface-container-lowest transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded">{req.referenceType}</span>
                  <span className="font-mono text-[12px] text-outline">ID: {req.referenceId}</span>
                </div>
                <p className="text-sm font-bold text-on-surface">
                  {req.referenceType === "RFQ" ? `RFQ Approval Request` : req.referenceType === "PO" ? `Purchase Order Approval` : `${req.referenceType} Request`} #{req.referenceId}
                </p>
                {req.remarks && <p className="text-[12px] text-on-surface-variant mt-1">{req.remarks}</p>}
                <p className="text-[11px] text-outline mt-1">{req.createdAt ? new Date(req.createdAt).toLocaleString() : "Recently"}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(req.id)}
                  disabled={isPending && loadingId === req.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {loadingId === req.id && loadingAction === "approve" ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  disabled={isPending && loadingId === req.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border border-error/30 text-error hover:bg-error/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {loadingId === req.id && loadingAction === "reject" ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-outline opacity-30 mx-auto mb-3" />
              <p className="text-on-surface-variant font-medium">All caught up! No pending requests.</p>
            </div>
          )}
        </div>
      </div>

      {/* Processed Requests */}
      {processed.length > 0 && (
        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold text-[16px] text-on-surface">Previously Processed ({processed.length})</h3>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {processed.map((req) => (
              <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded">{req.referenceType}</span>
                    <span className="font-mono text-[12px] text-outline">ID: {req.referenceId}</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">
                    {req.referenceType} #{req.referenceId}
                  </p>
                  <p className="text-[11px] text-outline mt-1">{req.updatedAt ? new Date(req.updatedAt).toLocaleString() : ""}</p>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
