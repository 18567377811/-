import { getSiteUrl } from "@/lib/site-url";

type PayPalTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;

export function isPayPalConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET,
  );
}

export function getPayPalClientId() {
  const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!id) throw new Error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set");
  return id;
}

export function getPayPalApiBase() {
  const mode = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const clientId = getPayPalClientId();
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) throw new Error("PAYPAL_CLIENT_SECRET is not set");

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal token failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  cachedToken = {
    accessToken: data.access_token,
    // refresh 60s early
    expiresAt: Date.now() + Math.max(30, data.expires_in - 60) * 1000,
  };
  return cachedToken.accessToken;
}

export async function paypalFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${getPayPalApiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      `PayPal API ${path} failed: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`,
    );
  }

  return body as T;
}

export function centsToPayPalAmount(cents: number) {
  return (cents / 100).toFixed(2);
}

export function buildPayPalReturnUrls(locale: string, cancelPath: string) {
  const siteUrl = getSiteUrl();
  return {
    // Buyer returns here after approving on PayPal; we capture then go to success.
    return_url: `${siteUrl}/${locale}/checkout/paypal/return`,
    cancel_url: `${siteUrl}/${locale}${cancelPath}`,
  };
}

/** Verify webhook signature when PAYPAL_WEBHOOK_ID is configured. */
export async function verifyPayPalWebhook(options: {
  headers: Headers;
  rawBody: string;
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    // Without webhook id we still accept events in capture-primary setups,
    // but log so ops can tighten later.
    console.warn("[paypal] PAYPAL_WEBHOOK_ID unset — skipping signature check");
    return true;
  }

  const transmissionId = options.headers.get("paypal-transmission-id");
  const transmissionTime = options.headers.get("paypal-transmission-time");
  const certUrl = options.headers.get("paypal-cert-url");
  const authAlgo = options.headers.get("paypal-auth-algo");
  const transmissionSig = options.headers.get("paypal-transmission-sig");

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    return false;
  }

  let webhookEvent: unknown;
  try {
    webhookEvent = JSON.parse(options.rawBody) as unknown;
  } catch {
    return false;
  }

  const result = await paypalFetch<{ verification_status?: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    },
  );

  return result.verification_status === "SUCCESS";
}
