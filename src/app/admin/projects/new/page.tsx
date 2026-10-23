import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const categories = await db.getProjectCategories();

  return (
    <div className="space-y-6">
      <ProjectForm availableCategories={categories} />
    </div>
  );
}
