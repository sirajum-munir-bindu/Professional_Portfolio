import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { displayModeSchema, digitalCardSchema } from "@/lib/validations";
import { generateVCardString } from "@/lib/vcard";
import { db } from "@/lib/db";
import { initialSiteSettings } from "@/lib/fallback-data";

describe("Single-Domain Website Display Mode & E-Visiting Card System", () => {
  let originalMode: "PORTFOLIO" | "DIGITAL_CARD" = "DIGITAL_CARD";

  beforeEach(async () => {
    // Isolate test cases
    await db.updateSiteSettings({
      activeDisplayMode: "PORTFOLIO",
    });
  });

  afterAll(async () => {
    // Restore to DIGITAL_CARD
    await db.updateSiteSettings({
      activeDisplayMode: "DIGITAL_CARD",
      cardName: "Sirajum Munir",
    });
  });

  describe("Validation & Exclusivity Invariants", () => {
    it("accepts valid activeDisplayMode values PORTFOLIO and DIGITAL_CARD", () => {
      const resPortfolio = displayModeSchema.safeParse({ activeDisplayMode: "PORTFOLIO" });
      expect(resPortfolio.success).toBe(true);

      const resCard = displayModeSchema.safeParse({ activeDisplayMode: "DIGITAL_CARD" });
      expect(resCard.success).toBe(true);
    });

    it("rejects invalid, mixed, or ambiguous display modes", () => {
      const invalidCases = [
        { activeDisplayMode: "BOTH" },
        { activeDisplayMode: "NONE" },
        { activeDisplayMode: "CARD" },
        { activeDisplayMode: "" },
        { activeDisplayMode: null },
      ];

      for (const c of invalidCases) {
        const res = displayModeSchema.safeParse(c);
        expect(res.success).toBe(false);
      }
    });

    it("validates digital card payload fields correctly", () => {
      const validCard = {
        cardName: "Sirajum Munir",
        cardTitle: "Systems Architect",
        cardCompany: "Tech Corp",
        cardEmail: "sirajum@example.com",
        cardPhone: "+880 1700-000000",
        cardWhatsapp: "+880 1700-000000",
        cardWebsite: "https://example.com",
        cardLinkedin: "https://linkedin.com/in/example",
        cardGithub: "https://github.com/example",
      };

      const res = digitalCardSchema.safeParse(validCard);
      expect(res.success).toBe(true);
    });

    it("rejects invalid URLs or malformed emails in card payload", () => {
      const invalid = {
        cardEmail: "not-an-email",
        cardWebsite: "not-a-url",
      };

      const res = digitalCardSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Database Persistence & Mode Switching", () => {
    it("initializes activeDisplayMode as PORTFOLIO by default", async () => {
      const settings = await db.getSiteSettings();
      expect(settings.activeDisplayMode).toBe("PORTFOLIO");
    });

    it("switches to DIGITAL_CARD and persists without affecting other data", async () => {
      const initialProjects = await db.getPublishedProjects();
      expect(initialProjects.length).toBeGreaterThan(0);

      const updated = await db.updateSiteSettings({
        activeDisplayMode: "DIGITAL_CARD",
        cardName: "Sirajum Munir Test",
      });

      expect(updated.activeDisplayMode).toBe("DIGITAL_CARD");
      expect(updated.cardName).toBe("Sirajum Munir Test");

      // Verify retrieval
      const fetched = await db.getSiteSettings();
      expect(fetched.activeDisplayMode).toBe("DIGITAL_CARD");

      // Ensure projects remained intact and untouched
      const afterProjects = await db.getPublishedProjects();
      expect(afterProjects.length).toBe(initialProjects.length);
    });

    it("switches back from DIGITAL_CARD to PORTFOLIO cleanly", async () => {
      await db.updateSiteSettings({ activeDisplayMode: "DIGITAL_CARD" });
      let current = await db.getSiteSettings();
      expect(current.activeDisplayMode).toBe("DIGITAL_CARD");

      await db.updateSiteSettings({ activeDisplayMode: "PORTFOLIO" });
      current = await db.getSiteSettings();
      expect(current.activeDisplayMode).toBe("PORTFOLIO");
    });
  });

  describe("vCard (.vcf) Generation", () => {
    it("generates a valid standard vCard 3.0 string", () => {
      const settings = {
        ...initialSiteSettings,
        cardName: "Sirajum Munir",
        cardTitle: "Systems Architect",
        cardCompany: "Acme Cloud",
        cardPhone: "+880 1700-112233",
        cardWhatsapp: "+880 1700-112233",
        cardEmail: "sirajum@example.com",
        cardLocation: "Dhaka, Bangladesh",
        cardWebsite: "https://myportfolio.com",
      };

      const vcard = generateVCardString(settings, "https://myportfolio.com");

      expect(vcard).toContain("BEGIN:VCARD");
      expect(vcard).toContain("VERSION:3.0");
      expect(vcard).toContain("FN:Sirajum Munir");
      expect(vcard).toContain("TITLE:Systems Architect");
      expect(vcard).toContain("ORG:Acme Cloud");
      expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+880 1700-112233");
      expect(vcard).toContain("EMAIL;TYPE=INTERNET,WORK:sirajum@example.com");
      expect(vcard).toContain("ADR;TYPE=WORK:;;;Dhaka\\, Bangladesh;;;");
      expect(vcard).toContain("URL:https://myportfolio.com");
      expect(vcard).toContain("END:VCARD");
    });
  });
});
