import Link from "next/link";
import { routes } from "@/lib/routes";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel = "Create application",
  actionHref = routes.newApplication,
}: EmptyStateProps) {
  return (
    <div className="animate-fade-in-up rounded-3xl border border-dashed border-indigo-200 bg-white/85 p-8 text-center shadow-sm shadow-slate-200/70 backdrop-blur sm:p-12">
      <div className="mx-auto mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 ring-8 ring-indigo-50/60" />
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
