import { SaleType } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type VariantInput = {
  id?: string;
  labelZh: string;
  labelEn: string;
  labelMs?: string;
  priceUsd: number;
  sortOrder?: number;
};

export async function GET(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });
    if (!product) throw badRequest("商品不存在");
    return { product };
  });
}

export async function PUT(request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    const variants = body.variants as VariantInput[] | undefined;

    const product = await prisma.$transaction(async (tx) => {
      if (Array.isArray(variants)) {
        if (variants.length === 0) throw badRequest("至少需要一个规格");
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: variants.map((variant, index) => {
            const labelZh = String(variant.labelZh || "");
            const labelEn = String(variant.labelEn || labelZh);
            const row = {
              productId: id,
              labelZh,
              labelEn,
              labelMs: String(variant.labelMs || labelEn),
              priceUsd: Number(variant.priceUsd),
              sortOrder: Number(variant.sortOrder ?? index),
            };
            return variant.id ? { ...row, id: variant.id } : row;
          }),
        });
      }

      let nextSaleType: SaleType | undefined;
      if (body.categoryId != null) {
        const category = await tx.category.findUnique({
          where: { id: String(body.categoryId) },
          select: { saleType: true },
        });
        if (!category) throw badRequest("分类不存在");
        nextSaleType = category.saleType;
      }

      return tx.product.update({
        where: { id },
        data: {
          slug: body.slug != null ? String(body.slug).trim() : undefined,
          categoryId:
            body.categoryId != null ? String(body.categoryId) : undefined,
          saleType: nextSaleType,
          nameZh: body.nameZh != null ? String(body.nameZh) : undefined,
          nameEn: body.nameEn != null ? String(body.nameEn) : undefined,
          nameMs: body.nameMs != null ? String(body.nameMs) : undefined,
          summaryZh:
            body.summaryZh != null ? String(body.summaryZh) : undefined,
          summaryEn:
            body.summaryEn != null ? String(body.summaryEn) : undefined,
          summaryMs:
            body.summaryMs != null ? String(body.summaryMs) : undefined,
          descriptionZh:
            body.descriptionZh != null
              ? String(body.descriptionZh)
              : undefined,
          descriptionEn:
            body.descriptionEn != null
              ? String(body.descriptionEn)
              : undefined,
          descriptionMs:
            body.descriptionMs != null
              ? String(body.descriptionMs)
              : undefined,
          priceFromUsd:
            body.priceFromUsd != null
              ? Number(body.priceFromUsd)
              : undefined,
          turnaroundMonths:
            body.turnaroundMonths != null
              ? String(body.turnaroundMonths)
              : undefined,
          rating:
            body.rating === null
              ? null
              : body.rating != null
                ? Number(body.rating)
                : undefined,
          image: body.image != null ? String(body.image) : undefined,
          inStock: body.inStock != null ? Boolean(body.inStock) : undefined,
          keywords:
            body.keywords != null
              ? JSON.stringify(body.keywords)
              : undefined,
          sortOrder:
            body.sortOrder != null ? Number(body.sortOrder) : undefined,
          isActive: body.isActive != null ? Boolean(body.isActive) : undefined,
        },
        include: {
          variants: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
      });
    });

    return { product };
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  return withAdmin(async () => {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return { ok: true };
  });
}
