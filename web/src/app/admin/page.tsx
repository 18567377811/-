import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const ok = await isAdminAuthenticated();
  redirect(ok ? "/admin/categories" : "/admin/login");
}
