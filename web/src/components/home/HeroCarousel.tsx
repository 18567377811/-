"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRevealOnView, revealClass } from "@/hooks/useRevealOnView";
import type { HeroSlideView } from "@/types/commerce";

function Chevron({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          direction === "left"
            ? "M15 5.5 8.5 12 15 18.5"
            : "M9 5.5 15.5 12 9 18.5"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlideView[] }) {
  const t = useTranslations();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { ref: heroRef, visible: heroVisible } =
    useRevealOnView<HTMLElement>({ threshold: 0.2 });

  const len = slides.length;

  const go = useCallback(
    (next: number) => {
      if (len === 0) return;
      setIndex(((next % len) + len) % len);
    },
    [len],
  );

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, [slides]);

  useEffect(() => {
    if (paused || len === 0) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % len);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, len]);

  if (len === 0) return null;

  const current = slides[index] ?? slides[0];

  return (
    <section
      ref={heroRef}
      className="group/hero relative mx-auto w-full max-w-[1200px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        setPaused(false);
        if (start == null) return;
        const end = event.changedTouches[0]?.clientX;
        if (end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 42) return;
        go(index + (delta < 0 ? 1 : -1));
      }}
      onTouchCancel={() => {
        touchStartX.current = null;
        setPaused(false);
      }}
    >
      <div className="relative aspect-[4/3] w-full touch-pan-y sm:aspect-[16/7] lg:aspect-[21/8]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={i === 0 || i === index}
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b211c]/75 via-[#2b211c]/25 to-transparent" />
          </div>
        ))}

        <div
          key={current.id}
          className="absolute inset-x-0 bottom-0 z-10 px-[4%] pb-[7%] pt-[12%] sm:px-8 sm:pb-10 lg:px-12"
        >
          <p
            className={`${revealClass(heroVisible, "reveal")} text-[clamp(0.625rem,0.5rem+0.4vw,0.75rem)] tracking-[0.22em] text-white/75 uppercase`}
          >
            {t("brand.name")}
          </p>
          <h1
            className={`${revealClass(heroVisible, "reveal")} mt-[0.4em] max-w-[min(36rem,92%)] font-display text-[clamp(1.25rem,0.85rem+2.8vw,3rem)] leading-[1.22] text-white text-balance`}
          >
            {current.title}
          </h1>
          <p
            className={`${revealClass(heroVisible, "reveal-delay")} mt-[0.55em] max-w-[min(32rem,95%)] text-[clamp(0.78rem,0.68rem+0.55vw,1rem)] leading-relaxed text-white/85`}
          >
            {current.body}
          </p>
          <p
            className={`${revealClass(heroVisible, "reveal-delay")} mt-[0.7em] text-[clamp(0.7rem,0.62rem+0.35vw,0.875rem)] text-[#f0d2c4]`}
          >
            {t("home.limited")}
          </p>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-200 group-hover/hero:opacity-100 hover:bg-white/15 sm:left-4 sm:h-11 sm:w-11"
        >
          <Chevron direction="left" className="h-6 w-6 drop-shadow" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white opacity-0 transition-opacity duration-200 group-hover/hero:opacity-100 hover:bg-white/15 sm:right-4 sm:h-11 sm:w-11"
        >
          <Chevron direction="right" className="h-6 w-6 drop-shadow" />
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/45"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
