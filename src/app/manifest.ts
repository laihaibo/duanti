import type { MetadataRoute } from "next";

// 静态导出（output: "export"）要求 metadata 路由显式声明
export const dynamic = "force-static";

// GitHub Pages 子路径部署时由 next.config.env 注入 /duanti，本地为空
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "锻体 · 每日训练计划",
    short_name: "锻体",
    description:
      "纯本地的个人每日锻体助手：早/中/晚各 30 分钟，下雨或夜晚自动切换室内壶铃方案。",
    id: `${basePath}/`,
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    lang: "zh-CN",
    background_color: "#eef1f7",
    theme_color: "#007aff",
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${basePath}/icons/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
