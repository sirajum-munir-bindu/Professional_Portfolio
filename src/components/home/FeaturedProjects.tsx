"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink, Layers, CheckCircle2 } from "lucide-react";
import { ProjectCaseStudy, ProjectCategoryItem } from "@/types";

interface FeaturedProjectsProps {
  projects: ProjectCaseStudy[];
  availableCategories?: ProjectCategoryItem[];
}

export function FeaturedProjects({ projects, availableCategories }: FeaturedProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Derive visible categories strictly from the backend categories configuration
  const activeCategories = availableCategories
    ? availableCategories.filter((c) => c.visible).sort((a, b) => a.order - b.order)
    : [];

  const visibleCategoryNames = availableCategories
    ? activeCategories.map((c) => c.name)
    : Array.from(new Set(projects.map((p) => p.category)));

  const categories = ["ALL", ...visibleCategoryNames];

  // Safeguard: if active filter was hidden in backend, fall back to "ALL"
  const activeFilter = categories.includes(selectedCategory) ? selectedCategory : "ALL";

  const visibleProjects = availableCategories
    ? projects.filter((p) => visibleCategoryNames.includes(p.category))
    : projects;

  const filteredProjects =
    activeFilter === "ALL"
      ? visibleProjects
      : visibleProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 border-t border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Production Systems & Digital Products</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Engineering Projects
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
              Real-world systems, mission-critical distributed architectures, and audited software products. Every project includes structured architectural blueprints and verified production metrics.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface border border-surface-border">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeFilter === cat
                    ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {cat === "ALL" ? "All Systems" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-surface border border-surface-border hover:border-accent/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-card hover:shadow-glow"
            >
              {/* Media Preview Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

                {/* Category & Status Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-accent/20 border border-accent/30 text-[10px] font-mono text-accent">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* External Quick Links */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-accent hover:border-accent/40 transition-colors"
                      title="GitHub Repository"
                      aria-label={`${project.title} GitHub Repository`}
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-accent hover:border-accent/40 transition-colors"
                      title="Live System Demo"
                      aria-label={`${project.title} Live System Demo`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Verified Outcomes Highlight */}
                  {project.verifiedOutcomes && project.verifiedOutcomes.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-surface-muted/60 border border-surface-border/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-accent font-semibold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Outcomes</span>
                      </div>
                      <p className="text-xs text-white/90">
                        {project.verifiedOutcomes[0]}
                      </p>
                    </div>
                  )}

                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech.name}
                        className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-surface-border text-[11px] font-mono text-muted-foreground"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="px-2 py-1 rounded-md text-[11px] font-mono text-muted-foreground">
                        +{project.technologies.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-6 mt-6 border-t border-surface-border/60 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-white group-hover:text-accent transition-colors"
                  >
                    <span>Read Architecture Blueprint</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  {project.architectureDiagram && (
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      Interactive Diagram
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
