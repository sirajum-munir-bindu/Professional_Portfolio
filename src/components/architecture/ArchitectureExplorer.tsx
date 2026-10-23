"use client";

import { useState } from "react";
import { ProjectCaseStudy, ArchitectureNode } from "@/types";
import { Network, Server, Shield, Database, Cpu, HardDrive, ArrowRight, Activity, Terminal } from "lucide-react";

interface ArchitectureExplorerProps {
  projects: ProjectCaseStudy[];
}

export function ArchitectureExplorer({ projects }: ArchitectureExplorerProps) {
  // Only projects that possess an architecture diagram
  const archProjects = projects.filter(
    (p) => p.architectureDiagram && p.architectureDiagram.nodes.length > 0
  );

  const [activeProjectSlug, setActiveProjectSlug] = useState<string>(
    archProjects[0]?.slug || ""
  );

  const currentProject =
    archProjects.find((p) => p.slug === activeProjectSlug) || archProjects[0];

  const diagram = currentProject?.architectureDiagram;

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    diagram?.nodes[0]?.id || ""
  );

  if (!diagram || diagram.nodes.length === 0) {
    return null;
  }

  const selectedNode =
    diagram.nodes.find((n) => n.id === selectedNodeId) || diagram.nodes[0];

  // Helper to get connected edges for selected node
  const inboundEdges = diagram.edges.filter((e) => e.target === selectedNode.id);
  const outboundEdges = diagram.edges.filter((e) => e.source === selectedNode.id);

  // Helper icons for tiers
  const getTierIcon = (tier: ArchitectureNode["tier"]) => {
    switch (tier) {
      case "frontend":
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case "api":
        return <Server className="w-4 h-4 text-blue-400" />;
      case "auth":
        return <Shield className="w-4 h-4 text-purple-400" />;
      case "database":
        return <Database className="w-4 h-4 text-amber-400" />;
      case "cache":
        return <Cpu className="w-4 h-4 text-rose-400" />;
      case "queue":
        return <Activity className="w-4 h-4 text-cyan-400" />;
      default:
        return <HardDrive className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <section id="architecture" className="py-24 border-t border-surface-border/60 bg-[#08090d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>Interactive Architecture Explorer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              System Topology & Data Pipelines
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
              Inspect real distributed blueprints. Select nodes to evaluate tier boundaries, consensus mechanisms, caching strategies, and failover topologies.
            </p>
          </div>

          {/* Project Architecture Selector */}
          {archProjects.length > 1 && (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface border border-surface-border overflow-x-auto max-w-full">
              {archProjects.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => {
                    setActiveProjectSlug(p.slug);
                    if (p.architectureDiagram?.nodes[0]) {
                      setSelectedNodeId(p.architectureDiagram.nodes[0].id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentProject.slug === p.slug
                      ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {p.title.split(":")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Diagram & Node Deep-Dive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Topology Visual (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 shadow-card overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
              <div>
                <span className="text-xs font-mono font-semibold text-white">
                  {diagram.title}
                </span>
                <span className="text-xs text-muted-foreground block text-[11px] mt-0.5">
                  Click any node to inspect protocols & failover architecture
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Active Blueprint
              </div>
            </div>

            {/* Interactive Nodes Flowchart Matrix */}
            <div className="space-y-3.5 py-2">
              {diagram.nodes.map((node) => {
                const isSelected = node.id === selectedNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected
                        ? "bg-surface-muted border-accent/70 shadow-glow"
                        : "bg-surface-muted/40 border-surface-border hover:border-white/20 hover:bg-surface-muted/70"
                    }`}
                    aria-label={`Inspect ${node.label}`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-lg border ${
                          isSelected
                            ? "bg-accent/10 border-accent/30 text-accent"
                            : "bg-surface border-surface-border text-muted-foreground group-hover:text-white"
                        }`}
                      >
                        {getTierIcon(node.tier)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white group-hover:text-accent transition-colors">
                            {node.label}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-muted-foreground">
                            {node.tier}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground block mt-0.5 line-clamp-1">
                          {node.role} &bull; {node.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {node.status && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 hidden sm:inline">
                          {node.status}
                        </span>
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected
                            ? "text-accent translate-x-1"
                            : "text-muted-foreground group-hover:text-white"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Protocol Connections Footer Legend */}
            <div className="mt-5 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="text-white/40">Verified Protocols:</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-surface-border">gRPC / Protobuf</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-surface-border">HTTPS / REST</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-surface-border">ACID Serialization</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-surface-border">Raft Quorum</span>
            </div>
          </div>

          {/* Node Inspector Deep-Dive Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-surface border border-surface-border p-4 sm:p-7 shadow-card space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-border">
              <div>
                <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Node Architecture Deep-Dive
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedNode.label}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  Role: {selectedNode.role}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-surface-muted border border-surface-border text-accent">
                {getTierIcon(selectedNode.tier)}
              </div>
            </div>

            {/* Responsibility Overview */}
            <div>
              <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
                System Responsibility
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed bg-surface-muted/50 p-3.5 rounded-xl border border-surface-border">
                {selectedNode.description}
              </p>
            </div>

            {/* Tech Stack for this Node */}
            {selectedNode.techStack && selectedNode.techStack.length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-2">
                  Engineered With
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-border text-xs font-mono text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Inbound & Outbound Data Connections */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                Inter-Service Pipeline Links
              </h4>

              {inboundEdges.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted-foreground block">
                    Inbound Feeds:
                  </span>
                  {inboundEdges.map((e) => (
                    <div
                      key={e.id}
                      className="text-xs font-mono p-2 rounded-lg bg-surface-muted/40 border border-surface-border flex items-center justify-between text-muted-foreground"
                    >
                      <span>From: {diagram.nodes.find((n) => n.id === e.source)?.label || e.source}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                        {e.protocol || "TCP/TLS"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {outboundEdges.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted-foreground block">
                    Outbound Dispatches:
                  </span>
                  {outboundEdges.map((e) => (
                    <div
                      key={e.id}
                      className="text-xs font-mono p-2 rounded-lg bg-surface-muted/40 border border-surface-border flex items-center justify-between text-muted-foreground"
                    >
                      <span>To: {diagram.nodes.find((n) => n.id === e.target)?.label || e.target}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                        {e.protocol || "TCP/TLS"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
