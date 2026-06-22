import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { getProducts, getCategories, PAGE_SIZE } from "@/lib/supabase/queries";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; page?: string };
}) {
  const categorySlug = searchParams.category ?? "";
  const q = searchParams.q ?? "";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [{ products, total }, categories] = await Promise.all([
    getProducts({ categorySlug: categorySlug || undefined, q, page }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function url(params: { category?: string; q?: string; page?: string }) {
    const sp = new URLSearchParams();
    const searchQ = params.q ?? q;
    const searchCat = params.category !== undefined ? params.category : categorySlug;
    if (searchQ) sp.set("q", searchQ);
    if (searchCat) sp.set("category", searchCat);
    if (params.page) sp.set("page", params.page);
    const s = sp.toString();
    return `/shop${s ? `?${s}` : ""}`;
  }

  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-7xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-[#1B130F]">
              Shop
            </h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              {total} product{total !== 1 ? "s" : ""} found
            </p>
          </div>

          <form method="GET" action="/shop" className="flex gap-3">
            {categorySlug && (
              <input type="hidden" name="category" value={categorySlug} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              className="w-64 border border-border bg-surface-container-lowest px-4 py-2 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
            <button
              type="submit"
              className="border border-primary px-6 py-2 font-label-sm text-label-sm uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={url({ category: undefined, page: "1" })}
            className={`border px-5 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-colors ${
              !categorySlug
                ? "border-[#1B130F] text-[#1B130F]"
                : "border-border text-on-surface-variant hover:border-[#1B130F] hover:text-[#1B130F]"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={url({ category: cat.slug, page: "1" })}
              className={`border px-5 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-colors ${
                categorySlug === cat.slug
                  ? "border-[#1B130F] text-[#1B130F]"
                  : "border-border text-on-surface-variant hover:border-[#1B130F] hover:text-[#1B130F]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
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
        ) : (
          <p className="mt-12 font-body-md text-body-md text-on-surface-variant text-center py-20">
            No products found.
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={url({ page: String(page - 1) })}
                className="flex h-10 w-10 items-center justify-center border border-border text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                &larr;
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <span key={p} className="contents">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="flex h-10 w-10 items-center justify-center text-on-surface-variant">
                      &hellip;
                    </span>
                  )}
                  <Link
                    href={url({ page: String(p) })}
                    className={`flex h-10 w-10 items-center justify-center font-label-md text-label-md transition-colors ${
                      p === page
                        ? "bg-primary text-on-primary"
                        : "border border-border text-on-surface-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {p}
                  </Link>
                </span>
              ))}
            {page < totalPages && (
              <Link
                href={url({ page: String(page + 1) })}
                className="flex h-10 w-10 items-center justify-center border border-border text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
