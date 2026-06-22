"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(true)}
            className="scale-95 text-on-primary transition-transform duration-200 hover:scale-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

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
              {mounted && totalItems > 0 && (
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

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 w-72 bg-[#221a16] shadow-2xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <span className="font-headline-md text-headline-md text-on-primary">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="scale-95 text-on-primary transition-transform duration-200 hover:scale-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-4 pt-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-none px-3 py-3 font-label-md text-label-md transition-colors duration-200",
                    "text-on-primary/70 hover:bg-white/5 hover:text-on-primary",
                    pathname === href && "text-accent-gold",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-white/10 pt-6">
            {user ? (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 font-label-md text-label-md text-on-primary/70 transition-colors duration-200 hover:text-on-primary"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 font-label-md text-label-md uppercase tracking-widest text-on-primary/70 transition-colors duration-200 hover:text-on-primary"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </div>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
