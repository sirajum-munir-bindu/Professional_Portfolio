import Link from "next/link";
import { Github, Linkedin, Twitter, Terminal, ArrowUp } from "lucide-react";
import { SiteSettingsData } from "@/types";

interface FooterProps {
  settings: SiteSettingsData;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-[#07080c] py-16 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-surface-border/60">
          {/* Identity & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight text-white">
                {settings.displayName}
              </span>
              <span className="text-xs text-muted-foreground font-mono">/</span>
              <span className="text-xs text-accent font-mono">portfolio.sys</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {settings.headline}. Specializing in fault-tolerant distributed architectures, low-latency microservices, and modern Next.js product engineering.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-surface-border text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-surface-border text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border border-surface-border text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Architecture Navigation */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#projects" className="hover:text-white transition-colors">
                  Featured Case Studies
                </Link>
              </li>
              <li>
                <Link href="/#architecture" className="hover:text-white transition-colors">
                  Interactive Architecture Explorer
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-white transition-colors">
                  Technical Capabilities Matrix
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-white transition-colors">
                  Engineering Milestones
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  Direct Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Status */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
              Infrastructure Status
            </h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-white font-mono text-[11px]">All Systems Operational</span>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                <span>Next.js 15 &bull; Edge ISR &bull; PostgreSQL</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Hosted with global edge distribution, zero-overhead static assets, and sub-100ms INP response budget.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} {settings.displayName}. Built with Next.js 15, TypeScript & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="hover:text-white transition-colors font-mono text-[11px]">
              Admin Studio
            </Link>
            <a
              href="#top"
              className="flex items-center gap-1 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
