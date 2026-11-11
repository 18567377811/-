type IconProps = { className?: string };

export function IconClose({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M9 4h6a1 1 0 0 1 1 1v2H8V5a1 1 0 0 1 1-1Z" />
      <path d="M6.5 7 7.6 19.1A1.8 1.8 0 0 0 9.4 20.7h5.2a1.8 1.8 0 0 0 1.8-1.6L17.5 7" />
      <path d="M10 11v5.5M14 11v5.5" />
    </svg>
  );
}

export function IconChevronUp({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m7.5 14 4.5-4.5L16.5 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m7.5 10 4.5 4.5L16.5 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCategories({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconProducts({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 8.5 12 4.5l7.5 4v7l-7.5 4-7.5-4v-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 12.5v7M4.5 8.5 12 12.5 19.5 8.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconHero({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9" cy="10.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m7.5 16.5 3.2-3.2a1.2 1.2 0 0 1 1.6 0L15 15.5l1.2-1.2a1.2 1.2 0 0 1 1.6 0l1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconOrders({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 5.5h10a2 2 0 0 1 2 2v11l-3-1.5-3 1.5-3-1.5-3 1.5v-11a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 9.5h6M9 12.5h6M9 15.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconSettings({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.8v1.8M12 18.4v1.8M4.9 7.1l1.3 1.3M17.8 15.6l1.3 1.3M3.8 12h1.8M18.4 12h1.8M4.9 16.9l1.3-1.3M17.8 8.4l1.3-1.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLogout({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 5.5H7.5A2.5 2.5 0 0 0 5 8v8a2.5 2.5 0 0 0 2.5 2.5H10M14 8.5 17.5 12 14 15.5M10 12h7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconUpload({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.5V6.5M12 6.5 8.5 10M12 6.5 15.5 10M5.5 15.5v1.5A2.5 2.5 0 0 0 8 19.5h8a2.5 2.5 0 0 0 2.5-2.5v-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 6.5 5.5 5.5L9 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBold({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7V5Zm0 7h7a3.5 3.5 0 0 1 0 7H7v-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconItalic({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.5 5H10M13.5 19H9M14 5l-4 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconUnderline({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 5v6.5a5 5 0 0 0 10 0V5M6.5 19h11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconList({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 7h10M9 12h10M9 17h10M5.2 7h.01M5.2 12h.01M5.2 17h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconOrderedList({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 7h9M10 12h9M10 17h9M5 6.5v4M5 6.5h1.4M4.5 17h2.2M5.5 14.8v.2c0 .8.6 1.3 1.2 1.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconLink({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9.5 14.5 8 16a3.5 3.5 0 0 1-5-5l1.8-1.8a3.5 3.5 0 0 1 4.6-.2M14.5 9.5 16 8a3.5 3.5 0 0 1 5 5l-1.8 1.8a3.5 3.5 0 0 1-4.6.2M9 15l6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHeading({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 5v14M18 5v14M6 12h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconImage({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m7 17 3.5-3.5 2.5 2.5L16 12.5 19 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
