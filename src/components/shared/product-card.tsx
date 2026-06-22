import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number | null;
  imageSrc?: string;
}

export function ProductCard({
  slug,
  name,
  tagline,
  price,
  compareAtPrice,
  imageSrc,
}: ProductCardProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <Link href={`/products/${slug}`} className="group cursor-pointer">
      <div className="product-image-container aspect-square bg-surface-neutral mb-6 relative overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-contain p-12"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-amber-light/20 to-accent-amber-deep/10 flex items-center justify-center">
            <span className="font-serif text-4xl text-accent-gold/40">&#x2736;</span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-body-lg text-body-lg font-medium text-[#1B130F]">
            {name}
          </h3>
          <p className="font-caption text-caption text-[#1B130F] mt-0.5">
            {tagline}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="font-body-lg text-body-lg text-[#1B130F]">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="block font-caption text-caption text-muted line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
