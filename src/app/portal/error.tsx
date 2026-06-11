"use client"; // Error components must be Client Components

import React, { useEffect } from "react";
import Link from "next/link";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Portal Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-error">warning</span>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-on-background mb-4">
        Something went wrong!
      </h2>
      
      <p className="text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
        We encountered an unexpected error while processing your request. Please try again or return to the dashboard.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Try Again
        </button>
        
        <Link 
          href="/portal/admin/dashboard"
          className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
