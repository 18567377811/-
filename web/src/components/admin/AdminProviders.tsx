"use client";

import { AdminToastHost } from "@/components/admin/toast";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AdminToastHost />
    </>
  );
}
