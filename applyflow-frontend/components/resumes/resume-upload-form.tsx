"use client";

import { useRef, useState, type FormEvent } from "react";
import { UploadCloud } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/errors";
import { uploadResume } from "@/services/resumes.service";
import type { Resume } from "@/types/resume";

const maxFileSizeBytes = 5 * 1024 * 1024;
const acceptedFileTypes = ".pdf,.doc,.docx,.txt";

interface ResumeUploadFormProps {
  onUploaded: (resume: Resume) => void;
}

export function ResumeUploadForm({ onUploaded }: ResumeUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a resume file to upload.");
      return;
    }

    if (selectedFile.size > maxFileSizeBytes) {
      setError("Resume file must be 5 MB or smaller.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const resume = await uploadResume(selectedFile);
      onUploaded(resume);
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-200/70 backdrop-blur transition-all hover:shadow-lg hover:shadow-slate-200/80"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-sm font-semibold text-slate-800" htmlFor="resume-file">
            Upload resume
          </label>
          <Input
            ref={inputRef}
            id="resume-file"
            name="file"
            type="file"
            accept={acceptedFileTypes}
            className="mt-2 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => {
              setError(null);
              setSelectedFile(event.target.files?.[0] ?? null);
            }}
          />
          <p className="mt-2 text-xs text-slate-500">
            PDF, DOC, DOCX, or TXT. Maximum file size is 5 MB.
          </p>
        </div>
        <Button type="submit" data-testid="upload-resume-submit" disabled={isUploading}>
          <UploadCloud className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload resume"}
        </Button>
      </div>

      {selectedFile ? (
        <p className="mt-4 text-sm text-slate-600">
          Selected: <span className="font-semibold text-slate-950">{selectedFile.name}</span>
        </p>
      ) : null}

      {error ? (
        <div className="mt-4">
          <ErrorState message={error} />
        </div>
      ) : null}
    </form>
  );
}
