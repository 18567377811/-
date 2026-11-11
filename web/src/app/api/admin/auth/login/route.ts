import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  getAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const expected = getAdminPassword();
    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured" },
        { status: 503 },
      );
    }
    if (!body.password || body.password !== expected) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return response;
  } catch (error) {
    console.error("[admin/login]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
