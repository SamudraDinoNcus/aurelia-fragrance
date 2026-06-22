import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk Server Components, Route Handlers, dan Server Actions.
 *
 * Menggunakan `cookies()` dari `next/headers` untuk membaca sesi pengguna
 * yang sudah di-refresh oleh middleware. Melempar ke try-catch saat `setAll`
 * dipanggil dari Server Component (yang tidak bisa set cookie) — ini aman
 * karena middleware sudah menangani refresh.
 *
 * Penggunaan di Server Component:
 * ```tsx
 * import { createClient } from "@/lib/supabase/server";
 * const supabase = createClient();
 * const { data } = await supabase.from("products").select("*");
 * ```
 *
 * Penggunaan di Server Action:
 * ```tsx
 * "use server";
 * import { createClient } from "@/lib/supabase/server";
 * const supabase = createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 * ```
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component — aman diabaikan karena
            // middleware sudah menangani refresh token sebelum request ini.
          }
        },
      },
    },
  );
}
