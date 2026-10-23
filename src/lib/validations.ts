import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please provide a valid email address").trim(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  category: z.enum(["GENERAL", "CONSULTING", "JOB_OPPORTUNITY", "ARCHITECTURE_REVIEW"]).default("GENERAL"),
  message: z.string().min(15, "Message must be at least 15 characters").max(3000),
  honeyPot: z.string().max(0, "Anti-spam trigger").optional(), // Honeypot field for bot trapping
});

export const projectCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens")
    .optional(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  category: z.string().min(2),
  shortDescription: z.string().min(10).max(300),
  coverImage: z.string().url("Must be a valid image URL"),
  demoUrl: z.string().url().nullable().optional().or(z.literal("")),
  githubUrl: z.string().url().nullable().optional().or(z.literal("")),
  videoUrl: z.string().url().nullable().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
  problemStatement: z.string().min(20, "Problem statement must be comprehensive"),
  solutionOverview: z.string().min(20, "Solution overview must be comprehensive"),
  architectureOverview: z.string().min(20, "Architecture overview must be comprehensive"),
  keyFeatures: z.array(z.string()).min(1, "At least one key feature is required"),
  personalContribution: z.string().min(10),
  verifiedOutcomes: z.array(z.string()).optional().nullable(),
  challengesLearned: z.string().optional().nullable(),
  technologies: z.array(
    z.object({
      name: z.string().min(1),
      category: z.string().default("General"),
      order: z.number().optional(),
    })
  ).default([]),
  media: z.array(
    z.object({
      url: z.string().url(),
      caption: z.string().optional().nullable(),
      isCover: z.boolean().default(false),
    })
  ).optional(),
});

export const siteSettingsSchema = z.object({
  displayName: z.string().min(2),
  roleTitle: z.string().nullable().optional(),
  headline: z.string().min(5),
  bio: z.string().min(20),
  avatarUrl: z.string().nullable().optional(),
  availableForWork: z.boolean(),
  availabilityNote: z.string().nullable().optional(),
  primaryEmail: z.string().email(),
  location: z.string().min(2),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  twitterUrl: z.string().url().nullable().optional().or(z.literal("")),
  resumeUrl: z.string().nullable().optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color code"),
  metaTitle: z.string().min(5),
  metaDescription: z.string().min(20),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  categoryId: z.string().min(1),
  iconName: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  evidenceNote: z.string().optional().nullable(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(2),
  role: z.string().min(2),
  location: z.string().optional().nullable(),
  startDate: z.string().min(4),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  type: z.string().default("FULL_TIME"),
  description: z.string().min(10),
  highlights: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export const achievementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  issuer: z.string().min(2),
  date: z.string().min(4),
  category: z.enum(["AWARD", "CERTIFICATION", "HACKATHON", "TALK"]).default("AWARD"),
  url: z.string().url().optional().nullable().or(z.literal("")),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});
