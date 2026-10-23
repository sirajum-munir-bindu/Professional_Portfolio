import { describe, it, expect } from "vitest";
import {
  loginSchema,
  contactFormSchema,
  projectSchema,
  skillSchema,
} from "../src/lib/validations";

describe("Input Validation & Security Schemas", () => {
  describe("loginSchema", () => {
    it("validates valid admin email and password", () => {
      const result = loginSchema.safeParse({
        email: "admin@portfolio.local",
        password: "SecurePassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid emails and short passwords", () => {
      const invalidEmail = loginSchema.safeParse({
        email: "not-an-email",
        password: "SecurePassword123!",
      });
      expect(invalidEmail.success).toBe(false);

      const shortPass = loginSchema.safeParse({
        email: "admin@portfolio.local",
        password: "123",
      });
      expect(shortPass.success).toBe(false);
    });
  });

  describe("contactFormSchema", () => {
    it("accepts valid contact submission", () => {
      const valid = contactFormSchema.safeParse({
        name: "Jane Doe",
        email: "jane@company.com",
        subject: "Consulting Inquiry",
        category: "CONSULTING",
        message: "We would like to hire you to architect our distributed event streaming pipeline.",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects empty message or invalid email", () => {
      const bad = contactFormSchema.safeParse({
        name: "J",
        email: "bad-email",
        subject: "Hi",
        message: "Short",
      });
      expect(bad.success).toBe(false);
    });

    it("traps honeypot field if filled by spambot", () => {
      const botSubmission = contactFormSchema.safeParse({
        name: "Spambot",
        email: "bot@spam.com",
        subject: "Buy crypto",
        message: "Click here to buy lots of coins right now immediately please",
        honeyPot: "filled-by-bot",
      });
      expect(botSubmission.success).toBe(false);
    });
  });

  describe("projectSchema", () => {
    it("validates a complete engineering case study", () => {
      const validProj = projectSchema.safeParse({
        title: "Distributed Raft Proxy",
        slug: "distributed-raft-proxy",
        category: "Cloud Architecture",
        shortDescription: "High-throughput fault-tolerant consensus broker.",
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
        problemStatement: "Monolithic queue was dropping packets under 150k TPS loads during network partitions.",
        solutionOverview: "Constructed raft quorum proxy with zero-copy socket buffers in Go.",
        architectureOverview: "Edge ingress routes to in-memory buffers before persisting across multiple availability zones.",
        keyFeatures: ["Zero-copy buffers", "Consensus failover"],
        personalContribution: "Authored consensus engine and benchmarks.",
        technologies: [{ name: "Go", category: "Backend" }],
      });
      expect(validProj.success).toBe(true);
    });

    it("rejects project missing required architectural sections", () => {
      const invalidProj = projectSchema.safeParse({
        title: "Test",
        slug: "invalid slug with spaces",
        category: "Backend",
        shortDescription: "Too short",
        coverImage: "not-a-url",
        problemStatement: "",
        solutionOverview: "",
        architectureOverview: "",
        keyFeatures: [],
        personalContribution: "",
      });
      expect(invalidProj.success).toBe(false);
    });
  });

  describe("skillSchema", () => {
    it("validates a skill entry", () => {
      const validSkill = skillSchema.safeParse({
        name: "Kubernetes",
        categoryId: "cat-cloud",
        shortDescription: "EKS clusters and container orchestration",
        evidenceNote: "Orchestrated 14 microservices",
        order: 1,
        visible: true,
      });
      expect(validSkill.success).toBe(true);
    });
  });
});
