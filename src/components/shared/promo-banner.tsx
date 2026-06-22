import Image from "next/image";
import Link from "next/link";

interface PromoBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function PromoBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
}: PromoBannerProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-5 h-auto md:h-[819px] overflow-hidden">
      <div className="md:col-span-2 bg-on-background flex flex-col justify-center px-container-margin-mobile md:px-container-margin py-20 text-on-primary">
        <h2 className="font-display-hero text-display-hero mb-8">{title}</h2>
        <p className="font-body-md text-body-md opacity-80 mb-12 max-w-sm leading-relaxed">
          {description}
        </p>
        <Link
          href={ctaHref}
          className="font-label-md text-label-md border-b border-on-primary pb-1 w-fit uppercase tracking-widest hover:text-accent-gold hover:border-accent-gold transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
      <div className="md:col-span-3 relative h-full min-h-[400px] md:min-h-0">
        <Image
          src="/images/art-of-giving.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1B130F]/40" />
      </div>
    </section>
  );
}
