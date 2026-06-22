import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*), profile:user_id(full_name)")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    pending: "Pending payment",
    paid: "Paid",
    shipped: "Shipped",
    completed: "Completed",
    failed: "Payment failed",
    expired: "Expired",
    cancelled: "Cancelled",
  };

  const isSuccess =
    order.status === "paid" ||
    order.status === "shipped" ||
    order.status === "completed";

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-2xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <div className="text-center">
          {isSuccess ? (
            <CheckCircle className="mx-auto h-16 w-16 text-accent-gold" />
          ) : (
            <div className="mx-auto h-16 w-16 rounded-full border-2 border-accent-gold flex items-center justify-center">
              <span className="font-headline-md text-headline-md text-accent-gold">
                $
              </span>
            </div>
          )}
          <h1 className="mt-6 font-headline-lg text-headline-lg text-on-background">
            {isSuccess ? "Order confirmed" : "Order received"}
          </h1>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
            {isSuccess
              ? "Thank you for your purchase. You'll receive a confirmation email shortly."
              : `Your order is currently: ${statusLabels[order.status] || order.status}`}
          </p>
        </div>

        <div className="mt-12 bg-surface-container-lowest border border-border p-8">
          <div className="flex justify-between">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-muted">
                Order ID
              </p>
              <p className="mt-1 font-body-md text-body-md text-on-background">
                {order.id}
              </p>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-muted">
                Status
              </p>
              <p className="mt-1 font-body-md text-body-md text-accent-gold">
                {statusLabels[order.status] || order.status}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-muted">
              Items
            </p>
            <ul className="mt-3 space-y-3">
              {(order.order_items ?? []).map(
                (item: { id: string; product_name: string; quantity: number; price_at_purchase: number }) => (
                  <li
                    key={item.id}
                    className="flex justify-between font-body-md text-body-md"
                  >
                    <span className="text-on-surface-variant">
                      {item.product_name} x{item.quantity}
                    </span>
                    <span className="text-on-background">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="mt-6 border-t border-border pt-6 space-y-3">
            <div className="flex justify-between font-body-md text-body-md">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-on-background">
                ${(order.subtotal_amount ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-body-md text-body-md">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="text-on-surface-variant">
                ${(order.shipping_cost ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-body-lg text-body-lg border-t border-border pt-3">
              <span className="text-on-background">Total</span>
              <span className="text-on-background">
                ${(order.total_amount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="default" size="lg" asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
