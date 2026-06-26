import { apiClient } from "@/lib/api-client";
import type {
  DashboardSummary,
  MonthlyStats,
  StatusDistribution,
} from "@/types/dashboard";

export async function getDashboardSummary() {
  const response = await apiClient.get<DashboardSummary>("/dashboard/summary");
  return response.data;
}

export async function getStatusDistribution() {
  const response = await apiClient.get<StatusDistribution[]>(
    "/dashboard/status-distribution",
  );
  return response.data;
}

export async function getMonthlyStats() {
  const response = await apiClient.get<MonthlyStats[]>("/dashboard/monthly-stats");
  return response.data;
}
