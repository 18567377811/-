/**
 * Icons for methods Stripe Checkout can present with our USD + dynamic PM setup.
 * Card brands + Apple Pay / Google Pay / Link (no Shop Pay / PayPal unless enabled).
 */
const PAYMENT_METHODS = [
  {
    id: "visa",
    label: "Visa",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <path
          fill="#fff"
          d="M20.2 21.2 22.4 10.8h2.7l-2.2 10.4h-2.7Zm12.3-10.1c-.5-.2-1.4-.4-2.5-.4-2.7 0-4.7 1.5-4.7 3.5 0 1.5 1.4 2.4 2.5 2.9 1.1.5 1.5.9 1.5 1.4 0 .7-.9 1.1-1.7 1.1-1.1 0-1.8-.2-2.7-.6l-.4-.2-.4 2.4c.7.3 2 .6 3.4.6 2.9 0 4.8-1.5 4.8-3.7 0-1.2-.7-2.2-2.4-3-1-.5-1.6-.9-1.6-1.4 0-.5.5-.9 1.7-.9 1 0 1.7.2 2.2.4l.3.1.4-2.2Zm7.1-.3h-2.1c-.6 0-1.1.2-1.4.9l-4.9 10.4h3.3l.7-1.9h4c.1.4.4 1.9.4 1.9h2.9L39.6 11.1Zm-3.9 6.7.6-1.7c0 .1 1.3-3.6 1.3-3.6l.1.4.7 3h-2.7ZM16.7 11.1l-3.1 8.3-.3-1.7c-.6-2-2.5-4.1-4.6-5.2l2.8 10.5h3.3l5-12H16.7Z"
        />
        <path fill="#F9A01B" d="M11.3 11.1H6.3l-.1.3c3.9 1 6.5 3.4 7.6 6.2l-1.1-5.4c-.2-.7-.7-.9-1.4-1.1Z" />
      </svg>
    ),
  },
  {
    id: "mastercard",
    label: "Mastercard",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#F5F5F5" />
        <circle cx="19" cy="16" r="8" fill="#EB001B" />
        <circle cx="29" cy="16" r="8" fill="#F79E1B" />
        <path
          fill="#FF5F00"
          d="M24 10.1a8 8 0 0 1 0 11.8 8 8 0 0 1 0-11.8Z"
        />
      </svg>
    ),
  },
  {
    id: "amex",
    label: "American Express",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#2E77BC" />
        <text
          x="24"
          y="19.5"
          textAnchor="middle"
          fill="#fff"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          AMEX
        </text>
      </svg>
    ),
  },
  {
    id: "unionpay",
    label: "UnionPay",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#fff" stroke="#E5E5E5" />
        <rect x="8" y="8" width="10" height="16" rx="1.5" fill="#D10429" />
        <rect x="19" y="8" width="10" height="16" rx="1.5" fill="#024C98" />
        <rect x="30" y="8" width="10" height="16" rx="1.5" fill="#067266" />
      </svg>
    ),
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#111" />
        <path
          fill="#fff"
          d="M18.2 12.2c0-1 .5-1.9 1.3-2.5-.6.1-1.4.5-1.8 1-.4.5-.8 1.3-.7 2 .7.1 1.4-.3 1.2-.5Zm1.9 1c-1.4 0-2.5.8-2.5.8s-.3-.9-1.3-.9c-.9 0-1.7.6-2.1 1.5-.9 1.6-.2 3.9.7 5.2.4.6.9 1.2 1.6 1.2.6 0 .9-.4 1.7-.4.8 0 1 .4 1.7.4.7 0 1.1-.6 1.5-1.1.5-.7.7-1.3.7-1.4-.1 0-1.3-.5-1.3-1.9 0-1.2.9-1.7.9-1.7s-.8-1.2-1.6-1.2Zm4.1 7.6V11.5h1.5v.7c.3-.4.9-.9 1.8-.9.5 0 1 .1 1.3.4l-.6 1.3c-.2-.2-.5-.3-.9-.3-.9 0-1.5.7-1.5 1.9v5.2h-1.6Zm6.1.2c-1.7 0-2.9-1.1-2.9-2.8 0-1.8 1.3-2.9 3-2.9.6 0 1.1.1 1.5.3v-.3c0-1-.6-1.5-1.6-1.5-.7 0-1.3.3-1.7.6l-.6-1.1c.6-.5 1.5-.8 2.5-.8 1.7 0 2.9 1 2.9 2.9v5.4h-1.4v-.6c-.4.4-1.1.8-2 .8Zm.4-1.3c1 0 1.7-.7 1.7-1.7v-.6c-.3-.2-.8-.4-1.4-.4-.8 0-1.5.5-1.5 1.4 0 .8.6 1.3 1.2 1.3Zm5.5 1.3c-1.1 0-1.9-.5-2.3-1.3l1.2-.7c.2.5.7.8 1.2.8.6 0 1-.3 1-.8 0-1.4-3.3-.5-3.3-2.7 0-1.1 1-2 2.4-2 1 0 1.8.4 2.2 1.1l-1.2.7c-.2-.4-.6-.6-1-.6-.5 0-.8.3-.8.6 0 1.3 3.3.4 3.3 2.7 0 1.3-1.1 2.1-2.7 2.1Z"
        />
      </svg>
    ),
  },
  {
    id: "google-pay",
    label: "Google Pay",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#fff" stroke="#E5E5E5" />
        <path fill="#4285F4" d="M22.2 16.3v-2.1h6.2c.1.5.1 1.1.1 1.6 0 2.1-.6 3.8-1.6 4.9-1.1 1.2-2.6 1.8-4.7 1.8-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9c2 0 3.5.8 4.6 1.8l-1.5 1.5c-.7-.7-1.8-1.3-3.1-1.3-2.5 0-4.5 2.1-4.5 4.9s2 4.9 4.5 4.9c1.6 0 2.6-.7 3.1-1.6.4-.6.6-1.4.7-2.5h-4.8Z" />
        <path fill="#3C4043" d="M30.2 20.8v-7.8h2v7.8h-2Zm5.7 0-3.7-7.8h2.2l2.2 4.9 2.2-4.9h2.1l-3.6 7.8h-1.4Z" />
      </svg>
    ),
  },
  {
    id: "link",
    label: "Link",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#00D66F" />
        <text
          x="24"
          y="19.5"
          textAnchor="middle"
          fill="#0A2540"
          fontSize="10"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          Link
        </text>
      </svg>
    ),
  },
] as const;

export function FooterPayments() {
  return (
    <ul className="flex flex-wrap items-center gap-1.5 sm:justify-end">
      {PAYMENT_METHODS.map((method) => (
        <li
          key={method.id}
          title={method.label}
          aria-label={method.label}
          className="inline-flex overflow-hidden rounded-md shadow-[0_1px_2px_rgba(43,33,28,0.06)] ring-1 ring-[color:var(--line)]"
        >
          {method.mark}
        </li>
      ))}
    </ul>
  );
}
