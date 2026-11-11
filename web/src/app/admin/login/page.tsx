"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminToast } from "@/components/admin/toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "登录失败");
      }
      adminToast.success("登录成功");
      router.replace("/admin/categories");
    } catch (err) {
      const message = err instanceof Error ? err.message : "登录失败";
      setError(message);
      adminToast.error(message);
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,122,255,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(52,199,89,0.16),transparent_40%),linear-gradient(180deg,#eef2f8,#f2f2f7)]" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-sm rounded-[1.75rem] border border-white/50 bg-white/55 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-8"
      >
        <p className="text-center text-xs font-semibold tracking-[0.18em] text-[var(--ios-secondary)] uppercase">
          Feltora
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">
          管理后台登录
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--ios-secondary)]">
          输入管理员密码继续
        </p>

        <label className="mt-8 block">
          <span className="admin-label">密码</span>
          <input
            type="password"
            className="admin-input"
            value={password}
            autoFocus
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-[var(--ios-red)]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !password}
          className="admin-btn admin-btn-primary mt-6 w-full disabled:opacity-50"
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </form>
    </div>
  );
}
