import { PrismaClient } from "@prisma/client";
import {
  initialProjects,
  initialSkillCategories,
  initialExperience,
  initialEducation,
  initialAchievements,
  initialSiteSettings,
} from "../src/lib/fallback-data";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with production-grade engineering portfolio records...");

  // 1. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { ...initialSiteSettings },
    create: { ...initialSiteSettings },
  });
  console.log("Site settings seeded.");

  // 2. Seed Admin User
  const defaultPassword = process.env.ADMIN_PASSWORD || "SecureAdminPassword123!";
  const defaultEmail = (process.env.ADMIN_EMAIL || "admin@portfolio.local").toLowerCase().trim();
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: defaultEmail },
    update: { passwordHash, name: "Sirajum Munir", role: "ADMIN" },
    create: {
      email: defaultEmail,
      passwordHash,
      name: "Sirajum Munir",
      role: "ADMIN",
    },
  });
  console.log(`Admin user seeded: ${defaultEmail}`);

  // 3. Seed Projects & Diagrams
  for (const proj of initialProjects) {
    const createdProj = await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {
        title: proj.title,
        category: proj.category,
        shortDescription: proj.shortDescription,
        coverImage: proj.coverImage,
        demoUrl: proj.demoUrl,
        githubUrl: proj.githubUrl,
        videoUrl: proj.videoUrl,
        featured: proj.featured,
        published: proj.published,
        order: proj.order,
        problemStatement: proj.problemStatement,
        solutionOverview: proj.solutionOverview,
        architectureOverview: proj.architectureOverview,
        keyFeatures: JSON.stringify(proj.keyFeatures),
        personalContribution: proj.personalContribution,
        verifiedOutcomes: proj.verifiedOutcomes ? JSON.stringify(proj.verifiedOutcomes) : null,
        challengesLearned: proj.challengesLearned,
      },
      create: {
        slug: proj.slug,
        title: proj.title,
        category: proj.category,
        shortDescription: proj.shortDescription,
        coverImage: proj.coverImage,
        demoUrl: proj.demoUrl,
        githubUrl: proj.githubUrl,
        videoUrl: proj.videoUrl,
        featured: proj.featured,
        published: proj.published,
        order: proj.order,
        problemStatement: proj.problemStatement,
        solutionOverview: proj.solutionOverview,
        architectureOverview: proj.architectureOverview,
        keyFeatures: JSON.stringify(proj.keyFeatures),
        personalContribution: proj.personalContribution,
        verifiedOutcomes: proj.verifiedOutcomes ? JSON.stringify(proj.verifiedOutcomes) : null,
        challengesLearned: proj.challengesLearned,
      },
    });

    // Seed Architecture Diagram if exists
    if (proj.architectureDiagram) {
      await prisma.architectureDiagram.upsert({
        where: { projectId: createdProj.id },
        update: {
          title: proj.architectureDiagram.title,
          description: proj.architectureDiagram.description,
          nodes: JSON.stringify(proj.architectureDiagram.nodes),
          edges: JSON.stringify(proj.architectureDiagram.edges),
        },
        create: {
          projectId: createdProj.id,
          title: proj.architectureDiagram.title,
          description: proj.architectureDiagram.description,
          nodes: JSON.stringify(proj.architectureDiagram.nodes),
          edges: JSON.stringify(proj.architectureDiagram.edges),
        },
      });
    }

    // Seed Technologies
    await prisma.projectTechnology.deleteMany({ where: { projectId: createdProj.id } });
    for (const tech of proj.technologies) {
      await prisma.projectTechnology.create({
        data: {
          projectId: createdProj.id,
          name: tech.name,
          category: tech.category,
          order: tech.order || 0,
        },
      });
    }

    // Seed Media
    if (proj.media) {
      await prisma.projectMedia.deleteMany({ where: { projectId: createdProj.id } });
      for (const m of proj.media) {
        await prisma.projectMedia.create({
          data: {
            projectId: createdProj.id,
            url: m.url,
            caption: m.caption,
            isCover: m.isCover,
          },
        });
      }
    }
  }
  console.log(`Seeded ${initialProjects.length} projects with diagrams and media.`);

  // 4. Seed Skills
  for (const cat of initialSkillCategories) {
    const createdCat = await prisma.skillCategory.upsert({
      where: { name: cat.name },
      update: { order: cat.order },
      create: { name: cat.name, order: cat.order },
    });

    for (const s of cat.skills) {
      const existing = await prisma.skill.findFirst({
        where: { name: s.name, categoryId: createdCat.id },
      });
      if (existing) {
        await prisma.skill.update({
          where: { id: existing.id },
          data: {
            iconName: s.iconName,
            shortDescription: s.shortDescription,
            evidenceNote: s.evidenceNote,
            order: s.order,
            visible: s.visible,
          },
        });
      } else {
        await prisma.skill.create({
          data: {
            name: s.name,
            categoryId: createdCat.id,
            iconName: s.iconName,
            shortDescription: s.shortDescription,
            evidenceNote: s.evidenceNote,
            order: s.order,
            visible: s.visible,
          },
        });
      }
    }
  }
  console.log("Seeded technical skills and categories.");

  // 5. Seed Experience
  for (const exp of initialExperience) {
    const existing = await prisma.experience.findFirst({
      where: { company: exp.company, role: exp.role },
    });
    const data = {
      company: exp.company,
      role: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      type: exp.type,
      description: exp.description,
      highlights: JSON.stringify(exp.highlights),
      order: exp.order,
    };
    if (existing) {
      await prisma.experience.update({ where: { id: existing.id }, data });
    } else {
      await prisma.experience.create({ data });
    }
  }

  // 6. Seed Achievements
  for (const ach of initialAchievements) {
    const existing = await prisma.achievement.findFirst({
      where: { title: ach.title, issuer: ach.issuer },
    });
    const data = {
      title: ach.title,
      issuer: ach.issuer,
      date: ach.date,
      category: ach.category,
      url: ach.url,
      description: ach.description,
      order: ach.order,
    };
    if (existing) {
      await prisma.achievement.update({ where: { id: existing.id }, data });
    } else {
      await prisma.achievement.create({ data });
    }
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
