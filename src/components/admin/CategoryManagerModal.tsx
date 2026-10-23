"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectCategoryItem } from "@/types";
import {
  saveProjectCategoryAction,
  deleteProjectCategoryAction,
  toggleProjectCategoryVisibilityAction,
} from "@/app/actions/admin-actions";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Tag,
  Layers,
} from "lucide-react";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProjectCategoryItem[];
  onCategoriesChange: (updated: ProjectCategoryItem[]) => void;
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onCategoriesChange,
}: CategoryManagerModalProps) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<Partial<ProjectCategoryItem> | null>(null);
  const [name, setName] = useState("");
  const [order, setOrder] = useState(1);
  const [visible, setVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingCategory({ id: undefined });
    setName("");
    setOrder(categories.length + 1);
    setVisible(true);
    setError(null);
  };

  const handleStartEdit = (cat: ProjectCategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setOrder(cat.order);
    setVisible(cat.visible);
    setError(null);
  };

  const handleCancelForm = () => {
    setEditingCategory(null);
    setError(null);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const payload = {
      id: editingCategory?.id,
      name: name.trim(),
      order: Number(order),
      visible,
    };

    const res = await saveProjectCategoryAction(payload);
    setIsSubmitting(false);

    if (res.success && res.category) {
      const exists = categories.some((c) => c.id === res.category?.id);
      const updated = exists
        ? categories.map((c) => (c.id === res.category?.id ? res.category : c))
        : [...categories, res.category];
      onCategoriesChange(updated);
      setEditingCategory(null);
      router.refresh();
    } else {
      setError(res.error || "Failed to save category.");
    }
  };

  const handleToggleVisibility = async (cat: ProjectCategoryItem) => {
    const newVisible = !cat.visible;
    const updated = categories.map((c) =>
      c.id === cat.id ? { ...c, visible: newVisible } : c
    );
    onCategoriesChange(updated);
    await toggleProjectCategoryVisibilityAction(cat.id, newVisible);
    router.refresh();
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    const res = await deleteProjectCategoryAction(id);
    if (res.success) {
      onCategoriesChange(categories.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert("Error deleting category: " + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-surface border border-surface-border shadow-card overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Project Categories Manager
              </h2>
              <p className="text-xs text-muted-foreground">
                Control frontend display: create, edit, reorder, or hide categories from public visitors.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-surface-border text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Bar */}
          {!editingCategory && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                {categories.length} configured categories ({categories.filter((c) => c.visible).length} visible on frontend)
              </span>

              <button
                type="button"
                onClick={handleStartCreate}
                className="px-3.5 py-1.5 rounded-xl bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-glow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>
          )}

          {/* Edit / Create Form */}
          {editingCategory && (
            <form
              onSubmit={handleSaveCategory}
              className="p-4 rounded-xl bg-surface-muted/60 border border-accent/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {editingCategory.id ? "Edit Category" : "New Category"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Slug will auto-generate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-mono text-white block">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Distributed Systems"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-white block">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="rounded bg-surface border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Visible on Public Frontend Filter</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-muted-foreground hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-lg bg-accent text-accent-foreground font-semibold text-xs hover:bg-accent-hover shadow-glow"
                  >
                    {isSubmitting ? "Saving..." : "Save Category"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-border flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface border border-surface-border text-muted-foreground">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        /{cat.slug}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      Order: {cat.order}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Visibility Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                      cat.visible
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "bg-surface text-muted-foreground border border-surface-border"
                    }`}
                    title={cat.visible ? "Visible on Frontend (Click to Hide)" : "Hidden from Frontend (Click to Show)"}
                  >
                    {cat.visible ? (
                      <>
                        <Eye className="w-3 h-3 text-accent" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 rounded-lg border border-surface-border text-muted-foreground hover:text-white transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg border border-surface-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface-muted/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
