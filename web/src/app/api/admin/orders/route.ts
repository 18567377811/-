import { withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return withAdmin(async () => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return { orders };
  });
}
