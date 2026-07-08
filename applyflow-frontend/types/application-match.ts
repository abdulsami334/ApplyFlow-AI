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
  resumeDomain: string | null;
  jobDescriptionDomain: string | null;
  similarityPercent: number | null;
  skillScore: number | null;
  domainScore: number | null;
  feedback: string | null;
  resumeSkills: string[];
  jobDescriptionSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  warning: string | null;
  createdAt: string;
}
