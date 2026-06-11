"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";

export default function ApprovalsPage() {
  const approvals = [
    { id: 1, type: "Purchase Order", reference: "PO-5092", amount: 42000, requestedBy: "John Doe", status: "PENDING" },
    { id: 2, type: "Vendor Onboarding", reference: "TechCorp Inc.", amount: null, requestedBy: "Jane Smith", status: "PENDING" },
    { id: 3, type: "RFQ Award", reference: "RFQ-1022", amount: 150000, requestedBy: "Alice Johnson", status: "APPROVED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Approvals</h1>
      </div>
      
      <Card className="border-outline-variant shadow-sm rounded-2xl bg-surface">
        <CardHeader>
          <CardTitle className="font-headline-lg text-[24px]">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto custom-scrollbar">
            <Table className="block md:table">
              <TableHeader className="hidden md:table-header-group bg-surface-container-low border-b border-outline-variant">
                <TableRow>
                  <TableHead className="text-[11px] font-bold text-outline uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-[11px] font-bold text-outline uppercase tracking-wider">Reference</TableHead>
                  <TableHead className="text-[11px] font-bold text-outline uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-[11px] font-bold text-outline uppercase tracking-wider">Requested By</TableHead>
                  <TableHead className="text-[11px] font-bold text-outline uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="block md:table-row-group divide-y divide-outline-variant/50 md:divide-outline-variant">
                {approvals.map((req) => (
                  <TableRow key={req.id} className="block md:table-row bg-surface rounded-xl border border-outline-variant/50 shadow-sm mb-4 mx-4 md:mx-0 md:mb-0 md:rounded-none md:border-none md:shadow-none hover:bg-surface-container-lowest transition-colors group relative p-4 md:p-0">
                    <TableCell className="block md:table-cell px-0 py-2 md:px-4 md:py-4 font-bold text-on-surface text-base md:text-sm md:font-medium">
                      <div className="flex items-center justify-between md:block">
                        <span className="text-[10px] uppercase font-bold text-outline md:hidden">Type</span>
                        <span>{req.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="block md:table-cell px-0 py-2 md:px-4 md:py-4 border-t border-outline-variant/30 md:border-none">
                      <div className="flex items-center justify-between md:block">
                        <span className="text-[10px] uppercase font-bold text-outline md:hidden">Reference</span>
                        <span>{req.reference}</span>
                      </div>
                    </TableCell>
                    <TableCell className="block md:table-cell px-0 py-2 md:px-4 md:py-4 border-t border-outline-variant/30 md:border-none">
                      <div className="flex items-center justify-between md:block">
                        <span className="text-[10px] uppercase font-bold text-outline md:hidden">Amount</span>
                        <span className="font-mono-sm font-bold text-sm">{req.amount ? `$${req.amount.toLocaleString()}` : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="block md:table-cell px-0 py-2 md:px-4 md:py-4 border-t border-outline-variant/30 md:border-none">
                      <div className="flex items-center justify-between md:block">
                        <span className="text-[10px] uppercase font-bold text-outline md:hidden">Requested By</span>
                        <span>{req.requestedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="block md:table-cell px-0 py-2 md:px-4 md:py-4 border-t border-outline-variant/30 md:border-none">
                      <div className="flex items-center justify-between md:justify-start">
                        <span className="text-[10px] uppercase font-bold text-outline md:hidden">Status</span>
                        <Badge variant={req.status === "APPROVED" ? "default" : "secondary"}
                          className={req.status === "APPROVED" ? "bg-primary/10 text-primary border-none shadow-none" : "bg-secondary/10 text-secondary border-none shadow-none"}
                        >
                          {req.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="block md:table-cell px-0 py-4 md:py-4 md:px-4 text-right border-t border-outline-variant/30 md:border-none mt-2 md:mt-0">
                      <div className="flex justify-between md:justify-end gap-2 items-center">
                        <span className="text-[10px] uppercase font-bold text-outline md:hidden">Actions</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" title="View Details" className="h-8 md:h-9"><Eye className="w-4 h-4" /></Button>
                          {req.status === "PENDING" && (
                            <>
                              <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/10 h-8 md:h-9" title="Approve">
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-error border-error/30 hover:bg-error/10 h-8 md:h-9" title="Reject">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
