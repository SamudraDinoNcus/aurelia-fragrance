import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/supabase/queries";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const compareAtPrice = product.compare_at_price;
  const categoryName = (product.category as { name?: string } | null)?.name;

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-7xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-accent-gold transition-colors hover:text-[#1B130F]"
        >
          &larr; Back to shop
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div className="aspect-square bg-surface-neutral relative overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent-amber-light/20 to-accent-amber-deep/10 flex items-center justify-center">
                <span className="font-serif text-6xl text-accent-gold/30">
                  &#x2736;
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {categoryName && (
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-accent-gold">
                {categoryName}
              </p>
            )}
            <h1 className="mt-2 font-headline-lg text-headline-lg text-[#1B130F]">
              {product.name}
            </h1>
            <p className="mt-2 font-body-md text-body-md text-[#1B130F]">
              {product.description?.split(".")[0] ?? ""}
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              {compareAtPrice && compareAtPrice > product.price && (
                <span className="font-body-lg text-body-lg text-muted line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="font-headline-md text-headline-md text-[#1B130F]">
                ${product.price.toFixed(2)}
              </span>
              {compareAtPrice && compareAtPrice > product.price && (
                <span className="font-label-sm text-label-sm text-accent-gold">
                  Save ${(compareAtPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-8 font-caption text-caption text-[#1B130F] leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-8 border-t border-border pt-8">
              <div>
                <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-accent-gold">
                  Top notes
                </h4>
                <ul className="mt-3 space-y-1">
                  {product.top_notes.map((note) => (
                    <li
                      key={note}
                      className="font-body-md text-body-md text-[#1B130F]"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-accent-gold">
                  Heart notes
                </h4>
                <ul className="mt-3 space-y-1">
                  {product.middle_notes.map((note) => (
                    <li
                      key={note}
                      className="font-body-md text-body-md text-[#1B130F]"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-accent-gold">
                  Base notes
                </h4>
                <ul className="mt-3 space-y-1">
                  {product.base_notes.map((note) => (
                    <li
                      key={note}
                      className="font-body-md text-body-md text-[#1B130F]"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <AddToCartButton
                slug={product.slug}
                name={product.name}
                price={product.price}
                tagline={product.description?.split(".")[0] ?? ""}
              />
              <Button variant="outline" size="lg">
                Add to wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
