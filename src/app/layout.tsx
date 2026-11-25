import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SITE } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const defaultTitle = "DTCP Approved Plots in Villupuram & Salem | SMA Real Estate";
const defaultDescription = `DTCP-approved plots, villas and land in Villupuram, Salem and across Tamil Nadu. Document-first process, 40+ years experience. Call us on ${SITE.displayPhone}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: defaultTitle,
    template: "%s | SMA Real Estate",
  },
  description: defaultDescription,
  authors: [{ name: SITE.legalName }],
  icons: {
    icon: [{ url: "/brand/sma-logo.png", type: "image/png", sizes: "1024x1024" }],
    shortcut: ["/brand/sma-logo.png"],
    apple: [{ url: "/brand/sma-logo.png", type: "image/png", sizes: "1024x1024" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "SMA Real Estate & Builders — plots and villas in Tamil Nadu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-home.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0B2D20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`overflow-x-clip ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-0 overflow-x-clip bg-background text-foreground antialiased sm:min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary-deep focus:px-4 focus:py-2 focus:text-gold"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
