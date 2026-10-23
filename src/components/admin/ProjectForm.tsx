"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProjectAction } from "@/app/actions/admin-actions";
import { ProjectCaseStudy, ProjectCategoryItem, ArchitectureNode, ArchitectureEdge } from "@/types";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Network,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface ProjectFormProps {
  initialData?: ProjectCaseStudy | null;
  availableCategories?: ProjectCategoryItem[];
}

export function ProjectForm({ initialData, availableCategories = [] }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "Cloud Architecture");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage ||
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
  );
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [published, setPublished] = useState(initialData?.published !== false);
  const [order, setOrder] = useState(initialData?.order || 1);

  // Case study sections
  const [problemStatement, setProblemStatement] = useState(initialData?.problemStatement || "");
  const [solutionOverview, setSolutionOverview] = useState(initialData?.solutionOverview || "");
  const [architectureOverview, setArchitectureOverview] = useState(initialData?.architectureOverview || "");
  const [personalContribution, setPersonalContribution] = useState(initialData?.personalContribution || "");
  const [challengesLearned, setChallengesLearned] = useState(initialData?.challengesLearned || "");

  // Dynamic Array Fields
  const [keyFeatures, setKeyFeatures] = useState<string[]>(
    initialData?.keyFeatures && initialData.keyFeatures.length > 0
      ? initialData.keyFeatures
      : ["Zero-copy serialization with Protocol Buffers and custom ring-buffer queues"]
  );
  const [newFeatureText, setNewFeatureText] = useState("");

  const [verifiedOutcomes, setVerifiedOutcomes] = useState<string[]>(
    initialData?.verifiedOutcomes || ["Reduced p99 ingestion latency from 85ms to 4.2ms"]
  );
  const [newOutcomeText, setNewOutcomeText] = useState("");

  // Technologies
  const [technologies, setTechnologies] = useState<{ name: string; category: string; order: number }[]>(
    initialData?.technologies?.map((t, idx) => ({
      name: t.name,
      category: t.category,
      order: t.order ?? idx + 1,
    })) || [
      { name: "Go / Golang", category: "Backend", order: 1 },
      { name: "Apache Kafka", category: "Infrastructure", order: 2 },
    ]
  );
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState("Backend");

  // Architecture Diagram State
  const [enableDiagram, setEnableDiagram] = useState(Boolean(initialData?.architectureDiagram));
  const [diagramTitle, setDiagramTitle] = useState(
    initialData?.architectureDiagram?.title || "Production System Blueprint"
  );
  const [diagramDescription, setDiagramDescription] = useState(
    initialData?.architectureDiagram?.description || "High-level topology & pipeline"
  );
  const [nodes, setNodes] = useState<ArchitectureNode[]>(
    initialData?.architectureDiagram?.nodes || [
      {
        id: "node-1",
        label: "API Gateway",
        role: "Reverse Proxy & Edge Ingress",
        description: "Terminates TLS, validates JWT tokens, routes upstream traffic.",
        tier: "api",
        status: "operational",
        techStack: ["Envoy", "Go"],
      },
      {
        id: "node-2",
        label: "Worker Broker",
        role: "Event Pipeline",
        description: "In-memory ring buffer with partition consensus.",
        tier: "queue",
        status: "active",
        techStack: ["Kafka", "Raft"],
      },
    ]
  );
  const [edges, setEdges] = useState<ArchitectureEdge[]>(
    initialData?.architectureDiagram?.edges || [
      { id: "e1", source: "node-1", target: "node-2", label: "gRPC", protocol: "gRPC" },
    ]
  );

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setKeyFeatures([...keyFeatures, newFeatureText.trim()]);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== idx));
  };

  const handleAddOutcome = () => {
    if (!newOutcomeText.trim()) return;
    setVerifiedOutcomes([...verifiedOutcomes, newOutcomeText.trim()]);
    setNewOutcomeText("");
  };

  const handleRemoveOutcome = (idx: number) => {
    setVerifiedOutcomes(verifiedOutcomes.filter((_, i) => i !== idx));
  };

  const handleAddTech = () => {
    if (!newTechName.trim()) return;
    setTechnologies([
      ...technologies,
      { name: newTechName.trim(), category: newTechCategory, order: technologies.length + 1 },
    ]);
    setNewTechName("");
  };

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  // Node & Edge manipulation
  const handleAddNode = () => {
    const newId = `node-${Date.now()}`;
    setNodes([
      ...nodes,
      {
        id: newId,
        label: "New Node",
        role: "Microservice",
        description: "Performs isolated service duties.",
        tier: "api",
        status: "operational",
        techStack: ["TypeScript"],
      },
    ]);
  };

  const handleRemoveNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.source !== id && e.target !== id));
  };

  const handleAddEdge = () => {
    if (nodes.length < 2) return;
    const newId = `e-${Date.now()}`;
    setEdges([
      ...edges,
      {
        id: newId,
        source: nodes[0].id,
        target: nodes[1].id,
        protocol: "HTTPS/REST",
      },
    ]);
  };

  const handleRemoveEdge = (id: string) => {
    setEdges(edges.filter((e) => e.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      id: initialData?.id,
      title,
      slug,
      category,
      shortDescription,
      coverImage,
      demoUrl: demoUrl.trim() ? demoUrl.trim() : null,
      githubUrl: githubUrl.trim() ? githubUrl.trim() : null,
      videoUrl: videoUrl.trim() ? videoUrl.trim() : null,
      featured,
      published,
      order: Number(order),
      problemStatement,
      solutionOverview,
      architectureOverview,
      keyFeatures,
      personalContribution,
      verifiedOutcomes,
      challengesLearned: challengesLearned.trim() ? challengesLearned.trim() : null,
      technologies,
      architectureDiagram: enableDiagram
        ? {
            title: diagramTitle,
            description: diagramDescription,
            nodes,
            edges,
          }
        : null,
    };

    const res = await saveProjectAction(payload);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Failed to persist project.");
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl border border-surface-border text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {initialData ? `Edit: ${initialData.title}` : "New Architecture Project"}
            </h1>
            <span className="text-xs text-muted-foreground">
              Configure system case studies and interactive blueprints
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{initialData ? "Save Changes" : "Publish Project"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Metadata */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          1. System Identity & Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Nexus Stream: High-Throughput Event Mesh"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. nexus-event-mesh"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            >
              {availableCategories.length > 0 ? (
                availableCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {!c.visible ? "(Hidden on frontend)" : ""}
                  </option>
                ))
              ) : (
                <>
                  <option value="Cloud Architecture">Cloud Architecture</option>
                  <option value="Full-Stack System">Full-Stack System</option>
                  <option value="DevOps & SRE">DevOps & SRE</option>
                  <option value="AI & Data Engineering">AI & Data Engineering</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Cover Image URL *</label>
            <input
              type="url"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Display Priority (Order)</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Short Description *</label>
          <textarea
            rows={2}
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One or two sentences summarizing the engineering core and scale..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Live Demo URL</label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded bg-surface-muted border-surface-border text-accent focus:ring-accent"
            />
            <span>Published (Visible to Public Visitors)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded bg-surface-muted border-surface-border text-accent focus:ring-accent"
            />
            <span>Featured Case Study</span>
          </label>
        </div>
      </div>

      {/* Case Study Sections */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          2. Case Study Blueprint Sections
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Problem Statement *</label>
          <textarea
            rows={3}
            required
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="Detailed description of the engineering bottleneck, scale constraints, or reliability breakdown..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Solution Overview *</label>
          <textarea
            rows={3}
            required
            value={solutionOverview}
            onChange={(e) => setSolutionOverview(e.target.value)}
            placeholder="The architectural approach chosen to solve the challenge..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Architecture Overview *</label>
          <textarea
            rows={3}
            required
            value={architectureOverview}
            onChange={(e) => setArchitectureOverview(e.target.value)}
            placeholder="Detailed system architecture, data pipelines, and failover mechanics..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Personal Contribution *</label>
          <textarea
            rows={2}
            required
            value={personalContribution}
            onChange={(e) => setPersonalContribution(e.target.value)}
            placeholder="Your specific role, authored modules, and architectural decisions..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Challenges & Lessons Learned</label>
          <textarea
            rows={2}
            value={challengesLearned}
            onChange={(e) => setChallengesLearned(e.target.value)}
            placeholder="Toughest debugging moments, race conditions, or kernel tunings..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>
      </div>

      {/* Dynamic Features & Outcomes */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-6">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          3. Key Features & Verified Metrics
        </h2>

        {/* Key Features */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-white block">Key Technical Features</label>
          <div className="space-y-2">
            {keyFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-muted border border-surface-border text-xs text-white">
                <span className="flex-1">{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(i)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newFeatureText}
              onChange={(e) => setNewFeatureText(e.target.value)}
              placeholder="Add technical feature..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Verified Outcomes */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <label className="text-xs font-mono text-white block">Verified Production Outcomes</label>
          <div className="space-y-2">
            {verifiedOutcomes.map((out, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-muted border border-surface-border text-xs text-white">
                <span className="flex-1">{out}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOutcome(i)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newOutcomeText}
              onChange={(e) => setNewOutcomeText(e.target.value)}
              placeholder="e.g. Reduced p99 latency from 85ms to 4.2ms..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddOutcome}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <label className="text-xs font-mono text-white block">Applied Technologies</label>
          <div className="flex flex-wrap gap-2">
            {technologies.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
              >
                <span>{t.name}</span>
                <span className="text-[10px] text-muted-foreground">({t.category})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(idx)}
                  className="text-muted-foreground hover:text-rose-400"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newTechName}
              onChange={(e) => setNewTechName(e.target.value)}
              placeholder="Tech name (e.g. Redis)"
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
            />
            <select
              value={newTechCategory}
              onChange={(e) => setNewTechCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Observability">Observability</option>
            </select>
            <button
              type="button"
              onClick={handleAddTech}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Architecture Diagram Builder */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              4. Interactive Architecture Blueprint
            </h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
            <input
              type="checkbox"
              checked={enableDiagram}
              onChange={(e) => setEnableDiagram(e.target.checked)}
              className="rounded bg-surface-muted border-surface-border text-accent focus:ring-accent"
            />
            <span>Enable Diagram on Case Study</span>
          </label>
        </div>

        {enableDiagram && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-white block">Diagram Title</label>
                <input
                  type="text"
                  value={diagramTitle}
                  onChange={(e) => setDiagramTitle(e.target.value)}
                  className="w-full px-3.5 py-1.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-white block">Description</label>
                <input
                  type="text"
                  value={diagramDescription}
                  onChange={(e) => setDiagramDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                />
              </div>
            </div>

            {/* Nodes Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white block font-semibold">
                  Architecture Nodes ({nodes.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddNode}
                  className="px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-xs text-accent hover:border-accent flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Node</span>
                </button>
              </div>

              <div className="space-y-3">
                {nodes.map((node, i) => (
                  <div key={node.id} className="p-3.5 rounded-xl bg-surface-muted/50 border border-surface-border space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={node.label}
                        onChange={(e) => {
                          const updated = [...nodes];
                          updated[i].label = e.target.value;
                          setNodes(updated);
                        }}
                        placeholder="Node Label"
                        className="px-2.5 py-1 rounded bg-surface border border-surface-border text-xs text-white"
                      />
                      <input
                        type="text"
                        value={node.role}
                        onChange={(e) => {
                          const updated = [...nodes];
                          updated[i].role = e.target.value;
                          setNodes(updated);
                        }}
                        placeholder="Role / Responsibility"
                        className="px-2.5 py-1 rounded bg-surface border border-surface-border text-xs text-white"
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={node.tier}
                          onChange={(e) => {
                            const updated = [...nodes];
                            updated[i].tier = e.target.value as ArchitectureNode["tier"];
                            setNodes(updated);
                          }}
                          className="flex-1 px-2.5 py-1 rounded bg-surface border border-surface-border text-xs text-white"
                        >
                          <option value="frontend">Frontend</option>
                          <option value="api">API</option>
                          <option value="auth">Auth</option>
                          <option value="database">Database</option>
                          <option value="cache">Cache</option>
                          <option value="queue">Queue</option>
                          <option value="infrastructure">Infrastructure</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveNode(node.id)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={1}
                      value={node.description}
                      onChange={(e) => {
                        const updated = [...nodes];
                        updated[i].description = e.target.value;
                        setNodes(updated);
                      }}
                      placeholder="Node detailed explanation..."
                      className="w-full px-2.5 py-1 rounded bg-surface border border-surface-border text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Edges Editor */}
            <div className="space-y-3 pt-2 border-t border-surface-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white block font-semibold">
                  Connections / Protocol Edges ({edges.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddEdge}
                  className="px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-xs text-accent hover:border-accent flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Edge</span>
                </button>
              </div>

              <div className="space-y-2">
                {edges.map((edge, i) => (
                  <div key={edge.id} className="p-2.5 rounded-lg bg-surface-muted/50 border border-surface-border flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">From:</span>
                    <select
                      value={edge.source}
                      onChange={(e) => {
                        const updated = [...edges];
                        updated[i].source = e.target.value;
                        setEdges(updated);
                      }}
                      className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-white"
                    >
                      {nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label}
                        </option>
                      ))}
                    </select>

                    <span className="text-[11px] font-mono text-muted-foreground">To:</span>
                    <select
                      value={edge.target}
                      onChange={(e) => {
                        const updated = [...edges];
                        updated[i].target = e.target.value;
                        setEdges(updated);
                      }}
                      className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-white"
                    >
                      {nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={edge.protocol || "gRPC"}
                      onChange={(e) => {
                        const updated = [...edges];
                        updated[i].protocol = e.target.value as ArchitectureEdge["protocol"];
                        setEdges(updated);
                      }}
                      className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-accent font-mono"
                    >
                      <option value="gRPC">gRPC</option>
                      <option value="HTTPS/REST">HTTPS/REST</option>
                      <option value="SQL Connection">SQL Connection</option>
                      <option value="Async Queue">Async Queue</option>
                      <option value="TCP/TLS">TCP/TLS</option>
                      <option value="WebSocket">WebSocket</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveEdge(edge.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{initialData ? "Save Architecture Project" : "Publish Project"}</span>
        </button>
      </div>
    </form>
  );
}
