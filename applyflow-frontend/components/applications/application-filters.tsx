"use client";

import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { APPLICATION_STATUSES, JOB_TYPES, WORK_MODES } from "@/types/application";

export interface ApplicationFiltersValue {
  search: string;
  status: string;
  jobType: string;
  workMode: string;
  source: string;
}

interface ApplicationFiltersProps {
  value: ApplicationFiltersValue;
  onChange: (value: ApplicationFiltersValue) => void;
  sources: string[];
}

const emptyFilters: ApplicationFiltersValue = {
  search: "",
  status: "",
  jobType: "",
  workMode: "",
  source: "",
};

export function ApplicationFilters({
  value,
  onChange,
  sources,
}: ApplicationFiltersProps) {
  function updateFilter(name: keyof ApplicationFiltersValue, nextValue: string) {
    onChange({ ...value, [name]: nextValue });
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm shadow-slate-200/70 backdrop-blur transition-all hover:shadow-md hover:shadow-slate-200/80 sm:p-5">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Search and filters
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Find the roles that need your attention next.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(emptyFilters)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="space-y-2 md:col-span-2 xl:col-span-2">
          <Label htmlFor="applicationSearch">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="applicationSearch"
              value={value.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Company, role, location, contact..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="statusFilter">Status</Label>
          <Select
            id="statusFilter"
            value={value.status}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTypeFilter">Job type</Label>
          <Select
            id="jobTypeFilter"
            value={value.jobType}
            onChange={(event) => updateFilter("jobType", event.target.value)}
          >
            <option value="">All types</option>
            {JOB_TYPES.map((jobType) => (
              <option key={jobType} value={jobType}>
                {jobType}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workModeFilter">Work mode</Label>
          <Select
            id="workModeFilter"
            value={value.workMode}
            onChange={(event) => updateFilter("workMode", event.target.value)}
          >
            <option value="">All modes</option>
            {WORK_MODES.map((workMode) => (
              <option key={workMode} value={workMode}>
                {workMode}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceFilter">Source</Label>
          <Select
            id="sourceFilter"
            value={value.source}
            onChange={(event) => updateFilter("source", event.target.value)}
          >
            <option value="">All sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
