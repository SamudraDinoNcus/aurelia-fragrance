export default function AboutPage() {
  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-4xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <h1 className="font-headline-lg text-headline-lg text-[#1B130F]">
          About Aurélia
        </h1>

        <div className="mt-12 space-y-8">
          <section>
            <h2 className="font-headline-md text-headline-md text-[#1B130F]">
              Our story
            </h2>
            <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Aurélia Fragrance was born from a passion for the extraordinary.
              Founded in the heart of Paris, we set out to create fragrances
              that transcend time — each bottle a masterpiece of olfactory art.
            </p>
            <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Our master perfumers source the finest ingredients from around the
              globe: Bulgarian roses, Indian sandalwood, French lavender, and
              rare Oud from Southeast Asia. Every fragrance is aged to
              perfection, allowing the notes to harmonize into something truly
              exceptional.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-[#1B130F]">
              Our philosophy
            </h2>
            <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              We believe fragrance is more than scent — it is memory, identity,
              and emotion captured in liquid form. Aurélia is for those who
              appreciate the finer things, who seek beauty in the details, and
              who understand that true luxury is timeless.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-[#1B130F]">
              Craftsmanship
            </h2>
            <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Each Aurélia fragrance is hand-blended in small batches in our
              atelier in Grasse, the perfume capital of the world. From
              maceration to bottling, every step is overseen by our master
              perfumers to ensure uncompromising quality.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
