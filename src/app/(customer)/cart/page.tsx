"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface pt-28">
        <div className="flex flex-col items-center text-center px-4">
          <ShoppingBag className="h-16 w-16 text-muted mb-6" />
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            Your cart is empty
          </h1>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant max-w-sm">
            Looks like you haven&apos;t added anything yet. Discover our collection of luxury fragrances.
          </p>
          <Button variant="default" size="lg" className="mt-8" asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-5xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            Cart ({totalItems})
          </h1>
          <button
            onClick={clearCart}
            className="font-label-sm text-label-sm text-muted hover:text-destructive transition-colors uppercase tracking-widest"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex gap-6 border-b border-border pb-6"
              >
                <div className="h-28 w-28 shrink-0 bg-surface-neutral flex items-center justify-center">
                  <span className="font-serif text-3xl text-accent-gold/40">
                    &#x2736;
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-body-lg text-body-lg font-medium text-on-background hover:text-accent-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="font-body-md text-body-md text-muted mt-0.5">
                        {item.tagline}
                      </p>
                    </div>
                    <span className="font-body-lg text-body-lg text-on-background shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 border border-border px-3 py-1">
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="font-label-md text-label-md text-on-background hover:text-accent-gold transition-colors px-1"
                      >
                        &minus;
                      </button>
                      <span className="font-label-md text-label-md w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="font-label-md text-label-md text-on-background hover:text-accent-gold transition-colors px-1"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="flex items-center gap-1 text-muted hover:text-destructive transition-colors font-label-sm text-label-sm uppercase tracking-widest"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest border border-border p-8 h-fit">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-background">
              Order summary
            </h3>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-background">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface-variant">Calculated at checkout</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-body-lg text-body-lg">
                <span className="text-on-background">Total</span>
                <span className="text-on-background">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button variant="default" size="lg" className="mt-8 w-full" asChild>
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <div className="mt-4 text-center">
              <Link
                href="/shop"
                className="font-label-sm text-label-sm text-muted hover:text-on-background transition-colors uppercase tracking-widest"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
