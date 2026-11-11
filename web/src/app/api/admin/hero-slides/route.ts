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
    if (!body?.image || !body?.titleZh || !body?.titleEn) {
      throw badRequest("缺少必填字段");
    }
    const slide = await prisma.heroSlide.create({
      data: {
        image: String(body.image),
        titleZh: String(body.titleZh),
        titleEn: String(body.titleEn),
        titleMs: String(body.titleMs ?? body.titleEn),
        bodyZh: String(body.bodyZh ?? ""),
        bodyEn: String(body.bodyEn ?? ""),
        bodyMs: String(body.bodyMs ?? ""),
        sortOrder: Number(body.sortOrder ?? 0),
        isActive: body.isActive !== false,
      },
    });
    return { slide };
  });
}
