import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ArchitectureExplorer } from "@/components/architecture/ArchitectureExplorer";
import { TechnologyMatrix } from "@/components/home/TechnologyMatrix";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { ContactSection } from "@/components/contact/ContactSection";
import { DigitalVisitingCard } from "@/components/card/DigitalVisitingCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const settings = await db.getSiteSettings();

  // JSON-LD structured data for search engine credibility
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.displayName,
    jobTitle: settings.headline,
    description: settings.bio,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.internal",
    sameAs: [settings.githubUrl, settings.linkedinUrl, settings.twitterUrl].filter(Boolean),
  };

  // If Premium E-Visiting Card mode is active, render ONLY the non-scrollable Digital Identity Card
  if (settings.activeDisplayMode === "DIGITAL_CARD") {
    return (
      <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#07090e]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DigitalVisitingCard settings={settings} />
      </div>
    );
  }

  // Otherwise, render full professional portfolio
  const [
    projects,
    projectCategories,
    skillCategories,
    experience,
    education,
    achievements,
  ] = await Promise.all([
    db.getPublishedProjects(),
    db.getProjectCategories(),
    db.getSkillCategories(),
    db.getExperience(),
    db.getEducation(),
    db.getAchievements(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-accent selection:text-accent-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header settings={settings} />

      <main className="flex-1">
        <Hero settings={settings} />
        <FeaturedProjects
          projects={projects}
          availableCategories={projectCategories}
        />
        <ArchitectureExplorer projects={projects} />
        <TechnologyMatrix categories={skillCategories} />
        <ExperienceTimeline
          experience={experience}
          achievements={achievements}
          education={education}
        />
        <ContactSection settings={settings} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
