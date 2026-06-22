"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/image-upload";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          price: String(data.price ?? ""),
          stock: String(data.stock ?? ""),
          description: data.description ?? "",
        });
        setLoading(false);
      });
  }, [params.id, supabase]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: form.name,
          slug: form.slug,
          price: parseFloat(form.price) || 0,
          stock: parseInt(form.stock, 10) || 0,
          description: form.description,
        })
        .eq("id", params.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    },
    [form, params.id, router, supabase],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-body-md text-body-md text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <nav className="flex gap-2 text-text-muted font-label-sm mb-4">
          <span>Admin</span>
          <span>/</span>
          <a href="/admin/products" className="hover:text-primary transition-colors">Products</a>
          <span>/</span>
          <span className="text-primary">Edit</span>
        </nav>
        <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
          Edit Product
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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg bg-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
            Slug
          </label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg bg-transparent outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
              Price (USD)
            </label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg bg-transparent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
              Stock
            </label>
            <input
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              type="number"
              min="0"
              required
              className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg bg-transparent outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-text-muted uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border-0 border-b border-outline-variant focus:border-accent-gold focus:ring-0 py-2 px-0 text-body-lg bg-transparent outline-none transition-colors resize-none"
          />
        </div>

        <div className="border-t border-outline-variant pt-8">
          <ImageUpload
            productId={params.id}
            onUploaded={(url) => console.log("Image uploaded:", url)}
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
