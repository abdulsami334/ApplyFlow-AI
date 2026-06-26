export interface DashboardSummary {
  totalApplications: number;
  applied: number;
  screening: number;
  interview: number;
  offers: number;
  rejected: number;
  withdrawn: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface MonthlyStats {
  year: number;
  month: number;
  monthName: string;
  count: number;
}
