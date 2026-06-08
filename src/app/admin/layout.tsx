"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If login page, don't show sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Products", href: "/admin/products" },
    { label: "Offers", href: "/admin/offers" },
    { label: "Reviews", href: "/admin/reviews" },
  ];

  return (
    <ProtectedAdminRoute>
      <div className="flex-1 bg-zafira-cream flex flex-col md:flex-row">
        {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-zafira-slate text-white flex flex-col hidden md:flex min-h-[calc(100vh-5rem)]">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-serif tracking-widest uppercase">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-4 py-3 rounded-sm transition-colors text-sm tracking-wide uppercase",
                pathname === item.href || (pathname !== "/admin" && item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-zafira-gold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-zafira-slate text-white p-4 overflow-x-auto whitespace-nowrap">
        <nav className="flex space-x-4">
           {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-sm transition-colors text-xs tracking-wide uppercase inline-block",
                pathname === item.href || (pathname !== "/admin" && item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-zafira-gold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedAdminRoute>
  );
}
