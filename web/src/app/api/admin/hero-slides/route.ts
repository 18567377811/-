import { badRequest, withAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return withAdmin(async () => {
    const slides = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return { slides };
  });
}

export async function POST(request: Request) {
  return withAdmin(async () => {
    const body = await request.json();
    if (!body?.image || !body?.titleZh) {
      throw badRequest("缺少必填字段（图片、中文标题）");
    }
    const titleZh = String(body.titleZh);
    const titleEn = String(body.titleEn || titleZh);
    const titleMs = String(body.titleMs || titleEn);
    const bodyZh = String(body.bodyZh ?? "");
    const bodyEn = String(body.bodyEn || bodyZh);
    const bodyMs = String(body.bodyMs || bodyEn);
    const slide = await prisma.heroSlide.create({
      data: {
        image: String(body.image),
        titleZh,
        titleEn,
        titleMs,
        bodyZh,
        bodyEn,
        bodyMs,
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive !== false,
      },
    });
    return { slide };
  });
}
