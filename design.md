# Design Spec — Aurélia Fragrance (E-commerce Parfum)

Dokumen ini merangkum sistem desain berdasarkan referensi visual yang diberikan, untuk dijadikan acuan saat membangun frontend.

## 1. Brand & Mood

- **Nama brand**: Aurélia Fragrance
- **Mood**: mewah, hangat, elegan, minimalis-editorial (mirip majalah fashion high-end)
- **Kesan visual**: foto besar dengan tone warna amber/golden-hour, dipadukan dengan tipografi serif yang halus dan banyak white space pada bagian katalog produk.

## 2. Color Palette

| Token | Hex (perkiraan) | Penggunaan |
|---|---|---|
| `--color-bg-dark` | `#1B130F` | Background hero, section gelap (navbar, "The art of giving") |
| `--color-bg-cream` | `#FAF6F1` | Background section terang (best sellers, footer) |
| `--color-bg-neutral` | `#F0ECE6` | Background card produk |
| `--color-text-dark` | `#1B130F` | Teks pada background terang |
| `--color-text-light` | `#FFFFFF` | Teks pada background gelap |
| `--color-accent-gold` | `#C9A36A` | Aksen tombol garis bawah, ikon, highlight |
| `--color-accent-amber` | `#B5651D` – `#D98E4A` | Tone foto produk & lifestyle (gradasi amber/copper) |
| `--color-muted-grey` | `#8A8378` | Teks sekunder/caption, harga coret |

Karakter warna keseluruhan: palet hangat (warm neutrals) — coklat tua, krem, dan gold/copper sebagai aksen. Tidak ada warna saturasi tinggi; semuanya desaturated dan earthy untuk kesan premium.

## 3. Typography

- **Heading / Display**: Serif elegan (contoh: *Playfair Display*, *Cormorant*, atau *EB Garamond*) — dipakai untuk logo "Aurélia Fragrance", judul hero "Refined elegance, lasting legacy", judul section ("Our best sellers", "The art of giving"), dan logo besar di footer.
- **Body / UI text**: Sans-serif tipis-netral (contoh: *Inter*, *Helvetica Neue*, atau *Söhne*) — dipakai untuk navigasi, deskripsi produk, harga, tombol, dan footer links.
- **Skala ukuran (perkiraan)**:
  - Hero headline: 48–64px, serif, line-height rapat
  - Logo footer besar: 56–72px, serif
  - Section title: 28–32px, serif
  - Nama produk / label: 14–16px, sans-serif, medium
  - Harga: 14–16px, sans-serif
  - Caption / deskripsi kecil: 12–13px, sans-serif, warna abu-abu
  - Nav links: 13–14px, sans-serif, letter-spacing sedikit lebar

## 4. Layout & Grid

- Lebar konten utama mengikuti container dengan margin samping konsisten (≈ 60–80px di desktop).
- Grid produk: **4 kolom** dengan gap kecil–medium, rasio gambar produk mendekati 1:1 (square card, background krem muda).
- Section hero: full-bleed image dengan overlay gradient gelap di bagian bawah agar teks putih tetap terbaca.
- Section "The art of giving" & promo bundle: layout 2 kolom (gambar besar di kiri/kanan, teks + CTA kecil menumpuk di atas gambar dengan overlay gelap).
- Section fitur ("Transform your fragrance journey"): grid **4 kolom ikon** (ikon + judul singkat + deskripsi 1 baris), diikuti banner promo kecil di bawahnya.
- Footer: multi-kolom (logo besar serif di kiri, 3 kolom link di tengah, form subscribe + gambar kecil di kanan).

## 5. Komponen UI

### Navbar
- Background gelap transparan di atas hero image.
- Logo kiri (serif), menu tengah (Shop, Best sellers, Gift sets, Limited edition, About, Contact), ikon kanan (search, cart, account) — semua outline/minimal, warna putih.

### Hero Section
- Foto lifestyle besar (model menyemprotkan parfum), tone warna amber gelap.
- Headline serif besar di pojok kiri bawah, warna putih.
- Teks deskripsi singkat 2 kolom kecil di kanan headline.
- Tombol CTA solid putih dengan teks gelap ("Shop now"), tanpa border-radius besar (kotak/slightly rounded).

### Product Card (Best Sellers)
- Background krem muda, gambar produk transparan/centered.
- Nama produk (bold/medium) + tagline 1 baris di bawah gambar.
- Harga di kanan nama produk; jika ada diskon, harga lama dicoret + harga baru di sebelahnya.
- Tidak ada border/shadow — pemisah hanya lewat warna background card.

### Promo / Bundle Card
- Foto produk di atas, info teks (nama bundle, harga, deskripsi singkat) di bawah dengan background putih.
- Link underline kecil sebagai CTA sekunder ("Shop couple bundles").

### Banner Section (full width, gelap)
- Foto produk + properti dekoratif (pita, kotak hadiah) dengan overlay gelap.
- Judul serif kiri atas, caption + CTA underline di pojok kanan bawah foto.

### Feature Icons Row
- 4 item sejajar: ikon outline tipis + judul singkat + deskripsi 1–2 baris, dipisahkan whitespace (tanpa card/border).

### Footer
- Logo brand besar (serif) jadi focal point.
- 3 kolom navigasi link kecil + 1 kolom newsletter (judul, deskripsi singkat, link "Subscribe now" underline).
- Ikon sosial media kecil outline di pojok kiri bawah, copyright text kecil di sampingnya.
- Gambar kecil dekoratif di pojok kanan bawah.

## 6. Spacing & Style Notes

- Banyak negative space, terutama di section produk (background putih/krem polos).
- Tidak ada heavy shadow atau gradient mencolok di area UI (kontras dengan foto yang sangat dramatis-bertekstur).
- Garis bawah (underline) dipakai sebagai gaya link sekunder/CTA teks, bukan tombol solid.
- Tombol solid (putih di atas gelap, atau gelap di atas terang) dipakai hanya untuk CTA utama.
- Border-radius minim (0–4px) — kesan tegas dan editorial, bukan rounded/soft.

## 7. Rekomendasi Implementasi Frontend

- **Stack**: React/Next.js + Tailwind CSS (utility class cocok untuk replikasi spacing & warna konsisten).
- **Font loading**: Google Fonts — pasangan *Playfair Display* (heading) + *Inter* atau *Work Sans* (body).
- **Image handling**: gunakan `next/image` atau lazy-loading untuk foto hero & produk beresolusi tinggi agar performa tetap baik.
- **Komponen reusable**: `ProductCard`, `PromoBanner`, `FeatureIconItem`, `Navbar`, `Footer`.
- **Responsiveness**: grid produk 4 kolom → 2 kolom (tablet) → 1 kolom (mobile); hero text tetap kiri-bawah tapi ukuran font diturunkan signifikan di mobile.
