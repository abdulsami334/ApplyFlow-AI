"use client";

import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
import { deleteResume } from "@/services/resumes.service";
import type { Resume } from "@/types/resume";

interface ResumeListProps {
  resumes: Resume[];
  onDeleted: (id: string) => void;
}

export function ResumeList({ resumes, onDeleted }: ResumeListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      setError(null);
      await deleteResume(id);
      onDeleted(id);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-200/70 backdrop-blur">
        <div className="grid gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid-cols-[1fr_140px_170px_120px]">
          <span>File</span>
          <span>Size</span>
          <span>Uploaded</span>
          <span className="sm:text-right">Action</span>
        </div>
        <ul className="divide-y divide-slate-100">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="grid gap-3 px-4 py-4 transition-colors hover:bg-indigo-50/40 sm:grid-cols-[1fr_140px_170px_120px] sm:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {resume.fileName}
                  </p>
                  <p className="text-xs text-slate-500">{resume.contentType}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">{formatFileSize(resume.fileSize)}</p>
              <p className="text-sm text-slate-600">{formatDate(resume.uploadedAt)}</p>
              <div className="sm:text-right">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === resume.id}
                  onClick={() => handleDelete(resume.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deletingId === resume.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
