import { db } from "@/lib/db";
import { SiteSettingsClient } from "@/components/admin/SiteSettingsClient";

export default async function AdminSettingsPage() {
  const settings = await db.getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Site Configuration & SEO
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Update your public identity, accent design tokens, professional channels, and search engine metadata.
        </p>
      </div>

      <SiteSettingsClient initialSettings={settings} />
    </div>
  );
}
