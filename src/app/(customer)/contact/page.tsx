import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="bg-surface pt-28">
      <div className="mx-auto max-w-4xl px-container-margin-mobile pb-section-gap md:px-container-margin">
        <h1 className="font-headline-lg text-headline-lg text-[#1B130F]">
          Contact
        </h1>
        <p className="mt-3 max-w-lg font-body-md text-body-md text-on-surface-variant">
          Have a question or need assistance? We&apos;d love to hear from you.
        </p>

        <form className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="font-label-sm text-label-sm uppercase tracking-widest text-[#1B130F]"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="font-label-sm text-label-sm uppercase tracking-widest text-[#1B130F]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="subject"
              className="font-label-sm text-label-sm uppercase tracking-widest text-[#1B130F]"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              className="mt-2 w-full border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="message"
              className="font-label-sm text-label-sm uppercase tracking-widest text-[#1B130F]"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className="mt-2 w-full resize-none border border-border bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-background outline-none transition-colors focus:border-accent-gold"
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" variant="default" size="lg">
              Send message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
