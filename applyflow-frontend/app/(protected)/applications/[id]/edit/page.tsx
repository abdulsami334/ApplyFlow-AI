"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApplicationForm } from "@/components/applications/application-form";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { getErrorMessage } from "@/lib/errors";
import { getApplication } from "@/services/applications.service";
import type { JobApplication } from "@/types/application";

export default function EditApplicationPage() {
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Edit application
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Update application details
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Keep status, dates, and notes aligned with your latest progress.
        </p>
      </div>
      {isLoading ? <LoadingState label="Loading application..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && application ? (
        <ApplicationForm mode="edit" application={application} />
      ) : null}
    </div>
  );
}
