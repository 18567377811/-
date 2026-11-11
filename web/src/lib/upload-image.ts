const MAX_BYTES = 8 * 1024 * 1024;

export async function uploadImageFile(file: File): Promise<{
  url: string;
  provider: "imgbb" | "catbox";
}> {
  if (!file.type.startsWith("image/")) {
    throw new Error("仅支持图片文件");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("图片需小于 8MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imgbbKey = process.env.IMGBB_API_KEY?.trim();

  if (imgbbKey) {
    const body = new FormData();
    body.set("image", buffer.toString("base64"));
    body.set("name", file.name.replace(/\.[^.]+$/, "") || "feltora");
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`,
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

  const catbox = new FormData();
  catbox.set("reqtype", "fileupload");
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
    throw new Error(text || "图床上传失败");
  }
  return { url: text, provider: "catbox" };
}
