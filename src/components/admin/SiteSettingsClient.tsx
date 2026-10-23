"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteSettingsData } from "@/types";
import { saveSiteSettingsAction } from "@/app/actions/admin-actions";
import { Save, AlertCircle, CheckCircle2, Upload, User, ExternalLink } from "lucide-react";

interface SiteSettingsClientProps {
  initialSettings: SiteSettingsData;
}

const ACCENT_PRESETS = [
  { name: "Emerald", hex: "#10b981" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Lime", hex: "#84cc16" },
];

export function SiteSettingsClient({ initialSettings }: SiteSettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidHex = (hex: string) => /^#[0-9a-fA-F]{6}$/.test(hex);

  const handleAccentChange = (rawColor: string) => {
    let clean = rawColor.trim();
    if (clean && !clean.startsWith("#")) {
      clean = `#${clean}`;
    }
    setSettings((prev) => ({ ...prev, accentColor: clean }));
    if (isValidHex(clean)) {
      document.documentElement.style.setProperty("--accent", clean);
    }
  };

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
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSettings((prev) => ({ ...prev, avatarUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar image");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    const res = await saveSiteSettingsAction(settings);
    setIsSubmitting(false);

    if (res.success && res.settings) {
      setMessage("Site settings & branding successfully updated and revalidated.");
      setSettings(res.settings);
    } else {
      setError(res.error || "Failed to update settings.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex justify-end w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save System Settings</span>
        </button>
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

      {/* Identity & Headline */}
      <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 space-y-4 shadow-card">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          1. Public Identity & Positioning
        </h2>

        {/* Profile Picture / Avatar Field */}
        <div className="p-4 rounded-xl bg-surface-muted/50 border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-mono font-semibold text-white block">
                Profile Picture / Hero Portrait URL
              </label>
              <span className="text-[11px] text-muted-foreground">
                Displays in the Hero section visual card. Paste a URL or select a picture from Media Storage.
              </span>
            </div>
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
            {/* Live Preview */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface border border-surface-border shrink-0 flex items-center justify-center shadow-subtle">
              {settings.avatarUrl ? (
                <Image
                  src={settings.avatarUrl}
                  alt="Profile Avatar Preview"
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
                value={settings.avatarUrl || ""}
                onChange={(e) => setSettings({ ...settings, avatarUrl: e.target.value })}
                placeholder="https://... (copied from /admin/media)"
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-white text-xs font-mono"
              />

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-white hover:border-accent/40 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-accent" />
                  <span>{isUploadingAvatar ? "Uploading Payload..." : "Upload New Picture"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    className="hidden"
                  />
                </label>

                {settings.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, avatarUrl: "" })}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Display Name *</label>
            <input
              type="text"
              required
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Header Role Sub-title / Tagline</label>
            <input
              type="text"
              placeholder="e.g. Systems Architect"
              value={settings.roleTitle || ""}
              onChange={(e) => setSettings({ ...settings, roleTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
            <span className="text-[10px] text-muted-foreground block">
              Shown in uppercase right below your name in the header navigation bar.
            </span>
          </div>
        </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-white block">Accent Hex Color *</label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="accentColorPicker"
                className="relative w-10 h-10 rounded-xl border border-surface-border cursor-pointer overflow-hidden flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95"
                style={{ backgroundColor: isValidHex(settings.accentColor) ? settings.accentColor : "#10b981" }}
                title="Click to open color palette"
              >
                <input
                  id="accentColorPicker"
                  type="color"
                  value={isValidHex(settings.accentColor) ? settings.accentColor : "#10b981"}
                  onChange={(e) => handleAccentChange(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>

              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="#10b981"
                  value={settings.accentColor}
                  onChange={(e) => handleAccentChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono uppercase focus:border-accent"
                />
              </div>
            </div>

            {/* One-Click Palette Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-muted-foreground mr-1">Presets:</span>
              {ACCENT_PRESETS.map((p) => {
                const isSelected = settings.accentColor.toLowerCase() === p.hex.toLowerCase();
                return (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => handleAccentChange(p.hex)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                      isSelected
                        ? "border-white text-white bg-white/10 shadow-sm"
                        : "border-white/10 text-muted-foreground hover:text-white hover:border-white/30 bg-surface"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Professional Headline *</label>
          <input
            type="text"
            required
            value={settings.headline}
            onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Short Biography *</label>
          <textarea
            rows={3}
            required
            value={settings.bio}
            onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Primary Email *</label>
            <input
              type="email"
              required
              value={settings.primaryEmail}
              onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Location / Work Mode *</label>
            <input
              type="text"
              required
              value={settings.location}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
            <input
              type="checkbox"
              checked={settings.availableForWork}
              onChange={(e) => setSettings({ ...settings, availableForWork: e.target.checked })}
              className="rounded bg-surface-muted border-surface-border text-accent focus:ring-accent"
            />
            <span>Show Availability Indicator on Public Header</span>
          </label>
        </div>
      </div>

      {/* Social Profiles & SEO */}
      <div className="rounded-2xl bg-surface border border-surface-border p-4 sm:p-6 space-y-4 shadow-card">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          2. Social Links & SEO Optimization
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">GitHub URL *</label>
            <input
              type="url"
              required
              value={settings.githubUrl}
              onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">LinkedIn URL *</label>
            <input
              type="url"
              required
              value={settings.linkedinUrl}
              onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Twitter / X URL</label>
            <input
              type="url"
              value={settings.twitterUrl || ""}
              onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Resume / CV Download URL</label>
            <input
              type="text"
              value={settings.resumeUrl || ""}
              onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-mono text-white block">Meta Title (SEO) *</label>
          <input
            type="text"
            required
            value={settings.metaTitle}
            onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-white block">Meta Description (SEO) *</label>
          <textarea
            rows={2}
            required
            value={settings.metaDescription}
            onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
          />
        </div>
      </div>

      {/* Bottom Save Action for Mobile Convenience */}
      <div className="flex justify-end w-full pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save System Settings</span>
        </button>
      </div>
    </form>
  );
}
