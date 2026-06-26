import { ApplicationForm } from "@/components/applications/application-form";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          New application
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Add a role to your pipeline
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Capture the core role details, source, contact, and next follow-up.
        </p>
      </div>
      <ApplicationForm mode="create" />
    </div>
  );
}
