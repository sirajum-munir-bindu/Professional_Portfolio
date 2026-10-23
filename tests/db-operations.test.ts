import { describe, it, expect } from "vitest";
import { db } from "../src/lib/db";

describe("Database Operations & Public Protection", () => {
  it("only returns published projects to public visitors", async () => {
    // Create a draft project
    const draft = await db.upsertProject({
      title: "Secret Unreleased Engine",
      slug: "secret-unreleased-engine",
      category: "Cloud Architecture",
      shortDescription: "Internal preview only",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
      published: false, // Draft
      problemStatement: "Problem",
      solutionOverview: "Solution",
      architectureOverview: "Overview",
      keyFeatures: ["Feature A"],
      personalContribution: "Sole developer",
    });

    const publicList = await db.getPublishedProjects();
    const foundInPublic = publicList.find((p) => p.slug === "secret-unreleased-engine");
    expect(foundInPublic).toBeUndefined();

    // Verify detail lookup rejects draft when requirePublished is true
    const publicDetail = await db.getProjectBySlug("secret-unreleased-engine", true);
    expect(publicDetail).toBeNull();

    // Verify admin can still fetch it
    const adminDetail = await db.getProjectBySlug("secret-unreleased-engine", false);
    expect(adminDetail).not.toBeNull();
    expect(adminDetail?.title).toBe("Secret Unreleased Engine");

    // Clean up
    await db.deleteProject(draft.id);
  });

  it("supports project CRUD and architecture diagram binding", async () => {
    const created = await db.upsertProject({
      title: "Automated Integration Test Project",
      slug: "automated-test-proj",
      category: "Full-Stack System",
      shortDescription: "Verified test project description",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
      published: true,
      problemStatement: "Testing problem",
      solutionOverview: "Testing solution",
      architectureOverview: "Testing overview",
      keyFeatures: ["Test 1", "Test 2"],
      personalContribution: "Testing lead",
      architectureDiagram: {
        title: "Test Diagram",
        nodes: [
          {
            id: "n1",
            label: "Test Node",
            role: "Service",
            description: "Test node desc",
            tier: "api",
          },
        ],
        edges: [],
      },
    });

    expect(created.id).toBeDefined();
    expect(created.slug).toBe("automated-test-proj");
    expect(created.architectureDiagram?.nodes.length).toBe(1);

    // Update
    const updated = await db.upsertProject({
      ...created,
      title: "Automated Integration Test Project (Updated)",
    });
    expect(updated.title).toBe("Automated Integration Test Project (Updated)");

    // Delete
    const deleted = await db.deleteProject(created.id);
    expect(deleted).toBe(true);

    const check = await db.getProjectById(created.id);
    expect(check).toBeNull();
  });
});
