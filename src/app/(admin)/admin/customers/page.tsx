import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";

async function getCustomers() {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*, orders:orders(count)")
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-10">
        <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
          Customers
        </h2>
        <p className="text-text-muted font-body-md mt-2">
          {customers.length} registered customers
        </p>
      </div>

      <div className="bg-white border border-outline-variant">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-neutral">
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider text-center">
                Orders
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <Users className="h-8 w-8 text-text-muted mx-auto mb-4" />
                  <p className="font-body-md text-body-md text-text-muted">
                    No customers yet.
                  </p>
                </td>
              </tr>
            )}
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-surface-bright transition-colors">
                <td className="px-6 py-4">
                  <span className="font-body-md text-body-md text-primary">
                    {customer.full_name ?? "—"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-label-sm text-label-sm ${customer.role === "admin" ? "text-accent-gold" : "text-text-muted"}`}>
                    {customer.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-label-md text-label-md text-primary">
                  {(customer.orders as { count?: number } | null)?.count ?? 0}
                </td>
                <td className="px-6 py-4 font-body-md text-body-md text-text-muted">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
