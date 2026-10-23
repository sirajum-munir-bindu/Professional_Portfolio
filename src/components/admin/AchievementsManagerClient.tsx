"use client";

import { useState } from "react";
import { AchievementItem } from "@/types";
import { saveAchievementAction, deleteAchievementAction } from "@/app/actions/admin-actions";
import { Plus, Trash2, Award, ExternalLink } from "lucide-react";

interface AchievementsManagerClientProps {
  initialAchievements: AchievementItem[];
}

export function AchievementsManagerClient({ initialAchievements }: AchievementsManagerClientProps) {
  const [items, setItems] = useState<AchievementItem[]>(initialAchievements);
  const [editingItem, setEditingItem] = useState<Partial<AchievementItem> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.issuer) return;

    setIsSubmitting(true);
    const achData: AchievementItem = {
      id: editingItem.id || `ach-${Date.now()}`,
      title: editingItem.title,
      issuer: editingItem.issuer,
      date: editingItem.date || "2024-01",
      category: editingItem.category || "CERTIFICATION",
      url: editingItem.url || null,
      description: editingItem.description || null,
      order: editingItem.order ?? 1,
    };

    const res = await saveAchievementAction(achData);
    setIsSubmitting(false);

    if (res.success) {
      const exists = items.some((i) => i.id === achData.id);
      setItems(exists ? items.map((i) => (i.id === achData.id ? achData : i)) : [...items, achData]);
      setEditingItem(null);
    } else {
      alert("Error saving achievement: " + res.error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete achievement "${title}"?`)) return;
    const res = await deleteAchievementAction(id);
    if (res.success) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            setEditingItem({
              title: "",
              issuer: "",
              date: "2024-05",
              category: "CERTIFICATION",
              url: "",
              description: "",
              order: items.length + 1,
            })
          }
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential / Award</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-surface border border-accent/40 shadow-card space-y-4 max-w-xl">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            {editingItem.id ? "Edit Credential" : "Add Credential / Award"}
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Title *</label>
            <input
              type="text"
              required
              value={editingItem.title || ""}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect – Professional"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Issuer / Organization *</label>
              <input
                type="text"
                required
                value={editingItem.issuer || ""}
                onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })}
                placeholder="e.g. Amazon Web Services"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Category</label>
              <select
                value={editingItem.category || "CERTIFICATION"}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    category: e.target.value as AchievementItem["category"],
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
              >
                <option value="CERTIFICATION">Certification</option>
                <option value="AWARD">Award / Contest</option>
                <option value="HACKATHON">Hackathon Win</option>
                <option value="TALK">Conference Talk / Keynote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Date (YYYY-MM) *</label>
              <input
                type="text"
                required
                value={editingItem.date || ""}
                onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                placeholder="2024-04"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Verification Link (URL)</label>
              <input
                type="url"
                value={editingItem.url || ""}
                onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Description</label>
            <textarea
              rows={2}
              value={editingItem.description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              placeholder="What this credential evaluated or validated..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-xl border border-surface-border text-xs text-muted-foreground hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover shadow-glow"
            >
              Save Credential
            </button>
          </div>
        </form>
      )}

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-surface border border-surface-border shadow-subtle space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider block">
                  {item.category} &bull; {item.date}
                </span>
                <h4 className="font-semibold text-sm text-white mt-0.5">
                  {item.title}
                </h4>
                <div className="text-xs text-muted-foreground">
                  Issuer: {item.issuer}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-muted-foreground hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-white border border-surface-border"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground pt-1 border-t border-surface-border/60">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
