import type Stripe from "stripe";
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

  // Idempotency: later persist by session.id and no-op if already recorded.
  console.info("[fulfill] commission paid", {
    sessionId: session.id,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
    customerEmail: session.customer_details?.email ?? session.customer_email,
    customerName: session.customer_details?.name,
    shipping: session.collected_information?.shipping_details,
    locale: session.metadata?.locale,
    items: session.metadata?.items,
    invoiceId:
      typeof session.invoice === "string" ? session.invoice : session.invoice?.id,
  });

  // Next: write order row (status: awaiting_photos) + email photo-upload link.
  return { fulfilled: true as const };
}
