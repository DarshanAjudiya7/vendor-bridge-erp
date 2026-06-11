"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { VendorRowActions } from "./VendorRowActions";

interface VendorTableProps {
  initialVendors: any[];
}

export function VendorTable({ initialVendors }: VendorTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derive unique categories from data
  const categories = useMemo(() => {
    const cats = new Set(initialVendors.map(v => v.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [initialVendors]);

  // Filter and Sort
  const filteredVendors = useMemo(() => {
    return initialVendors.filter(vendor => {
      // Global Search
      const matchesSearch = 
        (vendor.companyName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vendor.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vendor.vendorCode?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status Filter
      const matchesStatus = statusFilter === "ALL" || vendor.status === statusFilter;
      
      // Category Filter
      const matchesCategory = categoryFilter === "ALL" || vendor.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [initialVendors, searchQuery, statusFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'ACTIVE':
      case 'APPROVED': return 'bg-primary/10 text-primary border-primary/20';
      case 'PENDING': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'BLACKLISTED':
      case 'REJECTED': return 'bg-error/10 text-error border-error/20';
      case 'INACTIVE':
      case 'SUSPENDED': return 'bg-outline-variant/30 text-on-surface-variant border-outline-variant/50';
      default: return 'bg-surface-container text-on-surface border-outline-variant/50';
    }
  };

  const getStatusIconClass = (status: string) => {
    switch(status) {
      case 'ACTIVE':
      case 'APPROVED': return 'bg-primary animate-pulse';
      case 'PENDING': return 'bg-secondary';
      case 'BLACKLISTED':
      case 'REJECTED': return 'bg-error';
      default: return 'bg-outline';
    }
  };

  // Derived metrics for Bento Cards
  const activeVendors = initialVendors.filter(v => v.status === 'ACTIVE' || v.status === 'APPROVED').length;
  const categoriesCount = categories.map(cat => ({
    name: cat,
    count: initialVendors.filter(v => v.category === cat).length
  })).sort((a, b) => b.count - a.count).slice(0, 3);
  const totalCount = initialVendors.length || 1; // avoid division by zero

  const generateRating = (id: number) => {
    const val = 3 + ((id * 7) % 20) / 10; // Pseudo-random 3.0 to 4.9
    return val.toFixed(1);
  };

  return (
    <>
      {/* Complex Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface border border-outline-variant p-2 rounded-xl shadow-sm mb-6 overflow-x-auto">
        <div className="flex items-center px-3 sm:border-r border-outline-variant gap-2 text-outline shrink-0">
          <span className="material-symbols-outlined text-lg">filter_alt</span>
          <span className="font-label-md uppercase tracking-wider text-[10px] font-bold">Filters</span>
        </div>
        <div className="flex items-center gap-2 flex-1 shrink-0 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <input
            className="px-3 py-1.5 rounded-lg text-body-md border border-outline-variant bg-surface-container-low hover:bg-surface-container-high focus:border-primary outline-none transition-all w-48 sm:w-64"
            placeholder="Search name, ID..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
          <select
            className="px-3 py-1.5 rounded-lg text-body-md border border-outline-variant bg-surface-container-low hover:bg-surface-container-high focus:border-primary transition-all appearance-none outline-none cursor-pointer pr-8 bg-no-repeat"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236e7b6c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Status: Active</option>
            <option value="PENDING">Status: Pending</option>
            <option value="INACTIVE">Status: Inactive</option>
            <option value="SUSPENDED">Status: Suspended</option>
            <option value="BLACKLISTED">Status: Blacklisted</option>
          </select>
          <select
            className="px-3 py-1.5 rounded-lg text-body-md border border-outline-variant bg-surface-container-low hover:bg-surface-container-high focus:border-primary transition-all appearance-none outline-none cursor-pointer pr-8 bg-no-repeat"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236e7b6c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Category: All</option>
            {categories.map(c => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); setCategoryFilter("ALL"); }}
          className="text-primary font-semibold text-body-md px-4 hover:underline shrink-0 whitespace-nowrap"
        >
          Clear All
        </button>
      </div>

      {/* Bento Grid Data Presentation */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Data Table Container */}
        <div className="col-span-12 bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox"/>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider">Last Activity</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedVendors.map((vendor) => {
                  const rating = generateRating(vendor.id);
                  const numStars = Math.round(Number(rating));
                  
                  return (
                    <tr key={vendor.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" type="checkbox"/>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${vendor.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'} flex items-center justify-center font-bold`}>
                            {vendor.companyName.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/portal/procurement/vendors/${vendor.id}`} className="font-bold text-on-surface hover:text-primary hover:underline">
                              {vendor.companyName}
                            </Link>
                            <div className="text-[11px] text-outline font-mono">ID: {vendor.vendorCode || `VEN-${vendor.id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-surface-container-highest rounded text-on-surface-variant text-[12px] font-medium">
                          {vendor.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-sm ${i < numStars ? 'text-[#eab308]' : 'text-outline-variant'} ${i < numStars ? 'fill-icon' : ''}`}>
                              star
                            </span>
                          ))}
                          <span className="ml-1 font-mono-sm text-outline">{rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 border ${getStatusClass(vendor.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusIconClass(vendor.status)}`}></span>
                            {vendor.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        <div className="text-body-md font-mono-sm">{new Date(vendor.updatedAt || vendor.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-outline truncate max-w-[120px]">{vendor.city ? `${vendor.city}, ${vendor.country}` : vendor.contactEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <VendorRowActions vendorId={vendor.id} />
                      </td>
                    </tr>
                  );
                })}
                {paginatedVendors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-outline">
                      <span className="material-symbols-outlined text-[48px] opacity-30 block mb-3">person_off</span>
                      No vendors found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="bg-surface-container-lowest p-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-on-surface-variant text-body-md text-sm">
              Showing <span className="font-bold text-on-surface">{paginatedVendors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredVendors.length)}</span> of {filteredVendors.length} vendors
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface-container transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                {/* Simple pagination logic for demo */}
                <button className="w-10 h-10 bg-primary text-on-primary rounded-lg font-bold">
                  {currentPage}
                </button>
                {currentPage < totalPages && (
                  <button onClick={() => handlePageChange(currentPage + 1)} className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface-container transition-all">
                    {currentPage + 1}
                  </button>
                )}
                {currentPage + 1 < totalPages && (
                  <div className="px-2 text-outline">...</div>
                )}
                {currentPage + 1 < totalPages && (
                  <button onClick={() => handlePageChange(totalPages)} className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface-container transition-all">
                    {totalPages}
                  </button>
                )}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface-container transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Bento Cards: Insights */}
        <div className="col-span-12 lg:col-span-4 grid gap-6">
          <div className="bg-[#00873a] p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[#f7fff2] font-bold text-title-lg mb-1">Onboarding Speed</h4>
              <p className="text-[#f7fff2]/80 text-body-md mb-4 text-sm">Average time to full compliance.</p>
              <div className="flex items-end gap-2">
                <span className="text-white font-headline-lg text-[32px] font-bold leading-none">12.4</span>
                <span className="text-[#f7fff2] font-bold mb-1">Days</span>
                <div className="ml-auto flex items-center gap-1 text-[#7ffc97] bg-white/10 px-2 py-1 rounded-full text-[10px] font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  8% Improvement
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none">speed</span>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-on-surface">Top Categories</h4>
                <button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
              </div>
              <div className="space-y-4">
                {categoriesCount.map((cat, idx) => {
                  const percentage = Math.round((cat.count / totalCount) * 100);
                  const colors = ["bg-primary", "bg-secondary", "bg-[#eab308]"];
                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex justify-between text-[12px]">
                        <span className="text-on-surface-variant font-medium">{cat.name}</span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full ${colors[idx % colors.length]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {categoriesCount.length === 0 && (
                  <div className="text-sm text-outline italic">No categories found</div>
                )}
              </div>
            </div>
            <Link href="/portal/reports" className="mt-6 text-center text-primary font-bold text-body-md py-2 border-t border-outline-variant hover:bg-surface-container-low transition-all block w-full rounded-b-xl">
              View All Metrics
            </Link>
          </div>
        </div>

        {/* Timeline Bottom Bento */}
        <div className="col-span-12 lg:col-span-8 bg-surface rounded-2xl border border-outline-variant shadow-sm p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 min-w-[500px]">
            <h4 className="font-bold text-on-surface">Compliance Timeline</h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] text-outline font-bold uppercase"><span className="w-2 h-2 rounded-full bg-primary"></span> Complete</span>
              <span className="flex items-center gap-1.5 text-[10px] text-outline font-bold uppercase"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Ongoing</span>
            </div>
          </div>
          <div className="flex items-center gap-0 w-full min-w-[500px]">
            <div className="flex-1 flex flex-col items-center gap-3 relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white z-10 shadow-md">
                <span className="material-symbols-outlined text-lg">fact_check</span>
              </div>
              <div className="text-center">
                <div className="text-[12px] font-bold">Verification</div>
                <div className="text-[10px] text-outline">Stage 1</div>
              </div>
              <div className="absolute top-5 left-1/2 w-full h-1 bg-primary"></div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3 relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white z-10 shadow-md">
                <span className="material-symbols-outlined text-lg">description</span>
              </div>
              <div className="text-center">
                <div className="text-[12px] font-bold">Documentation</div>
                <div className="text-[10px] text-outline">Stage 2</div>
              </div>
              <div className="absolute top-5 left-1/2 w-full h-1 bg-secondary-container"></div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3 relative">
              <div className="w-10 h-10 rounded-full bg-secondary text-white z-10 shadow-md animate-pulse ring-4 ring-secondary/20">
                <span className="material-symbols-outlined text-lg">shield_person</span>
              </div>
              <div className="text-center">
                <div className="text-[12px] font-bold">Risk Assessment</div>
                <div className="text-[10px] text-outline">Stage 3</div>
              </div>
              <div className="absolute top-5 left-1/2 w-full h-1 bg-surface-container-highest"></div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3 relative">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-outline z-10 shadow-sm">
                <span className="material-symbols-outlined text-lg">handshake</span>
              </div>
              <div className="text-center">
                <div className="text-[12px] font-bold">Final Approval</div>
                <div className="text-[10px] text-outline">Stage 4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
