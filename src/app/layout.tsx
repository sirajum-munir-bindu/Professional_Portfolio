import type { Metadata, Viewport } from "next";
import "./globals.css";
import { db } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.getSiteSettings();
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.displayName} | ${settings.headline}`,
      template: `%s | ${settings.displayName}`,
    },
    description: settings.metaDescription,
    icons: {
      icon: settings.avatarUrl || "/favicon.ico",
      shortcut: settings.avatarUrl || "/favicon.ico",
      apple: settings.avatarUrl || "/favicon.ico",
    },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await db.getSiteSettings();
  const accentHex =
    settings?.accentColor && /^#[0-9a-fA-F]{6}$/.test(settings.accentColor)
      ? settings.accentColor
      : "#10b981";

  const cleanHex = accentHex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const hoverR = Math.max(0, Math.round(r * 0.85));
  const hoverG = Math.max(0, Math.round(g * 0.85));
  const hoverB = Math.max(0, Math.round(b * 0.85));
  const hoverHex = `#${hoverR.toString(16).padStart(2, "0")}${hoverG.toString(16).padStart(2, "0")}${hoverB.toString(16).padStart(2, "0")}`;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href={settings.avatarUrl || "/favicon.ico"} sizes="any" />
        {settings.avatarUrl && (
          <link rel="apple-touch-icon" href={settings.avatarUrl} />
        )}
        <style
          id="theme-dynamic-accent"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --accent: ${accentHex};
                --accent-hover: ${hoverHex};
                --accent-subtle: rgba(${r}, ${g}, ${b}, 0.14);
                --accent-glow: rgba(${r}, ${g}, ${b}, 0.35);
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-accent-foreground">
        {children}
      </body>
    </html>
  );
}
