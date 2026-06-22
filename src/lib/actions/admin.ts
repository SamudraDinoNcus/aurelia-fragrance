"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function softDeleteProduct(productId: string) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  if (product?.images?.length) {
    const filesToDelete: string[] = [];
    for (const url of product.images) {
      const path = extractStoragePath(url);
      if (path) filesToDelete.push(path);
    }
    if (filesToDelete.length > 0) {
      await supabase.storage.from("product-images").remove(filesToDelete);
    }
  }

  const { error } = await supabase
    .from("products")
    .update({ is_active: false, images: [] })
    .eq("id", productId);

  if (error) {
    console.error("[Admin] Soft delete error:", error);
    return { error: "Failed to delete product" };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

function extractStoragePath(publicUrl: string): string | null {
  const storageBase = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`
    : "";
  if (storageBase && publicUrl.startsWith(storageBase)) {
    return publicUrl.slice(storageBase.length);
  }
  return null;
}

export async function updateOrderTracking(
  orderId: string,
  data: { courier: string; tracking_number: string },
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      courier: data.courier,
      tracking_number: data.tracking_number,
      status: "shipped",
    })
    .eq("id", orderId);

  if (error) {
    console.error("[Admin] Tracking update error:", error);
    return { error: "Failed to update tracking" };
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<{ url?: string; error?: string }> {
  const supabase = createClient();

  const bucket = "product-images";
  const filePath = `${productId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("[Admin] Upload error:", uploadError);
    return { error: "Failed to upload image" };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  const publicUrl = urlData?.publicUrl;
  if (!publicUrl) {
    return { error: "Failed to get public URL" };
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ images: [publicUrl] })
    .eq("id", productId);

  if (updateError) {
    console.error("[Admin] Image URL update error:", updateError);
    return { error: "Failed to update product with image URL" };
  }

  revalidatePath(`/admin/products`);
  return { url: publicUrl };
}
