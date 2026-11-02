# 锻体 duanti

纯本地的个人每日锻体 PWA：早/中/晚各 30 分钟，动作清单勾选打卡，下雨或夜晚自动切换室内壶铃方案，长期跟踪连续打卡与壶铃容量趋势。

**视觉风格**：Apple Liquid Glass（iOS 液态玻璃质感），移动端优先（390px 视口）。

## 功能

- **今日**：早/中/晚三张时段卡片，逐项勾选完成；顶部连续打卡天数 + 本周完成度环（打卡 = 当天 3 个时段全部完成）
- **计划**：调整各时段（户外/雨天室内）的组数、次数、时长
- **动作库**：全部动作 + 分类筛选 + 动作要点与呼吸提示
- **统计**：近 30 天完成热力图、壶铃累计容量（组 × 次 × kg）
- **设置**：壶铃重量（默认 16kg）、出生年、主题（跟随系统/浅色/深色）、导出 JSON 备份、清空数据
- **场景切换**：晚上锁定室内；早/中午默认户外，雨天一键切换室内（中午快走 → 壶铃摆动 4×20 + 箭步蹲 3×10）
- **PWA**：可安装到主屏幕，Serwist 离线缓存

## 技术栈

Next.js 15（App Router，静态导出）· TypeScript 严格模式 · Tailwind CSS v4 · shadcn/ui（Radix UI）· Zustand + persist（localStorage，无后端）· Serwist · pnpm 9 · Node 22

## 本地启动

```bash
pnpm install
pnpm dev
```

配置了 `basePath: /duanti`，请访问 **http://localhost:3000/duanti/**

## 构建与图标

```bash
pnpm build        # 静态导出到 ./out
pnpm icons        # 重新生成 PWA 图标（assets/*.svg → public/icons/*.png）
pnpm lint
```

## 部署到 GitHub Pages（GitHub Actions）

1. 推送到 `main` 分支（工作流 `.github/workflows/deploy.yml` 会自动构建并部署）
2. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**
3. 访问 `https://<用户名>.github.io/duanti/`

## 数据说明

所有数据（打卡记录、计划调整、设置）仅保存在浏览器 localStorage（键 `duanti-store`），无后端、无追踪。换设备或清浏览器数据前，请在「设置 → 导出数据为 JSON」备份。
