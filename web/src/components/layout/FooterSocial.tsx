import {
  SOCIAL_ICON_PATHS,
  activeSocialLinks,
  type SocialItem,
} from "@/components/layout/social-data";

export type { SocialItem };

export function FooterSocial({ links }: { links?: SocialItem[] }) {
  const items = activeSocialLinks(links);

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
              <path d={SOCIAL_ICON_PATHS[item.id] || SOCIAL_ICON_PATHS.instagram} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
