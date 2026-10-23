import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArchitectureExplorer } from "@/components/architecture/ArchitectureExplorer";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await db.getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.getProjectBySlug(slug, true);
  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Case Study Blueprint`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await db.getProjectBySlug(slug, true);
  const settings = await db.getSiteSettings();
  const allProjects = await db.getPublishedProjects();

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header settings={settings} />

      <main className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Breadcrumb / Back Navigation */}
          <div>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Systems Showcase</span>
            </Link>
          </div>

          {/* Project Title & Meta Banner */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-surface-muted border border-surface-border text-xs font-mono text-accent">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[11px] font-mono text-accent">
                  Featured Case Study
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:border-white/20 text-xs font-medium text-white flex items-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4 text-accent" />
                  <span>Inspect Source Code</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Production Instance</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Media Preview */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-surface-border bg-surface-muted shadow-card">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* Structured Section 1: The Problem & The Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>The Engineering Challenge</span>
              </div>
              <h3 className="text-lg font-bold text-white">Problem & Root Cause</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-accent font-semibold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Architectural Solution</span>
              </div>
              <h3 className="text-lg font-bold text-white">System Architecture Strategy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.solutionOverview}
              </p>
            </div>
          </div>

          {/* Structured Section 2: Interactive Architecture Explorer (If Present) */}
          {project.architectureDiagram && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Architectural Blueprint</span>
              </div>
              <ArchitectureExplorer projects={[project]} />
            </div>
          )}

          {/* Structured Section 3: Technical Implementation Details */}
          <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Core System Implementation</span>
            </div>

            <h3 className="text-xl font-bold text-white">Detailed Architecture Overview</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {project.architectureOverview}
            </p>

            {/* Key Features Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                Critical Technical Highlights:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-surface-muted/60 border border-surface-border flex items-start gap-2.5 text-xs text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Role & Personal Contribution */}
            <div className="pt-4 border-t border-surface-border/60">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-2">
                Personal Engineering Contribution:
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.personalContribution}
              </p>
            </div>
          </div>

          {/* Structured Section 4: Verified Outcomes & Lessons Learned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.verifiedOutcomes && project.verifiedOutcomes.length > 0 && (
              <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 text-accent">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Production Metrics
                </h3>
                <ul className="space-y-2.5">
                  {project.verifiedOutcomes.map((outcome, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.challengesLearned && (
              <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  Edge Cases & Lessons Learned
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {project.challengesLearned}
                </p>
              </div>
            )}
          </div>

          {/* Structured Section 5: Technologies Stack Grid */}
          <div className="rounded-2xl bg-surface border border-surface-border p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
              Applied Technologies & Tooling
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <div
                  key={t.name}
                  className="px-3 py-1.5 rounded-lg bg-surface-muted border border-surface-border text-xs font-mono text-white flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{t.name}</span>
                  <span className="text-[10px] text-muted-foreground">({t.category})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Section 6: Related Projects Footer */}
          {relatedProjects.length > 0 && (
            <div className="pt-10 border-t border-surface-border/60 space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Explore More System Blueprints
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/projects/${rp.slug}`}
                    className="group p-5 rounded-2xl bg-surface border border-surface-border hover:border-accent/40 transition-colors shadow-subtle flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-mono text-accent uppercase tracking-wider">
                        {rp.category}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-accent transition-colors mt-1">
                        {rp.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {rp.shortDescription}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-surface-border/60 flex items-center justify-between text-xs font-mono text-white group-hover:text-accent">
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
