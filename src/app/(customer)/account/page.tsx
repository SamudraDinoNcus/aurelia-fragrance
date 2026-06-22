"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/shared/auth-provider";
import { Button } from "@/components/ui/button";
import { User, Package, LogOut } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    supabase
      .from("orders")
      .select("id, status, total_amount, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data);
        setLoading(false);
      });
  }, [user, router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-4xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            My Account
          </h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>

        <div className="mt-10 border border-border bg-surface-container-lowest p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center bg-accent-gold/10">
              <User className="h-6 w-6 text-accent-gold" />
            </div>
            <div>
              <p className="font-headline-md text-headline-md text-on-background">
                {profile?.full_name || "Customer"}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-label-md text-label-md uppercase tracking-widest text-on-background">
            Order History
          </h2>

          {loading ? (
            <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
              Loading...
            </p>
          ) : orders.length === 0 ? (
            <div className="mt-6 border border-border bg-surface-container-lowest p-10 text-center">
              <Package className="mx-auto h-8 w-8 text-on-surface-variant" />
              <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
                No orders yet
              </p>
              <Button variant="default" size="lg" className="mt-6" asChild>
                <Link href="/shop">Start shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="flex items-center justify-between border border-border bg-surface-container-lowest px-6 py-4 transition-colors hover:border-accent-gold/50"
                >
                  <div>
                    <p className="font-body-md text-body-md text-on-background">
                      #{order.id.slice(0, 8)}
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md text-body-md text-on-background">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <span className="font-caption text-caption uppercase tracking-wider text-accent-gold">
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
