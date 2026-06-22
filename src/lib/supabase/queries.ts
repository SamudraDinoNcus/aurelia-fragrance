import { createClient } from "./server";
import type { Product, Category } from "@/types";

export const PAGE_SIZE = 12;

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return (data ?? []) as Category[];
}

export async function getProducts(opts?: {
  categorySlug?: string;
  q?: string;
  page?: number;
}): Promise<{ products: Product[]; total: number }> {
  const supabase = createClient();
  const page = opts?.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select("*, category:category_id(*)", { count: "exact" })
    .eq("is_active", true);

  if (opts?.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .single();
    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (opts?.q) {
    query = query.ilike("name", `%${opts.q}%`);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    products: (data ?? []) as Product[],
    total: count ?? 0,
  };
}

export async function getBestSellers(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:category_id(*)")
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function getLimitedEdition(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:category_id(*)")
    .eq("is_active", true)
    .eq("is_limited_edition", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function getGiftSets(): Promise<Product[]> {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "gift-sets")
    .single();
  if (!categories) return [];
  const { data } = await supabase
    .from("products")
    .select("*, category:category_id(*)")
    .eq("is_active", true)
    .eq("category_id", categories.id)
    .order("created_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:category_id(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as Product | null;
}
