import { apiClient } from "@/lib/api-client";
import type { Resume } from "@/types/resume";

export async function getResumes() {
  const response = await apiClient.get<Resume[]>("/resumes");
  return response.data;
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<Resume>("/resumes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteResume(id: string) {
  await apiClient.delete(`/resumes/${id}`);
}
