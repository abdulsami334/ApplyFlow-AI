import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/auth";

export async function getCurrentUser() {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
}
