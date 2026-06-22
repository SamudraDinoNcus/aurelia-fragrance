-- ============================================================================
-- Aurélia Fragrance — Migration 0001: Skema Inti & Row Level Security
-- Fase 2.2 (Desain Skema Database) & 2.3 (RLS & Roles) pada plan.md
-- Jalankan skrip ini secara utuh di Supabase Dashboard > SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & ENUM TYPES
-- ----------------------------------------------------------------------------

-- gen_random_uuid() butuh extension pgcrypto (biasanya sudah aktif di Supabase,
-- baris ini aman dijalankan ulang / idempotent).
create extension if not exists "pgcrypto";

create type public.user_role as enum ('customer', 'admin');

create type public.order_status as enum (
  'pending',    -- order dibuat, menunggu pembayaran
  'paid',       -- pembayaran diterima (callback Midtrans "settlement"/"capture")
  'shipped',    -- admin sudah input nomor resi
  'completed',  -- pesanan selesai diterima customer
  'failed',     -- pembayaran gagal
  'expired',    -- pembayaran kedaluwarsa (tidak dibayar dalam waktu tertentu)
  'cancelled'   -- dibatalkan (oleh customer/admin)
);

-- ----------------------------------------------------------------------------
-- 1. HELPER FUNCTION: auto-update kolom updated_at
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- 2. TABEL: categories
-- ----------------------------------------------------------------------------

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

comment on table public.categories is
  'Kategori produk (contoh: Eau de Parfum, Eau de Toilette, Gift Set). '
  'Berbeda dengan flag is_best_seller/is_limited_edition di tabel products, '
  'yang sifatnya merchandising tag lintas kategori untuk landing page.';

-- ----------------------------------------------------------------------------
-- 3. TABEL: products (termasuk scent notes: top / middle / base)
-- ----------------------------------------------------------------------------

create table public.products (
  id                  uuid primary key default gen_random_uuid(),
  category_id         uuid references public.categories(id) on delete set null,

  name                text not null,
  slug                text not null unique,
  description         text,

  price               numeric(12,2) not null check (price >= 0),
  compare_at_price    numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  stock               integer not null default 0 check (stock >= 0),

  images              text[] not null default '{}',

  -- Scent notes / piramida aroma parfum
  top_notes           text[] not null default '{}',
  middle_notes        text[] not null default '{}',
  base_notes          text[] not null default '{}',

  -- Merchandising tag yang dipakai untuk filter halaman Best Sellers / Limited Edition
  is_best_seller      boolean not null default false,
  is_limited_edition  boolean not null default false,

  -- Soft delete: produk "dihapus" admin tetap ada di DB (riwayat order tetap valid)
  is_active           boolean not null default true,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on column public.products.top_notes is 'Aroma yang tercium pertama, paling ringan & cepat menguap (contoh: bergamot, lemon).';
comment on column public.products.middle_notes is 'Aroma inti/heart note yang muncul setelah top notes menghilang (contoh: rose, jasmine).';
comment on column public.products.base_notes is 'Aroma dasar paling tahan lama, muncul terakhir (contoh: musk, sandalwood, oud).';

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index idx_products_category on public.products(category_id);
create index idx_products_best_seller on public.products(is_best_seller) where is_best_seller = true;
create index idx_products_limited_edition on public.products(is_limited_edition) where is_limited_edition = true;
create index idx_products_active on public.products(is_active) where is_active = true;

-- ----------------------------------------------------------------------------
-- 4. TABEL: profiles (1:1 dengan auth.users, menyimpan role admin/customer)
-- ----------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  address     text,
  role        public.user_role not null default 'customer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-insert baris profiles setiap kali ada user baru daftar lewat Supabase Auth,
-- supaya kita tidak perlu membuat profile secara manual di sisi aplikasi.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 5. TABEL: orders & order_items
-- ----------------------------------------------------------------------------

create table public.orders (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete restrict,

  status             public.order_status not null default 'pending',

  subtotal_amount    numeric(12,2) not null default 0,
  shipping_cost      numeric(12,2) not null default 0,
  total_amount       numeric(12,2) not null default 0,

  -- Disimpan sebagai jsonb (bukan text tunggal) agar terstruktur:
  -- { "recipient_name", "phone", "address_line", "city", "province", "postal_code" }
  shipping_address   jsonb not null,

  courier            text,
  tracking_number    text,
  midtrans_order_id  text unique,
  paid_at            timestamptz,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);

create table public.order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id) on delete cascade,
  product_id          uuid references public.products(id) on delete set null,

  -- Snapshot nama & harga saat transaksi, supaya riwayat order tetap akurat
  -- walaupun nama/harga produk asli berubah di kemudian hari.
  product_name        text not null,
  price_at_purchase   numeric(12,2) not null check (price_at_purchase >= 0),
  quantity             integer not null check (quantity > 0),

  created_at          timestamptz not null default now()
);

create index idx_order_items_order on public.order_items(order_id);
create index idx_order_items_product on public.order_items(product_id);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Helper: cek apakah user yang sedang login adalah admin.
-- SECURITY DEFINER + diberi search_path tetap, supaya function ini bisa
-- membaca tabel profiles TANPA terkena RLS-nya sendiri (mencegah infinite
-- recursion saat dipakai di dalam policy tabel profiles).
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- ---- categories: publik boleh baca, hanya admin boleh tulis ----
create policy "categories_select_public"
  on public.categories for select
  using (true);

create policy "categories_admin_all"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---- products: publik hanya boleh lihat produk aktif, admin lihat semua ----
create policy "products_select_public"
  on public.products for select
  using (is_active = true or public.is_admin());

create policy "products_admin_insert"
  on public.products for insert
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products for delete
  using (public.is_admin());

-- ---- profiles: user hanya boleh lihat/ubah datanya sendiri, admin bebas ----
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- (Tidak ada policy INSERT untuk role authenticated biasa — baris profiles
-- dibuat otomatis lewat trigger handle_new_user yang berjalan sebagai
-- SECURITY DEFINER sehingga tidak terhalang RLS.)

-- ---- orders: customer hanya lihat/insert order miliknya, admin bebas ----
create policy "orders_select_own_or_admin"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "orders_update_admin_only"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- Catatan penting: update status pembayaran ('pending' -> 'paid', dst) akan
-- dilakukan oleh API Route Webhook Midtrans (Fase 4) menggunakan
-- SUPABASE_SERVICE_ROLE_KEY, yang otomatis BYPASS seluruh RLS di atas.
-- Policy "orders_update_admin_only" di sini khusus untuk update manual oleh
-- admin lewat Dashboard (misal input nomor resi).

-- ---- order_items: ikut aturan order induknya ----
create policy "order_items_select_own_or_admin"
  on public.order_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- ============================================================================
-- Selesai. Lanjut ke Fase 2.1 (Supabase client di Next.js) & 2.4 (Autentikasi).
-- ============================================================================
