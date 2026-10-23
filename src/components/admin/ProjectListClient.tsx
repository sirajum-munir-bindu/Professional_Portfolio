"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProjectCaseStudy } from "@/types";
import { deleteProjectAction, saveProjectAction } from "@/app/actions/admin-actions";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  EyeOff,
  Eye,
  Star,
  Network,
} from "lucide-react";

interface ProjectListClientProps {
  initialProjects: ProjectCaseStudy[];
}

export function ProjectListClient({ initialProjects }: ProjectListClientProps) {
  const [projects, setProjects] = useState<ProjectCaseStudy[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublished = async (project: ProjectCaseStudy) => {
    const updated = { ...project, published: !project.published };
    setProjects(projects.map((p) => (p.id === project.id ? updated : p)));
    await saveProjectAction(updated);
  };

  const handleToggleFeatured = async (project: ProjectCaseStudy) => {
    const updated = { ...project, featured: !project.featured };
    setProjects(projects.map((p) => (p.id === project.id ? updated : p)));
    await saveProjectAction(updated);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you certain you want to delete "${title}"? This action cannot be reversed.`)) {
      return;
    }
    setDeletingId(id);
    const res = await deleteProjectAction(id);
    setDeletingId(null);
    if (res.success) {
      setProjects(projects.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete project: " + res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blueprints by name, category, or stack..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-surface-border text-xs text-white placeholder:text-muted-foreground/60 focus:border-accent"
          />
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
        </div>

        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>New Architecture Blueprint</span>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted/70 border-b border-surface-border font-mono text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No engineering blueprints matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Project info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-surface-muted shrink-0 border border-surface-border">
                          <Image
                            src={proj.coverImage}
                            alt={proj.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/projects/${proj.id}`}
                            className="font-semibold text-white hover:text-accent transition-colors block text-xs"
                          >
                            {proj.title}
                          </Link>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            /{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground text-[11px]">
                      {proj.category}
                    </td>

                    {/* Status Toggles */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(proj)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            proj.published
                              ? "bg-accent/15 text-accent border border-accent/30"
                              : "bg-surface-muted text-muted-foreground border border-surface-border"
                          }`}
                          title="Toggle Public Visibility"
                        >
                          {proj.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{proj.published ? "Published" : "Draft"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(proj)}
                          className={`p-1 rounded text-[10px] transition-colors ${
                            proj.featured
                              ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                              : "text-muted-foreground hover:text-white"
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star className={`w-3.5 h-3.5 ${proj.featured ? "fill-amber-400" : ""}`} />
                        </button>
                      </div>
                    </td>

                    {/* Diagram Indicator */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {proj.architectureDiagram ? (
                        <span className="inline-flex items-center gap-1 text-accent">
                          <Network className="w-3 h-3" />
                          <span>{proj.architectureDiagram.nodes.length} Nodes</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">&mdash;</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/${proj.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-surface-border text-muted-foreground hover:text-white transition-colors"
                          title="Preview Case Study"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/projects/${proj.id}`}
                          className="p-1.5 rounded-lg border border-surface-border text-muted-foreground hover:text-white transition-colors"
                          title="Edit Blueprint"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id, proj.title)}
                          disabled={deletingId === proj.id}
                          className="p-1.5 rounded-lg border border-surface-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
