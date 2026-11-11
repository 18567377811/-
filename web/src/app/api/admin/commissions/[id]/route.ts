import { badRequest, withAdmin } from "@/lib/admin-api";
import { COMMISSION_STATUSES } from "@/lib/commission-options";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const STATUSES = new Set<string>(
  COMMISSION_STATUSES.map((item) => item.value),
);

export async function GET(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const commission = await prisma.commissionRequest.findUnique({
      where: { id },
    });
    if (!commission) throw badRequest("委托不存在");
    return { commission };
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    const status = String(body?.status ?? "");
    if (!status || !STATUSES.has(status)) {
      throw badRequest("无效状态");
    }
    const commission = await prisma.commissionRequest.update({
      where: { id },
      data: { status },
    });
    return { commission };
  });
}
