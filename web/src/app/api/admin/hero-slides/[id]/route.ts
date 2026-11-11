import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        image: body.image != null ? String(body.image) : undefined,
        titleZh: body.titleZh != null ? String(body.titleZh) : undefined,
        titleEn: body.titleEn != null ? String(body.titleEn) : undefined,
        titleMs: body.titleMs != null ? String(body.titleMs) : undefined,
        bodyZh: body.bodyZh != null ? String(body.bodyZh) : undefined,
        bodyEn: body.bodyEn != null ? String(body.bodyEn) : undefined,
        bodyMs: body.bodyMs != null ? String(body.bodyMs) : undefined,
        sortOrder:
          body.sortOrder != null ? Number(body.sortOrder) : undefined,
        isActive: body.isActive != null ? Boolean(body.isActive) : undefined,
      },
    });
    return { slide };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    try {
      await prisma.heroSlide.delete({ where: { id } });
    } catch {
      throw badRequest("轮播不存在");
    }
    return { ok: true };
  });
}
