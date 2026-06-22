import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware Aurélia Fragrance
 *
 * Fungsi 1 — Session Refresh:
 *   Memperbarui token Supabase di cookie pada setiap request. Ini wajib agar
 *   Server Components & Server Actions selalu melihat sesi yang sudah fresh,
 *   bukan token kedaluwarsa dari cookie lama.
 *
 * Fungsi 2 — Route Guard:
 *   - /admin/* (kecuali /admin/login) → wajib role 'admin'
 *   - /checkout, /account/*           → wajib login (customer)
 *   - /admin/login (sudah admin)      → redirect ke /admin
 */

const ADMIN_ROOT = "/admin";
const ADMIN_LOGIN_PATH = "/admin/login";
const CUSTOMER_LOGIN_PATH = "/login";

/** Path yang butuh autentikasi customer (bukan admin) */
const PROTECTED_CUSTOMER_PATHS = ["/checkout", "/account"];

export async function middleware(request: NextRequest) {
  // --- ENV Guard ---
  // Lewati middleware jika env vars belum diisi (saat development awal,
  // sebelum .env.local dikonfigurasi). Tanpa ini Next.js akan crash.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  // --- Buat response yang bisa dimodifikasi oleh setAll ---
  // Pola ini adalah cara resmi @supabase/ssr memperbarui cookie di middleware.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Langkah 1: perbarui cookie di objek request (agar kode sesudah
          // ini bisa membacanya, mis. saat memanggil getUser() di bawah)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Langkah 2: buat response baru yang membawa cookie ke browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // =============================================================================
  // PENTING: Jangan letakkan logika apapun antara createServerClient dan
  // supabase.auth.getUser(). Melanggar ini bisa menyebabkan user ter-logout
  // secara acak. Gunakan getUser() (bukan getSession()) — getUser() memvalidasi
  // token ke Supabase server, bukan sekadar membaca cookie lokal.
  // =============================================================================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith(ADMIN_ROOT);
  const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH;
  const isProtectedCustomerRoute = PROTECTED_CUSTOMER_PATHS.some((p) =>
    pathname.startsWith(p),
  );

  // ===========================================================================
  // Guard 1: Seluruh area /admin/* (kecuali /admin/login)
  // ===========================================================================
  if (isAdminArea && !isAdminLoginPage) {
    // 1a. Tidak ada sesi sama sekali → ke /admin/login
    if (!user) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    // 1b. Ada sesi, tapi perlu verifikasi role di database.
    //     Query ini ringan: hanya select satu kolom, satu baris, indexed by PK.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      // Bukan admin (atau terjadi error saat cek) → tendang ke /admin/login
      // dengan query param agar halaman login bisa tampilkan pesan "Akses ditolak"
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ===========================================================================
  // Guard 2: Halaman /admin/login — jika sudah login sebagai admin, skip
  // ===========================================================================
  if (isAdminLoginPage && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      // Sudah admin dan aktif → langsung ke dashboard
      return NextResponse.redirect(new URL(ADMIN_ROOT, request.url));
    }
  }

  // ===========================================================================
  // Guard 3: Rute customer yang butuh login (/checkout, /account/*)
  // ===========================================================================
  if (isProtectedCustomerRoute && !user) {
    const loginUrl = new URL(CUSTOMER_LOGIN_PATH, request.url);
    // Simpan path tujuan agar setelah login bisa redirect kembali ke sini
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kembalikan response — mengandung cookie sesi yang sudah di-refresh
  return supabaseResponse;
}

export const config = {
  matcher: [
    /**
     * Jalankan middleware di semua route KECUALI:
     * - _next/static  : file bundle JS/CSS statis
     * - _next/image   : image optimization endpoint
     * - favicon.ico   : browser request otomatis
     * - File gambar   : .svg, .png, .jpg, dll (public assets)
     *
     * Catatan: API routes (/api/*) TIDAK dikecualikan di sini karena
     * session refresh tetap diperlukan di API routes yang membutuhkan auth.
     * Logic guard di atas tidak akan mempengaruhi /api/* karena hanya
     * memeriksa path yang spesifik.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
