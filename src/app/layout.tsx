import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/glass/bottom-nav";
import { RegisterSW } from "@/components/pwa/register-sw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "锻体 · 每日训练计划",
  description: "纯本地的个人每日锻体助手：早/中/晚 30 分钟，室内外自动切换。",
  applicationName: "锻体",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "锻体",
  },
  icons: {
    apple: `${basePath}/icons/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

/** 预渲染阶段同步主题，避免暗色模式闪烁（读取 zustand persist 的 localStorage） */
const themeInitScript = `(function(){try{
  var t='auto';
  var raw=localStorage.getItem('duanti-store');
  if(raw){var s=JSON.parse(raw);t=(s&&s.state&&s.state.settings&&s.state.settings.theme)||'auto';}
  var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark',dark);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <div className="app-backdrop" aria-hidden />
        <main className="mx-auto w-full max-w-[430px] px-4 pb-[calc(96px+env(safe-area-inset-bottom))] pt-5">
          {children}
        </main>
        <BottomNav />
        <RegisterSW />
      </body>
    </html>
  );
}
