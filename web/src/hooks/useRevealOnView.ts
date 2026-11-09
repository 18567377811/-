"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Portion of element that must be visible (0–1) */
  threshold?: number;
  /** Shrink/expand root box, e.g. "0px 0px -10% 0px" */
  rootMargin?: string;
};

/**
 * Fires once when the element first intersects the viewport.
 * Use with animation classes like `cat-enter` / `list-card` / `reveal`.
 */
export function useRevealOnView<T extends HTMLElement = HTMLElement>(
  options: Options = {},
) {
  const { threshold = 0.18, rootMargin = "0px 0px -6% 0px" } = options;
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, threshold, rootMargin]);

  return { ref, visible };
}

export function revealClass(visible: boolean, animationClass: string) {
  return visible ? animationClass : "opacity-0";
}
