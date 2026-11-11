type SocialItem = {
  id: string;
  label: string;
  href: string;
  enabled?: boolean;
};

const PATHS: Record<string, string> = {
  facebook:
    "M14 8.5h2.2V6.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V12H7v2.7h2.2V22h2.9v-7.3H15l.4-2.7h-2.9V10.7c0-.8.2-1.4 1.5-1.4Z",
  instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 1.7a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6Zm4.7-2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  youtube:
    "M22.5 7.7a2.8 2.8 0 0 0-2-2C18.7 5.3 12 5.3 12 5.3s-6.7 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.1 12a29 29 0 0 0 .4 4.3 2.8 2.8 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22.9 12a29 29 0 0 0-.4-4.3ZM10 15.1V8.9l5.5 3.1L10 15.1Z",
  tiktok:
    "M18.6 8.1a5.8 5.8 0 0 1-3.5-1.2v7.1a5.1 5.1 0 1 1-5.1-5.1c.3 0 .6 0 .9.1v2.5a2.6 2.6 0 1 0 1.8 2.5V2.5h2.4a5.8 5.8 0 0 0 3.5 3.4v2.2Z",
};

export function FooterSocial({ links }: { links?: SocialItem[] }) {
  const items = (links ?? []).filter(
    (item) => item.enabled !== false && item.href,
  );

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink-soft ring-1 ring-[color:var(--line)] transition hover:bg-white hover:text-accent"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
              <path d={PATHS[item.id] || PATHS.instagram} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
