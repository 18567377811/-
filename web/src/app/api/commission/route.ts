import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.fullName || !body?.email) {
      return NextResponse.json(
        { error: "姓名与邮箱为必填" },
        { status: 400 },
      );
    }
    if (!body?.preferredStyle || !body?.timing) {
      return NextResponse.json(
        { error: "请选择风格与定制时间" },
        { status: 400 },
      );
    }
    const photos = Array.isArray(body.photos)
      ? body.photos.filter((item: unknown) => typeof item === "string" && item)
      : [];
    if (photos.length === 0) {
      return NextResponse.json(
        { error: "请至少上传一张宠物照片" },
        { status: 400 },
      );
    }

    const row = await prisma.commissionRequest.create({
      data: {
        productId: body.productId ? String(body.productId) : null,
        productSlug: body.productSlug ? String(body.productSlug) : null,
        productName: body.productName ? String(body.productName) : null,
        fullName: String(body.fullName).trim(),
        email: String(body.email).trim(),
        country: String(body.country ?? ""),
        petName: String(body.petName ?? ""),
        petBreed: String(body.petBreed ?? ""),
        petDescription: String(body.petDescription ?? ""),
        preferredStyle: String(body.preferredStyle ?? ""),
        timing: String(body.timing ?? ""),
        questions: String(body.questions ?? ""),
        photosJson: JSON.stringify(photos.slice(0, 6)),
        locale: body.locale ? String(body.locale) : null,
        status: "new",
      },
    });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (error) {
    console.error("[commission]", error);
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}
