import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type {
  CreateMatchAnalysisPayload,
  JobDescription,
  JobDescriptionPayload,
  ResumeMatchAnalysis,
} from "@/types/application-match";

export async function getJobDescription(applicationId: string) {
  try {
    const response = await apiClient.get<JobDescription>(
      `/applications/${applicationId}/job-description`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function saveJobDescription(
  applicationId: string,
  payload: JobDescriptionPayload,
  hasExistingJobDescription: boolean,
) {
  const request = hasExistingJobDescription
    ? apiClient.put<JobDescription>(`/applications/${applicationId}/job-description`, payload)
    : apiClient.post<JobDescription>(`/applications/${applicationId}/job-description`, payload);

  const response = await request;
  return response.data;
}

export async function getMatchAnalysis(applicationId: string) {
  try {
    const response = await apiClient.get<ResumeMatchAnalysis>(
      `/applications/${applicationId}/match-analysis`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function createMatchAnalysis(
  applicationId: string,
  payload: CreateMatchAnalysisPayload,
) {
  const response = await apiClient.post<ResumeMatchAnalysis>(
    `/applications/${applicationId}/match-analysis`,
    payload,
  );
  return response.data;
}
