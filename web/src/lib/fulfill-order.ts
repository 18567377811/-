import type Stripe from "stripe";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isSessionPaid } from "@/lib/stripe";

export type FulfillOrderInput = {
  paymentProvider: "stripe" | "paypal";
  stripeSessionId?: string | null;
  paypalOrderId?: string | null;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  customerName: string | null;
  shippingJson: string | null;
  itemsJson: string;
  locale: string | null;
  invoiceId?: string | null;
};

/**
 * Post-payment fulfillment entry point.
 * Drive all side effects from webhooks / server capture — never only from the success page.
 */
export async function fulfillPaidOrder(input: FulfillOrderInput) {
  if (input.paymentProvider === "stripe" && input.stripeSessionId) {
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: input.stripeSessionId },
    });
    if (existing) {
      console.info("[fulfill] already recorded", {
        provider: "stripe",
        sessionId: input.stripeSessionId,
      });
      return { fulfilled: true as const, orderId: existing.id };
    }
  }

  if (input.paymentProvider === "paypal" && input.paypalOrderId) {
    const existing = await prisma.order.findUnique({
      where: { paypalOrderId: input.paypalOrderId },
    });
    if (existing) {
      console.info("[fulfill] already recorded", {
        provider: "paypal",
        orderId: input.paypalOrderId,
      });
      return { fulfilled: true as const, orderId: existing.id };
    }
  }

  const order = await prisma.order.create({
    data: {
      paymentProvider: input.paymentProvider,
      stripeSessionId: input.stripeSessionId ?? null,
      paypalOrderId: input.paypalOrderId ?? null,
      amountTotal: input.amountTotal,
      currency: input.currency,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      shippingJson: input.shippingJson,
      itemsJson: input.itemsJson,
      locale: input.locale,
      invoiceId: input.invoiceId ?? null,
      status: OrderStatus.awaiting_photos,
    },
  });

  console.info("[fulfill] order saved", {
    orderId: order.id,
    provider: input.paymentProvider,
    stripeSessionId: input.stripeSessionId,
    paypalOrderId: input.paypalOrderId,
  });

  return { fulfilled: true as const, orderId: order.id };
}

export async function fulfillPaidCheckout(session: Stripe.Checkout.Session) {
  if (!isSessionPaid(session)) {
    console.info("[fulfill] skip unpaid session", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
    return { fulfilled: false as const };
  }

  const shipping = session.collected_information?.shipping_details ?? null;
  return fulfillPaidOrder({
    paymentProvider: "stripe",
    stripeSessionId: session.id,
    amountTotal: session.amount_total,
    currency: session.currency,
    customerEmail:
      session.customer_details?.email ?? session.customer_email ?? null,
    customerName: session.customer_details?.name ?? null,
    shippingJson: shipping ? JSON.stringify(shipping) : null,
    itemsJson: session.metadata?.items ?? "[]",
    locale: session.metadata?.locale ?? null,
    invoiceId:
      typeof session.invoice === "string"
        ? session.invoice
        : (session.invoice?.id ?? null),
  });
}

type PayPalMoney = { currency_code?: string; value?: string };
type PayPalItem = {
  name?: string;
  quantity?: string;
  sku?: string;
  unit_amount?: PayPalMoney;
};
type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: PayPalMoney;
};
type PayPalShipping = {
  name?: { full_name?: string };
  address?: Record<string, string | undefined>;
};
type PayPalPurchaseUnit = {
  custom_id?: string;
  items?: PayPalItem[];
  shipping?: PayPalShipping;
  payments?: { captures?: PayPalCapture[] };
  amount?: PayPalMoney;
};
type PayPalPayer = {
  email_address?: string;
  name?: { given_name?: string; surname?: string };
};
export type PayPalCapturedOrder = {
  id: string;
  status?: string;
  purchase_units?: PayPalPurchaseUnit[];
  payer?: PayPalPayer;
};

function parseSku(sku?: string) {
  if (!sku) return null;
  const [productId, variantId] = sku.split(":");
  if (!productId || !variantId) return null;
  return { productId, variantId };
}

function dollarsToCents(value?: string) {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export async function fulfillPayPalCapturedOrder(order: PayPalCapturedOrder) {
  const unit = order.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const captureStatus = (capture?.status || "").toUpperCase();
  if (captureStatus && captureStatus !== "COMPLETED") {
    console.info("[fulfill] skip paypal capture not completed", {
      orderId: order.id,
      captureStatus,
    });
    return { fulfilled: false as const };
  }

  const items =
    unit?.items
      ?.map((item) => {
        const ids = parseSku(item.sku);
        if (!ids) return null;
        const quantity = Number.parseInt(item.quantity || "1", 10);
        return {
          productId: ids.productId,
          variantId: ids.variantId,
          quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        };
      })
      .filter(Boolean) ?? [];

  const payerName = [order.payer?.name?.given_name, order.payer?.name?.surname]
    .filter(Boolean)
    .join(" ")
    .trim();

  const amount =
    dollarsToCents(capture?.amount?.value) ??
    dollarsToCents(unit?.amount?.value);

  return fulfillPaidOrder({
    paymentProvider: "paypal",
    paypalOrderId: order.id,
    amountTotal: amount,
    currency: (capture?.amount?.currency_code || unit?.amount?.currency_code || "USD").toLowerCase(),
    customerEmail: order.payer?.email_address ?? null,
    customerName: payerName || unit?.shipping?.name?.full_name || null,
    shippingJson: unit?.shipping ? JSON.stringify(unit.shipping) : null,
    itemsJson: JSON.stringify(items),
    locale: unit?.custom_id || null,
    invoiceId: capture?.id ?? null,
  });
}
