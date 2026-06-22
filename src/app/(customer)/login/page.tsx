"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      const { error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      router.replace(next);
      router.refresh();
    },
    [email, password, next, router, supabase],
  );

  const handleGoogleLogin = useCallback(async () => {
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (oAuthError) setError(oAuthError.message);
  }, [supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-container-margin-mobile md:px-container-margin">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-display-hero text-display-hero-mobile text-on-background md:text-[40px]">
            Aurélia
          </Link>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Sign in to your account
          </p>
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
              placeholder="your@email.com"
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
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <Button type="submit" variant="default" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center font-body-md text-body-md text-on-surface-variant">
              <span className="bg-surface px-3">or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" size="lg" onClick={handleGoogleLogin} className="mt-4 w-full">
            Google
          </Button>
        </div>

        <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="border-b border-on-background text-on-background hover:border-accent-gold hover:text-accent-gold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
