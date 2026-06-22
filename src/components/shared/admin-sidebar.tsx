"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  FileEdit,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

const BOTTOM_ITEMS = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/support", label: "Support", icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col bg-primary w-64 z-50">
      <div className="px-8 py-10">
        <h1 className="font-headline-md text-headline-md text-accent-gold tracking-widest uppercase">
          AURÉLIA
        </h1>
        <p className="font-label-sm text-label-sm text-accent-gold/60 mt-1 uppercase">
          Luxury Admin
        </p>
      </div>

      <nav className="flex-1 flex flex-col mt-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 transition-all duration-300",
              isActive(href)
                ? "text-accent-gold border-r-2 border-accent-gold bg-primary-container"
                : "text-text-muted hover:text-accent-gold hover:bg-primary-container",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-label-md text-label-md">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant/20 py-6">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 text-text-muted hover:text-accent-gold px-6 py-3 transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span className="font-label-md text-label-md">{label}</span>
          </Link>
        ))}
        <div className="px-6 mt-6">
          <Link
            href="/"
            className="block w-full border border-accent-gold text-accent-gold py-3 font-label-sm text-label-sm uppercase tracking-widest text-center hover:bg-accent-gold hover:text-primary transition-all duration-300"
          >
            View Boutique
          </Link>
        </div>
      </div>
    </aside>
  );
}
