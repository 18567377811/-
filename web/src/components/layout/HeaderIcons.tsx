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

/** Soft cream-style back chevron for secondary pages */
export function BackIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M14.75 5.75 8.5 12l6.25 6.25"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
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

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="11"
        cy="11"
        r="6.25"
        stroke="currentColor"
        strokeWidth="1.55"
      />
      <path
        d="M16.2 16.2 20 20"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FiltersIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7.5h14M8 12h8M10.5 16.5h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.6 14.5 9l5.9.5-4.5 3.8 1.4 5.7L12 16.7 6.7 19l1.4-5.7L3.6 9.5 9.5 9 12 3.6Z"
      />
    </svg>
  );
}

export function ChevronIcon({
  className = "h-4 w-4",
  direction = "down",
}: IconProps & { direction?: "up" | "down" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{
        transform: direction === "up" ? "rotate(180deg)" : undefined,
      }}
    >
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
