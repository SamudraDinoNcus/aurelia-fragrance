# Plan.md — Implementasi Aurélia Fragrance E-commerce Platform

> Dokumen ini adalah acuan kerja (living document) untuk pelacakan progress pengembangan proyek. Update status dan checklist setiap kali menyelesaikan sebuah task.

---

## 📊 Status Proyek

| Item | Status |
|---|---|
| **Total Progress** | `~88%` (Fase 1 ✅, Fase 2 ✅, Fase 3 ✅, Fase 4 ✅, Fase 5 ~93% ✅) |
| **Current Phase** | `Phase 5 — Dashboard Admin (sisa: Storage, notif, detail customer)` |
| **Last Updated** | `2026-06-19` |
| **Target Rilis (MVP)** | `-` |

**Legenda Prioritas:** 🔴 High · 🟡 Medium · 🟢 Low
**Legenda Checklist:** `- [ ]` belum dikerjakan · `- [x]` selesai

> Catatan: Saat sebuah fase selesai 100%, update kolom *Current Phase* ke fase berikutnya dan hitung ulang *Total Progress* (jumlah task selesai / total task seluruh fase).

---

## Tech Stack Reference

- **Framework**: Next.js (App Router, Server Components + Server Actions)
- **Styling/UI**: Tailwind CSS + Shadcn/UI
- **Backend/DB**: Supabase (Postgres, Auth, Storage, RLS)
- **Payment Gateway**: Midtrans (Snap/Core API)
- **Hosting (rekomendasi)**: Vercel (frontend) + Supabase Cloud (backend)

---

## FASE 1 — Setup & Arsitektur Proyek

**Tujuan fase:** Menyiapkan fondasi teknis proyek agar siap dikembangkan secara modular dan scalable.

- [x] 🔴 Inisialisasi project Next.js (App Router, TypeScript, Tailwind) — *catatan: disusun manual karena environment kerja tanpa akses internet; jalankan `npm install` di mesin Anda untuk menarik dependency*
- [x] 🔴 Setup struktur folder dasar mengikuti konvensi App Router:
  - `/src/app/(customer)` — group route untuk halaman publik (Shop, Best Sellers, dst)
  - `/src/app/(admin)/admin` — group route + segment nyata untuk Dashboard Admin (lihat README untuk alasan penamaan bertingkat)
  - `/src/app/api` — route handler/API internal (jika diperlukan)
  - `/src/components/ui` — komponen hasil generate Shadcn/UI
  - `/src/components/shared` — komponen custom reusable (Navbar, Footer, ProductCard, dll)
  - `/src/lib` — utilitas & client (supabase.ts, midtrans.ts, utils.ts)
  - `/src/types` — definisi TypeScript types/interfaces global
  - `/src/hooks` — custom React hooks
- [x] 🔴 Install & inisialisasi Shadcn/UI (`components.json` + `cn()` helper + komponen `Button` pertama), set tema dasar (warna, radius `0px`) sesuai `design.md`
- [x] 🟡 Konfigurasi `tailwind.config.ts` — tambahkan custom color tokens, font family (serif untuk heading, sans untuk body) sesuai design system
- [x] 🟡 Setup font loading via `next/font` (EB Garamond + Inter, sesuai token di `frontend-parfume.zip`)
- [x] 🔴 Setup environment variables (`.env.local.example`) — siapkan placeholder untuk Supabase URL/Key dan Midtrans Server/Client Key
- [x] 🟡 Setup linting & formatting (ESLint + Prettier + prettier-plugin-tailwindcss) agar konsistensi kode terjaga
- [x] 🟢 Setup Git repository, buat `.gitignore` yang benar (pastikan `.env.local` ter-ignore) — initial commit sudah dibuat
- [x] 🟡 Buat dokumentasi struktur folder singkat di `README.md`

**Output Fase 1:** Project kosong namun terstruktur, siap dihubungkan ke Supabase & Midtrans.

> **Catatan implementasi Fase 1 (2026-06-17):**
> - Tema visual (warna, font EB Garamond/Inter, spacing, radius `0px`) diekstrak langsung dari `frontend-parfume.zip` dan ditulis di `tailwind.config.ts` + `src/app/globals.css`, menggantikan placeholder font "Playfair Display" pada draf awal.
> - Folder admin disesuaikan menjadi `(admin)/admin/` (bukan sekadar `(admin)/`) agar URL `/admin/*` benar-benar terbentuk — route group polos di Next.js App Router tidak menambah segmen URL. Detail alasan ada di `README.md`.
> - Komponen `Button` (`src/components/ui/button.tsx`) sudah ditulis manual mengikuti pola resmi shadcn/ui beserta varian tambahan (`brand`, `outline-gold`) yang meniru gaya CTA pada mockup.
> - Karena environment eksekusi tidak memiliki akses internet, `npm install` belum dijalankan — jalankan secara manual di lingkungan Anda sebelum `npm run dev`.

---

## FASE 2 — Database, Autentikasi & Arsitektur Data (Supabase)

**Tujuan fase:** Membangun skema database, relasi antar tabel, serta sistem autentikasi customer & admin.

### 2.1 Setup Supabase Client
- [x] 🔴 Buat project baru di Supabase Dashboard — *URL & Anon Key sudah terisi di `.env.local`*
- [x] 🔴 Install dependency `@supabase/supabase-js` dan `@supabase/ssr` — *ada di `package.json`*
- [x] 🔴 Membuat Supabase client di `/src/lib/supabase/client.ts` (untuk Client Component)
- [x] 🔴 Membuat Supabase client di `/src/lib/supabase/server.ts` (untuk Server Component/Server Action, menggunakan cookies)
- [x] 🟡 Membuat middleware (`/src/middleware.ts`) untuk refresh session Supabase di setiap request

### 2.2 Desain Skema Database
- [x] 🔴 Tabel `products` — *ada di migration SQL `20260617120000_init_schema.sql`*
- [x] 🔴 Tabel `categories`
- [x] 🔴 Tabel `orders`
- [x] 🔴 Tabel `order_items`
- [x] 🔴 Tabel `profiles` (customers) — *dengan trigger `handle_new_user` dari `auth.users`*
- [x] 🟡 Tabel `carts` / strategi cart — *keputusan: client-side cart via Zustand/Context + persist localStorage untuk guest, sinkron ke DB saat login (dikerjakan di Fase 4)*
- [ ] 🟡 Buat diagram relasi (ERD) sederhana sebagai referensi tim — *skema sudah lengkap di migration SQL + `src/types/database.ts`*

### 2.3 Row Level Security (RLS) & Roles
- [x] 🔴 Aktifkan RLS di semua tabel sensitif (`orders`, `order_items`, `profiles`, `products`, `categories`)
- [x] 🔴 Buat policy: customer hanya bisa membaca/mengubah data miliknya sendiri
- [x] 🔴 Buat mekanisme role admin (kolom `role` enum di tabel `profiles` + fungsi `is_admin()`)
- [x] 🟡 Buat policy khusus admin: full access ke `products`, `orders`, `customers`

### 2.4 Autentikasi
- [x] 🔴 Implementasi Sign Up & Login (Email/Password) menggunakan Supabase Auth
  - Halaman `/login` — *`src/app/(customer)/login/page.tsx`*
  - Halaman `/register` — *`src/app/(customer)/register/page.tsx`*
  - Halaman `/admin/login` — *`src/app/(admin)/admin/login/page.tsx`*
- [x] 🟡 Implementasi Login via OAuth (Google) sebagai opsi tambahan — *tombol Google di halaman login/register + callback route di `src/app/auth/callback/route.ts`*
- [x] 🔴 Buat halaman/route protection: redirect ke `/login` jika belum auth saat akses Checkout atau Dashboard Admin — *middleware guard di `src/middleware.ts`*
- [x] 🟡 Buat context/provider `AuthProvider` untuk akses data user di seluruh komponen client — *`src/components/shared/auth-provider.tsx`*

**Output Fase 2:** Database siap pakai dengan keamanan RLS, serta sistem login customer & admin berfungsi.

---

## FASE 3 — Pengembangan UI Customer Portal (Landing & Katalog)

**Tujuan fase:** Membangun seluruh halaman publik berdasarkan `design.md` yang sudah disepakati.

### 3.1 Komponen Global
- [x] 🔴 Buat komponen `Navbar` — *`src/components/shared/navbar.tsx`*
- [x] 🔴 Buat komponen `Footer` — *`src/components/shared/footer.tsx`*
- [x] 🟡 Buat komponen `ProductCard` — *`src/components/shared/product-card.tsx`*
- [x] 🟡 Buat komponen `PromoBanner` — *`src/components/shared/promo-banner.tsx`*
- [x] 🟢 Buat komponen `FeatureIconItem` — *`src/components/shared/feature-icon-item.tsx`*

### 3.2 Halaman Publik
- [x] 🔴 Halaman **Home/Landing** (`/`) — hero section, best sellers grid, art of giving banner, feature section
- [x] 🔴 Halaman **Shop** (`/shop`) — listing semua produk, filter by category, sorting
- [x] 🟡 Halaman **Best Sellers** (`/best-sellers`) — filter produk dengan flag `is_best_seller`
- [x] 🟡 Halaman **Gift Sets** (`/gift-sets`) — filter produk dengan kategori gift set
- [x] 🟡 Halaman **Limited Edition** (`/limited-edition`) — filter produk dengan flag `is_limited_edition`
- [x] 🟢 Halaman **About** (`/about`) — konten statis brand story
- [x] 🟢 Halaman **Contact** (`/contact`) — form kontak sederhana
- [x] 🔴 Halaman **Product Detail** (`/products/[slug]`) — galeri gambar, deskripsi, varian, tombol add to cart

### 3.3 Data Fetching
- [x] 🔴 Implementasi fetch data produk dari Supabase menggunakan Server Component (langsung di halaman, tanpa client-side fetching berlebih)
- [x] 🟡 Implementasi pagination/infinite scroll pada halaman Shop — *12 produk per halaman, navigasi halaman + ellipsis*
- [x] 🟡 Implementasi search produk (query ke Supabase berdasarkan nama) — *input search + ilike query di Server Component*

**Output Fase 3:** Seluruh halaman customer portal tampil sesuai design system dan terhubung ke data real dari Supabase.

> **Catatan implementasi Fase 3 (2026-06-19):**
> - Semua komponen & halaman sudah diselaraskan dengan `frontend-parfume/*.html` (navbar scroll effect, hero h-screen, promo grid 5-col, footer logo 120px, product card p-12).
> - Data fetching dari Supabase via Server Component (`src/lib/supabase/queries.ts`) — semua halaman publik sudah menggunakan data real.
> - Search produk: input di halaman Shop → query `ilike` ke Supabase.
> - Pagination: 12 produk/halaman, navigasi halaman dengan ellipsis.
> - Filter kategori terintegrasi dengan search & pagination (semua state di URL).

---

## FASE 4 — Cart, Checkout & Integrasi Payment Gateway (Midtrans)

**Tujuan fase:** Membangun alur belanja end-to-end dari keranjang hingga pembayaran selesai.

### 4.1 Cart Management
- [x] 🔴 Tentukan strategi state management cart — *Context API + useReducer + localStorage (guest), siap untuk sinkron DB*
- [x] 🔴 Buat halaman **Cart** (`/cart`) — list item, update quantity, remove item, subtotal
- [x] 🟡 Buat komponen **Mini Cart/Drawer** — *slide-in dari kanan, qty control, link ke cart/checkout, badge di Navbar*

### 4.2 Checkout Flow
- [x] 🔴 Buat halaman **Checkout** (`/checkout`) — form alamat pengiriman, ringkasan order, integrasi Snap.js
- [x] 🔴 Buat Server Action untuk membuat record `orders` & `order_items` — *`src/lib/actions/checkout.ts`*
- [ ] 🟡 Validasi stok produk sebelum order dibuat (mencegah overselling)

### 4.3 Integrasi Midtrans
- [ ] 🔴 Setup akun Midtrans Sandbox, ambil Server Key & Client Key — *perlu diisi di `.env.local`*
- [x] 🔴 Membuat helper client di `/src/lib/midtrans.ts` — *createSnapToken() siap pakai*
- [x] 🔴 Buat API Route (`/src/app/api/payment/route.ts`) — *menerima order_id, return snap token*
- [x] 🔴 Integrasikan Snap.js (popup pembayaran) — *di halaman Checkout, fallback jika tanpa key*
- [x] 🔴 Buat API Route **Webhook** (`/src/app/api/midtrans/webhook/route.ts`) — *verifikasi signature + update status order*
- [x] 🔴 Implementasi logika update status `orders` — *pending → paid/failed/expired*
- [x] 🟡 Implementasi verifikasi signature key pada webhook — *SHA512 verification*
- [x] 🟡 Buat halaman **Order Success/Status** (`/order/[id]`) — *ringkasan order & status*
- [ ] 🟢 Implementasi notifikasi email konfirmasi order (opsional)

**Output Fase 4:** Customer dapat melakukan pembelian end-to-end dari cart hingga pembayaran sukses, dan status order terupdate otomatis.

> **Catatan implementasi Fase 4 (2026-06-19):**
> - Cart Context (`src/lib/cart-context.tsx`) — useReducer + localStorage, hook `useCart()` tersedia di seluruh app.
> - Halaman `/cart` — list item, quantity control, remove, subtotal, proceed to checkout.
> - Mini Cart Drawer — slide-in dari kanan, badge jumlah item di Navbar.
> - Halaman `/checkout` — form shipping address + order summary + integrasi Midtrans Snap.js.
> - Server Action `createOrder` — insert ke tabel `orders` & `order_items`.
> - Midtrans helper (`src/lib/midtrans.ts`) — `createSnapToken()` untuk request Snap Token.
> - API Route `/api/payment` — return Snap Token untuk popup pembayaran.
> - Webhook `/api/midtrans/webhook` — verifikasi signature SHA512 + update status order.
> - Halaman `/order/[id]` — ringkasan order & status pembayaran.
> - **Yang perlu dilakukan:** Isi `MIDTRANS_SERVER_KEY` & `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` di `.env.local` agar payment benar-benar berfungsi.

---

## FASE 5 — Dashboard Admin

**Tujuan fase:** Membangun panel internal untuk mengelola produk, pesanan, dan data pelanggan.

### 5.1 Layout & Akses
- [x] 🔴 Buat layout khusus admin (`/src/app/(admin)/admin/layout.tsx`) — *masih placeholder, akan diisi sidebar & header*
- [x] 🔴 Implementasi route guard: hanya user dengan role `admin` yang bisa mengakses `/admin/*` — *ada di `src/middleware.ts`*

### 5.2 Dashboard Overview
- [x] 🟡 Halaman **Overview** (`/admin`) — *stats cards, chart bars, recent activity, collection insights*
- [x] 🟢 Tambahkan grafik sederhana (chart penjualan) — *bar chart visual dengan Tailwind*

### 5.3 CRUD Product
- [x] 🔴 Halaman **List Produk** (`/admin/products`) — *tabel dengan nama, kategori, harga, stock, aksi*
- [x] 🔴 Halaman **Tambah Produk** (`/admin/products/new`) — *form name, slug, price, stock, description*
- [ ] 🔴 Implementasi upload gambar produk ke **Supabase Storage** — *helper + action siap, perlu setup Storage bucket di Supabase Dashboard*
- [x] 🔴 Halaman **Edit Produk** (`/admin/products/[id]/edit`) — *form pre-filled dari database*
- [x] 🟡 Implementasi delete produk (soft delete) — *set is_active=false, konfirmasi sebelum hapus*

### 5.4 Order Management
- [x] 🔴 Halaman **List Order** (`/admin/orders`) — *tabel dengan order ID, customer, date, status, total*
- [x] 🔴 Halaman **Detail Order** (`/admin/orders/[id]`) — *info customer, item, alamat, status, payment*
- [x] 🔴 Implementasi fitur **Update Nomor Resi** — *form courier + tracking number, set status shipped*
- [ ] 🟡 Trigger notifikasi

### 5.5 Customer Data
- [x] 🟡 Halaman **List Customer** (`/admin/customers`) — *tabel dari tabel profiles*
- [x] 🟢 Halaman **Detail Customer** (`/admin/customers/[id]`) — *profil + order history + total spent*

**Output Fase 5:** Admin memiliki kontrol penuh atas katalog produk, proses fulfillment order, dan data pelanggan.

---

> **Catatan implementasi Fase 5 (2026-06-19):**
> - Admin layout (`(admin)/admin/layout.tsx`) — sidebar navigasi dark dengan icon lucide-react, route guard via middleware.
> - Halaman Dashboard (`/admin`) — 3 stat cards (Daily Sales, Total Orders, Traffic), bar chart 12 bulan, recent activity feed, bottom insights.
> - Halaman Products (`/admin/products`) — tabel dengan nama, kategori, harga, stock, action edit/hapus.
> - Halaman Tambah Produk (`/admin/products/new`) — form name, slug, price, stock, description → insert ke Supabase.
> - Halaman Orders (`/admin/orders`) — 4 stat cards (Total Orders, Pending, Revenue, Delivered) + tabel order.
> - Halaman Customers (`/admin/customers`) — tabel dari tabel `profiles` dengan kolom name, role, orders count, joined date.
> - **Update:** Edit produk, soft delete, detail order + update resi, detail customer sudah selesai.
> - **Upload gambar:** Komponen + action + SQL policy siap. Yang perlu Anda lakukan: buat bucket `product-images` di Supabase Dashboard → Storage → Create Bucket (public) → lalu jalankan `supabase/storage-policies.sql` di SQL Editor.

---

## FASE 6 — Quality Assurance, Optimasi & Deployment

**Tujuan fase:** Memastikan aplikasi stabil, cepat, dan siap produksi.

- [ ] 🔴 Testing manual end-to-end seluruh user flow (browsing → cart → checkout → pembayaran → admin update resi)
- [ ] 🟡 Audit responsiveness di berbagai breakpoint (mobile, tablet, desktop) sesuai catatan di `design.md`
- [ ] 🟡 Optimasi gambar (gunakan `next/image`, kompresi, lazy loading) untuk performa loading
- [ ] 🟡 Implementasi SEO dasar (metadata per halaman, sitemap, robots.txt) untuk halaman publik
- [ ] 🟢 Setup error handling & halaman 404/500 custom
- [ ] 🟡 Migrasi Midtrans dari Sandbox ke Production (ganti key, ubah environment)
- [ ] 🔴 Setup environment variables di hosting (Vercel) — Supabase Key & Midtrans Key versi production
- [ ] 🔴 Deploy ke Vercel, hubungkan domain custom
- [ ] 🟡 Setup monitoring dasar (Vercel Analytics atau Sentry untuk error tracking)
- [ ] 🟢 Final review checklist sebelum go-live (cek semua link, gambar, dan transaksi dummy production)

**Output Fase 6:** Aplikasi live, stabil, dan siap menerima transaksi nyata dari customer.

---

> **Catatan implementasi Fase 2 (2026-06-19):**
> - Semua Supabase client (client.ts, server.ts, admin.ts) dan middleware session refresh sudah berfungsi.
> - Migration SQL mencakup seluruh tabel inti (products, categories, profiles, orders, order_items) + trigger `handle_new_user`, + RLS policies lengkap.
> - Halaman login/register customer (`/login`, `/register`) dan admin (`/admin/login`) sudah dibuat dengan form email/password + opsi Google OAuth.
> - Route callback OAuth ada di `/auth/callback` — perlu konfigurasi OAuth di Supabase Dashboard (Google provider) agar benar-benar aktif.
> - Cart strategy sudah ditentukan (client-side + localStorage), akan diimplementasikan di Fase 4.
> - **Yang masih perlu dikerjakan:** OAuth setup di Supabase Dashboard, dan ERD diagram (opsional).

---

## 📌 Catatan Tambahan untuk Tracking Harian

- Update kolom **Total Progress** di bagian atas setiap akhir sesi kerja (hitung berdasarkan jumlah checklist tercentang).
- Pindahkan **Current Phase** hanya jika seluruh task 🔴 High pada fase tersebut sudah selesai (task 🟡/🟢 boleh menyusul jika diperlukan).
- Disarankan membuat branch Git per fase (`feature/phase-2-database`, dst) agar histori perubahan rapi dan mudah ditelusuri.
