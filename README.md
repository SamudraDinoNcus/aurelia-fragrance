# Aurélia Fragrance — E-commerce Platform

Proyek e-commerce parfum premium. Lihat `plan.md` untuk roadmap fase pengembangan dan `design.md` untuk spesifikasi desain (diekstrak dari `frontend-parfume.zip`).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling/UI**: Tailwind CSS + shadcn/ui (komponen di `src/components/ui`)
- **Backend/DB**: Supabase (Postgres, Auth, Storage, RLS) — dipasang di Fase 2
- **Payment Gateway**: Midtrans (Snap API) — dipasang di Fase 4

## Cara Menjalankan Proyek

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment variable
cp .env.local.example .env.local
# lalu isi value Supabase & Midtrans saat fase terkait dimulai

# 3. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk halaman publik, dan [http://localhost:3000/admin](http://localhost:3000/admin) untuk placeholder Dashboard Admin.

> **Catatan teknis:** struktur proyek ini disusun secara manual (tanpa menjalankan `create-next-app`/`shadcn init` langsung) karena environment kerja saat ini tidak memiliki akses internet untuk mengunduh package. Jalankan `npm install` di komputer/CI Anda yang memiliki akses internet untuk mengunduh seluruh dependency di `package.json`.

## Struktur Folder

```
src/
├── app/
│   ├── (customer)/        # Route group halaman publik — tanpa prefix URL
│   │   ├── layout.tsx      #   wrapper Navbar/Footer (diisi penuh di Fase 3)
│   │   └── page.tsx         #   "/" — placeholder verifikasi tema
│   ├── (admin)/
│   │   └── admin/          # Route group + segment nyata → URL diawali "/admin"
│   │       ├── layout.tsx   #   wrapper sidebar admin (diisi penuh di Fase 5)
│   │       └── page.tsx      #   "/admin" — placeholder overview
│   ├── api/                 # Route handler (mis. /api/payment, /api/midtrans/webhook di Fase 4)
│   ├── layout.tsx            # Root layout — font loading EB Garamond & Inter
│   └── globals.css            # Token tema (CSS variable) + style pendukung
├── components/
│   ├── ui/                   # Komponen shadcn/ui (Button sudah ada, lainnya ditambah sesuai kebutuhan)
│   └── shared/                # Komponen custom reusable (Navbar, Footer, ProductCard — Fase 3)
├── lib/
│   ├── utils.ts                # Helper cn() untuk className
│   └── supabase/                # Supabase client (Fase 2)
├── types/
│   └── index.ts                  # Tipe global (diperluas sesuai skema DB — Fase 2)
└── hooks/                          # Custom React hooks
```

### Mengapa `(admin)/admin/` bertingkat dua?

Route group `(admin)` di Next.js App Router **tidak menambah segmen URL** — fungsinya hanya untuk mengelompokkan layout/logic. Karena Dashboard Admin butuh prefix URL nyata (`/admin`, `/admin/products`, dst), folder `admin` di dalamnya yang menyediakan segmen tersebut. Sebaliknya, `(customer)` sengaja dibiarkan sebagai route group murni karena halaman publik tidak butuh prefix (`/`, `/shop`, `/cart`, dst langsung tanpa awalan).

## Konvensi Styling

Semua token desain (warna, font, spacing) diekstrak dari `frontend-parfume.zip` dan didefinisikan di `tailwind.config.ts` + `src/app/globals.css`. Dua sistem dipakai berdampingan:

1. **CSS variable shadcn-compatible** (`bg-primary`, `bg-secondary`, `text-muted-foreground`, dst) — otomatis dipakai komponen `ui/*`.
2. **Token literal brand** (`bg-accent-gold`, `bg-surface-neutral`, `font-headline-lg`, dst) — agar class pada mockup HTML asli bisa disalin nyaris 1:1 ke komponen React saat membangun halaman di Fase 3 & 5.

## Status Pengembangan

Lihat `plan.md` di root repo untuk checklist & progress per fase.
