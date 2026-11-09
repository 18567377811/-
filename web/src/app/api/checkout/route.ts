import { NextResponse } from "next/server";
import { resolveCheckoutLines } from "@/lib/checkout-lines";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { routing, type AppLocale } from "@/i18n/routing";
import type { CartItem } from "@/types/commerce";

type CheckoutBody = {
  items?: CartItem[];
  locale?: string;
};

function normalizeLocale(value: unknown): AppLocale {
  if (typeof value === "string" && routing.locales.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  return routing.defaultLocale;
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured yet" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as CheckoutBody;
    const locale = normalizeLocale(body.locale);
    const lines = resolveCheckoutLines(body.items ?? []);
    const siteUrl = getSiteUrl();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      // Omit payment_method_types → Dashboard dynamic payment methods
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "NZ",
          "SG",
          "MY",
          "JP",
          "KR",
          "HK",
          "TW",
          "DE",
          "FR",
          "NL",
          "SE",
          "CH",
        ],
      },
      phone_number_collection: { enabled: true },
      // One-time Checkout + Invoice PDF for the customer / your bookkeeping
      invoice_creation: { enabled: true },
      customer_creation: "always",
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: line.unitAmountCents,
          product_data: {
            name: line.name,
            description: line.variantLabel,
            images: line.image ? [line.image] : undefined,
            metadata: {
              productId: line.productId,
              variantId: line.variantId,
            },
          },
        },
      })),
      success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/cart`,
      metadata: {
        locale,
        business: "feltora",
        items: JSON.stringify(
          lines.map((line) => ({
            productId: line.productId,
            variantId: line.variantId,
            quantity: line.quantity,
          })),
        ),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session missing redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    const status =
      message === "Cart is empty" ||
      message === "Invalid cart item" ||
      message === "Unknown product or variant"
        ? 400
        : 500;
    console.error("[checkout]", error);
    return NextResponse.json({ error: message }, { status });
  }
}
