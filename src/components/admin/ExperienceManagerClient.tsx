"use client";

import { useState } from "react";
import { ExperienceItem } from "@/types";
import { saveExperienceAction, deleteExperienceAction } from "@/app/actions/admin-actions";
import { Plus, Trash2, Calendar, MapPin, CheckCircle2 } from "lucide-react";

interface ExperienceManagerClientProps {
  initialExperience: ExperienceItem[];
}

export function ExperienceManagerClient({ initialExperience }: ExperienceManagerClientProps) {
  const [items, setItems] = useState<ExperienceItem[]>(initialExperience);
  const [editingItem, setEditingItem] = useState<Partial<ExperienceItem> | null>(null);
  const [newHighlight, setNewHighlight] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.company || !editingItem.role) return;

    setIsSubmitting(true);
    const expData: ExperienceItem = {
      id: editingItem.id || `exp-${Date.now()}`,
      company: editingItem.company,
      role: editingItem.role,
      location: editingItem.location || null,
      startDate: editingItem.startDate || "2023-01",
      endDate: editingItem.current ? null : editingItem.endDate || null,
      current: Boolean(editingItem.current),
      type: editingItem.type || "FULL_TIME",
      description: editingItem.description || "",
      highlights: editingItem.highlights || [],
      order: editingItem.order ?? 1,
    };

    const res = await saveExperienceAction(expData);
    setIsSubmitting(false);

    if (res.success) {
      const exists = items.some((i) => i.id === expData.id);
      setItems(exists ? items.map((i) => (i.id === expData.id ? expData : i)) : [...items, expData]);
      setEditingItem(null);
    } else {
      alert("Error saving experience: " + res.error);
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (!confirm(`Delete experience record "${role}"?`)) return;
    const res = await deleteExperienceAction(id);
    if (res.success) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const addHighlight = () => {
    if (!newHighlight.trim() || !editingItem) return;
    setEditingItem({
      ...editingItem,
      highlights: [...(editingItem.highlights || []), newHighlight.trim()],
    });
    setNewHighlight("");
  };

  const removeHighlight = (idx: number) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      highlights: (editingItem.highlights || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            setEditingItem({
              company: "",
              role: "",
              location: "San Francisco, CA",
              startDate: "2024-01",
              endDate: null,
              current: true,
              type: "FULL_TIME",
              description: "",
              highlights: [],
              order: items.length + 1,
            })
          }
          className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Milestone</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-4 sm:p-6 rounded-2xl bg-surface border border-accent/40 shadow-card space-y-4 max-w-2xl">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            {editingItem.id ? "Edit Career Record" : "Add Career Record"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Company *</label>
              <input
                type="text"
                required
                value={editingItem.company || ""}
                onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                placeholder="e.g. CloudScale Systems"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Role Title *</label>
              <input
                type="text"
                required
                value={editingItem.role || ""}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                placeholder="e.g. Staff Software Engineer"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">Start Date *</label>
              <input
                type="text"
                required
                value={editingItem.startDate || ""}
                onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                placeholder="2023-03"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white block">End Date (or Current)</label>
              <input
                type="text"
                disabled={Boolean(editingItem.current)}
                value={editingItem.endDate || ""}
                onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                placeholder="2024-01"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs font-mono disabled:opacity-40"
              />
            </div>

            <div className="space-y-1.5 flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                <input
                  type="checkbox"
                  checked={Boolean(editingItem.current)}
                  onChange={(e) => setEditingItem({ ...editingItem, current: e.target.checked })}
                  className="rounded bg-surface-muted border-surface-border text-accent focus:ring-accent"
                />
                <span>Current Role</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Scope & Responsibilities *</label>
            <textarea
              rows={2}
              required
              value={editingItem.description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              placeholder="Summary of engineering focus..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-white block">Accomplishments / Highlights</label>
            <div className="space-y-1.5">
              {(editingItem.highlights || []).map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-muted border border-surface-border text-xs text-white">
                  <span className="flex-1">{h}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add verified accomplishment bullet..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-surface-muted border border-surface-border text-xs text-white"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
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
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Experience Timeline List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-surface border border-surface-border shadow-subtle space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white">
                  {item.role}
                </h3>
                <div className="text-xs text-accent font-medium mt-0.5">
                  {item.company} &bull; {item.startDate} &mdash; {item.current ? "Present" : item.endDate}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-white border border-surface-border"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.role)}
                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>

            {item.highlights && item.highlights.length > 0 && (
              <ul className="space-y-1 pt-1 border-t border-surface-border/60">
                {item.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-white/90 flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
