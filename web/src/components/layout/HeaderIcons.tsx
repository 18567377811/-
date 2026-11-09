type IconProps = {
  className?: string;
};

/** Cream-style outline icons — soft stroke, warm ink */
export function MenuIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.5 7.25h15M4.5 12h15M4.5 16.75h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GlobeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="8.25"
        stroke="currentColor"
        strokeWidth="1.55"
      />
      <path
        d="M3.75 12h16.5M12 3.75c2.4 2.55 3.6 5.25 3.6 8.25S14.4 17.7 12 20.25M12 3.75C9.6 6.3 8.4 9 8.4 12s1.2 5.7 3.6 8.25"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M7.25 8.25h12.2l-1.15 8.05a1.75 1.75 0 0 1-1.73 1.5H10.1a1.75 1.75 0 0 1-1.73-1.45L6.8 5.75H4.25"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.25" cy="19.35" r="1.05" fill="currentColor" />
      <circle cx="16.35" cy="19.35" r="1.05" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
