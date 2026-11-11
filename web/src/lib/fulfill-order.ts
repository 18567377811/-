import type Stripe from "stripe";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isSessionPaid } from "@/lib/stripe";

/**
 * Post-payment fulfillment entry point.
 * Drive all side effects from webhooks — never only from the success page.
 */
export async function fulfillPaidCheckout(session: Stripe.Checkout.Session) {
  if (!isSessionPaid(session)) {
    console.info("[fulfill] skip unpaid session", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
    return { fulfilled: false as const };
  }

  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) {
    console.info("[fulfill] already recorded", { sessionId: session.id });
    return { fulfilled: true as const, orderId: existing.id };
  }

  const shipping = session.collected_information?.shipping_details ?? null;
  const order = await prisma.order.create({
    data: {
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
      status: OrderStatus.awaiting_photos,
    },
  });

  console.info("[fulfill] order saved", {
    orderId: order.id,
    sessionId: session.id,
  });

  return { fulfilled: true as const, orderId: order.id };
}
