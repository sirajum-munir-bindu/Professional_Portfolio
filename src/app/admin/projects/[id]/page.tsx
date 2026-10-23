import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await db.getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProjectForm initialData={project} />
    </div>
  );
}
