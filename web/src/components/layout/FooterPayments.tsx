/**
 * Icons for methods buyers commonly use via PayPal Checkout (wallet + cards).
 */
const PAYMENT_METHODS = [
  {
    id: "paypal",
    label: "PayPal",
    mark: (
      <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden>
        <rect width="48" height="32" rx="4" fill="#fff" stroke="#E5E5E5" />
        <path
          fill="#003087"
          d="M18.4 8.2h6.2c2.6 0 4.1 1.3 3.8 3.7-.4 2.8-2.3 4.4-5 4.4h-2.3l-.9 4.8h-2.5l2.7-13Z"
        />
        <path
          fill="#009CDE"
          d="M20.2 10.1h4.6c1.5 0 2.5.7 2.3 2.2-.3 1.8-1.5 2.8-3.3 2.8h-1.8l-.8 4.1h-1.8l2.8-9.1Z"
        />
        <path
          fill="#012169"
          d="M14.2 8.2h2.6l-2.7 13H11.6l.6-3.1c-.8.9-2 1.4-3.4 1.4-2.1 0-3.5-1.6-2.9-4 .6-2.5 2.7-4 5.1-4 .8 0 1.6.2 2.3.6l.9-3.9Zm-3.2 8.4c.9 0 1.7-.6 2-1.5.3-1.1-.2-1.8-1.2-1.8-.9 0-1.7.6-2 1.5-.3 1.1.2 1.8 1.2 1.8Z"
        />
      </svg>
    ),
  },
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
