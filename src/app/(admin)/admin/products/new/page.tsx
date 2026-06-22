"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const form = new FormData(e.currentTarget);
      const name = form.get("name") as string;
      const slug = form.get("slug") as string;
      const price = parseFloat(form.get("price") as string);
      const stock = parseInt(form.get("stock") as string, 10);
      const description = form.get("description") as string;

      const { error: insertError } = await supabase.from("products").insert({
        name,
        slug,
        price,
        stock: isNaN(stock) ? 0 : stock,
        description,
        category_id: null,
        is_active: true,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    },
    [router, supabase],
  );

  return (
    <div>
      <div className="mb-10">
        <nav className="flex gap-2 text-text-muted font-label-sm mb-4">
          <span>Admin</span>
          <span>/</span>
          <a href="/admin/products" className="hover:text-primary transition-colors">Products</a>
          <span>/</span>
          <span className="text-primary">New</span>
        </nav>
        <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
          Add New Fragrance
        </h2>
      </div>

      {error && (
        <div className="mb-6 border border-destructive bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8 bg-white border border-outline-variant p-10">
        <div>
          <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
            Product Name
          </label>
          <input
            name="name"
            required
            className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg placeholder:text-surface-variant bg-transparent outline-none transition-colors"
            placeholder="e.g. Midnight Iris"
          />
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
            Slug
          </label>
          <input
            name="slug"
            required
            className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg placeholder:text-surface-variant bg-transparent outline-none transition-colors"
            placeholder="midnight-iris"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
              Price (USD)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg placeholder:text-surface-variant bg-transparent outline-none transition-colors"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
              Initial Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              required
              className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg placeholder:text-surface-variant bg-transparent outline-none transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg placeholder:text-surface-variant bg-transparent outline-none transition-colors resize-none"
            placeholder="Enter olfactory notes and story..."
          />
        </div>

        <div className="flex justify-end gap-6 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 text-text-muted font-label-md uppercase tracking-widest hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" variant="default" size="lg">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}
