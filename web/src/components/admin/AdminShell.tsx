"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconCategories,
  IconHero,
  IconLogout,
  IconOrders,
  IconProducts,
  IconSettings,
} from "@/components/admin/icons";
import { adminToast } from "@/components/admin/toast";

const NAV = [
  { href: "/admin/categories", label: "分类", Icon: IconCategories },
  { href: "/admin/products", label: "商品", Icon: IconProducts },
  { href: "/admin/hero", label: "轮播", Icon: IconHero },
  { href: "/admin/orders", label: "订单", Icon: IconOrders },
  { href: "/admin/settings", label: "配置", Icon: IconSettings },
] as const;

export function AdminShell({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/auth/me");
      if (!res.ok) {
        router.replace("/admin/login");
        return;
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    adminToast.success("已退出登录");
    router.replace("/admin/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--ios-secondary)]">
        加载中…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl">
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-[var(--ios-separator)] bg-white/70 px-3 py-5 backdrop-blur-xl md:flex">
        <div className="px-3 pb-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--ios-secondary)] uppercase">
            Feltora
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">管理后台</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-press flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[15px] font-medium ${
                  active
                    ? "bg-[rgba(0,122,255,0.12)] text-[var(--ios-blue)]"
                    : "text-[var(--ios-label)] hover:bg-[var(--ios-fill)]"
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="admin-btn admin-btn-secondary mt-4 w-full"
        >
          <IconLogout className="h-4 w-4" />
          退出登录
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-[calc(4.75rem+var(--ios-safe-bottom))] md:pb-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--ios-separator)] bg-[rgba(242,242,247,0.86)] px-4 py-3 backdrop-blur-xl sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--ios-secondary)] uppercase md:hidden">
              Feltora Admin
            </p>
            <h2 className="text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--ios-label)] sm:text-[1.65rem]">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">{action}</div>
        </header>

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--ios-separator)] bg-[rgba(255,255,255,0.92)] px-1 pt-1 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "var(--ios-safe-bottom)" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-press flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  active
                    ? "text-[var(--ios-blue)]"
                    : "text-[var(--ios-secondary)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
