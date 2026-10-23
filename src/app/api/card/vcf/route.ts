import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVCardString } from "@/lib/vcard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const settings = await db.getSiteSettings();
    const url = new URL(request.url);
    const origin = url.origin;

    const vcf = generateVCardString(settings, origin);
    const filename = `${(settings.cardName || settings.displayName || "contact").replace(/[^a-zA-Z0-9_-]/g, "_")}.vcf`;

    return new NextResponse(vcf, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate vCard" }, { status: 500 });
  }
}
