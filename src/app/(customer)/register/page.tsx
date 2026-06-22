"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { createUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      const result = await createUser(email, password, fullName);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    },
    [email, password, fullName, router],
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
            Create your account
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="rounded-none border border-destructive bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="font-label-md text-label-md text-on-surface-variant">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              className="mt-1 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <Button type="submit" variant="default" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link href="/login" className="border-b border-on-background text-on-background hover:border-accent-gold hover:text-accent-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
