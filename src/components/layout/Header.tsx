"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield, ArrowUpRight } from "lucide-react";
import { SiteSettingsData } from "@/types";

interface HeaderProps {
  settings: SiteSettingsData;
}

export function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#projects", label: "Projects" },
    { href: "/#architecture", label: "Architecture" },
    { href: "/#capabilities", label: "Capabilities" },
    { href: "/#experience", label: "Experience" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090a0f]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-subtle"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-accent rounded-md p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-center font-mono text-sm font-bold text-accent group-hover:border-accent/40 transition-colors">
              AW
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-accent transition-colors">
                {settings.displayName}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider hidden sm:inline">
                Systems Architect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-muted/60 border border-surface-border rounded-full px-4 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-muted-foreground hover:text-white px-3 py-1.5 rounded-full transition-colors hover:bg-white/[0.04]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Availability Badge & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {settings.availableForWork && (
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[11px] font-medium text-accent"
                title={settings.availabilityNote || "Available for select projects"}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>Available</span>
              </div>
            )}

            <Link
              href="/admin/dashboard"
              className="p-1.5 rounded-lg border border-surface-border text-muted-foreground hover:text-white hover:border-white/20 transition-colors text-xs flex items-center gap-1.5"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="hidden lg:inline text-[11px] font-mono">Admin</span>
            </Link>

            <Link
              href="#contact"
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors font-medium flex items-center gap-1"
            >
              Get in Touch
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-surface-border text-muted-foreground hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-xl bg-surface border border-surface-border shadow-card flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-mono text-muted-foreground hover:text-white flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-accent" />
                Admin Dashboard
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs font-semibold py-2.5 rounded-lg bg-accent text-accent-foreground"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
