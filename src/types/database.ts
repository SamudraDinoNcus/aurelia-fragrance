/**
 * Tipe-tipe domain yang mencerminkan skema SQL (supabase/migrations/0001_init_schema.sql).
 *
 * Catatan: Ini ditulis manual karena akses CLI `supabase gen types` membutuhkan
 * koneksi ke proyek. Setelah project Supabase aktif dan CLI tersedia, jalankan:
 *   npx supabase gen types typescript --project-id <ID> > src/types/supabase.ts
 * lalu ganti import type di codebase dengan hasil generate tersebut.
 */

// ---------------------------------------------------------------------------
// Enum / Union Types (cermin enum PostgreSQL di database)
// ---------------------------------------------------------------------------

export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"     // Menunggu pembayaran
  | "paid"        // Pembayaran sukses (dari callback Midtrans)
  | "shipped"     // Admin sudah input nomor resi
  | "completed"   // Pesanan diterima customer
  | "failed"      // Pembayaran gagal
  | "expired"     // Tidak dibayar dalam batas waktu
  | "cancelled";  // Dibatalkan

// ---------------------------------------------------------------------------
// Entitas Database
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  images: string[];
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
  is_best_seller: boolean;
  is_limited_edition: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relasi (tersedia jika query menyertakan .select("*, category(*)"))
  category?: Category | null;
}

/**
 * Struktur JSON kolom `shipping_address` di tabel `orders`.
 * Disimpan sebagai jsonb agar terstruktur dan tidak hanya teks polos.
 */
export interface ShippingAddress {
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal_amount: number;
  shipping_cost: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  courier: string | null;
  tracking_number: string | null;
  midtrans_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  // Relasi (tersedia jika query join)
  order_items?: OrderItem[];
  profile?: Pick<Profile, "id" | "full_name" | "phone"> | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  /**
   * Snapshot nama produk saat transaksi berlangsung.
   * Tidak bergantung pada tabel products supaya riwayat order
   * tetap akurat walau produk aslinya diubah/dihapus.
   */
  product_name: string;
  price_at_purchase: number;
  quantity: number;
  created_at: string;
  // Relasi opsional
  product?: Product | null;
}

// ---------------------------------------------------------------------------
// Tipe-tipe utilitas
// ---------------------------------------------------------------------------

/** Membungkus nilai T menjadi T | null, berguna untuk prop opsional. */
export type Nullable<T> = T | null;

/** Shorthand untuk payload pagination */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
