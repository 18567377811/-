"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GlobeIcon } from "./HeaderIcons";
import { RegionPicker } from "./RegionPicker";

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe6] text-ink ring-1 ring-[rgba(43,33,28,0.08)] transition hover:bg-blush/55"
        aria-label={t("openRegion")}
      >
        <GlobeIcon className="h-[1.15rem] w-[1.15rem]" />
      </button>
      <RegionPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
