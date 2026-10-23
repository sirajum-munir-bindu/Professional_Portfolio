import { describe, it, expect } from "vitest";
import { db } from "../src/lib/db";

describe("Backend Category & Frontend Synchronization", () => {
  it("strictly changes frontend visible categories based on backend category settings", async () => {
    // 1. Get initial categories
    const initial = await db.getProjectCategories(false);
    expect(initial.length).toBeGreaterThan(0);

    // 2. Hide a specific category (e.g. "Cloud Architecture")
    const targetCat = initial[0];
    await db.toggleProjectCategoryVisibility(targetCat.id, false);

    // 3. Verify public frontend categories query omits the hidden category
    const publicCategories = await db.getProjectCategories(true);
    const isTargetVisible = publicCategories.some((c) => c.id === targetCat.id);
    expect(isTargetVisible).toBe(false);

    // 4. Verify admin list still shows it marked as hidden
    const adminCategories = await db.getProjectCategories(false);
    const targetInAdmin = adminCategories.find((c) => c.id === targetCat.id);
    expect(targetInAdmin?.visible).toBe(false);

    // 5. Restore category back to visible
    await db.toggleProjectCategoryVisibility(targetCat.id, true);
    const restoredPublic = await db.getProjectCategories(true);
    expect(restoredPublic.some((c) => c.id === targetCat.id)).toBe(true);
  });

  it("adds a new custom backend category and reflects it in frontend", async () => {
    const newCat = await db.upsertProjectCategory({
      name: "Cyber Security & Cryptography",
      visible: true,
    });

    const publicList = await db.getProjectCategories(true);
    expect(publicList.some((c) => c.name === "Cyber Security & Cryptography")).toBe(true);

    // Clean up
    await db.deleteProjectCategory(newCat.id);
  });
});
