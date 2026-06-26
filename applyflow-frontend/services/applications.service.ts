import { apiClient } from "@/lib/api-client";
import type { ApplicationPayload, JobApplication } from "@/types/application";

export async function getApplications() {
  const response = await apiClient.get<JobApplication[]>("/applications");
  return response.data;
}

export async function getApplication(id: string) {
  const response = await apiClient.get<JobApplication>(`/applications/${id}`);
  return response.data;
}

export async function createApplication(payload: ApplicationPayload) {
  const response = await apiClient.post<JobApplication>("/applications", payload);
  return response.data;
}

export async function updateApplication(id: string, payload: ApplicationPayload) {
  const response = await apiClient.put<JobApplication>(`/applications/${id}`, payload);
  return response.data;
}

export async function deleteApplication(id: string) {
  await apiClient.delete(`/applications/${id}`);
}
