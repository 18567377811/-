import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 本机构建后上传精简产物到服务器（不在 2G 机上 build）
  output: "standalone",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "*.ibb.co",
      },
      {
        protocol: "https",
        hostname: "files.catbox.moe",
      },
    ],
  },
  // Ensure Prisma engines ship with standalone output
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.prisma/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
  },
};

export default withNextIntl(nextConfig);
