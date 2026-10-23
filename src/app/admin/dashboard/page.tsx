import { db } from "@/lib/db";
import Link from "next/link";
import {
  Layers,
  CheckCircle,
  FileText,
  Mail,
  Plus,
  ArrowUpRight,
  AlertCircle,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [allProjects, messages, skills, siteSettings] = await Promise.all([
    db.getAllProjects(),
    db.getContactMessages(),
    db.getSkillCategories(),
    db.getSiteSettings(),
  ]);

  const totalProjects = allProjects.length;
  const publishedProjects = allProjects.filter((p) => p.published).length;
  const draftProjects = totalProjects - publishedProjects;
  const unreadMessages = messages.filter((m) => m.status === "UNREAD");
  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Operations & Content Studio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time status of published blueprints, architecture diagrams, and incoming client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>New Architecture Blueprint</span>
          </Link>
        </div>
      </div>

      {/* Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase tracking-wider">Total Projects</span>
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {totalProjects}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            {publishedProjects} Published &bull; {draftProjects} Drafts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase tracking-wider">Published Blueprints</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {publishedProjects}
          </div>
          <div className="text-[11px] text-accent font-mono">
            Active on Public Feed
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase tracking-wider">Unread Inquiries</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {unreadMessages.length}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            {messages.length} Total Received
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase tracking-wider">Verified Stack</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {totalSkills}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            Across {skills.length} Categories
          </div>
        </div>
      </div>

      {/* Content Needing Attention Alert */}
      {draftProjects > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs">
              You have <strong>{draftProjects} draft project(s)</strong> that are currently hidden from public visitors.
            </span>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-mono underline hover:text-white shrink-0"
          >
            Review Drafts &rarr;
          </Link>
        </div>
      )}

      {/* Split Section: Recent Inquiries & Projects Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-surface-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recent Inquiries Inbox
              </h2>
              <span className="text-xs text-muted-foreground">
                Inquiries submitted through verified portfolio channels
              </span>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No inquiries logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-surface-muted/50 border border-surface-border flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">
                        {msg.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-muted-foreground">
                        {msg.category}
                      </span>
                      {msg.status === "UNREAD" && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </div>
                    <div className="text-xs font-medium text-white/90">
                      {msg.subject}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {msg.message}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Published Status & Settings Snapshot (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-surface border border-surface-border p-6 shadow-card space-y-4">
          <div className="pb-3 border-b border-surface-border">
            <h2 className="text-base font-bold text-white tracking-tight">
              Site Profile Status
            </h2>
            <span className="text-xs text-muted-foreground">
              Configured metadata and public persona
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-muted/40 border border-surface-border flex items-center justify-between">
              <span className="text-muted-foreground">Display Name</span>
              <span className="font-semibold text-white">{siteSettings.displayName}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted/40 border border-surface-border flex items-center justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className={`font-mono font-medium ${siteSettings.availableForWork ? "text-accent" : "text-muted-foreground"}`}>
                {siteSettings.availableForWork ? "Available for Engagements" : "Unavailable"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted/40 border border-surface-border flex items-center justify-between">
              <span className="text-muted-foreground">Primary Inbound Email</span>
              <span className="font-mono text-white/90">{siteSettings.primaryEmail}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted/40 border border-surface-border flex items-center justify-between">
              <span className="text-muted-foreground">Accent Color</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: siteSettings.accentColor }}
                />
                <span className="font-mono text-white">{siteSettings.accentColor}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/settings"
              className="w-full py-2.5 px-4 rounded-xl border border-surface-border text-xs font-mono text-white hover:bg-surface-muted hover:border-accent/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Edit Site Configuration</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
