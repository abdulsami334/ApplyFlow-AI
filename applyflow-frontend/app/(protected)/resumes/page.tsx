"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { ResumeList } from "@/components/resumes/resume-list";
import { ResumeUploadForm } from "@/components/resumes/resume-upload-form";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { getErrorMessage } from "@/lib/errors";
import { getResumes } from "@/services/resumes.service";
import type { Resume } from "@/types/resume";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResumes() {
      try {
        const data = await getResumes();
        setResumes(data);
      } catch (resumeError) {
        setError(getErrorMessage(resumeError));
      } finally {
        setIsLoading(false);
      }
    }

    loadResumes();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">
              Resume library
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Resumes
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/80">
              Keep resume files organized for your job search and use them in
              application match analysis from each application detail page.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-indigo-100">
            <FileText className="h-7 w-7" />
          </div>
        </div>
      </div>

      <ResumeUploadForm
        onUploaded={(resume) =>
          setResumes((currentResumes) => [resume, ...currentResumes])
        }
      />

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-6 text-indigo-900 shadow-sm shadow-indigo-100/50">
        Use in application analysis: open an application, paste the job description,
        then select one of these resumes to run a deterministic match.
      </div>

      {isLoading ? <LoadingState label="Loading resumes..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && !error && resumes.length === 0 ? (
        <EmptyState
          title="No resumes yet"
          description="Upload your first resume to start building your library."
          actionLabel="Upload resume"
          actionHref="#resume-file"
        />
      ) : null}

      {!isLoading && !error && resumes.length > 0 ? (
        <ResumeList
          resumes={resumes}
          onDeleted={(id) =>
            setResumes((currentResumes) =>
              currentResumes.filter((resume) => resume.id !== id),
            )
          }
        />
      ) : null}
    </div>
  );
}
