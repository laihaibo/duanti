"use client";

import { useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 生产环境注册 Service Worker（静态导出下手动注册最可靠） */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register(`${basePath}/sw.js`)
      .catch((err) => console.warn("Service Worker 注册失败", err));
  }, []);
  return null;
}
