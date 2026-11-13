import { NextResponse } from "next/server";
import {
  fulfillPayPalCapturedOrder,
  type PayPalCapturedOrder,
} from "@/lib/fulfill-order";
import { isPayPalConfigured, paypalFetch } from "@/lib/paypal";

type Body = {
  orderID?: string;
};

export async function POST(request: Request) {
  try {
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal is not configured yet" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Body;
    const orderID = typeof body.orderID === "string" ? body.orderID.trim() : "";
    if (!orderID) {
      return NextResponse.json({ error: "orderID is required" }, { status: 400 });
    }

    const captured = await paypalFetch<PayPalCapturedOrder>(
      `/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
      { method: "POST", body: "{}" },
    );

    const result = await fulfillPayPalCapturedOrder(captured);
    if (!result.fulfilled) {
      return NextResponse.json(
        { error: "Payment not completed", orderID },
        { status: 402 },
      );
    }

    return NextResponse.json({
      orderID: captured.id,
      localOrderId: result.orderId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PayPal capture failed";
    console.error("[paypal/capture-order]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
