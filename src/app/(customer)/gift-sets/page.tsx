import { ProductCard } from "@/components/shared/product-card";
import { getGiftSets } from "@/lib/supabase/queries";

export default async function GiftSetsPage() {
  const products = await getGiftSets();

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-7xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <h1 className="font-headline-lg text-headline-lg text-[#1B130F]">
          Gift sets
        </h1>
        <p className="mt-3 max-w-lg font-body-md text-body-md text-on-surface-variant">
          Curated collections presented in our signature packaging — the art of
          giving, perfected.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
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
      </div>
    </div>
  );
}
