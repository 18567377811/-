import { NextResponse } from "next/server";
import {
  fulfillPayPalCapturedOrder,
  type PayPalCapturedOrder,
} from "@/lib/fulfill-order";
import { isPayPalConfigured, paypalFetch, verifyPayPalWebhook } from "@/lib/paypal";

type PayPalWebhookEvent = {
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    supplementary_data?: {
      related_ids?: { order_id?: string };
    };
  };
};

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured yet" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const ok = await verifyPayPalWebhook({
    headers: request.headers,
    rawBody,
  });
  if (!ok) {
    console.error("[paypal] webhook signature invalid");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: PayPalWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PayPalWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId =
        event.resource?.supplementary_data?.related_ids?.order_id || null;
      if (orderId) {
        const order = await paypalFetch<PayPalCapturedOrder>(
          `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
        );
        await fulfillPayPalCapturedOrder(order);
      } else {
        console.warn("[paypal] capture completed without order_id", {
          captureId: event.resource?.id,
        });
      }
    }
  } catch (error) {
    console.error("[paypal] webhook handler failed", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
