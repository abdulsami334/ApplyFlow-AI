"use client";

import { useState, type DragEvent } from "react";
import Link from "next/link";
import { CalendarDays, GripVertical, MapPin, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/lib/routes";
import { cn, formatDate, getStatusBadgeClass } from "@/lib/utils";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from "@/types/application";

export function ApplicationKanban({
  applications,
  onStatusChange,
  movingId,
}: {
  applications: JobApplication[];
  onStatusChange?: (
    application: JobApplication,
    status: ApplicationStatus,
  ) => Promise<void> | void;
  movingId?: string | null;
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<ApplicationStatus | null>(null);

  const grouped = APPLICATION_STATUSES.map((status) => ({
    status,
    applications: applications.filter(
      (application) => application.status.toLowerCase() === status.toLowerCase(),
    ),
  }));

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    application: JobApplication,
  ) {
    if (!onStatusChange) {
      return;
    }

    setDraggedId(application.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", application.id);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setOverStatus(null);
  }

  async function handleDrop(
    event: DragEvent<HTMLElement>,
    status: ApplicationStatus,
  ) {
    event.preventDefault();
    setOverStatus(null);

    if (!onStatusChange) {
      return;
    }

    const id = event.dataTransfer.getData("text/plain");
    const application = applications.find((item) => item.id === id);

    if (!application || application.status === status) {
      return;
    }

    await onStatusChange(application, status);
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[1120px] grid-cols-6 gap-4 xl:min-w-0">
        {grouped.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            applications={column.applications}
            draggedId={draggedId}
            isOver={overStatus === column.status}
            movingId={movingId}
            isInteractive={Boolean(onStatusChange)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={(event) => {
              if (!onStatusChange) {
                return;
              }

              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setOverStatus(column.status);
            }}
            onDragLeave={() => setOverStatus(null)}
            onDrop={(event) => handleDrop(event, column.status)}
          />
        ))}
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  applications,
  draggedId,
  isOver,
  movingId,
  isInteractive,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  status: ApplicationStatus;
  applications: JobApplication[];
  draggedId: string | null;
  isOver: boolean;
  movingId?: string | null;
  isInteractive: boolean;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    application: JobApplication,
  ) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}) {
  return (
    <section
      className={cn(
        "flex max-h-[calc(100vh-15rem)] min-h-[28rem] flex-col rounded-2xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-200/70 transition-colors",
        isOver && "border-indigo-300 bg-indigo-50/60",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <Badge className={cn("border px-2.5 py-1", getStatusBadgeClass(status))}>
          {status}
        </Badge>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {applications.length}
        </span>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {applications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-xs font-medium text-slate-500">
            {isInteractive ? "Drop applications here" : "No applications"}
          </p>
        ) : (
          applications.map((application) => (
            <div
              key={application.id}
              draggable={isInteractive}
              onDragStart={(event) => onDragStart(event, application)}
              onDragEnd={onDragEnd}
              className={cn(
                "rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md",
                isInteractive && "cursor-grab active:cursor-grabbing",
                draggedId === application.id && "opacity-50",
                movingId === application.id && "pointer-events-none opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-950">
                    {application.companyName}
                  </div>
                  <div className="mt-1 text-slate-500">
                    {application.positionTitle}
                  </div>
                </div>
                {isInteractive ? (
                  <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                ) : null}
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <p className="inline-flex items-center">
                  <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                  Applied {formatDate(application.applicationDate)}
                </p>
                {application.location ? (
                  <p className="flex items-center">
                    <MapPin className="mr-1.5 h-3.5 w-3.5" />
                    {application.location}
                  </p>
                ) : null}
                {application.followUpDate ? (
                  <p>Follow up {formatDate(application.followUpDate)}</p>
                ) : null}
              </div>
              <Link
                href={routes.editApplication(application.id)}
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
