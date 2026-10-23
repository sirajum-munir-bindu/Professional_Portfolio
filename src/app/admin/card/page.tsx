import { db } from "@/lib/db";
import { DigitalCardClient } from "@/components/admin/DigitalCardClient";

export const dynamic = "force-dynamic";

export default async function AdminCardPage() {
  const settings = await db.getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Premium E-Visiting Card Studio
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Customize your mobile-first digital identity card, direct dialers, contact vCard payloads, and QR code sharing.
        </p>
      </div>

      <DigitalCardClient initialSettings={settings} />
    </div>
  );
}
