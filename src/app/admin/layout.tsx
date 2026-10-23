import { getSession } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([
    getSession(),
    db.getSiteSettings(),
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
      />
      <main className="flex-1 p-3.5 sm:p-8 lg:p-10 pt-16 lg:pt-10 overflow-x-hidden max-w-7xl w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
