import { createClient } from "@/lib/supabase/server";
import { TrendingUp, ShoppingCart, Eye, Star } from "lucide-react";

async function getOrderStats() {
  const supabase = createClient();
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return { totalOrders: totalOrders ?? 0, pendingOrders: pendingOrders ?? 0 };
}

async function getRecentActivity() {
  const supabase = createClient();
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at, profile:user_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(4);
  return recentOrders ?? [];
}

export default async function AdminOverviewPage() {
  const [{ totalOrders, pendingOrders }, recentOrders] = await Promise.all([
    getOrderStats(),
    getRecentActivity(),
  ]);

  const stats = [
    {
      icon: TrendingUp,
      label: "Daily Sales",
      value: "$12,480.00",
      change: "+12.4%",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: String(totalOrders),
      change: "+5.2%",
    },
    {
      icon: Eye,
      label: "Website Traffic",
      value: "45.2K",
      change: "+18.9%",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
            Dashboard Overview
          </h2>
          <p className="font-body-lg text-body-lg text-text-muted max-w-lg">
            Welcome back. Here is a detailed summary of Aurélia&apos;s current
            performance across all fragrance collections.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all">
            Download Report
          </button>
          <button className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md hover:opacity-80 transition-all">
            Last 30 Days &darr;
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-neutral p-10 border border-outline-variant hover:bg-white transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-6">
              <stat.icon className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
              <span className="font-label-sm text-label-sm text-accent-gold">
                {stat.change}
              </span>
            </div>
            <p className="font-label-md text-label-md text-text-muted uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <h3 className="font-headline-lg text-headline-lg text-primary">
              {stat.value}
            </h3>
          </div>
        ))}
      </section>

      {/* Chart + Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 border border-outline-variant">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-headline-md text-headline-md text-primary">
              Sales Trends
            </h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 font-label-sm text-label-sm text-text-muted">
                <span className="w-3 h-3 bg-accent-gold" /> Revenue
              </span>
              <span className="flex items-center gap-2 font-label-sm text-label-sm text-text-muted">
                <span className="w-3 h-3 bg-primary" /> Orders
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {[40, 60, 55, 80, 95, 70, 45, 65, 50, 75, 60, 85].map(
              (height, i) => (
                <div
                  key={i}
                  className="w-full bg-surface-neutral hover:bg-accent-gold transition-colors relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(height * 130 + 200).toFixed(0)}
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="flex justify-between mt-6 font-label-sm text-label-sm text-text-muted">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className="bg-white p-10 border border-outline-variant flex flex-col">
          <h4 className="font-headline-md text-headline-md text-primary mb-8">
            Recent Activity
          </h4>
          <div className="space-y-8 flex-1">
            {recentOrders.length === 0 && (
              <p className="font-body-md text-body-md text-text-muted">
                No recent orders.
              </p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex gap-4 items-start pb-6 border-b border-outline-variant/30 last:border-0 last:pb-0"
              >
                <Star className="h-5 w-5 text-accent-gold mt-1 shrink-0" fill="currentColor" />
                <div>
                  <p className="font-label-md text-label-md text-primary">
                    New Order: {(order.profile as { full_name?: string } | null)?.full_name ?? "Guest"}
                  </p>
                  <p className="font-caption text-caption text-text-muted">
                    {new Date(order.created_at).toLocaleDateString()} &bull; $
                    {order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 text-center font-label-md text-label-md text-accent-gold uppercase tracking-widest hover:underline transition-all">
            View All Activity
          </button>
        </div>
      </section>

      {/* Bottom Insights */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 relative h-64 overflow-hidden bg-gradient-to-br from-accent-amber-deep/30 to-[#1B130F]/90">
          <div className="absolute inset-0 bg-primary/20 flex flex-col justify-end p-8 text-white">
            <p className="font-label-sm text-label-sm uppercase tracking-widest mb-1 text-accent-gold">
              Top Performing
            </p>
            <h5 className="font-headline-md text-headline-md">The Noir Series</h5>
          </div>
        </div>
        <div className="bg-surface-neutral p-10 border border-outline-variant flex flex-col justify-center">
          <p className="font-label-md text-label-md text-text-muted uppercase tracking-widest mb-4 text-center">
            Avg. Order Value
          </p>
          <h3 className="font-headline-lg text-headline-lg text-primary text-center">
            $214.50
          </h3>
          <div className="mt-4 flex justify-center items-center gap-1">
            <TrendingUp className="h-4 w-4 text-accent-gold" />
            <span className="font-label-sm text-label-sm text-accent-gold">
              +2.5%
            </span>
          </div>
        </div>
        <div className="bg-primary text-on-primary p-10 border border-outline-variant flex flex-col justify-center">
          <p className="font-label-md text-label-md text-on-primary-container uppercase tracking-widest mb-4 text-center">
            Conversion Rate
          </p>
          <h3 className="font-headline-lg text-headline-lg text-accent-gold text-center">
            4.12%
          </h3>
          <p className="mt-4 text-center font-label-sm text-label-sm opacity-60">
            High Performance
          </p>
        </div>
      </section>
    </div>
  );
}
