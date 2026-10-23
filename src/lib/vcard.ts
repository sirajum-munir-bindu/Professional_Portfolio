import { SiteSettingsData } from "@/types";

export function generateVCardString(settings: SiteSettingsData, origin?: string): string {
  const name = settings.cardName || settings.displayName || "Sirajum Munir";
  const title = settings.cardTitle || settings.roleTitle || settings.headline || "";
  const company = settings.cardCompany || "";
  const email = settings.cardEmail || settings.primaryEmail || "";
  const phone = settings.cardPhone || "";
  const whatsapp = settings.cardWhatsapp || "";
  const location = settings.cardLocation || settings.location || "";
  const website = settings.cardWebsite || origin || "https://portfolio.internal";
  const bio = settings.cardBio || settings.bio || "";

  // Split name for N field
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(name)}`,
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
  ];

  if (company) lines.push(`ORG:${escapeVCard(company)}`);
  if (title) lines.push(`TITLE:${escapeVCard(title)}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${email.trim()}`);
  if (phone) lines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
  if (whatsapp && whatsapp !== phone) lines.push(`TEL;TYPE=MSG,WORK:${whatsapp.trim()}`);
  if (location) lines.push(`ADR;TYPE=WORK:;;;${escapeVCard(location)};;;`);
  if (website) lines.push(`URL:${website.trim()}`);
  if (settings.cardLinkedin || settings.linkedinUrl) {
    lines.push(`URL;TYPE=LinkedIn:${(settings.cardLinkedin || settings.linkedinUrl).trim()}`);
  }
  if (settings.cardGithub || settings.githubUrl) {
    lines.push(`URL;TYPE=GitHub:${(settings.cardGithub || settings.githubUrl).trim()}`);
  }
  if (bio) {
    lines.push(`NOTE:${escapeVCard(bio.slice(0, 300))}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

function escapeVCard(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
