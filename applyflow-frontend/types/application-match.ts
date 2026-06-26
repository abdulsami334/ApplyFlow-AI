export interface JobDescription {
  id: string;
  userId: string;
  applicationId: string;
  rawText: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescriptionPayload {
  rawText: string;
}

export interface CreateMatchAnalysisPayload {
  resumeId: string;
}

export interface ResumeMatchAnalysis {
  id: string;
  userId: string;
  applicationId: string;
  resumeId: string;
  jobDescriptionId: string;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  warning: string | null;
  createdAt: string;
}
