"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ExternalLink, Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";
import { cn, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { deleteApplication } from "@/services/applications.service";
import type { JobApplication } from "@/types/application";

interface ApplicationTableProps {
  applications: JobApplication[];
  onDeleted: (id: string) => void;
}

export function ApplicationTable({
  applications,
  onDeleted,
}: ApplicationTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(application: JobApplication) {
    const confirmed = window.confirm(
      `Delete ${application.positionTitle} at ${application.companyName}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setDeletingId(application.id);

    try {
      await deleteApplication(application.id);
      onDeleted(application.id);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="destructive">{error}</Alert> : null}
      <div className="grid gap-3 lg:hidden">
        {applications.map((application) => (
          <article
            key={application.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-slate-950">
                  {application.companyName}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {application.positionTitle}
                </p>
              </div>
              <Badge
                className={cn(
                  "shrink-0 border px-2.5 py-1",
                  getStatusBadgeClass(application.status),
                )}
              >
                {application.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-500">
              <p className="inline-flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 text-indigo-500" />
                Applied {formatDate(application.applicationDate)}
              </p>
              {application.location ? (
                <p className="inline-flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
                  {application.location}
                </p>
              ) : null}
              <p>
                {[application.jobType, application.workMode]
                  .filter(Boolean)
                  .join(" / ") || "No job type or work mode set"}
              </p>
              {application.followUpDate ? (
                <p>Follow-up {formatDate(application.followUpDate)}</p>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href={routes.applicationDetail(application.id)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
              <Link
                href={routes.editApplication(application.id)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
              {application.jobUrl ? (
                <Link
                  href={application.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Job
                </Link>
              ) : null}
              <Button
                variant="destructive"
                onClick={() => handleDelete(application)}
                disabled={deletingId === application.id}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletingId === application.id ? "Deleting" : "Delete"}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-200/70 backdrop-blur lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Company</th>
                <th className="px-5 py-4 font-semibold">Position</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Details</th>
                <th className="px-5 py-4 font-semibold">Applied</th>
                <th className="px-5 py-4 font-semibold">Follow-up</th>
                <th className="px-5 py-4 font-semibold">Notes</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="transition-all duration-200 hover:bg-indigo-50/45"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">
                      {application.companyName}
                    </div>
                    {application.source ? (
                      <div className="mt-1 text-xs text-slate-500">
                        via {application.source}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">
                      {application.positionTitle}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      className={cn(
                        "border px-2.5 py-1",
                        getStatusBadgeClass(application.status),
                      )}
                    >
                      {application.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    <div className="font-medium text-slate-700">
                      {application.location ?? "-"}
                    </div>
                    <div className="mt-1 text-xs">
                      {[application.jobType, application.workMode]
                        .filter(Boolean)
                        .join(" / ") || "-"}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {formatDate(application.applicationDate)}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {application.followUpDate
                      ? formatDate(application.followUpDate)
                      : "-"}
                  </td>
                  <td className="max-w-xs truncate px-5 py-4 text-slate-500">
                    {application.notes ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={routes.applicationDetail(application.id)}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Link>
                      <Link
                        href={routes.editApplication(application.id)}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(application)}
                        disabled={deletingId === application.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === application.id ? "Deleting" : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
