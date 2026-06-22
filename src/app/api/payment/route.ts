import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSnapToken } from "@/lib/midtrans";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, profile:user_id(id, full_name, phone)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 },
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Order is not in pending status" },
        { status: 400 },
      );
    }

    const snapToken = await createSnapToken(
      orderId,
      order.total_amount,
      {
        email: (order.profile as { email?: string } | null)?.email ?? undefined,
        name: (order.profile as { full_name?: string } | null)?.full_name ?? undefined,
        phone: (order.profile as { phone?: string } | null)?.phone ?? undefined,
      },
    );

    return NextResponse.json({ snapToken });
  } catch (error) {
    console.error("[Payment API]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
