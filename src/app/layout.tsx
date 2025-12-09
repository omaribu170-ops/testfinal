/* =====================================================
   The Hub - Root Layout
   الـ Layout الرئيسي للتطبيق
===================================================== */

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// =====================================================
// إعداد الخط العربي IBM Plex Arabic
// =====================================================
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

// =====================================================
// Metadata للتطبيق
// =====================================================
export const metadata: Metadata = {
  title: "The Hub - كو-وركينج سبيس",
  description: "نظام إدارة متكامل لـ Co-Working Space و Entertainment Hub",
  keywords: ["coworking", "workspace", "entertainment", "gaming", "egypt"],
  authors: [{ name: "The Hub Team" }],

  // PWA Manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-icon-180.png",
  },

  // Open Graph للمشاركة على السوشيال ميديا
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://thehub.com",
    siteName: "The Hub",
    title: "The Hub - كو-وركينج سبيس",
    description: "مكان العمل والترفيه المتكامل",
  },

  // Apple PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Hub",
  },
};

// =====================================================
// Viewport Settings للـ PWA
// =====================================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// =====================================================
// Root Layout Component
// =====================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="The Hub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The Hub" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />

        {/* Splash Screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px)"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
