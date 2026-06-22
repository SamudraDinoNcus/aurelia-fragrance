import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import { AuthProvider } from "@/components/shared/auth-provider";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aurélia Fragrance | Refined Elegance",
    template: "%s | Aurélia Fragrance",
  },
  description:
    "Discover the essence of sophistication. Aurélia Fragrance — exclusive collection of luxury perfumes crafted to leave a lasting impression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${ebGaramond.variable} ${inter.variable}`}>
      <body className="overflow-x-hidden antialiased">
        {/*
          AuthProvider dipasang di root layout agar user, profile, dan isAdmin
          tersedia di seluruh aplikasi (customer portal maupun admin dashboard)
          tanpa perlu prop drilling.

          Catatan performa: Provider ini membuat satu request getUser() saat mount.
          Untuk halaman statis yang tidak butuh auth (misalnya landing page tanpa
          cart), optimasi bisa dilakukan di Fase 6 dengan lazy-mount provider.
        */}
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
