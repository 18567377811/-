import { DisplayMode, SaleType } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { ensureUniqueSlug, slugifyLabel } from "@/lib/slugify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return withAdmin(async () => {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return { categories };
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body?.nameZh || !body?.coverImage) {
      throw badRequest("缺少必填字段（中文名称、封面图）");
    }
    const nameZh = String(body.nameZh);
    const nameEn = String(body.nameEn || nameZh);
    const nameMs = String(body.nameMs || nameEn);
    const descriptionZh = String(body.descriptionZh ?? "");
    const descriptionEn = String(body.descriptionEn || descriptionZh);
    const descriptionMs = String(body.descriptionMs || descriptionEn);
    const hintZh = String(body.hintZh ?? "");
    const hintEn = String(body.hintEn || hintZh);
    const hintMs = String(body.hintMs || hintEn);
    const rawSlug = String(body.slug ?? "").trim();
    const slug = await ensureUniqueSlug(
      rawSlug || slugifyLabel(nameEn || nameZh, "category"),
      async (candidate) =>
        Boolean(
          await prisma.category.findUnique({
            where: { slug: candidate },
            select: { id: true },
          }),
        ),
    );
    const category = await prisma.category.create({
      data: {
        slug,
        nameZh,
        nameEn,
        nameMs,
        descriptionZh,
        descriptionEn,
        descriptionMs,
        hintZh,
        hintEn,
        hintMs,
        coverImage: String(body.coverImage),
        displayMode:
          body.displayMode === "featured"
            ? DisplayMode.featured
            : DisplayMode.grid,
        saleType:
          body.saleType === "direct" ? SaleType.direct : SaleType.custom,
        showOnHome: Boolean(body.showOnHome ?? true),
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive !== false,
      },
    });
    return { category };
  });
}
