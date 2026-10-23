import { db } from "@/lib/db";
import { AchievementsManagerClient } from "@/components/admin/AchievementsManagerClient";

export default async function AdminAchievementsPage() {
  const achievements = await db.getAchievements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Honors, Awards & Certifications
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Maintain verified certifications, hackathon victories, and conference keynotes.
        </p>
      </div>

      <AchievementsManagerClient initialAchievements={achievements} />
    </div>
  );
}
