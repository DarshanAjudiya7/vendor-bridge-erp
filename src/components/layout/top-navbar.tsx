"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "./NotificationCenter";
import { UserAccountDropdown } from "./UserAccountDropdown";

export function TopNavbar({ user }: { user?: any }) {
  return (
    <header className="h-16 border-b border-outline-variant/50 bg-surface flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Search vendors, RFQs, invoices..."
            className="w-full pl-10 bg-surface-container-low border-outline-variant/50 focus-visible:bg-surface focus-visible:ring-primary/20 transition-all rounded-xl"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationCenter />
        <div className="w-px h-6 bg-outline-variant/50 mx-1 hidden sm:block"></div>
        <UserAccountDropdown sessionUser={user} />
      </div>
    </header>
  );
}
