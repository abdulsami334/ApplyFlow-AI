import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardSummary } from "@/types/dashboard";
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Handshake,
  OctagonX,
  XCircle,
  type LucideIcon,
} from "lucide-react";

const summaryItems: Array<{
  key: keyof DashboardSummary;
  label: string;
  accent: string;
  icon: LucideIcon;
  description: string;
}> = [
  { key: "totalApplications", label: "Total", accent: "from-slate-900 to-slate-700", icon: BriefcaseBusiness, description: "Tracked opportunities" },
  { key: "applied", label: "Applied", accent: "from-blue-500 to-indigo-500", icon: CircleDashed, description: "Submitted roles" },
  { key: "screening", label: "Screening", accent: "from-cyan-500 to-sky-500", icon: Clock3, description: "Under review" },
  { key: "interview", label: "Interview", accent: "from-violet-500 to-purple-500", icon: CheckCircle2, description: "In conversation" },
  { key: "offers", label: "Offers", accent: "from-emerald-500 to-teal-500", icon: Handshake, description: "Positive outcomes" },
  { key: "rejected", label: "Rejected", accent: "from-rose-500 to-red-500", icon: OctagonX, description: "Closed roles" },
  { key: "withdrawn", label: "Withdrawn", accent: "from-amber-500 to-orange-500", icon: XCircle, description: "Paused by you" },
];

export function DashboardSummaryCards({ summary }: { summary: DashboardSummary }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {summaryItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.key} className="group overflow-hidden border-slate-200/90 bg-white/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
            <div className={`h-1 bg-gradient-to-r ${item.accent}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">
                {item.label}
              </CardTitle>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/70 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
                <Icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight text-slate-950">
                {summary[item.key]}
              </p>
              <p className="mt-2 text-xs font-medium text-slate-500">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
