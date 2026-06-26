"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, PlusCircle } from "lucide-react";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { MonthlyBarChart } from "@/components/dashboard/monthly-bar-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";
import {
  getDashboardSummary,
  getMonthlyStats,
  getStatusDistribution,
} from "@/services/dashboard.service";
import type {
  DashboardSummary,
  MonthlyStats,
  StatusDistribution,
} from "@/types/dashboard";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [distribution, setDistribution] = useState<StatusDistribution[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryData, distributionData, monthlyStatsData] =
          await Promise.all([
            getDashboardSummary(),
            getStatusDistribution(),
            getMonthlyStats(),
          ]);

        setSummary(summaryData);
        setDistribution(distributionData);
        setMonthlyStats(monthlyStatsData);
      } catch (dashboardError) {
        setError(getErrorMessage(dashboardError));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-6 lg:space-y-8">
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                Pipeline overview
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Track status movement, monthly application activity, and the
                health of your job search pipeline from one calm command center.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={routes.applicationBoard}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                View board
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={routes.newApplication}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New application
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading dashboard..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && !error && summary ? (
        <>
          <DashboardSummaryCards summary={summary} />
          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <StatusChart distribution={distribution} />
            <MonthlyBarChart stats={monthlyStats} />
          </section>
        </>
      ) : null}
    </div>
  );
}
