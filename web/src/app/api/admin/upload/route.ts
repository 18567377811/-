import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadImageFile } from "@/lib/upload-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }
    const result = await uploadImageFile(file);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[admin/upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传失败" },
      { status: 500 },
    );
  }
}
