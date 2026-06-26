"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PlusCircle, RefreshCw } from "lucide-react";
import { ApplicationKanban } from "@/components/applications/application-kanban";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";
import {
  getApplications,
  updateApplication,
} from "@/services/applications.service";
import type {
  ApplicationPayload,
  ApplicationStatus,
  JobApplication,
} from "@/types/application";

function toApplicationPayload(
  application: JobApplication,
  status: ApplicationStatus,
): ApplicationPayload {
  return {
    companyName: application.companyName,
    positionTitle: application.positionTitle,
    applicationDate: application.applicationDate,
    status,
    location: application.location,
    jobType: application.jobType,
    workMode: application.workMode,
    source: application.source,
    salaryRange: application.salaryRange,
    contactName: application.contactName,
    contactEmail: application.contactEmail,
    jobUrl: application.jobUrl,
    followUpDate: application.followUpDate,
    notes: application.notes,
  };
}

export default function ApplicationBoardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);

  async function loadApplications() {
    setError(null);
    setIsLoading(true);

    try {
      const data = await getApplications();
      setApplications(data);
    } catch (applicationsError) {
      setError(getErrorMessage(applicationsError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const activeCount = useMemo(
    () =>
      applications.filter(
        (application) =>
          application.status !== "Rejected" &&
          application.status !== "Withdrawn",
      ).length,
    [applications],
  );

  async function handleStatusChange(
    application: JobApplication,
    status: ApplicationStatus,
  ) {
    setMoveError(null);
    setMovingId(application.id);

    const previousApplications = applications;
    setApplications((current) =>
      current.map((item) =>
        item.id === application.id ? { ...item, status } : item,
      ),
    );

    try {
      const updatedApplication = await updateApplication(
        application.id,
        toApplicationPayload(application, status),
      );

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id ? updatedApplication : item,
        ),
      );
    } catch (statusError) {
      setApplications(previousApplications);
      setMoveError(getErrorMessage(statusError));
    } finally {
      setMovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur">
        <div className="flex flex-col justify-between gap-5 p-6 sm:p-8 xl:flex-row xl:items-end">
          <div>
            <Link
              href={routes.applications}
              className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to applications
            </Link>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Drag and drop board
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Application Board
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Move applications across statuses. Each drop updates the existing
              backend with PUT /api/applications/&#123;id&#125;.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {applications.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Active
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {activeCount}
              </p>
            </div>
            <Link
              href={routes.newApplication}
              className="inline-flex min-h-20 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New role
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading board..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {moveError ? (
        <Alert
          variant="destructive"
          className="flex items-center justify-between gap-3"
        >
          <span>{moveError}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadApplications}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </Alert>
      ) : null}

      {!isLoading && !error && applications.length === 0 ? (
        <EmptyState
          title="No applications on the board"
          description="Create your first application to start moving roles across statuses."
        />
      ) : null}

      {!isLoading && !error && applications.length > 0 ? (
        <ApplicationKanban
          applications={applications}
          movingId={movingId}
          onStatusChange={handleStatusChange}
        />
      ) : null}
    </div>
  );
}
