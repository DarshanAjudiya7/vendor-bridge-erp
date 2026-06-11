import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVendorById } from "@/lib/actions/vendor";

export default async function VendorProfilePage({ params }: { params: { id: string } }) {
  const vendorId = parseInt(params.id, 10);
  if (isNaN(vendorId)) return notFound();

  const vendor = await getVendorById(vendorId);
  if (!vendor) return notFound();

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'ACTIVE':
      case 'APPROVED': return 'bg-primary/10 text-primary';
      case 'PENDING': return 'bg-secondary/10 text-secondary';
      case 'BLACKLISTED':
      case 'REJECTED': return 'bg-error/10 text-error';
      case 'INACTIVE':
      case 'SUSPENDED': return 'bg-outline-variant/30 text-on-surface-variant';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  return (
    <div className="w-full font-body-md text-on-background selection:bg-secondary-container bg-surface min-h-screen pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <Link 
            href="/portal/procurement/vendors"
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="font-title-lg text-[24px] font-bold text-on-background">{vendor.companyName}</h2>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 w-fit ${getStatusClass(vendor.status ?? '')}`}>
                {vendor.status}
              </span>
            </div>
            <p className="text-sm text-outline font-mono">ID: {vendor.vendorCode || `VEN-${vendor.id}`} • {vendor.category || "Uncategorized"}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/portal/procurement/vendors/${vendor.id}/edit`}
              className="px-4 py-2 border border-outline-variant bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-surface-container-lowest transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span> Edit
            </Link>
            <a
              href={`mailto:${vendor.contactEmail}`}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span> Contact
            </a>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 Cols wide) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Company Info */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">corporate_fare</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Company Overview</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Company Name</p>
                  <p className="font-medium">{vendor.companyName}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Business Type</p>
                  <p className="font-medium">{vendor.companyType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Website</p>
                  <p className="font-medium">{vendor.website ? <a href={vendor.website} target="_blank" rel="noreferrer" className="text-secondary hover:underline">{vendor.website}</a> : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Registered Since</p>
                  <p className="font-medium">{vendor.createdAt?.toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            {/* Address Info */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Location Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Address Line</p>
                  <p className="font-medium">{vendor.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-outline mb-1">City</p>
                    <p className="font-medium">{vendor.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-outline mb-1">State</p>
                    <p className="font-medium">{vendor.state || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-outline mb-1">Country</p>
                    <p className="font-medium">{vendor.country || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-outline mb-1">Postal Code</p>
                    <p className="font-medium">{vendor.postalCode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tax Info */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Tax & Compliance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">GST Number</p>
                  <p className="font-mono text-sm bg-surface-container-lowest px-3 py-1.5 border border-outline-variant rounded-md w-fit">{vendor.gstNumber}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">PAN Number</p>
                  <p className="font-mono text-sm bg-surface-container-lowest px-3 py-1.5 border border-outline-variant rounded-md w-fit">{vendor.panNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Verification Status</p>
                  <p className={`font-medium w-fit px-2 py-0.5 rounded text-sm ${vendor.verificationStatus === 'VERIFIED' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>{vendor.verificationStatus}</p>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column (1 Col wide) */}
          <div className="space-y-6">
            
            {/* Contact Info */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">contacts</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Contact Info</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Primary Email</p>
                  <p className="font-medium text-secondary truncate" title={vendor.contactEmail}>{vendor.contactEmail}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Primary Phone</p>
                  <p className="font-medium">{vendor.contactPhone}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-outline mb-1">Alternate Phone</p>
                  <p className="font-medium">{vendor.alternatePhone || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-4">
                <span className="material-symbols-outlined text-primary">folder_open</span>
                <h3 className="font-title-lg text-[18px] font-semibold text-on-background">Documents</h3>
              </div>
              {vendor.attachments && Array.isArray(vendor.attachments) && vendor.attachments.length > 0 ? (
                <div className="space-y-3">
                  {vendor.attachments.map((file: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <a href={file.url} target="_blank" rel="noreferrer" className="text-[13px] font-bold hover:underline text-secondary truncate block">{file.filename || `Document ${idx+1}`}</a>
                        {file.size && <div className="text-[11px] text-outline mt-0.5">{Math.round(file.size / 1024)} KB</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-outline text-[32px] mb-2 opacity-50">find_in_page</span>
                  <p className="text-sm text-outline">No documents uploaded.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
