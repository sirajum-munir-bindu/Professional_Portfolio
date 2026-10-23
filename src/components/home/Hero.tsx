import Link from "next/link";
import { ArrowRight, Github, Linkedin, Terminal, Download, ShieldCheck } from "lucide-react";
import { HeroVisual } from "./HeroVisual";
import { SiteSettingsData } from "@/types";

interface HeroProps {
  settings: SiteSettingsData;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Headline & Technical Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability / Credibility Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface border border-surface-border text-xs font-mono text-muted-foreground shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-white font-medium">Distributed Systems & Full-Stack Architect</span>
              <span className="text-surface-border">|</span>
              <span>180k TPS &bull; SOC2 Ready</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              I Architect <span className="text-accent underline decoration-accent/30 underline-offset-8">Resilient Systems</span> & High-Impact Digital Products.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
              Staff Software Engineer with deep expertise in distributed event streaming, ACID financial ledgers, and edge-native Next.js applications. Bridging high-performance systems engineering with modern user experience.
            </p>

            {/* Key Outcomes Ticker / Evidence */}
            <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-surface-border/60 max-w-xl">
              <div>
                <div className="text-2xl font-mono font-bold text-white tracking-tight">180k+</div>
                <div className="text-xs text-muted-foreground mt-0.5">Events / Sec Throughput</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-accent tracking-tight">&lt;4.5ms</div>
                <div className="text-xs text-muted-foreground mt-0.5">p99 Ingestion Latency</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-white tracking-tight">99.999%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Production Uptime SLA</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#projects"
                className="px-6 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-card group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="#contact"
                className="px-6 py-3 rounded-xl bg-surface border border-surface-border text-white font-medium text-sm hover:bg-surface-muted hover:border-white/20 transition-all"
              >
                Direct Inquiry
              </Link>

              {settings.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  className="p-3 rounded-xl border border-surface-border text-muted-foreground hover:text-white hover:border-white/20 transition-all"
                  title="Download Architecture CV"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Social & Verification Links */}
            <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground">
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">Verified Profiles:</span>
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-accent" />
                <span>GitHub</span>
              </a>
              <span className="text-white/20">&bull;</span>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-accent" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Interactive Topology Visual (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
