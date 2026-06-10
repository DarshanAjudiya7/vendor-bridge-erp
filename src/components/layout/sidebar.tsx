"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // The user requested this specific list of links to always show
  const links = [
    { href: "/portal/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/portal/procurement/vendors", label: "Vendors", icon: "storefront" },
    { href: "/portal/procurement/rfqs", label: "RFQs", icon: "request_quote" },
    { href: "/portal/vendor/rfqs", label: "Quotations", icon: "description" },
    { href: "/portal/manager/dashboard", label: "Approvals", icon: "fact_check" },
    { href: "/portal/procurement/purchase-orders", label: "Purchase Orders", icon: "shopping_cart" },
    { href: "/portal/procurement/invoices", label: "Invoices", icon: "receipt_long" },
  ];

  const bottomLinks = [
    { href: "#notifications", label: "Notifications", icon: "notifications" },
    { href: "#reports", label: "Reports", icon: "analytics" },
    { href: "#settings", label: "Settings", icon: "settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container dark:bg-surface-container-low border-r border-outline-variant dark:border-outline flex flex-col p-4 overflow-y-auto z-50 hidden md:flex">
      <div className="mb-8 px-2 flex items-center gap-3 cursor-pointer" onClick={() => router.push('/portal/admin/dashboard')}>
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
        </div>
        <div>
          <h1 className="font-headline-md text-[18px] font-bold text-primary dark:text-primary-fixed leading-tight">VendorBridge</h1>
          <p className="text-[10px] uppercase tracking-widest text-outline">Enterprise ERP</p>
        </div>
      </div>
      
      <button 
        onClick={() => router.push('/portal/procurement/rfqs/create')}
        className="mb-6 w-full py-3 px-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        New Request
      </button>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          let isActive = pathname === link.href;
          if (link.href.includes('/comparison/') && pathname.includes('/comparison/')) {
            isActive = true;
          } else if (link.href === '/portal/procurement/vendors' && pathname.includes('/vendors')) {
            isActive = true;
          } else if (link.href === '/portal/procurement/rfqs' && pathname.includes('/rfqs') && !pathname.includes('/vendor/rfqs')) {
            isActive = true;
          }

          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-body-md transition-colors",
                isActive
                  ? "bg-secondary-container text-secondary dark:bg-secondary dark:text-on-secondary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              )}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span>{link.label}</span>
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
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-outline-variant mt-auto">
        <a 
          href="/api/auth/signout"
          className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg font-body-md"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
