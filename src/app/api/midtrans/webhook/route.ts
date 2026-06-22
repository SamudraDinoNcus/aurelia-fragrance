import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string,
): boolean {
  const expected = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
  return expected === signatureKey;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id: orderId,
      transaction_status,
      fraud_status,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      payment_type,
      transaction_id,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("[Midtrans Webhook] MIDTRANS_SERVER_KEY not configured");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    if (
      !verifySignature(
        orderId,
        transaction_status,
        String(grossAmount),
        serverKey,
        signatureKey,
      )
    ) {
      console.error("[Midtrans Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = createAdminClient();

    let newStatus: string;
    if (transaction_status === "capture" || transaction_status === "settlement") {
      newStatus = fraud_status === "accept" ? "paid" : "failed";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      newStatus = "failed";
    } else {
      newStatus = "pending";
    }

    const updateData: Record<string, string | null> = {
      status: newStatus,
      midtrans_order_id: orderId,
    };

    if (newStatus === "paid") {
      (updateData as Record<string, string | null>)["paid_at"] = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("midtrans_order_id", orderId);

    if (updateError) {
      console.error("[Midtrans Webhook] Update error:", updateError);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Midtrans Webhook]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
