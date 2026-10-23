import { getSession } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings, dbHealth] = await Promise.all([
    getSession(),
    db.getSiteSettings(),
    db.getDatabaseHealth(),
  ]);

  // If no session (or on login page), render plain children without sidebar wrapper
  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar
        adminEmail={session.email}
        displayName={settings.displayName}
        avatarUrl={settings.avatarUrl}
        dbConnected={dbHealth.connected}
      />
      <main className="flex-1 p-3.5 sm:p-8 lg:p-10 pt-16 lg:pt-10 overflow-x-hidden max-w-7xl w-full min-w-0">
        {!dbHealth.connected && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-base shrink-0 leading-none mt-0.5">⚠️</span>
              <div className="space-y-1">
                <span className="font-mono font-bold text-white block">
                  Running in Demo/Ephemeral Storage Mode (Database Not Connected)
                </span>
                <p className="text-amber-200/90 leading-relaxed">
                  On Vercel, changes made in the admin panel (such as toggling to E-Visiting Card or editing content) will not persist across visits without a real database. To make changes permanent for all visitors:
                </p>
                <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-amber-500/20 font-mono text-[11px] text-amber-300">
                  Connect a free PostgreSQL database (e.g. <strong>Neon.tech</strong>, <strong>Supabase</strong>, or <strong>Vercel Postgres</strong>) and set <span className="text-white font-bold">DATABASE_URL</span> in your Vercel Project Settings &gt; Environment Variables.
                </div>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
