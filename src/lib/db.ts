import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import {
  initialProjects,
  initialProjectCategories,
  initialSkillCategories,
  initialExperience,
  initialEducation,
  initialAchievements,
  initialSiteSettings,
} from "./fallback-data";
import {
  ProjectCaseStudy,
  ProjectCategoryItem,
  SkillCategoryWithSkills,
  ExperienceItem,
  EducationItem,
  AchievementItem,
  SiteSettingsData,
  ContactMessageItem,
} from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var dataStoreGlobal: ResilientDataStore | undefined;
}

const LOCAL_STORE_FILE = path.join(process.cwd(), "prisma", "local-data.json");

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// In-memory runtime cache/fallback store for when database is not yet connected or during local static export
class ResilientDataStore {
  private projects: ProjectCaseStudy[] = [...initialProjects];
  private projectCategories: ProjectCategoryItem[] = [...initialProjectCategories];
  private skillCategories: SkillCategoryWithSkills[] = [...initialSkillCategories];
  private experience: ExperienceItem[] = [...initialExperience];
  private education: EducationItem[] = [...initialEducation];
  private achievements: AchievementItem[] = [...initialAchievements];
  private settings: SiteSettingsData = { ...initialSiteSettings };
  private messages: ContactMessageItem[] = [
    {
      id: "msg-demo-1",
      name: "Marcus Vance",
      email: "marcus.v@techfoundry.io",
      subject: "Principal Cloud Architecture Consulting",
      message: "Hello Sirajum, we reviewed your work on Nexus Stream and would love to consult with you on our high-throughput payment broker migration this quarter.",
      category: "CONSULTING",
      status: "UNREAD",
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      id: "msg-demo-2",
      name: "Elena Rostova",
      email: "elena@vanguardventures.com",
      subject: "Advisory Role: Distributed Storage Infrastructure",
      message: "We're expanding our portfolio in developer tooling and are looking for a staff-level technical advisor with deep expertise in Raft consensus and PostgreSQL scaling.",
      category: "JOB_OPPORTUNITY",
      status: "READ",
      createdAt: new Date(Date.now() - 3600000 * 28),
    },
  ];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(LOCAL_STORE_FILE)) {
        const raw = fs.readFileSync(LOCAL_STORE_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.projectCategories)) this.projectCategories = parsed.projectCategories;
        if (Array.isArray(parsed.projects)) this.projects = parsed.projects;
        if (Array.isArray(parsed.skillCategories)) this.skillCategories = parsed.skillCategories;
        if (Array.isArray(parsed.experience)) this.experience = parsed.experience;
        if (Array.isArray(parsed.education)) this.education = parsed.education;
        if (Array.isArray(parsed.achievements)) this.achievements = parsed.achievements;
        if (parsed.settings) {
          this.settings = {
            ...initialSiteSettings,
            ...parsed.settings,
            activeDisplayMode: (parsed.settings.activeDisplayMode as any) || "PORTFOLIO",
          };
        }
        if (Array.isArray(parsed.messages)) this.messages = parsed.messages;
      }
    } catch {
      // Ignore disk load error
    }
  }

  private saveToDisk() {
    try {
      const data = {
        projectCategories: this.projectCategories,
        projects: this.projects,
        skillCategories: this.skillCategories,
        experience: this.experience,
        education: this.education,
        achievements: this.achievements,
        settings: this.settings,
        messages: this.messages,
      };
      fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // Ignore disk save error
    }
  }

  async getPublishedProjects(): Promise<ProjectCaseStudy[]> {
    try {
      if (process.env.DATABASE_URL) {
        const rows = await prisma.project.findMany({
          where: { published: true },
          orderBy: [{ featured: "desc" }, { order: "asc" }],
          include: {
            technologies: { orderBy: { order: "asc" } },
            media: { orderBy: { order: "asc" } },
            architectureDiagram: true,
          },
        });

        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            keyFeatures: JSON.parse(r.keyFeatures || "[]"),
            verifiedOutcomes: r.verifiedOutcomes ? JSON.parse(r.verifiedOutcomes) : null,
            architectureDiagram: r.architectureDiagram
              ? {
                  title: r.architectureDiagram.title,
                  description: r.architectureDiagram.description ?? undefined,
                  nodes: JSON.parse(r.architectureDiagram.nodes || "[]"),
                  edges: JSON.parse(r.architectureDiagram.edges || "[]"),
                }
              : null,
          }));
        }
      }
    } catch {
      // Graceful fallback if database connection times out or is unreachable
    }
    return this.projects.filter((p) => p.published).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.order - b.order);
  }

  async getAllProjects(): Promise<ProjectCaseStudy[]> {
    try {
      if (process.env.DATABASE_URL) {
        const rows = await prisma.project.findMany({
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
          include: {
            technologies: { orderBy: { order: "asc" } },
            media: { orderBy: { order: "asc" } },
            architectureDiagram: true,
          },
        });

        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            keyFeatures: JSON.parse(r.keyFeatures || "[]"),
            verifiedOutcomes: r.verifiedOutcomes ? JSON.parse(r.verifiedOutcomes) : null,
            architectureDiagram: r.architectureDiagram
              ? {
                  title: r.architectureDiagram.title,
                  description: r.architectureDiagram.description ?? undefined,
                  nodes: JSON.parse(r.architectureDiagram.nodes || "[]"),
                  edges: JSON.parse(r.architectureDiagram.edges || "[]"),
                }
              : null,
          }));
        }
      }
    } catch {
      // Graceful fallback
    }
    return [...this.projects].sort((a, b) => a.order - b.order);
  }

  async getProjectBySlug(slug: string, requirePublished = true): Promise<ProjectCaseStudy | null> {
    try {
      if (process.env.DATABASE_URL) {
        const row = await prisma.project.findFirst({
          where: {
            slug,
            ...(requirePublished ? { published: true } : {}),
          },
          include: {
            technologies: { orderBy: { order: "asc" } },
            media: { orderBy: { order: "asc" } },
            architectureDiagram: true,
          },
        });

        if (row) {
          return {
            ...row,
            keyFeatures: JSON.parse(row.keyFeatures || "[]"),
            verifiedOutcomes: row.verifiedOutcomes ? JSON.parse(row.verifiedOutcomes) : null,
            architectureDiagram: row.architectureDiagram
              ? {
                  title: row.architectureDiagram.title,
                  description: row.architectureDiagram.description ?? undefined,
                  nodes: JSON.parse(row.architectureDiagram.nodes || "[]"),
                  edges: JSON.parse(row.architectureDiagram.edges || "[]"),
                }
              : null,
          };
        }
      }
    } catch {
      // Graceful fallback
    }
    const found = this.projects.find((p) => p.slug === slug && (!requirePublished || p.published));
    return found ? { ...found } : null;
  }

  async getProjectById(id: string): Promise<ProjectCaseStudy | null> {
    try {
      if (process.env.DATABASE_URL) {
        const row = await prisma.project.findUnique({
          where: { id },
          include: {
            technologies: { orderBy: { order: "asc" } },
            media: { orderBy: { order: "asc" } },
            architectureDiagram: true,
          },
        });

        if (row) {
          return {
            ...row,
            keyFeatures: JSON.parse(row.keyFeatures || "[]"),
            verifiedOutcomes: row.verifiedOutcomes ? JSON.parse(row.verifiedOutcomes) : null,
            architectureDiagram: row.architectureDiagram
              ? {
                  title: row.architectureDiagram.title,
                  description: row.architectureDiagram.description ?? undefined,
                  nodes: JSON.parse(row.architectureDiagram.nodes || "[]"),
                  edges: JSON.parse(row.architectureDiagram.edges || "[]"),
                }
              : null,
          };
        }
      }
    } catch {
      // Graceful fallback
    }
    const found = this.projects.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async upsertProject(project: Partial<ProjectCaseStudy> & { title: string; slug: string }): Promise<ProjectCaseStudy> {
    const id = project.id || `proj-${Date.now()}`;
    const cleanProject: ProjectCaseStudy = {
      id,
      slug: project.slug,
      title: project.title,
      category: project.category || "Full-Stack System",
      shortDescription: project.shortDescription || "",
      coverImage: project.coverImage || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      demoUrl: project.demoUrl ?? null,
      githubUrl: project.githubUrl ?? null,
      videoUrl: project.videoUrl ?? null,
      featured: Boolean(project.featured),
      published: project.published !== undefined ? Boolean(project.published) : true,
      order: project.order ?? (this.projects.length + 1),
      problemStatement: project.problemStatement || "",
      solutionOverview: project.solutionOverview || "",
      architectureOverview: project.architectureOverview || "",
      keyFeatures: project.keyFeatures || [],
      personalContribution: project.personalContribution || "",
      verifiedOutcomes: project.verifiedOutcomes || null,
      challengesLearned: project.challengesLearned || null,
      technologies: project.technologies || [],
      media: project.media || [],
      architectureDiagram: project.architectureDiagram || null,
      updatedAt: new Date(),
    };

    try {
      if (process.env.DATABASE_URL) {
        await prisma.$transaction(async (tx) => {
          await tx.project.upsert({
            where: { id },
            create: {
              id,
              slug: cleanProject.slug,
              title: cleanProject.title,
              category: cleanProject.category,
              shortDescription: cleanProject.shortDescription,
              coverImage: cleanProject.coverImage,
              demoUrl: cleanProject.demoUrl,
              githubUrl: cleanProject.githubUrl,
              videoUrl: cleanProject.videoUrl,
              featured: cleanProject.featured,
              published: cleanProject.published,
              order: cleanProject.order,
              problemStatement: cleanProject.problemStatement,
              solutionOverview: cleanProject.solutionOverview,
              architectureOverview: cleanProject.architectureOverview,
              keyFeatures: JSON.stringify(cleanProject.keyFeatures),
              personalContribution: cleanProject.personalContribution,
              verifiedOutcomes: cleanProject.verifiedOutcomes ? JSON.stringify(cleanProject.verifiedOutcomes) : null,
              challengesLearned: cleanProject.challengesLearned,
            },
            update: {
              slug: cleanProject.slug,
              title: cleanProject.title,
              category: cleanProject.category,
              shortDescription: cleanProject.shortDescription,
              coverImage: cleanProject.coverImage,
              demoUrl: cleanProject.demoUrl,
              githubUrl: cleanProject.githubUrl,
              videoUrl: cleanProject.videoUrl,
              featured: cleanProject.featured,
              published: cleanProject.published,
              order: cleanProject.order,
              problemStatement: cleanProject.problemStatement,
              solutionOverview: cleanProject.solutionOverview,
              architectureOverview: cleanProject.architectureOverview,
              keyFeatures: JSON.stringify(cleanProject.keyFeatures),
              personalContribution: cleanProject.personalContribution,
              verifiedOutcomes: cleanProject.verifiedOutcomes ? JSON.stringify(cleanProject.verifiedOutcomes) : null,
              challengesLearned: cleanProject.challengesLearned,
            },
          });

          if (cleanProject.architectureDiagram) {
            await tx.architectureDiagram.upsert({
              where: { projectId: id },
              create: {
                projectId: id,
                title: cleanProject.architectureDiagram.title,
                description: cleanProject.architectureDiagram.description,
                nodes: JSON.stringify(cleanProject.architectureDiagram.nodes),
                edges: JSON.stringify(cleanProject.architectureDiagram.edges),
              },
              update: {
                title: cleanProject.architectureDiagram.title,
                description: cleanProject.architectureDiagram.description,
                nodes: JSON.stringify(cleanProject.architectureDiagram.nodes),
                edges: JSON.stringify(cleanProject.architectureDiagram.edges),
              },
            });
          }
        });
      }
    } catch {
      // In-memory fallback persistence
    }

    const index = this.projects.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.projects[index] = cleanProject;
    } else {
      this.projects.push(cleanProject);
    }
    this.saveToDisk();
    return cleanProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      if (process.env.DATABASE_URL) {
        await prisma.project.delete({ where: { id } });
      }
    } catch {
      // In-memory fallback
    }
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.projects.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  async getSkillCategories(): Promise<SkillCategoryWithSkills[]> {
    try {
      if (process.env.DATABASE_URL) {
        const rows = await prisma.skillCategory.findMany({
          orderBy: { order: "asc" },
          include: {
            skills: {
              where: { visible: true },
              orderBy: { order: "asc" },
            },
          },
        });
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            name: r.name,
            order: r.order,
            skills: r.skills.map((s) => ({
              id: s.id,
              name: s.name,
              categoryId: s.categoryId,
              categoryName: r.name,
              iconName: s.iconName,
              shortDescription: s.shortDescription,
              evidenceNote: s.evidenceNote,
              order: s.order,
              visible: s.visible,
            })),
          }));
        }
      }
    } catch {
      // fallback
    }
    return this.skillCategories;
  }

  async upsertSkill(skill: Partial<SkillCategoryWithSkills["skills"][0]> & { name: string; categoryId: string }): Promise<void> {
    const id = skill.id || `s-${Date.now()}`;
    const category = this.skillCategories.find((c) => c.id === skill.categoryId);
    if (category) {
      const existingIdx = category.skills.findIndex((s) => s.id === id);
      const newSkill = {
        id,
        name: skill.name,
        categoryId: skill.categoryId,
        categoryName: category.name,
        iconName: skill.iconName || "Code",
        shortDescription: skill.shortDescription || "",
        evidenceNote: skill.evidenceNote || "",
        order: skill.order ?? (category.skills.length + 1),
        visible: skill.visible !== false,
      };
      if (existingIdx >= 0) {
        category.skills[existingIdx] = newSkill;
      } else {
        category.skills.push(newSkill);
      }
    }
  }

  async deleteSkill(id: string): Promise<void> {
    for (const cat of this.skillCategories) {
      cat.skills = cat.skills.filter((s) => s.id !== id);
    }
  }

  async getExperience(): Promise<ExperienceItem[]> {
    try {
      if (process.env.DATABASE_URL) {
        const rows = await prisma.experience.findMany({
          orderBy: { order: "asc" },
        });
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            highlights: JSON.parse(r.highlights || "[]"),
          }));
        }
      }
    } catch {
      // fallback
    }
    return this.experience;
  }

  async upsertExperience(exp: ExperienceItem): Promise<void> {
    const idx = this.experience.findIndex((e) => e.id === exp.id);
    if (idx >= 0) {
      this.experience[idx] = exp;
    } else {
      this.experience.push(exp);
    }
  }

  async deleteExperience(id: string): Promise<void> {
    this.experience = this.experience.filter((e) => e.id !== id);
  }

  async getEducation(): Promise<EducationItem[]> {
    return this.education;
  }

  async getAchievements(): Promise<AchievementItem[]> {
    try {
      if (process.env.DATABASE_URL) {
        const rows = await prisma.achievement.findMany({
          orderBy: { order: "asc" },
        });
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            ...r,
            category: r.category as AchievementItem["category"],
          }));
        }
      }
    } catch {
      // fallback
    }
    return this.achievements;
  }

  async upsertAchievement(ach: AchievementItem): Promise<void> {
    const idx = this.achievements.findIndex((a) => a.id === ach.id);
    if (idx >= 0) {
      this.achievements[idx] = ach;
    } else {
      this.achievements.push(ach);
    }
  }

  async deleteAchievement(id: string): Promise<void> {
    this.achievements = this.achievements.filter((a) => a.id !== id);
  }

  async getSiteSettings(): Promise<SiteSettingsData> {
    try {
      if (process.env.DATABASE_URL) {
        const row = await prisma.siteSettings.findUnique({
          where: { id: "default" },
        });
        if (row) {
          return {
            ...this.settings,
            ...row,
            activeDisplayMode: (row.activeDisplayMode as any) || "PORTFOLIO",
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      ...this.settings,
      activeDisplayMode: (this.settings.activeDisplayMode as any) || "PORTFOLIO",
    };
  }

  async updateSiteSettings(updates: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
    this.settings = { ...this.settings, ...updates };
    this.saveToDisk();
    try {
      if (process.env.DATABASE_URL) {
        await prisma.siteSettings.upsert({
          where: { id: "default" },
          create: { ...this.settings },
          update: { ...updates },
        });
      }
    } catch {
      // fallback
    }
    return this.settings;
  }

  async getContactMessages(): Promise<ContactMessageItem[]> {
    return this.messages;
  }

  async createContactMessage(msg: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category?: string;
  }): Promise<ContactMessageItem> {
    const newMsg: ContactMessageItem = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      category: msg.category || "GENERAL",
      status: "UNREAD",
      createdAt: new Date(),
    };
    try {
      if (process.env.DATABASE_URL) {
        await prisma.contactMessage.create({
          data: {
            name: newMsg.name,
            email: newMsg.email,
            subject: newMsg.subject,
            message: newMsg.message,
            category: newMsg.category,
            status: newMsg.status,
          },
        });
      }
    } catch {
      // fallback
    }
    this.messages.unshift(newMsg);
    return newMsg;
  }

  async updateMessageStatus(id: string, status: ContactMessageItem["status"]): Promise<void> {
    const m = this.messages.find((msg) => msg.id === id);
    if (m) m.status = status;
    try {
      if (process.env.DATABASE_URL) {
        await prisma.contactMessage.update({
          where: { id },
          data: { status },
        });
      }
    } catch {
      // fallback
    }
  }

  async deleteMessage(id: string): Promise<void> {
    this.messages = this.messages.filter((m) => m.id !== id);
    try {
      if (process.env.DATABASE_URL) {
        await prisma.contactMessage.delete({ where: { id } });
      }
    } catch {
      // fallback
    }
  }

  async getProjectCategories(onlyVisible = false): Promise<ProjectCategoryItem[]> {
    try {
      if (process.env.DATABASE_URL) {
        const rows = await prisma.projectCategory.findMany({
          where: onlyVisible ? { visible: true } : undefined,
          orderBy: { order: "asc" },
        });
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            order: r.order,
            visible: r.visible,
          }));
        }
      }
    } catch {
      // fallback
    }
    const list = onlyVisible
      ? this.projectCategories.filter((c) => c.visible)
      : this.projectCategories;
    return [...list].sort((a, b) => a.order - b.order);
  }

  async upsertProjectCategory(category: Partial<ProjectCategoryItem> & { name: string }): Promise<ProjectCategoryItem> {
    const slug =
      category.slug ||
      category.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const id = category.id || `pcat-${Date.now()}`;
    const cleanCategory: ProjectCategoryItem = {
      id,
      name: category.name,
      slug,
      order: category.order ?? (this.projectCategories.length + 1),
      visible: category.visible !== false,
    };

    try {
      if (process.env.DATABASE_URL) {
        await prisma.projectCategory.upsert({
          where: { id },
          create: {
            id,
            name: cleanCategory.name,
            slug: cleanCategory.slug,
            order: cleanCategory.order,
            visible: cleanCategory.visible,
          },
          update: {
            name: cleanCategory.name,
            slug: cleanCategory.slug,
            order: cleanCategory.order,
            visible: cleanCategory.visible,
          },
        });
      }
    } catch {
      // fallback
    }

    const idx = this.projectCategories.findIndex((c) => c.id === id);
    if (idx >= 0) {
      this.projectCategories[idx] = cleanCategory;
    } else {
      this.projectCategories.push(cleanCategory);
    }
    this.saveToDisk();
    return cleanCategory;
  }

  async toggleProjectCategoryVisibility(id: string, visible: boolean): Promise<void> {
    const cat = this.projectCategories.find((c) => c.id === id);
    if (cat) cat.visible = visible;
    try {
      if (process.env.DATABASE_URL) {
        await prisma.projectCategory.update({
          where: { id },
          data: { visible },
        });
      }
    } catch {
      // fallback
    }
    this.saveToDisk();
  }

  async deleteProjectCategory(id: string): Promise<boolean> {
    try {
      if (process.env.DATABASE_URL) {
        await prisma.projectCategory.delete({ where: { id } });
      }
    } catch {
      // fallback
    }
    const idx = this.projectCategories.findIndex((c) => c.id === id);
    if (idx >= 0) {
      this.projectCategories.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }
}

// Global data repository singleton with dev hot-reload preservation
export const db = globalThis.dataStoreGlobal ?? new ResilientDataStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.dataStoreGlobal = db;
}
