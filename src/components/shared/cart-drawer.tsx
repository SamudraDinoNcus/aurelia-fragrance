"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, totalItems, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <span className="font-label-md text-label-md uppercase tracking-widest">
                Cart ({totalItems})
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-background transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingBag className="h-12 w-12 text-muted mb-4" />
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Your cart is empty
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="mt-4 font-label-sm text-label-sm border-b border-primary pb-0.5 uppercase tracking-widest hover:text-accent-gold hover:border-accent-gold transition-colors"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex gap-4 border-b border-border pb-4"
                  >
                    <div className="h-20 w-20 shrink-0 bg-surface-neutral flex items-center justify-center">
                      <span className="font-serif text-xl text-accent-gold/40">
                        &#x2736;
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={onClose}
                            className="font-body-md text-body-md font-medium text-on-background hover:text-accent-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="text-muted hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-caption text-caption text-muted mt-0.5">
                          {item.tagline}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-surface-neutral px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity - 1)
                            }
                            className="text-on-background hover:text-accent-gold transition-colors font-label-md text-label-md px-1"
                          >
                            &minus;
                          </button>
                          <span className="font-label-md text-label-md w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity + 1)
                            }
                            className="text-on-background hover:text-accent-gold transition-colors font-label-md text-label-md px-1"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-body-md text-body-md text-on-background">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border px-6 py-6 space-y-4">
              <div className="flex justify-between font-body-lg text-body-lg">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="font-caption text-caption text-muted">
                Shipping calculated at checkout
              </p>
              <Button variant="default" size="lg" className="w-full" asChild>
                <Link href="/checkout" onClick={onClose}>
                  Checkout
                </Link>
              </Button>
              <div className="text-center">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="font-label-sm text-label-sm text-muted hover:text-on-background transition-colors uppercase tracking-widest"
                >
                  View cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
