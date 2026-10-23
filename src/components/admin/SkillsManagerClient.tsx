"use client";

import { useState } from "react";
import { SkillCategoryWithSkills, SkillItem } from "@/types";
import { saveSkillAction, deleteSkillAction } from "@/app/actions/admin-actions";
import { Plus, Trash2, Cpu, CheckCircle } from "lucide-react";

interface SkillsManagerClientProps {
  initialCategories: SkillCategoryWithSkills[];
}

export function SkillsManagerClient({ initialCategories }: SkillsManagerClientProps) {
  const [categories, setCategories] = useState<SkillCategoryWithSkills[]>(initialCategories);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [selectedCatId, setSelectedCatId] = useState(initialCategories[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name) return;

    setIsSubmitting(true);
    const skillId = editingSkill.id || `s-${Date.now()}`;
    const skillData: SkillItem = {
      id: skillId,
      name: editingSkill.name,
      categoryId: selectedCatId,
      shortDescription: editingSkill.shortDescription || "",
      evidenceNote: editingSkill.evidenceNote || "",
      iconName: editingSkill.iconName || "Code",
      order: editingSkill.order ?? 1,
      visible: editingSkill.visible !== false,
    };

    const res = await saveSkillAction(skillData);
    setIsSubmitting(false);

    if (res.success) {
      // update state
      setCategories(
        categories.map((cat) => {
          if (cat.id === selectedCatId) {
            const exists = cat.skills.some((s) => s.id === skillId);
            const skills = exists
              ? cat.skills.map((s) => (s.id === skillId ? skillData : s))
              : [...cat.skills, skillData];
            return { ...cat, skills };
          }
          return cat;
        })
      );
      setEditingSkill(null);
    } else {
      alert("Error saving skill: " + res.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    const res = await deleteSkillAction(id);
    if (res.success) {
      setCategories(
        categories.map((cat) => ({
          ...cat,
          skills: cat.skills.filter((s) => s.id !== id),
        }))
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Category selector & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCatId === cat.id
                  ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                  : "bg-surface border border-surface-border text-muted-foreground hover:text-white"
              }`}
            >
              {cat.name} ({cat.skills.length})
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingSkill({
              name: "",
              shortDescription: "",
              evidenceNote: "",
              categoryId: selectedCatId,
              order: 1,
              visible: true,
            })
          }
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stack Capability</span>
        </button>
      </div>

      {/* Edit / New Modal / Panel */}
      {editingSkill && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-surface border border-accent/40 shadow-card space-y-4 max-w-xl">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            {editingSkill.id ? "Edit Capability" : "Add Technical Capability"}
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Skill Name *</label>
            <input
              type="text"
              required
              value={editingSkill.name || ""}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              placeholder="e.g. Apache Kafka"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Short Description</label>
            <input
              type="text"
              value={editingSkill.shortDescription || ""}
              onChange={(e) => setEditingSkill({ ...editingSkill, shortDescription: e.target.value })}
              placeholder="e.g. Partitioning strategies, consumer groups, exact-once semantics"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white block">Production Evidence Note</label>
            <input
              type="text"
              value={editingSkill.evidenceNote || ""}
              onChange={(e) => setEditingSkill({ ...editingSkill, evidenceNote: e.target.value })}
              placeholder="e.g. Managed multi-AZ Kafka cluster processing billions of events"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-muted border border-surface-border text-white text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 rounded-xl border border-surface-border text-xs text-muted-foreground hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover shadow-glow"
            >
              Save Capability
            </button>
          </div>
        </form>
      )}

      {/* Skills Grid for Active Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories
          .find((c) => c.id === selectedCatId)
          ?.skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-surface border border-surface-border flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="font-semibold text-sm text-white">
                  {skill.name}
                </div>
                {skill.shortDescription && (
                  <p className="text-xs text-muted-foreground">
                    {skill.shortDescription}
                  </p>
                )}
                {skill.evidenceNote && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-accent pt-1">
                    <CheckCircle className="w-3 h-3 text-accent shrink-0" />
                    <span>{skill.evidenceNote}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingSkill(skill)}
                  className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-white border border-surface-border"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id, skill.name)}
                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
