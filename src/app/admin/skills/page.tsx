import { db } from "@/lib/db";
import { SkillsManagerClient } from "@/components/admin/SkillsManagerClient";

export default async function AdminSkillsPage() {
  const categories = await db.getSkillCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Technical Skills & Stack Matrix
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Maintain technical proficiencies, concrete evidence notes, and categorizations.
        </p>
      </div>

      <SkillsManagerClient initialCategories={categories} />
    </div>
  );
}
