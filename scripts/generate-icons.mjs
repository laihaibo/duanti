import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

// 从 assets/*.svg 生成 PWA 图标 PNG（提交产物到 public/icons/）
const assets = resolve(process.cwd(), "assets");
const outDir = resolve(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

const jobs = [
  { src: "icon.svg", size: 192, dest: "icon-192.png" },
  { src: "icon.svg", size: 512, dest: "icon-512.png" },
  { src: "icon-maskable.svg", size: 512, dest: "icon-maskable-512.png" },
  { src: "icon-maskable.svg", size: 180, dest: "apple-touch-icon.png" },
];

for (const { src, size, dest } of jobs) {
  await sharp(resolve(assets, src), { density: 384 })
    .resize(size, size)
    .png()
    .toFile(resolve(outDir, dest));
  console.log(`generated public/icons/${dest}`);
}
