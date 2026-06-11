"use client";

import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "./NotificationCenter";
import { UserAccountDropdown } from "./UserAccountDropdown";

export function TopNavbar({ 
  user,
  setMobileMenuOpen
}: { 
  user?: any;
  setMobileMenuOpen?: (open: boolean) => void;
}) {
  return (
    <header className="h-16 border-b border-outline-variant/50 bg-surface flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile Hamburger Menu */}
        <button 
          className="md:hidden p-2 text-on-surface hover:bg-surface-container-highest rounded-full transition-colors shrink-0"
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Search vendors, RFQs, invoices..."
            className="w-full pl-10 bg-surface-container-low border-outline-variant/50 focus-visible:bg-surface focus-visible:ring-primary/20 transition-all rounded-xl"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Icon (optional, expand on click) */}
        <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors">
          <Search className="h-5 w-5" />
        </button>
        
        <NotificationCenter />
        <div className="w-px h-6 bg-outline-variant/50 mx-1 hidden sm:block"></div>
        <UserAccountDropdown sessionUser={user} />
      </div>
    </header>
  );
}
