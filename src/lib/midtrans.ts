const MIDTRANS_API_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/v1"
    : "https://app.sandbox.midtrans.com/snap/v1";

export async function createSnapToken(
  orderId: string,
  grossAmount: number,
  customerDetails: { email?: string; name?: string; phone?: string },
): Promise<string> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    throw new Error(
      "[Midtrans] MIDTRANS_SERVER_KEY not configured. Set it in .env.local",
    );
  }

  const response = await fetch(`${MIDTRANS_API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: customerDetails,
      credit_card: { secure: true },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `[Midtrans] Failed to create snap token: ${response.status} ${errorBody}`,
    );
  }

  const data = await response.json();
  return data.token;
}
