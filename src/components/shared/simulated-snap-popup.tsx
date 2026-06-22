"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Building, Smartphone, Wallet, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "credit_card", label: "Credit Card", icon: CreditCard },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building },
  { id: "gopay", label: "GoPay", icon: Wallet },
  { id: "shopeepay", label: "ShopeePay", icon: Smartphone },
];

interface SimulatedSnapPopupProps {
  orderId: string;
  totalAmount: number;
  onPaid: () => void;
  onClose: () => void;
}

export function SimulatedSnapPopup({ orderId, totalAmount, onPaid, onClose }: SimulatedSnapPopupProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [step, setStep] = useState<"select" | "processing" | "success">("select");

  const handlePay = useCallback(() => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      onPaid();
    }, 2000);
  }, [onPaid]);

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-md bg-surface p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-accent-gold">
            <Check className="h-8 w-8 text-accent-gold" />
          </div>
          <h2 className="mt-6 font-headline-md text-headline-md text-on-background">
            Payment Successful
          </h2>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Your order #{orderId.slice(0, 8)} has been confirmed.
          </p>
          <Button
            variant="default"
            size="lg"
            className="mt-8 w-full"
            onClick={() => router.push(`/order/${orderId}`)}
          >
            View Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background">
              Complete Payment
            </h2>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5">
              Order #{orderId.slice(0, 8)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="scale-95 text-on-surface-variant transition-transform duration-200 hover:scale-100 hover:text-on-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-6">
          <p className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4">
            Payment Method
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "flex items-center gap-3 border px-4 py-4 text-left transition-all duration-200",
                    isSelected
                      ? "border-accent-gold bg-accent-gold/5"
                      : "border-border bg-surface-container-lowest hover:border-accent-gold/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isSelected ? "text-accent-gold" : "text-on-surface-variant",
                    )}
                  />
                  <span
                    className={cn(
                      "font-body-md text-body-md",
                      isSelected ? "text-on-background" : "text-on-surface-variant",
                    )}
                  >
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedMethod === "credit_card" && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Card Number
                </label>
                <input
                  placeholder="4111 1111 1111 1111"
                  className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                    Expiry
                  </label>
                  <input
                    placeholder="MM/YY"
                    className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                    CVV
                  </label>
                  <input
                    placeholder="123"
                    type="password"
                    className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "bank_transfer" && (
            <div className="mt-6 space-y-3 rounded-none border border-border bg-surface-container-lowest p-5">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Transfer to:
              </p>
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-background">BCA Virtual Account</span>
                <span className="font-headline-md text-headline-md text-on-background tracking-wider">
                  12345 67890
                </span>
              </div>
            </div>
          )}

          {(selectedMethod === "gopay" || selectedMethod === "shopeepay") && (
            <div className="mt-6 rounded-none border border-border bg-surface-container-lowest p-5 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Scan the QR code with your {selectedMethod === "gopay" ? "GoPay" : "ShopeePay"} app
              </p>
              <div className="mx-auto mt-4 h-48 w-48 border-2 border-dashed border-border flex items-center justify-center">
                <Smartphone className="h-12 w-12 text-on-surface-variant" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border px-8 py-5">
          <div className="flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">Total</span>
            <span className="font-headline-md text-headline-md text-on-background">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <Button
            variant="default"
            size="lg"
            className="mt-4 w-full"
            disabled={step === "processing"}
            onClick={handlePay}
          >
            {step === "processing" ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
