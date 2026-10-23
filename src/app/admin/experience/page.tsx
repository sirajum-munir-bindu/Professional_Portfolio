import { db } from "@/lib/db";
import { ExperienceManagerClient } from "@/components/admin/ExperienceManagerClient";

export default async function AdminExperiencePage() {
  const experience = await db.getExperience();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Professional Career & Experience
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Maintain verified job histories, leadership responsibilities, and quantified milestones.
        </p>
      </div>

      <ExperienceManagerClient initialExperience={experience} />
    </div>
  );
}
