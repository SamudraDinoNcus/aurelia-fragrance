import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk Client Components (browser).
 *
 * `createBrowserClient` mengelola sesi via cookie (SSR-compatible) dan
 * localStorage (SPA). Aman dipanggil berulang — secara internal mengembalikan
 * singleton per kombinasi URL+key.
 *
 * Penggunaan:
 * ```tsx
 * "use client";
 * import { createClient } from "@/lib/supabase/client";
 *
 * const supabase = useMemo(() => createClient(), []);
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
