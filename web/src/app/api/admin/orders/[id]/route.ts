import { OrderStatus } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const STATUSES = new Set(Object.values(OrderStatus));

export async function GET(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw badRequest("订单不存在");
    return { order };
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    if (!body?.status || !STATUSES.has(body.status)) {
      throw badRequest("无效状态");
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status as OrderStatus },
    });
    return { order };
  });
}
