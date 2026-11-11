import { NextResponse } from "next/server";
import { uploadImageFile } from "@/lib/upload-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public image upload for commission pet photos (ImgBB / Catbox). */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }
    const result = await uploadImageFile(file);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传失败" },
      { status: 500 },
    );
  }
}
