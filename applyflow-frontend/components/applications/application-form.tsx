"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, CalendarClock, Contact, FileText } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { routes } from "@/lib/routes";
import { toDateInputValue, toUtcDateTime } from "@/lib/utils";
import {
  createApplication,
  updateApplication,
} from "@/services/applications.service";
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  WORK_MODES,
  type ApplicationPayload,
  type JobApplication,
} from "@/types/application";

interface ApplicationFormProps {
  mode: "create" | "edit";
  application?: JobApplication;
}

export function ApplicationForm({ mode, application }: ApplicationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ApplicationPayload>({
    companyName: application?.companyName ?? "",
    positionTitle: application?.positionTitle ?? "",
    applicationDate: application
      ? toDateInputValue(application.applicationDate)
      : new Date().toISOString().slice(0, 10),
    status: application?.status ?? "Applied",
    location: application?.location ?? "",
    jobType: application?.jobType ?? "",
    workMode: application?.workMode ?? "",
    source: application?.source ?? "",
    salaryRange: application?.salaryRange ?? "",
    contactName: application?.contactName ?? "",
    contactEmail: application?.contactEmail ?? "",
    jobUrl: application?.jobUrl ?? "",
    followUpDate: application?.followUpDate
      ? toDateInputValue(application.followUpDate)
      : "",
    notes: application?.notes ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof ApplicationPayload, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: ApplicationPayload = {
      ...form,
      companyName: form.companyName.trim(),
      positionTitle: form.positionTitle.trim(),
      applicationDate: toUtcDateTime(form.applicationDate),
      location: form.location?.trim() || null,
      jobType: form.jobType?.trim() || null,
      workMode: form.workMode?.trim() || null,
      source: form.source?.trim() || null,
      salaryRange: form.salaryRange?.trim() || null,
      contactName: form.contactName?.trim() || null,
      contactEmail: form.contactEmail?.trim() || null,
      jobUrl: form.jobUrl?.trim() || null,
      followUpDate: form.followUpDate ? toUtcDateTime(form.followUpDate) : null,
      notes: form.notes?.trim() || null,
    };

    try {
      if (mode === "edit" && application) {
        await updateApplication(application.id, payload);
      } else {
        await createApplication(payload);
      }

      router.push(routes.applications);
      router.refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/50 to-white">
        <CardTitle className="text-2xl">
          {mode === "edit" ? "Edit application" : "Create application"}
        </CardTitle>
        <CardDescription className="text-slate-500">
          Track the role, current status, and any useful notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {error ? <Alert variant="destructive">{error}</Alert> : null}

          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Role details</h2>
                <p className="text-sm text-slate-500">
                  Company, title, location, and working style.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="positionTitle">Position</Label>
                <Input
                  id="positionTitle"
                  value={form.positionTitle}
                  onChange={(event) =>
                    updateField("positionTitle", event.target.value)
                  }
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location ?? ""}
                  onChange={(event) => updateField("location", event.target.value)}
                  maxLength={255}
                  placeholder="New York, Remote, London..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job type</Label>
                <Select
                  id="jobType"
                  value={form.jobType ?? ""}
                  onChange={(event) => updateField("jobType", event.target.value)}
                >
                  <option value="">Not specified</option>
                  {JOB_TYPES.map((jobType) => (
                    <option key={jobType} value={jobType}>
                      {jobType}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workMode">Work mode</Label>
                <Select
                  id="workMode"
                  value={form.workMode ?? ""}
                  onChange={(event) => updateField("workMode", event.target.value)}
                >
                  <option value="">Not specified</option>
                  {WORK_MODES.map((workMode) => (
                    <option key={workMode} value={workMode}>
                      {workMode}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary range</Label>
                <Input
                  id="salaryRange"
                  value={form.salaryRange ?? ""}
                  onChange={(event) =>
                    updateField("salaryRange", event.target.value)
                  }
                  maxLength={100}
                  placeholder="$100k - $130k"
                />
              </div>
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Tracking details</h2>
                <p className="text-sm text-slate-500">
                  Status, application date, source, and follow-up timing.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="applicationDate">Application date</Label>
                <Input
                  id="applicationDate"
                  type="date"
                  value={form.applicationDate}
                  onChange={(event) =>
                    updateField("applicationDate", event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  required
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={form.source ?? ""}
                  onChange={(event) => updateField("source", event.target.value)}
                  maxLength={255}
                  placeholder="LinkedIn, referral, company site..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={form.followUpDate ?? ""}
                  onChange={(event) =>
                    updateField("followUpDate", event.target.value)
                  }
                />
              </div>
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Contact className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Contact and links</h2>
                <p className="text-sm text-slate-500">
                  Recruiter details and the original job link.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={form.contactName ?? ""}
                  onChange={(event) =>
                    updateField("contactName", event.target.value)
                  }
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail ?? ""}
                  onChange={(event) =>
                    updateField("contactEmail", event.target.value)
                  }
                  maxLength={255}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  value={form.jobUrl ?? ""}
                  onChange={(event) => updateField("jobUrl", event.target.value)}
                  maxLength={1000}
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          <section className="space-y-5 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Notes</h2>
                <p className="text-sm text-slate-500">
                  Interview details, recruiter context, and next steps.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes ?? ""}
                onChange={(event) => updateField("notes", event.target.value)}
                maxLength={2000}
                placeholder="Interview details, recruiter name, next steps..."
              />
            </div>
          </section>

          <div className="sticky bottom-0 -mx-5 flex flex-col-reverse gap-3 border-t border-slate-100 bg-white/90 px-5 py-4 backdrop-blur sm:-mx-6 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(routes.applications)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save changes"
                  : "Create application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
