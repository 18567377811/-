import { DisplayMode } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw badRequest("分类不存在");
    return { category };
  });
}

export async function PUT(request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: {
        slug: body.slug != null ? String(body.slug).trim() : undefined,
        nameZh: body.nameZh != null ? String(body.nameZh) : undefined,
        nameEn: body.nameEn != null ? String(body.nameEn) : undefined,
        nameMs: body.nameMs != null ? String(body.nameMs) : undefined,
        descriptionZh:
          body.descriptionZh != null ? String(body.descriptionZh) : undefined,
        descriptionEn:
          body.descriptionEn != null ? String(body.descriptionEn) : undefined,
        descriptionMs:
          body.descriptionMs != null ? String(body.descriptionMs) : undefined,
        hintZh: body.hintZh != null ? String(body.hintZh) : undefined,
        hintEn: body.hintEn != null ? String(body.hintEn) : undefined,
        hintMs: body.hintMs != null ? String(body.hintMs) : undefined,
        coverImage:
          body.coverImage != null ? String(body.coverImage) : undefined,
        displayMode:
          body.displayMode === "featured"
            ? DisplayMode.featured
            : body.displayMode === "grid"
              ? DisplayMode.grid
              : undefined,
        showOnHome:
          body.showOnHome != null ? Boolean(body.showOnHome) : undefined,
        sortOrder:
          body.sortOrder != null ? Number(body.sortOrder) : undefined,
        isActive: body.isActive != null ? Boolean(body.isActive) : undefined,
      },
    });
    return { category };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      throw badRequest("该分类下仍有商品，无法删除");
    }
    await prisma.category.delete({ where: { id } });
    return { ok: true };
  });
}
