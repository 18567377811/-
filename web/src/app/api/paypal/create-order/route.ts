import { NextResponse } from "next/server";
import { resolveCheckoutLines } from "@/lib/checkout-lines";
import {
  buildPayPalReturnUrls,
  centsToPayPalAmount,
  isPayPalConfigured,
  paypalFetch,
} from "@/lib/paypal";
import { routing, type AppLocale } from "@/i18n/routing";
import type { CartItem } from "@/types/commerce";

type Body = {
  items?: CartItem[];
  locale?: string;
  cancelPath?: string;
};

type PayPalCreateOrderResponse = {
  id: string;
  status?: string;
  links?: Array<{ href?: string; rel?: string; method?: string }>;
};

function normalizeCancelPath(value: unknown): string {
  if (typeof value !== "string") return "/cart";
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return "/cart";
  }
  return path;
}

function normalizeLocale(value: unknown): AppLocale {
  if (typeof value === "string" && routing.locales.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  return routing.defaultLocale;
}

export async function POST(request: Request) {
  try {
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal is not configured yet" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Body;
    const locale = normalizeLocale(body.locale);
    const cancelPath = normalizeCancelPath(body.cancelPath);
    const lines = await resolveCheckoutLines(body.items ?? []);
    const urls = buildPayPalReturnUrls(locale, cancelPath);

    const itemTotalCents = lines.reduce(
      (sum, line) => sum + line.unitAmountCents * line.quantity,
      0,
    );
    const itemTotal = centsToPayPalAmount(itemTotalCents);

    const order = await paypalFetch<PayPalCreateOrderResponse>(
      "/v2/checkout/orders",
      {
        method: "POST",
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: locale,
              description: "Feltora pet felt order",
              amount: {
                currency_code: "USD",
                value: itemTotal,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: itemTotal,
                  },
                },
              },
              items: lines.map((line) => ({
                name: line.name.slice(0, 127),
                description: line.variantLabel.slice(0, 127),
                sku: `${line.productId}:${line.variantId}`.slice(0, 127),
                unit_amount: {
                  currency_code: "USD",
                  value: centsToPayPalAmount(line.unitAmountCents),
                },
                quantity: String(line.quantity),
                category: "PHYSICAL_GOODS",
              })),
            },
          ],
          application_context: {
            brand_name: "Feltora",
            shipping_preference: "GET_FROM_FILE",
            user_action: "PAY_NOW",
            return_url: urls.return_url,
            cancel_url: urls.cancel_url,
          },
        }),
      },
    );

    if (!order.id) {
      return NextResponse.json(
        { error: "PayPal order missing id" },
        { status: 500 },
      );
    }

    const approveUrl = order.links?.find((link) => link.rel === "approve")?.href;
    if (!approveUrl) {
      return NextResponse.json(
        { error: "PayPal approve URL missing" },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: order.id, url: approveUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PayPal create order failed";
    const status =
      message === "Cart is empty" ||
      message === "Invalid cart item" ||
      message === "Unknown product or variant" ||
      message === "Custom products cannot be checked out directly" ||
      message === "NEXT_PUBLIC_SITE_URL is not set"
        ? 400
        : 500;
    console.error("[paypal/create-order]", error);
    return NextResponse.json({ error: message }, { status });
  }
}
