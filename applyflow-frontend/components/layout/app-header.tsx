"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Columns3,
  FileText,
  Layers3,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { href: routes.dashboard, label: "Dashboard", icon: BarChart3 },
  { href: routes.resumes, label: "Resumes", icon: FileText },
  { href: routes.applications, label: "Applications", icon: BriefcaseBusiness },
  { href: routes.applicationBoard, label: "Board", icon: Columns3 },
  { href: routes.newApplication, label: "Add application", icon: PlusCircle },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    router.replace(routes.login);
  }

  return (
    <aside className="flex h-screen w-[280px] flex-col overflow-hidden border-r border-white/10 bg-[#080b18] text-white shadow-2xl shadow-slate-950/30">
      <div className="border-b border-white/10 p-6">
        <Link href={routes.dashboard} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-slate-950 shadow-lg shadow-indigo-500/20">
            <Layers3 className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">
              ApplyFlow
            </span>
            <span className="block text-xs font-medium text-slate-400">
                Job search command center
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === routes.applications &&
              pathname.startsWith(routes.applications) &&
              pathname !== routes.newApplication &&
              pathname !== routes.applicationBoard);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30",
                isActive && "bg-white text-slate-950 shadow-lg shadow-black/20 hover:bg-white hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-black/10">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Signed in
          </p>
          <p className="mt-1 truncate text-sm font-semibold">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full justify-start text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
