import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 8 * 1024 * 1024;

export type UploadProvider = "local" | "imgbb" | "catbox";

export function getUploadDir(): string {
  const fromEnv = process.env.UPLOAD_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  // Local/dev default; production should set UPLOAD_DIR=/var/www/feltora/uploads
  return path.join(process.cwd(), "uploads");
}

function extensionFor(file: File): string {
  const fromName = path.extname(file.name).toLowerCase();
  if (/^\.(jpe?g|png|gif|webp|avif|bmp)$/.test(fromName)) return fromName;
  switch (file.type) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/avif":
      return ".avif";
    default:
      return ".jpg";
  }
}

async function uploadLocal(
  file: File,
  buffer: Buffer,
): Promise<{ url: string; provider: "local" }> {
  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}${extensionFor(file)}`;
  await writeFile(path.join(dir, name), buffer);
  return { url: `/uploads/${name}`, provider: "local" };
}

async function uploadImgbb(
  file: File,
  buffer: Buffer,
  apiKey: string,
): Promise<{ url: string; provider: "imgbb" }> {
  const body = new FormData();
  body.set("image", buffer.toString("base64"));
  body.set("name", file.name.replace(/\.[^.]+$/, "") || "feltora");
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body },
  );
  const data = (await res.json()) as {
    success?: boolean;
    data?: { url?: string; display_url?: string };
    error?: { message?: string };
  };
  const url = data.data?.display_url || data.data?.url;
  if (!res.ok || !data.success || !url) {
    throw new Error(data.error?.message || "ImgBB 上传失败");
  }
  return { url, provider: "imgbb" };
}

async function uploadCatbox(
  file: File,
  buffer: Buffer,
  userhash: string,
): Promise<{ url: string; provider: "catbox" }> {
  const catbox = new FormData();
  catbox.set("reqtype", "fileupload");
  catbox.set("userhash", userhash);
  catbox.set(
    "fileToUpload",
    new File([new Uint8Array(buffer)], file.name || "upload.jpg", {
      type: file.type,
    }),
  );
  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: catbox,
  });
  const text = (await res.text()).trim();
  if (!res.ok || !/^https?:\/\//i.test(text)) {
    throw new Error(text || "Catbox 上传失败");
  }
  return { url: text, provider: "catbox" };
}

function looksLikeImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  // Some browsers (esp. HEIC / drag-drop) leave type empty — fall back to extension.
  return /\.(jpe?g|png|gif|webp|avif|bmp|heic|heif)$/i.test(file.name);
}

export async function uploadImageFile(file: File): Promise<{
  url: string;
  provider: UploadProvider;
}> {
  if (!looksLikeImage(file)) {
    throw new Error("仅支持图片文件");
  }
  if (file.size <= 0) {
    throw new Error("文件为空");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("图片需小于 8MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imgbbKey = process.env.IMGBB_API_KEY?.trim();
  const catboxHash = process.env.CATBOX_USERHASH?.trim();

  // Prefer configured remote hosts; always fall back to local disk.
  // Anonymous Catbox is skipped — it now returns "Invalid uploader".
  if (imgbbKey) {
    try {
      return await uploadImgbb(file, buffer, imgbbKey);
    } catch (error) {
      console.warn("[upload] ImgBB failed, falling back to local:", error);
    }
  }

  if (catboxHash) {
    try {
      return await uploadCatbox(file, buffer, catboxHash);
    } catch (error) {
      console.warn("[upload] Catbox failed, falling back to local:", error);
    }
  }

  return uploadLocal(file, buffer);
}
