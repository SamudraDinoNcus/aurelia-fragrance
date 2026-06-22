"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User } from "lucide-react";
import { useAuth } from "./auth-provider";
import { useCart } from "@/lib/cart-context";
import { CartDrawer } from "./cart-drawer";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/best-sellers", label: "Best sellers" },
  { href: "/gift-sets", label: "Gift sets" },
  { href: "/limited-edition", label: "Limited edition" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          !isHome || scrolled
            ? "bg-[#221a16] py-4 shadow-sm"
            : "bg-transparent py-8",
        )}
      >
        <nav className="mx-auto flex items-center justify-between px-container-margin-mobile md:px-container-margin">
          <Link
            href="/"
            className="font-headline-lg text-headline-lg tracking-tight text-on-primary"
          >
            Aurélia Fragrance
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "font-label-md text-label-md transition-colors duration-300",
                    "text-on-primary/80 hover:text-on-primary",
                    pathname === href && "text-accent-gold",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6 text-on-primary">
            <button type="button" aria-label="Search" className="scale-95 transition-transform duration-200 hover:scale-100">
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Cart"
              onClick={() => setDrawerOpen(true)}
              className="relative scale-95 transition-transform duration-200 hover:scale-100"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-gold text-[10px] font-bold text-primary">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            {user ? (
              <Link href="/account" aria-label="Account" className="scale-95 transition-transform duration-200 hover:scale-100">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className="font-label-md text-label-md uppercase tracking-widest transition-colors text-on-primary/80 hover:text-on-primary"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
