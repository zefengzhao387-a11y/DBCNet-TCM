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
  title: "DBCNet-TCM · 中医智能决策支持",
  description: "Modern Neo-Chinese clinical intelligence workstation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4faf3" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1018" },
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
