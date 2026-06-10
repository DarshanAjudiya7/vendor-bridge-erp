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
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.type}</TableCell>
                  <TableCell>{req.reference}</TableCell>
                  <TableCell>{req.amount ? `$${req.amount.toLocaleString()}` : "N/A"}</TableCell>
                  <TableCell>{req.requestedBy}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === "APPROVED" ? "default" : "secondary"}
                      className={req.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" title="View Details"><Eye className="w-4 h-4" /></Button>
                      {req.status === "PENDING" && (
                        <>
                          <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" title="Approve">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" title="Reject">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
