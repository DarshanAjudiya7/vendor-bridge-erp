"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";

export function PortalLayoutClient({
  children,
  role,
  user,
}: {
  children: React.ReactNode;
  role?: string;
  user: any;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        role={role} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <div className="flex-1 md:ml-64 flex flex-col w-full min-w-0 transition-all duration-300">
        <TopNavbar 
          user={user} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
