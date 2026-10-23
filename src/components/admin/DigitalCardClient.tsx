"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettingsData } from "@/types";
import { saveDigitalCardAction, saveActiveDisplayModeAction } from "@/app/actions/admin-actions";
import { DigitalVisitingCard } from "@/components/card/DigitalVisitingCard";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  User,
  ExternalLink,
  Sparkles,
  Smartphone,
  Eye,
  Check,
  Download,
  Plus,
  Trash2,
  Globe,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface DigitalCardClientProps {
  initialSettings: SiteSettingsData;
}

export function DigitalCardClient({ initialSettings }: DigitalCardClientProps) {
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  // Custom links state
  const getInitialCustomLinks = () => {
    if (!initialSettings.cardCustomLinks) return [];
    try {
      const parsed = JSON.parse(initialSettings.cardCustomLinks);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>(getInitialCustomLinks);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSettings((prev) => ({ ...prev, cardAvatarUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar image");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleAddCustomLink = () => {
    setCustomLinks((prev) => [...prev, { label: "", url: "" }]);
  };

  const handleRemoveCustomLink = (index: number) => {
    setCustomLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomLinkChange = (index: number, field: "label" | "url", value: string) => {
    setCustomLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSwitchDisplayMode = async (mode: "PORTFOLIO" | "DIGITAL_CARD") => {
    if (settings.activeDisplayMode === mode) return;
    setIsSwitchingMode(true);
    setMessage(null);
    setError(null);

    try {
      const res = await saveActiveDisplayModeAction(mode);
      if (res.success && res.activeDisplayMode) {
        setSettings((prev) => ({ ...prev, activeDisplayMode: res.activeDisplayMode as any }));
        setMessage(
          `Display Mode Updated: ${
            mode === "PORTFOLIO" ? "Professional Portfolio" : "Premium E-Visiting Card"
          } is now the exclusive active experience at the root domain (/).`
        );
      } else {
        setError(res.error || "Failed to switch website display mode.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch display mode.");
    } finally {
      setIsSwitchingMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    const cardPayload = {
      cardName: settings.cardName || settings.displayName,
      cardTitle: settings.cardTitle || settings.roleTitle,
      cardCompany: settings.cardCompany || "",
      cardBio: settings.cardBio || settings.bio,
      cardAvatarUrl: settings.cardAvatarUrl || settings.avatarUrl,
      cardPhone: settings.cardPhone || "",
      cardWhatsapp: settings.cardWhatsapp || settings.cardPhone || "",
      cardEmail: settings.cardEmail || settings.primaryEmail,
      cardLocation: settings.cardLocation || settings.location,
      cardWebsite: settings.cardWebsite || "",
      cardLinkedin: settings.cardLinkedin || settings.linkedinUrl,
      cardGithub: settings.cardGithub || settings.githubUrl,
      cardTwitter: settings.cardTwitter || settings.twitterUrl,
      cardResumeUrl: settings.cardResumeUrl || settings.resumeUrl,
      cardCustomLinks: JSON.stringify(customLinks.filter((l) => l.label && l.url)),
    };

    const res = await saveDigitalCardAction(cardPayload);
    setIsSubmitting(false);

    if (res.success && res.settings) {
      setMessage("E-Visiting Card content successfully saved and revalidated.");
      setSettings(res.settings);
    } else {
      setError(res.error || "Failed to save E-Visiting Card content.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Mode Status & Exclusive Switch */}
      <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                settings.activeDisplayMode === "DIGITAL_CARD"
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Public Root State:
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                settings.activeDisplayMode === "DIGITAL_CARD"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-surface-muted text-muted-foreground border border-surface-border"
              }`}
            >
              {settings.activeDisplayMode === "DIGITAL_CARD"
                ? "E-VISITING CARD ACTIVE (LIVE AT /)"
                : "PORTFOLIO ACTIVE (CARD IS INACTIVE)"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Saving card changes does NOT force activation. You can safely edit and preview card details anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {settings.activeDisplayMode === "DIGITAL_CARD" ? (
            <button
              type="button"
              disabled={isSwitchingMode}
              onClick={() => handleSwitchDisplayMode("PORTFOLIO")}
              className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-border border border-surface-border text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span>Switch to Portfolio Mode</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSwitchingMode}
              onClick={() => handleSwitchDisplayMode("DIGITAL_CARD")}
              className="px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-semibold flex items-center gap-1.5 shadow-glow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSwitchingMode ? "Activating..." : "Make E-Visiting Card Live at /"}</span>
            </button>
          )}

          <a
            href="/api/card/vcf"
            download
            className="px-3 py-2 rounded-xl bg-surface border border-surface-border hover:border-accent/40 text-xs text-muted-foreground hover:text-white flex items-center gap-1.5 transition-colors"
            title="Download test vCard file"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Test .vcf</span>
          </a>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor / Preview Tabs for Mobile and Desktop View Switch */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "editor"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-white hover:bg-surface"
            }`}
          >
            Card Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "preview"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-white hover:bg-surface"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Interactive Preview</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-3.5 h-3.5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Save Card Content</span>
        </button>
      </div>

      {activeTab === "preview" ? (
        <div className="rounded-2xl border border-surface-border bg-slate-950 p-2 sm:p-4 flex justify-center h-[90vh] overflow-hidden">
          <div className="w-full max-w-md h-full">
            <DigitalVisitingCard
              settings={{
                ...settings,
                cardCustomLinks: JSON.stringify(customLinks.filter((l) => l.label && l.url)),
              }}
              className="h-full max-h-full bg-transparent"
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            {/* Identity & Profile */}
            <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 space-y-4 shadow-card">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <span>1. Card Identity & Profile Photo</span>
              </h2>

              {/* Avatar Upload / URL */}
              <div className="p-4 rounded-xl bg-surface-muted/50 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-white block">
                    Card Avatar / Portrait
                  </label>
                  <Link
                    href="/admin/media"
                    target="_blank"
                    className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    <span>Media Storage</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface border border-surface-border shrink-0 flex items-center justify-center shadow-subtle">
                    {settings.cardAvatarUrl || settings.avatarUrl ? (
                      <Image
                        src={(settings.cardAvatarUrl || settings.avatarUrl) as string}
                        alt="Card Avatar Preview"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={settings.cardAvatarUrl || ""}
                      onChange={(e) => setSettings({ ...settings, cardAvatarUrl: e.target.value })}
                      placeholder={settings.avatarUrl ? "Inheriting from main avatar..." : "https://..."}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-white text-xs font-mono"
                    />

                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-white hover:border-accent/40 cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-accent" />
                        <span>{isUploadingAvatar ? "Uploading..." : "Upload New Avatar"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          onChange={handleAvatarUpload}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </label>

                      {settings.cardAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, cardAvatarUrl: "" })}
                          className="px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={settings.cardName || settings.displayName || ""}
                    onChange={(e) => setSettings({ ...settings, cardName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Professional Title *</label>
                  <input
                    type="text"
                    required
                    value={settings.cardTitle || settings.roleTitle || settings.headline || ""}
                    onChange={(e) => setSettings({ ...settings, cardTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Independent Consulting / Enterprise Co."
                    value={settings.cardCompany || ""}
                    onChange={(e) => setSettings({ ...settings, cardCompany: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Location</label>
                  <input
                    type="text"
                    value={settings.cardLocation || settings.location || ""}
                    onChange={(e) => setSettings({ ...settings, cardLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white block">Short Professional Bio</label>
                <textarea
                  rows={3}
                  value={settings.cardBio || settings.bio || ""}
                  onChange={(e) => setSettings({ ...settings, cardBio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 space-y-4 shadow-card">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-accent" />
                <span>2. Direct Communication & Action Links</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Phone Number (Dialer)</label>
                  <input
                    type="text"
                    placeholder="+880 1700-000000"
                    value={settings.cardPhone || ""}
                    onChange={(e) => setSettings({ ...settings, cardPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Triggered when clicking the &quot;Call&quot; button and stored in the .vcf contact card.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+880 1700-000000"
                    value={settings.cardWhatsapp || ""}
                    onChange={(e) => setSettings({ ...settings, cardWhatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Target of 1-tap WhatsApp chat (wa.me).
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Card Email *</label>
                  <input
                    type="email"
                    value={settings.cardEmail || settings.primaryEmail || ""}
                    onChange={(e) => setSettings({ ...settings, cardEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">CV / Resume Download URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={settings.cardResumeUrl || settings.resumeUrl || ""}
                    onChange={(e) => setSettings({ ...settings, cardResumeUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Social & Professional URLs */}
            <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 space-y-4 shadow-card">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                <span>3. Social Channels & External Links</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={settings.cardLinkedin || settings.linkedinUrl || ""}
                    onChange={(e) => setSettings({ ...settings, cardLinkedin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">GitHub Profile</label>
                  <input
                    type="text"
                    value={settings.cardGithub || settings.githubUrl || ""}
                    onChange={(e) => setSettings({ ...settings, cardGithub: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Twitter / X Profile</label>
                  <input
                    type="text"
                    value={settings.cardTwitter || settings.twitterUrl || ""}
                    onChange={(e) => setSettings({ ...settings, cardTwitter: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white block">Custom Website URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={settings.cardWebsite || ""}
                    onChange={(e) => setSettings({ ...settings, cardWebsite: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Custom Links */}
              <div className="pt-2 border-t border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white block">Additional Custom Links</span>
                  <button
                    type="button"
                    onClick={handleAddCustomLink}
                    className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border hover:border-accent/40 text-xs text-accent flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                {customLinks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Calendly / Substack)"
                      value={item.label}
                      onChange={(e) => handleCustomLinkChange(idx, "label", e.target.value)}
                      className="w-1/3 px-3 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={item.url}
                      onChange={(e) => handleCustomLinkChange(idx, "url", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomLink(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-glow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save E-Visiting Card Changes</span>
              </button>
            </div>
          </div>

          {/* Side Mini Preview Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-6 rounded-2xl bg-surface border border-surface-border p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span>Card Live Look</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* Miniature visual rendering */}
              <div className="rounded-2xl bg-slate-950 p-2 border border-white/10 shadow-inner h-[540px] overflow-hidden flex items-center justify-center">
                <div className="scale-[0.80] origin-center w-full">
                  <DigitalVisitingCard
                    settings={{
                      ...settings,
                      cardCustomLinks: JSON.stringify(customLinks.filter((l) => l.label && l.url)),
                    }}
                    className="h-[600px] max-h-[600px] bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
