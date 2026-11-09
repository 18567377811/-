"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { heroSlides } from "@/data/home";
import { useRevealOnView, revealClass } from "@/hooks/useRevealOnView";

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

export function HeroCarousel() {
  const t = useTranslations();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { ref: heroRef, visible: heroVisible } =
    useRevealOnView<HTMLElement>({ threshold: 0.2 });

  const go = useCallback((next: number) => {
    const len = heroSlides.length;
    setIndex(((next % len) + len) % len);
  }, []);

  // Preload all slide images so fades stay smooth
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      ref={heroRef}
      className="group/hero relative w-full overflow-hidden"
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
        {heroSlides.map((slide, i) => (
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
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b211c]/75 via-[#2b211c]/25 to-transparent" />
          </div>
        ))}

        <div
          key={heroSlides[index].id}
          className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 pt-16 sm:px-8 sm:pb-10 lg:px-12"
        >
          <p
            className={`${revealClass(heroVisible, "reveal")} text-[10px] tracking-[0.22em] text-white/75 uppercase sm:text-xs`}
          >
            {t("brand.name")}
          </p>
          <h1
            className={`${revealClass(heroVisible, "reveal")} mt-2 max-w-xl font-display text-3xl leading-tight text-white sm:text-5xl`}
          >
            {t(heroSlides[index].titleKey)}
          </h1>
          <p
            className={`${revealClass(heroVisible, "reveal-delay")} mt-2 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base`}
          >
            {t(heroSlides[index].bodyKey)}
          </p>
          <p
            className={`${revealClass(heroVisible, "reveal-delay")} mt-3 text-xs text-[#f0d2c4] sm:text-sm`}
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
        {heroSlides.map((slide, i) => (
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
