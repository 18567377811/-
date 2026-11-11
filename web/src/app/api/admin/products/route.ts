import { SaleType } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VariantInput = {
  id?: string;
  labelZh: string;
  labelEn: string;
  labelMs?: string;
  priceUsd: number;
  sortOrder?: number;
};

export async function GET() {
  return withAdmin(async () => {
    const products = await prisma.product.findMany({
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return { products };
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (
      !body?.slug ||
      !body?.categoryId ||
      !body?.nameZh ||
      !body?.nameEn ||
      !body?.image
    ) {
      throw badRequest("缺少必填字段");
    }
    const variants = (body.variants ?? []) as VariantInput[];
    if (!Array.isArray(variants) || variants.length === 0) {
      throw badRequest("至少需要一个规格");
    }

    const product = await prisma.product.create({
      data: {
        slug: String(body.slug).trim(),
        categoryId: String(body.categoryId),
        saleType:
          body.saleType === "direct" ? SaleType.direct : SaleType.custom,
        nameZh: String(body.nameZh),
        nameEn: String(body.nameEn),
        nameMs: String(body.nameMs ?? body.nameEn),
        summaryZh: String(body.summaryZh ?? ""),
        summaryEn: String(body.summaryEn ?? ""),
        summaryMs: String(body.summaryMs ?? ""),
        descriptionZh: String(body.descriptionZh ?? ""),
        descriptionEn: String(body.descriptionEn ?? ""),
        descriptionMs: String(body.descriptionMs ?? ""),
        priceFromUsd: Number(body.priceFromUsd ?? variants[0].priceUsd),
        turnaroundMonths: String(body.turnaroundMonths ?? "3–8"),
        rating: body.rating != null ? Number(body.rating) : null,
        image: String(body.image),
        inStock: body.inStock !== false,
        keywords: JSON.stringify(body.keywords ?? []),
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive !== false,
        variants: {
          create: variants.map((variant, index) => ({
            id: variant.id || undefined,
            labelZh: String(variant.labelZh),
            labelEn: String(variant.labelEn),
            labelMs: String(variant.labelMs ?? variant.labelEn),
            priceUsd: Number(variant.priceUsd),
            sortOrder: Number(variant.sortOrder ?? index),
          })),
        },
      },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });
    return { product };
  });
}
