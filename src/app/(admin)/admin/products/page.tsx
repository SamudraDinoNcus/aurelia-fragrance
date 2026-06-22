import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";

async function getProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:category_id(name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <nav className="flex gap-2 text-text-muted font-label-sm mb-4">
            <span>Admin</span>
            <span>/</span>
            <span className="text-primary">Products</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg tracking-tight text-primary">
            Product Management
          </h2>
          <p className="text-text-muted font-body-md mt-2">
            {products.length} active products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-on-primary px-10 py-4 font-label-md tracking-widest uppercase hover:bg-accent-gold transition-colors duration-300 inline-flex items-center gap-2"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white border border-outline-variant">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-neutral">
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider text-right">
                Price
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider text-center">
                Stock
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center font-body-md text-body-md text-text-muted">
                  No active products.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-surface-bright transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="font-headline-md text-body-lg text-primary">
                    {product.name}
                  </span>
                  <span className="block text-text-muted text-caption mt-0.5">
                    /{product.slug}
                  </span>
                </td>
                <td className="px-6 py-4 font-label-sm text-text-muted">
                  {(product.category as { name?: string } | null)?.name ?? "-"}
                </td>
                <td className="px-6 py-4 font-label-md text-primary text-right">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-2 py-1 font-label-sm ${
                      product.stock <= 5
                        ? "bg-error-container text-on-error-container"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-text-muted hover:text-accent-gold transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <DeleteButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-8 py-6 flex justify-between items-center bg-surface-bright border-t border-outline-variant">
          <span className="text-caption text-text-muted uppercase tracking-widest">
            Showing {products.length} product{products.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
