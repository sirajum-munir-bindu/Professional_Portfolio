"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  projectSchema,
  skillSchema,
  experienceSchema,
  achievementSchema,
  siteSettingsSchema,
} from "@/lib/validations";
import { ProjectCaseStudy, ExperienceItem, AchievementItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveProjectAction(data: unknown) {
  await requireAdmin();

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
    };
  }

  try {
    const saved = await db.upsertProject(parsed.data as unknown as Partial<ProjectCaseStudy> & { title: string; slug: string });
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${saved.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    return { success: true, project: saved };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to persist project.",
    };
  }
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  try {
    const success = await db.deleteProject(id);
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    return { success };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete project.",
    };
  }
}

export async function saveSkillAction(data: unknown) {
  await requireAdmin();
  const parsed = skillSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid skill parameters",
    };
  }

  try {
    await db.upsertSkill(parsed.data);
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to persist skill.",
    };
  }
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  try {
    await db.deleteSkill(id);
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete skill.",
    };
  }
}

export async function saveExperienceAction(data: unknown) {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid experience parameters",
    };
  }

  try {
    await db.upsertExperience(parsed.data as ExperienceItem);
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to persist experience record.",
    };
  }
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  try {
    await db.deleteExperience(id);
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete experience.",
    };
  }
}

export async function saveAchievementAction(data: unknown) {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid achievement parameters",
    };
  }

  try {
    await db.upsertAchievement(parsed.data as AchievementItem);
    revalidatePath("/");
    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to persist achievement.",
    };
  }
}

export async function deleteAchievementAction(id: string) {
  await requireAdmin();
  try {
    await db.deleteAchievement(id);
    revalidatePath("/");
    revalidatePath("/admin/achievements");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete achievement.",
    };
  }
}

export async function saveSiteSettingsAction(data: unknown) {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Invalid settings format",
    };
  }

  try {
    const updated = await db.updateSiteSettings(parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, settings: updated };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update settings.",
    };
  }
}

export async function updateMessageStatusAction(id: string, status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED") {
  await requireAdmin();
  try {
    await db.updateMessageStatus(id, status);
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update message.",
    };
  }
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  try {
    await db.deleteMessage(id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete message.",
    };
  }
}
