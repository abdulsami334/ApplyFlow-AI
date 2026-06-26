"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Columns3,
  FileText,
  Layers3,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: routes.dashboard, label: "Dashboard", icon: BarChart3 },
  { href: routes.resumes, label: "Resumes", icon: FileText },
  { href: routes.applications, label: "Applications", icon: BriefcaseBusiness },
  { href: routes.applicationBoard, label: "Board", icon: Columns3 },
  { href: routes.newApplication, label: "Add application", icon: PlusCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(routes.login);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-10">
        <LoadingState label="Opening your workspace..." />
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  function handleLogout() {
    logout();
    router.replace(routes.login);
  }

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_32%),radial-gradient(circle_at_bottom_right,#ecfeff,transparent_28%),linear-gradient(180deg,#f8fafc,#eef2f7)]">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-[280px]">
        <AppHeader />
      </div>

      <div className="flex h-screen min-w-0 flex-col lg:pl-[280px]">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080b18]/95 px-4 py-3 text-white backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={routes.dashboard} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-slate-950">
                <Layers3 className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold leading-tight">ApplyFlow</span>
                <span className="block text-xs font-medium text-slate-400">
                  Job search workspace
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
                className="text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isMobileNavOpen}
                className="text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
              >
                {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <nav
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
              isMobileNavOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
            aria-label="Primary navigation"
          >
            <div className="overflow-hidden">
              <div className="grid gap-2 pt-3 sm:grid-cols-2">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href === routes.applications &&
                      pathname.startsWith(routes.applications) &&
                      pathname !== routes.applicationBoard &&
                      pathname !== routes.newApplication);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex h-11 items-center rounded-xl bg-white/5 px-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white",
                        isActive && "bg-white text-slate-950 hover:bg-white hover:text-slate-950",
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto" data-testid="app-main-scroll">
          <div className="mx-auto w-full max-w-[1520px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
