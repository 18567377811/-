import { SaleType } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { ensureUniqueSlug, slugifyLabel } from "@/lib/slugify";

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
    if (!body?.categoryId || !body?.nameZh || !body?.image) {
      throw badRequest("缺少必填字段（分类、中文名称、主图）");
    }
    const variants = (body.variants ?? []) as VariantInput[];
    if (!Array.isArray(variants) || variants.length === 0) {
      throw badRequest("至少需要一个规格");
    }

    const nameZh = String(body.nameZh);
    const nameEn = String(body.nameEn || nameZh);
    const nameMs = String(body.nameMs || nameEn);
    const summaryZh = String(body.summaryZh ?? "");
    const summaryEn = String(body.summaryEn || summaryZh);
    const summaryMs = String(body.summaryMs || summaryEn);
    const descriptionZh = String(body.descriptionZh ?? "");
    const descriptionEn = String(body.descriptionEn || descriptionZh);
    const descriptionMs = String(body.descriptionMs || descriptionEn);

    const categoryId = String(body.categoryId);
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { saleType: true },
    });
    if (!category) throw badRequest("分类不存在");

    const rawSlug = String(body.slug ?? "").trim();
    const slug = await ensureUniqueSlug(
      rawSlug || slugifyLabel(nameEn || nameZh, "product"),
      async (candidate) =>
        Boolean(
          await prisma.product.findUnique({
            where: { slug: candidate },
            select: { id: true },
          }),
        ),
    );

    const product = await prisma.product.create({
      data: {
        slug,
        categoryId,
        saleType: category.saleType,
        nameZh,
        nameEn,
        nameMs,
        summaryZh,
        summaryEn,
        summaryMs,
        descriptionZh,
        descriptionEn,
        descriptionMs,
        priceFromUsd: Number(body.priceFromUsd ?? variants[0].priceUsd),
        turnaroundMonths: String(body.turnaroundMonths ?? "3–8"),
        rating: body.rating != null ? Number(body.rating) : null,
        image: String(body.image),
        inStock: body.inStock !== false,
        keywords: JSON.stringify(body.keywords ?? []),
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive !== false,
        variants: {
          create: variants.map((variant, index) => {
            const labelZh = String(variant.labelZh || "");
            const labelEn = String(variant.labelEn || labelZh);
            return {
              id: variant.id || undefined,
              labelZh,
              labelEn,
              labelMs: String(variant.labelMs || labelEn),
              priceUsd: Number(variant.priceUsd),
              sortOrder: Number(variant.sortOrder ?? index),
            };
          }),
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
