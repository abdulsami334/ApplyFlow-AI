"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Save, SearchCheck } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import {
  createMatchAnalysis,
  getJobDescription,
  getMatchAnalysis,
  saveJobDescription,
} from "@/services/application-match.service";
import { getResumes } from "@/services/resumes.service";
import type { JobDescription, ResumeMatchAnalysis } from "@/types/application-match";
import type { Resume } from "@/types/resume";

interface ApplicationMatchWorkspaceProps {
  applicationId: string;
}

export function ApplicationMatchWorkspace({ applicationId }: ApplicationMatchWorkspaceProps) {
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [analysis, setAnalysis] = useState<ResumeMatchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const [loadedJobDescription, loadedAnalysis, loadedResumes] = await Promise.all([
          getJobDescription(applicationId),
          getMatchAnalysis(applicationId),
          getResumes(),
        ]);

        setJobDescription(loadedJobDescription);
        setJobDescriptionText(loadedJobDescription?.rawText ?? "");
        setAnalysis(loadedAnalysis);
        setResumes(loadedResumes);
        setSelectedResumeId(loadedAnalysis?.resumeId ?? loadedResumes[0]?.id ?? "");
      } catch (workspaceError) {
        setError(getErrorMessage(workspaceError));
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspace();
  }, [applicationId]);

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume.id === selectedResumeId) ?? null,
    [resumes, selectedResumeId],
  );

  async function handleSaveJobDescription() {
    try {
      setIsSaving(true);
      setError(null);
      const savedJobDescription = await saveJobDescription(
        applicationId,
        { rawText: jobDescriptionText },
        Boolean(jobDescription),
      );
      setJobDescription(savedJobDescription);
      setJobDescriptionText(savedJobDescription.rawText);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAnalyze() {
    if (!selectedResumeId) {
      setError("Select a resume before running match analysis.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      const savedJobDescription = await saveJobDescription(
        applicationId,
        { rawText: jobDescriptionText },
        Boolean(jobDescription),
      );
      setJobDescription(savedJobDescription);

      const nextAnalysis = await createMatchAnalysis(applicationId, {
        resumeId: selectedResumeId,
      });
      setAnalysis(nextAnalysis);
    } catch (analysisError) {
      setError(getErrorMessage(analysisError));
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading match workspace..." />;
  }

  return (
    <div className="space-y-5">
      {error ? <ErrorState message={error} /> : null}

      <Card className="hover:shadow-xl hover:shadow-slate-200/80">
        <CardHeader>
          <CardTitle>Application Resume Match Workspace</CardTitle>
          <CardDescription>
            Paste the job description, choose a resume from your library, then run AI-assisted ATS analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="job-description">
              Job description
            </label>
            <Textarea
              id="job-description"
              className="mt-2 min-h-48"
              value={jobDescriptionText}
              placeholder="Paste the job description here..."
              onChange={(event) => setJobDescriptionText(event.target.value)}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" disabled={isSaving} onClick={handleSaveJobDescription}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save job description"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="resume-selector">
                Resume
              </label>
              <Select
                id="resume-selector"
                className="mt-2"
                value={selectedResumeId}
                onChange={(event) => setSelectedResumeId(event.target.value)}
              >
                <option value="">Select a resume</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.fileName}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-xs text-slate-500">
                {selectedResume
                  ? `Selected from Resume Library: ${selectedResume.fileName}`
                  : "Upload a resume in the Resume Library to use it here."}
              </p>
            </div>
            <Button type="button" disabled={isAnalyzing} onClick={handleAnalyze}>
              <SearchCheck className="mr-2 h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze Match"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis ? <MatchResultCard analysis={analysis} /> : null}
    </div>
  );
}

function MatchResultCard({ analysis }: { analysis: ResumeMatchAnalysis }) {
  return (
    <Card className="animate-fade-in-up hover:shadow-xl hover:shadow-slate-200/80">
      <CardHeader>
        <CardTitle>Match result</CardTitle>
        <CardDescription>
          Saved analysis from {new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(analysis.createdAt))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {analysis.warning ? (
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{analysis.warning}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-sm shadow-indigo-100/50">
          <p className="text-sm font-medium text-indigo-700">Match score</p>
          <p className="mt-2 text-4xl font-semibold text-slate-950">{analysis.matchScore}%</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Similarity" value={formatOptionalPercent(analysis.similarityPercent)} />
          <Metric label="Skill score" value={formatOptionalPercent(analysis.skillScore)} />
          <Metric label="Domain score" value={formatOptionalPercent(analysis.domainScore)} />
        </div>

        {(analysis.resumeDomain || analysis.jobDescriptionDomain) ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Metric label="Resume domain" value={analysis.resumeDomain ?? "Unknown"} />
            <Metric label="Job domain" value={analysis.jobDescriptionDomain ?? "Unknown"} />
          </div>
        ) : null}

        <KeywordList title="Matched keywords" keywords={analysis.matchedKeywords} tone="success" />
        <KeywordList title="Missing keywords" keywords={analysis.missingKeywords} tone="warning" />

        {analysis.feedback ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {analysis.feedback}
          </div>
        ) : null}

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Suggestions</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {analysis.suggestions.map((suggestion) => (
              <li key={suggestion} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function formatOptionalPercent(value: number | null) {
  return typeof value === "number" ? `${Math.round(value)}%` : "N/A";
}

function KeywordList({
  title,
  keywords,
  tone,
}: {
  title: string;
  keywords: string[];
  tone: "success" | "warning";
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <Badge
              key={keyword}
              className={
                tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }
            >
              {keyword}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-slate-500">No keywords found.</p>
        )}
      </div>
    </div>
  );
}
