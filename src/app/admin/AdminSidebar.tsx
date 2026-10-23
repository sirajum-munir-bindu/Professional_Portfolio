"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth-actions";
import {
  LayoutDashboard,
  Layers,
  Cpu,
  Briefcase,
  Award,
  Image as ImageIcon,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  adminEmail: string;
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects & Diagrams", icon: Layers },
    { href: "/admin/skills", label: "Skills Matrix", icon: Cpu },
    { href: "/admin/experience", label: "Experience", icon: Briefcase },
    { href: "/admin/achievements", label: "Achievements", icon: Award },
    { href: "/admin/media", label: "Media Storage", icon: ImageIcon },
    { href: "/admin/messages", label: "Inquiries Inbox", icon: Mail },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <div className="space-y-6">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white tracking-wider uppercase">
              Admin Studio
            </div>
            <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">
              {adminEmail}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls: Live Site & Logout */}
      <div className="pt-4 border-t border-surface-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-muted-foreground hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-surface-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-xs font-mono font-bold text-white uppercase">
            Admin Studio
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-surface-border text-white"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-md">
          <div className="w-64 h-full bg-surface border-r border-surface-border">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 bg-surface border-r border-surface-border shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
