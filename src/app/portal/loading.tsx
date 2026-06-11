import React from "react";

export default function PortalLoading() {
  return (
    <div className="w-full min-h-[50vh] p-4 md:p-8 flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="space-y-3 w-full sm:w-1/2">
          <div className="h-8 bg-surface-variant rounded-lg w-3/4 max-w-[300px]"></div>
          <div className="h-4 bg-surface-variant/60 rounded w-full max-w-[400px]"></div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-10 bg-surface-variant rounded-lg w-full sm:w-24"></div>
          <div className="h-10 bg-primary/20 rounded-lg w-full sm:w-32"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 bg-surface-variant rounded w-20"></div>
              <div className="w-10 h-10 rounded-full bg-surface-variant"></div>
            </div>
            <div className="h-8 bg-surface-variant rounded w-24 mb-2"></div>
            <div className="h-3 bg-surface-variant/60 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton (Table/List) */}
      <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="hidden md:flex border-b border-outline-variant p-4 gap-4 bg-surface-container-low">
          <div className="h-4 bg-surface-variant rounded w-12"></div>
          <div className="h-4 bg-surface-variant rounded w-1/4"></div>
          <div className="h-4 bg-surface-variant rounded w-1/5"></div>
          <div className="h-4 bg-surface-variant rounded w-1/5"></div>
          <div className="h-4 bg-surface-variant rounded flex-1"></div>
        </div>
        
        <div className="divide-y divide-outline-variant/50 md:divide-outline-variant">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 md:flex md:items-center gap-4">
              <div className="hidden md:block h-4 bg-surface-variant rounded w-12"></div>
              <div className="flex items-center gap-3 w-full md:w-1/4 mb-3 md:mb-0">
                <div className="w-10 h-10 rounded-lg bg-surface-variant shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface-variant rounded w-3/4"></div>
                  <div className="h-3 bg-surface-variant/60 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-surface-variant rounded w-1/5 mb-3 md:mb-0"></div>
              <div className="h-4 bg-surface-variant rounded w-1/5 mb-3 md:mb-0"></div>
              <div className="h-4 bg-surface-variant rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
