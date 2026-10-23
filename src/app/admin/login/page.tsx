"use client";

import { useState, useActionState } from "react";
import { loginAction, AuthActionResult } from "@/app/actions/auth-actions";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 relative selection:bg-accent selection:text-accent-foreground">
      {/* Ambient background glow & grid depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute w-[460px] h-[320px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[460px] h-[320px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -bottom-20 -right-20" />

      <div className="max-w-[420px] w-full relative z-10 space-y-6">
        {/* Main Card */}
        <div className="rounded-2xl bg-surface/90 backdrop-blur-xl border border-surface-border p-7 sm:p-8 shadow-card relative overflow-hidden">
          {/* Top accent accentuation line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-mono font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Admin Console</span>
            </div>

            <div className="w-12 h-12 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-accent mx-auto shadow-subtle">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Admin Studio Access
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Sign in with your administrator credentials to manage portfolio blueprints, settings, and inquiries.
              </p>
            </div>
          </div>

          {/* Error Feedback */}
          {state?.error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-snug">{state.error}</span>
            </div>
          )}

          {/* Login Form */}
          <form action={formAction} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-mono font-medium text-foreground/90 block"
              >
                Administrator Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@portfolio.local"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-muted/90 border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/50 transition-colors"
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-mono font-medium text-foreground/90 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-surface-muted/90 border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/50 transition-colors"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-white transition-colors p-0.5 rounded focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent-hover transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-lg active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-surface-border/60 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-mono">
            <Lock className="w-3 h-3 text-accent/80" />
            <span>End-to-end encrypted administrative session</span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-surface-muted"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
