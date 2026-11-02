import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/motion/motion-provider";
import { brand } from "@/content/brand.config";
import { getSite } from "@/content";
import { fontVariables } from "@/lib/fonts";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.defaultTitle, template: site.seo.titleTemplate },
  description: site.seo.description,
  keywords: site.seo.keywords,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.seo.defaultTitle,
    description: site.seo.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.defaultTitle,
    description: site.seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: brand.colors.ink,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} className={fontVariables} suppressHydrationWarning>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
