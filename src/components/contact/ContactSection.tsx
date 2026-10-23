"use client";

import { useActionState } from "react";
import { submitContactForm, ContactActionResult } from "@/app/actions/contact-actions";
import { SiteSettingsData } from "@/types";
import { Mail, Send, CheckCircle2, AlertCircle, Github, Linkedin, ShieldCheck, MapPin } from "lucide-react";

interface ContactSectionProps {
  settings: SiteSettingsData;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [state, formAction, isPending] = useActionState<ContactActionResult | null, FormData>(
    submitContactForm,
    null
  );

  return (
    <section id="contact" className="py-24 border-t border-surface-border/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct Channels / Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              <span>Initiate Collaboration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Let&apos;s Build Something Resilient.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Available for staff-level architectural advisory, high-throughput systems consulting, and technical leadership engagements.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface border border-surface-border">
                <div className="p-2.5 rounded-lg bg-surface-muted text-accent">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${settings.primaryEmail}`}
                    className="text-sm font-semibold text-white hover:text-accent transition-colors break-all"
                  >
                    {settings.primaryEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface border border-surface-border">
                <div className="p-2.5 rounded-lg bg-surface-muted text-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                    Location & Availability
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {settings.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface border border-surface-border">
                <div className="p-2.5 rounded-lg bg-surface-muted text-accent">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                    Privacy Guarantee
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Submissions are stored directly in encrypted database records. Zero spam or 3rd-party trackers.
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-surface border border-surface-border hover:border-white/20 text-xs font-medium text-white flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4 text-accent" />
                GitHub
              </a>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-surface border border-surface-border hover:border-white/20 text-xs font-medium text-white flex items-center gap-2 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-accent" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-surface border border-surface-border p-4 sm:p-8 shadow-card">
            {state?.success ? (
              <div className="p-8 rounded-xl bg-accent/10 border border-accent/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {state.message}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-xs font-mono text-white hover:border-accent/40 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                {/* Honeypot field for bot trapping (invisible to humans) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="company_verification_field"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {state?.error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs font-mono font-medium text-white block"
                    >
                      Your Name <span className="text-accent">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/60 transition-colors"
                    />
                    {state?.fieldErrors?.name && (
                      <span className="text-[11px] text-rose-400">
                        {state.fieldErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-mono font-medium text-white block"
                    >
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. sarah@enterprise.io"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/60 transition-colors"
                    />
                    {state?.fieldErrors?.email && (
                      <span className="text-[11px] text-rose-400">
                        {state.fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="category"
                      className="text-xs font-mono font-medium text-white block"
                    >
                      Inquiry Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      defaultValue="GENERAL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm transition-colors cursor-pointer"
                    >
                      <option value="GENERAL">General Discussion</option>
                      <option value="CONSULTING">Systems Architecture Consulting</option>
                      <option value="JOB_OPPORTUNITY">Executive / Staff Engineering Role</option>
                      <option value="ARCHITECTURE_REVIEW">Infrastructure Code Review</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-xs font-mono font-medium text-white block"
                    >
                      Subject <span className="text-accent">*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="e.g. Event Mesh Migration Strategy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/60 transition-colors"
                    />
                    {state?.fieldErrors?.subject && (
                      <span className="text-[11px] text-rose-400">
                        {state.fieldErrors.subject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-mono font-medium text-white block"
                  >
                    Message & Project Scope <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Provide details on throughput requirements, current technical bottlenecks, or scope of collaboration..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/60 transition-colors resize-y"
                  />
                  {state?.fieldErrors?.message && (
                    <span className="text-[11px] text-rose-400">
                      {state.fieldErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 px-6 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Encrypting & Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
