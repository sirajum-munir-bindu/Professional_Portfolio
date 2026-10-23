import Link from "next/link";
import { ArrowRight, Github, Linkedin, Download } from "lucide-react";
import { HeroVisual } from "./HeroVisual";
import { SiteSettingsData } from "@/types";

interface HeroProps {
  settings: SiteSettingsData;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background ambient radial aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-accent/20 via-accent/5 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Main Headline & Positioning (7 cols) */}
          <div className="lg:col-span-7 space-y-7">
            {/* Minimal & Eye-Catching Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] sm:leading-[1.05]">
              Architecting systems. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white/90 to-accent">
                Building digital products.
              </span>
            </h1>

            {/* Minimal Sub-copy */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl font-normal leading-relaxed">
              Full-stack software engineer & cloud architect. Specializing in high-throughput distributed systems, modern web products, and edge-native scale.
            </p>

            {/* Action Buttons & Verified Channels Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <Link
                href="#projects"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-card group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#contact"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-surface border border-surface-border text-white font-medium text-sm hover:bg-surface-muted hover:border-white/20 transition-all text-center"
              >
                Get in Touch
              </Link>

              {/* Direct Profile Links */}
              <div className="flex items-center gap-2 pt-1 sm:pt-0 pl-0 sm:pl-2">
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-surface border border-surface-border text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                  aria-label="GitHub Profile"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4 text-accent" />
                </a>

                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-surface border border-surface-border text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-accent" />
                </a>

                {settings.resumeUrl && (
                  <a
                    href={settings.resumeUrl}
                    className="p-3 rounded-xl bg-surface border border-surface-border text-muted-foreground hover:text-white hover:border-white/30 transition-all"
                    title="Download Architecture CV"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Download CV"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Topology Visual / Portrait (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <HeroVisual
              avatarUrl={settings.avatarUrl}
              displayName={settings.displayName}
              accentColor={settings.accentColor}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
