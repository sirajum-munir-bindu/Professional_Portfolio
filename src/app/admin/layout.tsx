import { getSession } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If no session (or on login page), render plain children without sidebar wrapper
  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <AdminSidebar adminEmail={session.email} />
      <main className="flex-1 p-4 sm:p-8 lg:p-10 pt-16 lg:pt-10 overflow-x-hidden max-w-7xl">
        {children}
      </main>
    </div>
  );
}
