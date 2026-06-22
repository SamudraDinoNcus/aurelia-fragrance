"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CheckoutInput {
  items: { slug: string; name: string; price: number; quantity: number }[];
  shippingAddress: {
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    province: string;
    postal_code: string;
  };
}

export async function createOrder(input: CheckoutInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to checkout" };
  }

  const subtotalAmount = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = 0;
  const totalAmount = subtotalAmount + shippingCost;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      subtotal_amount: subtotalAmount,
      shipping_cost: shippingCost,
      total_amount: totalAmount,
      shipping_address: input.shippingAddress,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("[Checkout] Order insert error:", orderError);
    return { error: "Failed to create order. Please try again." };
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_name: item.name,
    price_at_purchase: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("[Checkout] Order items insert error:", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "Failed to create order items. Please try again." };
  }

  revalidatePath("/checkout");
  revalidatePath(`/order/${order.id}`);

  return { orderId: order.id, totalAmount };
}
