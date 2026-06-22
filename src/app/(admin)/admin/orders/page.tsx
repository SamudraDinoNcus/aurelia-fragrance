import { createClient } from "@/lib/supabase/server";
import { TrendingUp, Clock, DollarSign, Award } from "lucide-react";

async function getOrders() {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, profile:user_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

async function getOrderCounts() {
  const supabase = createClient();
  const { count: total } = await supabase.from("orders").select("*", { count: "exact", head: true });
  const { count: pending } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");
  return { total: total ?? 0, pending: pending ?? 0 };
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

export default async function AdminOrdersPage() {
  const [orders, counts] = await Promise.all([getOrders(), getOrderCounts()]);

  const stats = [
    { icon: DollarSign, label: "Total Orders", value: String(counts.total), change: "+12%", color: "border-l-2 border-accent-gold" },
    { icon: Clock, label: "Pending Fulfillment", value: String(counts.pending), sub: "Avg wait: 4h", color: "border-l-2 border-primary" },
    { icon: TrendingUp, label: "Revenue (MTD)", value: "$84.2k", sub: "High demand season", color: "border-l-2 border-accent-gold" },
    { icon: Award, label: "Delivered", value: "98.2%", sub: "Exceeding luxury standards", color: "bg-primary text-white" },
  ];

  return (
    <div>
      <section className="mb-12">
        <div className="flex justify-between items-end">
          <div>
            <span className="font-label-sm text-label-sm text-accent-gold uppercase tracking-[0.3em]">
              Management
            </span>
            <h2 className="font-display-hero text-headline-lg text-primary mt-2">
              Order Tracking
            </h2>
            <p className="font-body-lg text-body-lg text-text-muted mt-2 max-w-xl">
              Curate and monitor the journey of every Aurélia fragrance from our atelier to the customer.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-surface-neutral p-8 ${stat.color}`}>
            <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-widest">
              {stat.label}
            </p>
            <p className="font-display-hero text-[40px] text-primary mt-2">{stat.value}</p>
            {stat.change && (
              <div className="mt-4 flex items-center gap-2 text-accent-amber-deep font-label-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{stat.change}</span>
              </div>
            )}
            {stat.sub && (
              <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant italic">
                {stat.sub}
              </p>
            )}
          </div>
        ))}
      </section>

      <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-neutral/50">
              <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-widest">
                Order ID
              </th>
              <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-widest">
                Customer
              </th>
              <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-widest text-center">
                Status
              </th>
              <th className="px-6 py-5 font-label-md text-label-md text-primary uppercase tracking-widest text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center font-body-md text-body-md text-text-muted">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-neutral/30 transition-colors">
                <td className="px-6 py-6 font-label-md text-label-md text-primary">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-6">
                  <p className="font-body-md text-body-md text-primary">
                    {(order.profile as { full_name?: string } | null)?.full_name ?? "Guest"}
                  </p>
                  <p className="font-caption text-caption text-text-muted">
                    {(order.profile as { email?: string } | null)?.email ?? ""}
                  </p>
                </td>
                <td className="px-6 py-6 font-body-md text-body-md text-text-muted">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-6 text-center">
                  <span
                    className={`px-4 py-1.5 font-label-sm text-[11px] uppercase tracking-widest ${
                      statusStyles[order.status] ?? ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-6 font-label-md text-label-md text-primary text-right">
                  ${order.total_amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex justify-between items-center px-6">
        <p className="font-caption text-caption text-text-muted">
          Showing 1-{Math.min(orders.length, 10)} of {counts.total} orders
        </p>
      </div>
    </div>
  );
}
