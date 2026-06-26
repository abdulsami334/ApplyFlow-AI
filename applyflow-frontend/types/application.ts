export const APPLICATION_STATUSES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
] as const;

export const WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type WorkMode = (typeof WORK_MODES)[number];

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  positionTitle: string;
  applicationDate: string;
  status: ApplicationStatus | string;
  location: string | null;
  jobType: JobType | string | null;
  workMode: WorkMode | string | null;
  source: string | null;
  salaryRange: string | null;
  contactName: string | null;
  contactEmail: string | null;
  jobUrl: string | null;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ApplicationPayload {
  companyName: string;
  positionTitle: string;
  applicationDate: string;
  status: ApplicationStatus | string;
  location?: string | null;
  jobType?: JobType | string | null;
  workMode?: WorkMode | string | null;
  source?: string | null;
  salaryRange?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  jobUrl?: string | null;
  followUpDate?: string | null;
  notes?: string | null;
}
