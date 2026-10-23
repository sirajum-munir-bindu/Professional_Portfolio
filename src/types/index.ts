export interface ProjectCategoryItem {
  id: string;
  name: string;
  slug: string;
  order: number;
  visible: boolean;
}

export type ProjectCategory = string;

export interface ArchitectureNode {
  id: string;
  label: string;
  role: string;
  description: string;
  tier: "frontend" | "api" | "auth" | "database" | "cache" | "queue" | "infrastructure";
  status?: "operational" | "active" | "optimized";
  techStack?: string[];
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: "HTTPS/REST" | "gRPC" | "WebSocket" | "TCP/TLS" | "Async Queue" | "SQL Connection";
}

export interface ArchitectureData {
  title: string;
  description?: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  coverImage: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  videoUrl?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  problemStatement: string;
  solutionOverview: string;
  architectureOverview: string;
  keyFeatures: string[];
  personalContribution: string;
  verifiedOutcomes?: string[] | null;
  challengesLearned?: string | null;
  technologies: {
    id?: string;
    name: string;
    category: string;
    order?: number;
  }[];
  media?: {
    id?: string;
    url: string;
    caption?: string | null;
    isCover: boolean;
  }[];
  architectureDiagram?: ArchitectureData | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SkillItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  iconName?: string | null;
  shortDescription?: string | null;
  evidenceNote?: string | null;
  order: number;
  visible: boolean;
}

export interface SkillCategoryWithSkills {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  type: string;
  description: string;
  highlights: string[];
  order: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gradeOrHonor?: string | null;
  activities?: string | null;
  order: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: "AWARD" | "CERTIFICATION" | "HACKATHON" | "TALK";
  url?: string | null;
  description?: string | null;
  order: number;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string | Date;
}

export interface SiteSettingsData {
  id: string;
  displayName: string;
  roleTitle?: string | null;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  availableForWork: boolean;
  availabilityNote: string | null;
  primaryEmail: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string | null;
  resumeUrl?: string | null;
  accentColor: string;
  metaTitle: string;
  metaDescription: string;
}
