"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/components/shared/auth-provider";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/checkout";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks?: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [address, setAddress] = useState({
    recipient_name: "",
    phone: "",
    address_line: "",
    city: "",
    province: "",
    postal_code: "",
  });

  const loadSnapScript = useCallback(() => {
    if (document.getElementById("midtrans-snap")) return;
    const script = document.createElement("script");
    script.id = "midtrans-snap";
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "",
    );
    document.body.appendChild(script);
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!user) {
      router.push(`/login?next=/checkout`);
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await createOrder({
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress: address,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (!result.orderId) {
      setError("Failed to create order");
      setIsLoading(false);
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      router.push(`/order/${result.orderId}`);
      setIsLoading(false);
      return;
    }

    loadSnapScript();

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: result.orderId }),
      });
      const data = await res.json();

      if (data.snapToken && window.snap) {
        clearCart();
        window.snap.pay(data.snapToken, {
          onSuccess: () => router.push(`/order/${result.orderId}`),
          onPending: () => router.push(`/order/${result.orderId}`),
          onError: () => {
            setError("Payment failed. Your order has been saved.");
            router.push(`/order/${result.orderId}`);
          },
          onClose: () => {
            router.push(`/order/${result.orderId}`);
          },
        });
      } else {
        clearCart();
        router.push(`/order/${result.orderId}`);
      }
    } catch {
      clearCart();
      router.push(`/order/${result.orderId}`);
    }

    setIsLoading(false);
  }, [user, items, address, router, loadSnapScript, clearCart]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface pt-28">
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            Your cart is empty
          </h1>
          <Button variant="default" size="lg" className="mt-6" asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-5xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <h1 className="font-headline-lg text-headline-lg text-on-background">
          Checkout
        </h1>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_400px]">
          <div>
            <h2 className="font-label-md text-label-md uppercase tracking-widest text-on-background">
              Shipping address
            </h2>

            {error && (
              <div className="mt-4 rounded-none border border-destructive bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
                {error}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Recipient name
                </label>
                <input
                  required
                  value={address.recipient_name}
                  onChange={(e) =>
                    setAddress({ ...address, recipient_name: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
              <div className="col-span-2">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Phone
                </label>
                <input
                  required
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
              <div className="col-span-2">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Address
                </label>
                <input
                  required
                  value={address.address_line}
                  onChange={(e) =>
                    setAddress({ ...address, address_line: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  City
                </label>
                <input
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Province
                </label>
                <input
                  required
                  value={address.province}
                  onChange={(e) =>
                    setAddress({ ...address, province: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Postal code
                </label>
                <input
                  required
                  value={address.postal_code}
                  onChange={(e) =>
                    setAddress({ ...address, postal_code: e.target.value })
                  }
                  className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-surface-container-lowest border border-border p-8 h-fit sticky top-32">
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-background">
                Order summary
              </h3>
              <ul className="mt-6 space-y-4">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex justify-between font-body-md text-body-md"
                  >
                    <span className="text-on-surface-variant">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-on-background">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-4 space-y-3">
                <div className="flex justify-between font-body-md text-body-md">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="text-on-background">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-body-md text-body-md">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-on-surface-variant">Free</span>
                </div>
                <div className="flex justify-between font-body-lg text-body-lg border-t border-border pt-3">
                  <span className="text-on-background">Total</span>
                  <span className="text-on-background">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                variant="default"
                size="lg"
                className="mt-8 w-full"
                disabled={isLoading}
                onClick={handleCheckout}
              >
                {isLoading
                  ? "Processing..."
                  : `Pay $${subtotal.toFixed(2)}`}
              </Button>
              {!user && (
                <p className="mt-4 text-center font-caption text-caption text-on-surface-variant">
                  You&apos;ll be redirected to sign in first.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
