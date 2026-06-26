"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Columns3, ListFilter, PlusCircle, Table2 } from "lucide-react";
import {
  ApplicationFilters,
  type ApplicationFiltersValue,
} from "@/components/applications/application-filters";
import { ApplicationTable } from "@/components/applications/application-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";
import { getApplications } from "@/services/applications.service";
import type { JobApplication } from "@/types/application";

const emptyFilters: ApplicationFiltersValue = {
  search: "",
  status: "",
  jobType: "",
  workMode: "",
  source: "",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filters, setFilters] = useState<ApplicationFiltersValue>(emptyFilters);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (applicationsError) {
        setError(getErrorMessage(applicationsError));
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, []);

  const sources = useMemo(
    () =>
      Array.from(
        new Set(
          applications
            .map((application) => application.source)
            .filter((source): source is string => Boolean(source)),
        ),
      ).sort((first, second) => first.localeCompare(second)),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return applications.filter((application) => {
      const searchableText = [
        application.companyName,
        application.positionTitle,
        application.location,
        application.jobType,
        application.workMode,
        application.source,
        application.salaryRange,
        application.contactName,
        application.contactEmail,
        application.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!search || searchableText.includes(search)) &&
        (!filters.status || application.status === filters.status) &&
        (!filters.jobType || application.jobType === filters.jobType) &&
        (!filters.workMode || application.workMode === filters.workMode) &&
        (!filters.source || application.source === filters.source)
      );
    });
  }, [applications, filters]);

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
              Pipeline workspace
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Applications
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/80">
              Organize every opportunity, filter what matters, and move work
              forward with clarity.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={routes.applicationBoard}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-white/15"
            >
              <Columns3 className="mr-2 h-4 w-4" />
              Open board
            </Link>
            <Link
              href={routes.newApplication}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-indigo-50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New application
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading applications..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && !error && applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Create your first application to start tracking progress."
        />
      ) : null}

      {!isLoading && !error && applications.length > 0 ? (
        <>
          <ApplicationFilters
            value={filters}
            onChange={setFilters}
            sources={sources}
          />

          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200/70 backdrop-blur sm:flex-row sm:items-center">
            <p className="inline-flex items-center text-sm font-medium text-slate-600">
              <ListFilter className="mr-2 h-4 w-4 text-indigo-500" />
              Showing{" "}
              <span className="mx-1 font-semibold text-slate-950">
                {filteredApplications.length}
              </span>
              of {applications.length} applications
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <Button type="button" size="sm">
                  <Table2 className="mr-2 h-4 w-4" />
                  Table
                </Button>
              </div>
              <Link
                href={routes.applicationBoard}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Columns3 className="mr-2 h-4 w-4" />
                Board
              </Link>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-10 text-center">
              <h3 className="text-base font-semibold">No matching applications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Adjust the search or filters to see more results.
              </p>
              <Button
                type="button"
                className="mt-5"
                onClick={() => setFilters(emptyFilters)}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              onDeleted={(id) =>
                setApplications((current) =>
                  current.filter((application) => application.id !== id),
                )
              }
            />
          )}
        </>
      ) : null}
    </div>
  );
}
