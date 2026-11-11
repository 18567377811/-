import { DisplayMode } from "@prisma/client";
import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

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
    if (!body?.slug || !body?.nameZh || !body?.nameEn || !body?.coverImage) {
      throw badRequest("缺少必填字段");
    }
    const category = await prisma.category.create({
      data: {
        slug: String(body.slug).trim(),
        nameZh: String(body.nameZh),
        nameEn: String(body.nameEn),
        nameMs: String(body.nameMs ?? body.nameEn),
        descriptionZh: String(body.descriptionZh ?? ""),
        descriptionEn: String(body.descriptionEn ?? ""),
        descriptionMs: String(body.descriptionMs ?? ""),
        hintZh: String(body.hintZh ?? ""),
        hintEn: String(body.hintEn ?? ""),
        hintMs: String(body.hintMs ?? ""),
        coverImage: String(body.coverImage),
        displayMode:
          body.displayMode === "featured"
            ? DisplayMode.featured
            : DisplayMode.grid,
        showOnHome: Boolean(body.showOnHome ?? true),
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive !== false,
      },
    });
    return { category };
  });
}
