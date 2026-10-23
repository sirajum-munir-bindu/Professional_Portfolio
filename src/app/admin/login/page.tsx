"use client";

import { useActionState } from "react";
import { loginAction, AuthActionResult } from "@/app/actions/auth-actions";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Terminal } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 relative">
      {/* Subtle background glow */}
      <div className="absolute w-[500px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full rounded-2xl bg-surface border border-surface-border p-8 shadow-card relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-accent mx-auto font-mono text-base font-bold shadow-subtle">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Studio Access
          </h1>
          <p className="text-xs text-muted-foreground">
            Authenticate to manage distributed blueprints, case studies, and inquiries.
          </p>
        </div>

        {/* Error Feedback */}
        {state?.error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-mono font-medium text-white block"
            >
              Administrator Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="admin@portfolio.local"
                placeholder="admin@portfolio.local"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/60 transition-colors"
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-mono font-medium text-white block"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="SecureAdminPassword123!"
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-muted border border-surface-border focus:border-accent focus:ring-1 focus:ring-accent text-white text-sm placeholder:text-muted-foreground/60 transition-colors"
              />
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-6 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Development Helper Pill */}
        <div className="p-3.5 rounded-xl bg-surface-muted/60 border border-surface-border text-xs text-muted-foreground space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Default Local Credentials</span>
          </div>
          <div className="text-[11px]">User: <span className="text-white">admin@portfolio.local</span></div>
          <div className="text-[11px]">Pass: <span className="text-white">SecureAdminPassword123!</span></div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-mono text-muted-foreground hover:text-white transition-colors"
          >
            &larr; Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
