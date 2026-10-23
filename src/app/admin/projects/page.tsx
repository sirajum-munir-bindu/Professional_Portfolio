import { db } from "@/lib/db";
import { ProjectListClient } from "@/components/admin/ProjectListClient";

export default async function AdminProjectsPage() {
  const [projects, categories] = await Promise.all([
    db.getAllProjects(),
    db.getProjectCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Architecture Projects & Blueprints
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage system case studies, technology stacks, metrics, and interactive topology models.
        </p>
      </div>

      <ProjectListClient
        initialProjects={projects}
        initialCategories={categories}
      />
    </div>
  );
}
