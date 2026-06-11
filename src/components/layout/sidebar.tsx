"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function Sidebar({ 
  role, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: { 
  role?: string;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [pathname, setMobileMenuOpen]);

  const getDashboardRoute = () => {
    switch (role) {
      case "ADMIN": return "/portal/admin/dashboard";
      case "MANAGER": return "/portal/manager/dashboard";
      case "VENDOR": return "/portal/vendor/dashboard";
      default: return "/portal/procurement/dashboard";
    }
  };

  const getRfqsRoute = () => {
    return role === "VENDOR" ? "/portal/vendor/rfqs" : "/portal/procurement/rfqs";
  };

  const allLinks = [
    { href: getDashboardRoute(), label: "Dashboard", icon: "dashboard", roles: ["ADMIN", "MANAGER", "PROCUREMENT_OFFICER", "VENDOR"] },
    { href: "/portal/procurement/vendors", label: "Vendors", icon: "storefront", roles: ["ADMIN", "PROCUREMENT_OFFICER"] },
    { href: getRfqsRoute(), label: "RFQs", icon: "request_quote", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
    { href: "/portal/procurement/quotations", label: "Quotations", icon: "description", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
    { href: "/portal/manager/approvals", label: "Approvals", icon: "fact_check", roles: ["ADMIN", "MANAGER"] },
    { href: "/portal/procurement/purchase-orders", label: "Purchase Orders", icon: "shopping_cart", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
    { href: "/portal/procurement/invoices", label: "Invoices", icon: "receipt_long", roles: ["ADMIN", "PROCUREMENT_OFFICER"] },
  ];

  const links = allLinks
    .filter(l => l.roles.includes(role || "VENDOR"))
    .map((l, i) => ({ ...l, shortcut: (i + 1).toString() }));

  const bottomLinks = [
    { href: "/portal/notifications", label: "Notifications", icon: "notifications", roles: ["ADMIN", "MANAGER", "PROCUREMENT_OFFICER", "VENDOR"] },
    { href: "/portal/reports", label: "Reports", icon: "analytics", roles: ["ADMIN", "MANAGER"] },
    { href: "/portal/settings", label: "Settings", icon: "settings", roles: ["ADMIN"] },
  ].filter(l => l.roles.includes(role || "VENDOR"));

  // Global Keyboard Shortcuts for Sidebar Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt + Number
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= links.length) {
          e.preventDefault();
          router.push(links[num - 1].href);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, role, links]);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-surface-container dark:bg-surface-container-low border-r border-outline-variant dark:border-outline flex flex-col p-4 overflow-y-auto z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-8 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/portal/admin/dashboard')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
            </div>
            <div>
              <h1 className="font-headline-md text-[18px] font-bold text-primary dark:text-primary-fixed leading-tight">VendorBridge</h1>
              <p className="text-[10px] uppercase tracking-widest text-outline">Enterprise ERP</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {role !== "VENDOR" && role !== "MANAGER" && (
          <button 
            onClick={() => router.push('/portal/procurement/rfqs/create')}
            className="mb-6 w-full py-3 px-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Request
          </button>
        )}

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            let isActive = pathname === link.href;
            if (link.href === '/portal/procurement/vendors' && pathname.includes('/vendors')) {
              isActive = true;
            } else if (link.href === '/portal/procurement/rfqs' && pathname.includes('/rfqs') && !pathname.includes('/vendor/rfqs')) {
              isActive = true;
            } else if (link.href === '/portal/procurement/quotations' && pathname.includes('/quotations')) {
              isActive = true;
            } else if (link.href === '/portal/manager/approvals' && pathname.includes('/approvals')) {
              isActive = true;
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg font-body-md transition-all active:scale-[0.98] group",
                  isActive
                    ? "bg-secondary-container text-secondary dark:bg-secondary dark:text-on-secondary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                )}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="flex-1">{link.label}</span>
                {link.shortcut && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded border opacity-0 md:group-hover:opacity-100 transition-opacity font-mono tracking-tighter",
                    isActive ? "border-secondary/30 text-secondary/70 dark:text-on-secondary/70 dark:border-on-secondary/30" : "border-outline-variant text-outline"
                  )}>
                    Alt+{link.shortcut}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="mt-8 mb-2 px-4">
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Analytics & Support</p>
          </div>

          {bottomLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container-highest transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-outline-variant mt-auto">
          <button 
            onClick={() => {
              import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/login' }));
            }}
            className="w-full flex items-center gap-3 px-4 py-3 md:py-2.5 text-on-surface-variant hover:bg-surface-container-highest transition-all active:scale-[0.98] rounded-lg font-body-md"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
