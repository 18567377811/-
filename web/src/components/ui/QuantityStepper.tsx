"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
  id?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  label,
  id = "qty",
}: Props) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commit(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = clamp(parsed, min, max);
    setDraft(String(next));
    if (next !== value) onChange(next);
  }

  return (
    <div className="inline-flex items-center gap-2">
      {label ? (
        <label htmlFor={id} className="text-sm text-ink-soft">
          {label}
        </label>
      ) : null}
      <div className="inline-flex h-10 items-stretch overflow-hidden rounded-full border border-line bg-[color-mix(in_oklab,var(--blush)_28%,white)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1, min, max))}
          className="flex w-10 items-center justify-center text-lg font-medium text-accent-deep transition hover:bg-white/55 disabled:cursor-not-allowed disabled:opacity-35"
        >
          −
        </button>
        <input
          id={id}
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(event) => {
            const next = event.target.value.replace(/[^\d]/g, "");
            setDraft(next);
          }}
          onBlur={() => commit(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className="w-11 border-x border-line bg-white/70 text-center text-sm font-semibold text-ink outline-none focus:bg-white"
          aria-label={label ?? "Quantity"}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1, min, max))}
          className="flex w-10 items-center justify-center text-lg font-medium text-accent-deep transition hover:bg-white/55 disabled:cursor-not-allowed disabled:opacity-35"
        >
          +
        </button>
      </div>
    </div>
  );
}
