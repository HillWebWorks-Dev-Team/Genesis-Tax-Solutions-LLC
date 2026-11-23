import type { Metadata } from "next";
import { Suspense } from "react";
import { Great_Vibes, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { GlobalLoadingProvider } from "@/components/ui/GlobalLoading";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const script = Great_Vibes({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gtsnotarytax.com"),
  title: {
    default: `${siteConfig.brandName} | Jacksonville, FL`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Professional tax preparation and notary services in Jacksonville, FL from Genesis Tax & Notary Solutions.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandName} | Jacksonville, FL`,
    description:
      "Trusted tax preparation and notary services for individuals, families, and businesses in Jacksonville, Florida.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden antialiased">
        <Suspense fallback={<LoadingModal label="Loading" />}>
          <GlobalLoadingProvider>{children}</GlobalLoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
