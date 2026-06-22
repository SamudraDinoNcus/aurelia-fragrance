import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { PromoBanner } from "@/components/shared/promo-banner";
import { FeatureIconItem } from "@/components/shared/feature-icon-item";
import { getBestSellers } from "@/lib/supabase/queries";
import { Truck, Shield, Feather, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free shipping & easy returns",
    description: "Enjoy free shipping on orders over $150 and hassle-free returns.",
  },
  {
    icon: Shield,
    title: "Exquisite craftsmanship",
    description: "Each bottle is a masterpiece, crafted with premium ingredients.",
  },
  {
    icon: Feather,
    title: "Sustainable & Ethical",
    description: "Ethically sourced, cruelty-free and environmentally conscious.",
  },
  {
    icon: Sparkles,
    title: "Globally acclaimed scents",
    description: "Award-winning fragrances recognized for their elegance.",
  },
];

export default async function HomePage() {
  const bestSellers = await getBestSellers();
  const products = bestSellers.slice(0, 4);

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative h-screen w-full flex items-end pb-24 overflow-hidden bg-[#1B130F]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-amber-deep/40 to-[#1B130F]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 px-container-margin-mobile md:px-container-margin w-full grid md:grid-cols-2 items-end">
          <div>
            <h1 className="font-display-hero text-display-hero md:text-[80px] text-on-primary max-w-xl">
              Refined elegance,<br />lasting legacy
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-end md:justify-end gap-12 text-on-primary md:pb-4">
            <div className="max-w-xs text-right md:text-left">
              <p className="font-body-md text-body-md opacity-90 leading-relaxed">
                Discover the essence of sophistication. Elevate your senses with
                our exclusive collection of luxury perfumes, crafted to leave a
                lasting impression.
              </p>
            </div>
            <Button
              variant="brand"
              size="lg"
              asChild
              className="scale-95 hover:scale-100 transition-transform duration-200"
            >
              <Link href="/shop">Shop now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="bg-surface py-section-gap px-container-margin-mobile md:px-container-margin">
        <div className="max-w-full mx-auto">
          <h2 className="font-headline-lg text-headline-lg mb-16 text-[#1B130F]">
            Our best sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-20">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                tagline={product.description?.split(".")[0] ?? ""}
                price={product.price}
                compareAtPrice={product.compare_at_price}
                imageSrc={product.images?.[0]}
              />
            ))}
          </div>
          <div className="flex flex-col items-center text-center space-y-6">
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg italic">
              Timeless blends, unforgettable impressions, crafted to embody
              sophistication and allure.
            </p>
            <Link
              href="/shop"
              className="font-label-md text-label-md border-b border-primary pb-1 uppercase tracking-widest hover:text-accent-gold hover:border-accent-gold transition-colors duration-300"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Art of Giving ── */}
      <PromoBanner
        title="The art of giving"
        description="A gift of elegance, wrapped in sophistication, designed to leave a lasting impression. Experience the perfect harmony of fragrance and presentation."
        ctaLabel="Shop gift sets"
        ctaHref="/gift-sets"
      />

      {/* ── Features Row ── */}
      <section className="bg-background py-section-gap px-container-margin-mobile md:px-container-margin">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h2 className="font-headline-lg text-headline-lg text-[#1B130F] mb-4">
            Transform your fragrance journey with unmatched elegance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {FEATURES.map((feature) => (
            <FeatureIconItem key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-section-gap bg-surface-neutral p-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-amber-light/20 to-accent-amber-deep/10 flex items-center justify-center shrink-0">
              <span className="font-serif text-3xl text-accent-gold/40">&#x2736;</span>
            </div>
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                Redefine your fragrance journey with scents that exude
                sophistication and leave a lasting impression.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="font-label-md text-label-md border-b border-primary pb-1 uppercase tracking-widest hover:text-accent-gold transition-colors shrink-0"
          >
            Shop now
          </Link>
        </div>
      </section>
    </>
  );
}
