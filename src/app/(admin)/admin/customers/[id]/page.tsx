import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [profileResult, ordersResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", params.id).single(),
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.error || !profileResult.data) {
    notFound();
  }

  const profile = profileResult.data;
  const orders = ordersResult.data ?? [];

  const statusStyles: Record<string, string> = {
    pending: "bg-surface-neutral text-accent-gold border border-accent-gold/30",
    paid: "bg-accent-gold text-primary font-bold",
    shipped: "bg-primary text-white",
    completed: "bg-surface-container-high text-on-surface-variant",
    failed: "bg-error-container text-on-error-container",
  };

  return (
    <div>
      <div className="mb-10">
        <nav className="flex gap-2 text-text-muted font-label-sm mb-4">
          <span>Admin</span>
          <span>/</span>
          <a href="/admin/customers" className="hover:text-primary transition-colors">Customers</a>
          <span>/</span>
          <span className="text-primary">{profile.full_name ?? params.id.slice(0, 8)}</span>
        </nav>
        <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
          {profile.full_name ?? "Unnamed Customer"}
        </h2>
        <p className="text-text-muted font-body-md mt-1">
          Joined {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        <div className="bg-white border border-outline-variant p-8">
          <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
            Profile
          </h3>
          <div className="space-y-3 font-body-md text-body-md">
            <div>
              <span className="text-text-muted">Role</span>
              <p className="text-primary">{profile.role}</p>
            </div>
            {profile.phone && (
              <div>
                <span className="text-text-muted">Phone</span>
                <p className="text-primary">{profile.phone}</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white border border-outline-variant p-8">
          <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
            Orders
          </h3>
          <p className="font-headline-lg text-headline-lg text-primary">
            {orders.length}
          </p>
          <p className="font-body-md text-body-md text-text-muted mt-1">
            Total orders placed
          </p>
        </div>
        <div className="bg-white border border-outline-variant p-8">
          <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-4">
            Total Spent
          </h3>
          <p className="font-headline-lg text-headline-lg text-primary">
            ${orders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0).toFixed(2)}
          </p>
          <p className="font-body-md text-body-md text-text-muted mt-1">
            Lifetime value
          </p>
        </div>
      </div>

      <div className="bg-white border border-outline-variant">
        <div className="px-8 py-6 border-b border-outline-variant">
          <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary">
            Order History
          </h3>
        </div>
        {orders.length === 0 ? (
          <div className="px-8 py-12 text-center font-body-md text-body-md text-text-muted">
            No orders yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-neutral">
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase">Order ID</th>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase">Date</th>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase text-center">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-bright transition-colors">
                  <td className="px-6 py-4 font-label-md text-label-md text-primary">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-accent-gold transition-colors">
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 font-label-sm text-[11px] uppercase tracking-widest ${statusStyles[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-label-md text-label-md text-primary text-right">
                    ${order.total_amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8">
        <Link
          href="/admin/customers"
          className="font-label-sm text-label-sm text-text-muted hover:text-primary transition-colors uppercase tracking-widest"
        >
          &larr; Back to customers
        </Link>
      </div>
    </div>
  );
}
