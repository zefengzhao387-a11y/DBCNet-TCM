import type { Metadata, Viewport } from "next";
import { Cinzel, Noto_Serif_SC } from "next/font/google";
import localFont from "next/font/local";

import { FilmGrain } from "@/components/background/FilmGrain";
import { AppShell } from "@/components/shell/AppShell";
import { SEASON_INLINE_INIT } from "@/lib/season-inline-script";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "岐黄智鉴 · 多模态中医智能决策",
  description:
    "DBCNet 双分支（生成式感知 + 知识图谱约束）与舌象、问卷等多模态体质辨识的可视化入口。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SEASON_INLINE_INIT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${notoSerifSC.variable} min-h-screen font-sans antialiased`}
      >
        <AppShell>{children}</AppShell>
        <FilmGrain />
      </body>
    </html>
  );
}
