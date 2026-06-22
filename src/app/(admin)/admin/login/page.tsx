"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    errorParam === "unauthorized" ? "Access denied. Admin credentials required." : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      const userId = signInData.user?.id;
      if (!userId) {
        setError("Failed to verify account.");
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("This account does not have admin access.");
        setIsLoading(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    },
    [email, password, router, supabase],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-8">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-label-md text-label-md uppercase tracking-widest text-accent-gold">
            Admin
          </p>
          <h1 className="mt-2 font-display-hero text-display-hero-mobile text-on-background md:text-[40px]">
            Aurélia
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-none border border-destructive bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <div>
            <label htmlFor="password" className="font-label-md text-label-md text-on-surface-variant">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <Button type="submit" variant="default" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in to admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
