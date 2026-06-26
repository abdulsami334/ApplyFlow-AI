"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { ApplicationMatchWorkspace } from "@/components/applications/application-match-workspace";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";
import { cn, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { getApplication } from "@/services/applications.service";
import type { JobApplication } from "@/types/application";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await getApplication(params.id);
        setApplication(data);
      } catch (applicationError) {
        setError(getErrorMessage(applicationError));
      } finally {
        setIsLoading(false);
      }
    }

    loadApplication();
  }, [params.id]);

  if (isLoading) {
    return <LoadingState label="Loading application..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!application) {
    return <ErrorState message="Application not found." />;
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm shadow-slate-200/70 backdrop-blur">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {application.positionTitle}
              </h1>
              <Badge className={cn("border px-2.5 py-1", getStatusBadgeClass(application.status))}>
                {application.status}
              </Badge>
            </div>
            <p className="mt-2 text-lg font-medium text-slate-700">{application.companyName}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
              <p>Applied {formatDate(application.applicationDate)}</p>
              <p>{application.location ?? "No location set"}</p>
              <p>{[application.jobType, application.workMode].filter(Boolean).join(" / ") || "No work type set"}</p>
            </div>
            {application.notes ? (
              <p className="mt-4 max-w-3xl rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {application.notes}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {application.jobUrl ? (
              <Link href={application.jobUrl} target="_blank" rel="noreferrer">
                <Button type="button" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Job post
                </Button>
              </Link>
            ) : null}
            <Link href={routes.editApplication(application.id)}>
              <Button type="button" variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ApplicationMatchWorkspace applicationId={application.id} />
    </div>
  );
}
