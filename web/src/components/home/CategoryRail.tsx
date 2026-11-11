"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRevealOnView, revealClass } from "@/hooks/useRevealOnView";
import type { CategoryEntry } from "@/types/commerce";

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 5.5 15.5 12 9 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoryTile({
  entry,
  index,
}: {
  entry: CategoryEntry;
  index: number;
}) {
  const { ref, visible } = useRevealOnView<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={entry.href}
      className={`group relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-paper ring-1 ring-[color:var(--line)] sm:aspect-[2.2/1] sm:rounded-2xl lg:aspect-[2.6/1] lg:min-h-[220px] lg:rounded-[1.4rem] ${revealClass(visible, "cat-enter")}`}
      style={visible ? { animationDelay: `${index * 120}ms` } : undefined}
    >
      <Image
        src={entry.image}
        alt={entry.name}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 50vw, 560px"
      />

      <div className="absolute inset-0 bg-[#2b211c]/0 backdrop-blur-0 transition-all duration-350 ease-out group-hover:bg-[#2b211c]/22 group-hover:backdrop-blur-[3px]" />

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 lg:p-6">
        <p className="text-[13px] font-semibold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] transition duration-300 ease-out group-hover:-translate-y-0.5 sm:text-lg lg:text-xl">
          {entry.name}
        </p>
        <p className="mt-0 max-h-0 overflow-hidden text-[11px] leading-snug text-white/95 opacity-0 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)] transition-all duration-350 ease-out group-hover:mt-1.5 group-hover:max-h-12 group-hover:opacity-100 sm:text-sm">
          {entry.hint}
        </p>
      </div>
    </Link>
  );
}

export function CategoryRail({
  categories,
}: {
  categories: CategoryEntry[];
}) {
  const t = useTranslations();

  return (
    <section className="mt-6 px-4 sm:mt-8 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-6">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.18em] text-accent uppercase">
            {t("home.categoryEyebrow")}
          </p>
          <h2 className="font-display text-xl text-ink sm:text-2xl">
            {t("home.categoryTitle")}
          </h2>
        </div>

        <Link
          href="/collections"
          aria-label={t("home.categoryTitle")}
          className="inline-flex items-center justify-center p-1 text-ink-soft transition-colors hover:text-accent"
        >
          <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </Link>
      </div>

      <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-4 lg:gap-5">
        {categories.map((entry, index) => (
          <CategoryTile key={entry.slug} entry={entry} index={index} />
        ))}
      </div>
    </section>
  );
}
