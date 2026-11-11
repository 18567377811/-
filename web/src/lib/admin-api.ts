import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function withAdmin<T>(
  handler: () => Promise<T>,
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const data = await handler();
    return NextResponse.json(data);
  } catch (error) {
    const status =
      error instanceof Error && "status" in error
        ? Number((error as Error & { status?: number }).status) || 500
        : 500;
    if (status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[admin-api]", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export function badRequest(message: string) {
  const error = new Error(message);
  (error as Error & { status: number }).status = 400;
  return error;
}
