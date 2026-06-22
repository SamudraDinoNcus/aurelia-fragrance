-- =============================================================================
-- Storage Bucket & RLS Policies — Product Images
-- Jalankan di Supabase SQL Editor SETELAH membuat bucket "product-images"
-- melalui Supabase Dashboard > Storage > Create Bucket (public).
-- =============================================================================

-- 1. Izinkan admin upload file ke bucket product-images
create policy "Admin can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 2. Izinkan admin update file
create policy "Admin can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 3. Izinkan admin delete file
create policy "Admin can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 4. Izinkan semua orang (termasuk public / tidak login) SELECT / lihat gambar
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
