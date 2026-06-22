import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client dengan SERVICE ROLE KEY.
 *
 * ⚠️  PENTING — Aturan penggunaan:
 * 1. HANYA boleh diinstansiasi di dalam server-side code:
 *    - API Route Handlers (`/src/app/api/...`)
 *    - Server Actions
 *    - Script admin / seed data
 * 2. JANGAN pernah import file ini di Client Component atau expose ke browser.
 * 3. Client ini otomatis BYPASS semua RLS policy — pastikan validasi dilakukan
 *    secara manual sebelum operasi tulis/hapus.
 *
 * Penggunaan utama (Fase 4):
 * - Webhook Midtrans: update status order setelah konfirmasi pembayaran.
 *
 * Penggunaan contoh:
 * ```ts
 * import { createAdminClient } from "@/lib/supabase/admin";
 * const adminSupabase = createAdminClient();
 * await adminSupabase.from("orders").update({ status: "paid" }).eq("id", orderId);
 * ```
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment variables. " +
        "Pastikan sudah diisi di .env.local.",
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        // Tidak perlu auto-refresh karena client ini tidak untuk sesi user
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
