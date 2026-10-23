"use client";

import { useState } from "react";
import { SiteSettingsData } from "@/types";
import { saveSiteSettingsAction } from "@/app/actions/admin-actions";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

interface SiteSettingsClientProps {
  initialSettings: SiteSettingsData;
}

export function SiteSettingsClient({ initialSettings }: SiteSettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-glow disabled:opacity-50"
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
      <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4 shadow-card">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          1. Public Identity & Positioning
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Display Name *</label>
            <input
              type="text"
              required
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Accent Hex Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="w-9 h-9 rounded-lg bg-surface border border-surface-border cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="flex-1 px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
              />
            </div>
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
      <div className="rounded-2xl bg-surface border border-surface-border p-6 space-y-4 shadow-card">
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
    </form>
  );
}
