import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TrackingForm } from "./tracking-form";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*), profile:user_id(full_name, phone)")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-surface-neutral text-accent-gold border border-accent-gold/30",
    paid: "bg-accent-gold text-primary font-bold",
    shipped: "bg-primary text-white",
    completed: "bg-surface-container-high text-on-surface-variant",
    failed: "bg-error-container text-on-error-container",
    expired: "bg-surface-neutral text-text-muted",
    cancelled: "bg-surface-neutral text-text-muted",
  };

  const address = order.shipping_address as {
    recipient_name?: string;
    phone?: string;
    address_line?: string;
    city?: string;
    province?: string;
    postal_code?: string;
  } | null;

  return (
    <div>
      <div className="mb-10">
        <nav className="flex gap-2 text-text-muted font-label-sm mb-4">
          <span>Admin</span>
          <span>/</span>
          <a href="/admin/orders" className="hover:text-primary transition-colors">Orders</a>
          <span>/</span>
          <span className="text-primary">#{order.id.slice(0, 8)}</span>
        </nav>
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Order #{order.id.slice(0, 8)}
          </h2>
          <span className={`px-4 py-2 font-label-sm text-[11px] uppercase tracking-widest ${statusStyles[order.status] ?? ""}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <div className="bg-white border border-outline-variant p-8">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
              Customer
            </h3>
            <p className="font-body-md text-body-md text-primary">
              {(order.profile as { full_name?: string } | null)?.full_name ?? "Guest"}
            </p>
            <p className="font-body-md text-body-md text-text-muted mt-1">
              {(order.profile as { phone?: string } | null)?.phone ?? ""}
            </p>
          </div>

          <div className="bg-white border border-outline-variant p-8">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
              Shipping Address
            </h3>
            {address ? (
              <div className="space-y-1 font-body-md text-body-md">
                <p className="text-primary">{address.recipient_name}</p>
                <p className="text-text-muted">{address.phone}</p>
                <p className="text-text-muted">{address.address_line}</p>
                <p className="text-text-muted">
                  {address.city}, {address.province} {address.postal_code}
                </p>
              </div>
            ) : (
              <p className="text-text-muted font-body-md">No address provided</p>
            )}
          </div>

          {order.status !== "shipped" && order.status !== "completed" && (
            <div className="bg-white border border-outline-variant p-8">
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
                Update Tracking
              </h3>
              <TrackingForm orderId={order.id} />
            </div>
          )}

          {order.tracking_number && (
            <div className="bg-white border border-outline-variant p-8">
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
                Tracking Info
              </h3>
              <p className="font-body-md text-body-md text-primary">
                Courier: {order.courier ?? "-"}
              </p>
              <p className="font-body-md text-body-md text-text-muted mt-1">
                Tracking: {order.tracking_number}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-outline-variant p-8">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-6">
              Items
            </h3>
            <ul className="space-y-4">
              {(order.order_items ?? []).map(
                (item: { id: string; product_name: string; quantity: number; price_at_purchase: number }) => (
                  <li
                    key={item.id}
                    className="flex justify-between pb-4 border-b border-outline-variant/30"
                  >
                    <div>
                      <p className="font-body-md text-body-md text-primary">
                        {item.product_name}
                      </p>
                      <p className="font-caption text-caption text-text-muted">
                        x{item.quantity} @ ${item.price_at_purchase.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-body-md text-body-md text-primary">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ),
              )}
            </ul>
            <div className="mt-6 space-y-2 pt-4 border-t border-outline-variant">
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-primary">${order.subtotal_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-text-muted">Shipping</span>
                <span className="text-primary">${order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-lg text-body-lg pt-2 border-t border-outline-variant">
                <span className="text-primary font-bold">Total</span>
                <span className="text-primary font-bold">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.midtrans_order_id && (
            <div className="bg-white border border-outline-variant p-8">
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
                Payment
              </h3>
              <p className="font-body-md text-body-md text-text-muted">
                Midtrans ID: {order.midtrans_order_id}
              </p>
              {order.paid_at && (
                <p className="font-body-md text-body-md text-text-muted mt-1">
                  Paid at: {new Date(order.paid_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/admin/orders"
          className="font-label-sm text-label-sm text-text-muted hover:text-primary transition-colors uppercase tracking-widest"
        >
          &larr; Back to orders
        </Link>
      </div>
    </div>
  );
}
