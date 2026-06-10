"use client";

import React from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportVendorsButtonProps {
  vendors: any[];
}

export function ExportVendorsButton({ vendors }: ExportVendorsButtonProps) {
  const handleExport = () => {
    if (!vendors || vendors.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Create a new PDF document (landscape mode for more columns)
      const doc = new jsPDF("landscape");
      
      // Document Metadata
      doc.setProperties({
        title: "Vendor Directory Export",
        subject: "Vendor List",
        author: "VendorBridge ERP",
        keywords: "vendors, erp, export",
        creator: "VendorBridge ERP System"
      });

      // Colors and styling constants
      const primaryColor = [22, 101, 52]; // Green-800
      const textColor = [51, 65, 85]; // Slate-700
      
      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // --- Header Section ---
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("VendorBridge ERP", 14, 22);
      
      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text("Vendor Directory Report", 14, 30);
      
      // Date & Metadata
      doc.setFontSize(10);
      const dateStr = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      doc.text(`Generated on: ${dateStr}`, 14, 38);
      doc.text(`Total Records: ${vendors.length}`, 14, 44);

      // Horizontal Line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(14, 48, pageWidth - 14, 48);

      // --- Table Section ---
      
      const tableColumn = [
        "Vendor ID", 
        "Company Name", 
        "Email Address", 
        "Phone Number", 
        "Tax ID / GST", 
        "Status", 
        "Registration Date"
      ];
      
      const tableRows = vendors.map(v => [
        `VEN-${v.id}`,
        v.companyName || "-",
        v.contactEmail || "-",
        v.contactPhone || "-",
        v.gstNumber || "-",
        v.status || "UNKNOWN",
        new Date(v.createdAt).toLocaleDateString()
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: 'grid',
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 4,
          textColor: [60, 60, 60],
          lineColor: [226, 232, 240], // slate-200
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [248, 250, 252], // slate-50
          textColor: [15, 23, 42], // slate-900
          fontStyle: 'bold',
          lineWidth: 0.1,
          lineColor: [203, 213, 225], // slate-300
        },
        alternateRowStyles: {
          fillColor: [252, 253, 254] // very subtle slate
        },
        columnStyles: {
          0: { cellWidth: 25 }, // ID
          1: { cellWidth: 45 }, // Company
          2: { cellWidth: 60 }, // Email
          3: { cellWidth: 35 }, // Phone
          4: { cellWidth: 35 }, // Tax ID
          5: { cellWidth: 30 }, // Status
          6: { cellWidth: 30 }, // Date
        },
        didDrawPage: (data) => {
          // Footer
          const str = `Page ${doc.getNumberOfPages()}`;
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            str, 
            pageWidth - 14 - doc.getTextWidth(str), 
            pageHeight - 10
          );
          doc.text(
            "Confidential - Internal Use Only", 
            14, 
            pageHeight - 10
          );
        },
        margin: { top: 55, bottom: 20, left: 14, right: 14 }
      });

      // --- Trigger Download ---
      doc.save(`VendorBridge_Directory_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF generated successfully!");
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF document");
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="px-4 py-2.5 bg-surface border border-outline-variant text-on-surface rounded-lg font-semibold flex items-center gap-2 hover:bg-surface-container transition-all"
    >
      <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
      Export PDF
    </button>
  );
}
