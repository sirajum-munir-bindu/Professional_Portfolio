import type { Metadata, Viewport } from "next";
import "./globals.css";
import { db } from "@/lib/db";

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.internal";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.displayName} | ${settings.headline}`,
      template: `%s | ${settings.displayName}`,
    },
    description: settings.metaDescription,
    keywords: [
      "Software Engineer",
      "Cloud Architect",
      "Distributed Systems",
      "Next.js 15",
      "PostgreSQL",
      "Kubernetes",
      "Staff Engineer",
      "System Architecture",
    ],
    authors: [{ name: settings.displayName }],
    creator: settings.displayName,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: `${settings.displayName} | ${settings.headline}`,
      description: settings.metaDescription,
      siteName: `${settings.displayName} Engineering Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.displayName} | ${settings.headline}`,
      description: settings.metaDescription,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  );
}
