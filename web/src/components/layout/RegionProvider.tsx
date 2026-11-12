"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocale } from "next-intl";
import { formatMoney } from "@/lib/money";
import {
  DEFAULT_REGIONS,
  REGION_STORAGE_KEY,
  defaultRegionIdForLocale,
  enabledRegions,
  findRegion,
  type RegionConfig,
} from "@/lib/regions-config";

type RegionContextValue = {
  regions: RegionConfig[];
  region: RegionConfig;
  setRegionId: (id: string) => void;
  formatPrice: (amountUsd: number) => string;
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({
  regions: initialRegions,
  children,
}: {
  regions?: RegionConfig[];
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const regions = useMemo(
    () => enabledRegions(initialRegions?.length ? initialRegions : DEFAULT_REGIONS),
    [initialRegions],
  );
  const [regionId, setRegionIdState] = useState(() =>
    defaultRegionIdForLocale(locale, regions),
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(REGION_STORAGE_KEY);
      if (saved && regions.some((r) => r.id === saved)) {
        setRegionIdState(saved);
        return;
      }
    } catch {
      /* ignore */
    }
    setRegionIdState(defaultRegionIdForLocale(locale, regions));
  }, [locale, regions]);

  const setRegionId = useCallback((id: string) => {
    setRegionIdState(id);
    try {
      window.localStorage.setItem(REGION_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const region = findRegion(regionId, regions);

  const value = useMemo<RegionContextValue>(
    () => ({
      regions,
      region,
      setRegionId,
      formatPrice: (amountUsd: number) => formatMoney(amountUsd, region),
    }),
    [regions, region, setRegionId],
  );

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    // 兜底：无 Provider 时按当前默认英语区
    const region = DEFAULT_REGIONS[1];
    return {
      regions: DEFAULT_REGIONS,
      region,
      setRegionId: () => undefined,
      formatPrice: (amountUsd: number) => formatMoney(amountUsd, region),
    };
  }
  return ctx;
}
