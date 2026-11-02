import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// GitHub Pages 子路径部署（https://<user>.github.io/duanti/）
const basePath = "/duanti";

// Service Worker：开发模式关闭（避免热更新干扰），生产由 Serwist 编译 src/app/sw.ts → public/sw.js
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // 静态导出到 ./out（GitHub Pages 纯静态托管，无后端）
  output: "export",
  images: { unoptimized: true },
  // 子路径部署必设，否则 CSS/JS 404
  basePath,
  assetPrefix: `${basePath}/`,
  // 生成 page/index.html，GH Pages 子路径直接可访问
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default withSerwist(nextConfig);
