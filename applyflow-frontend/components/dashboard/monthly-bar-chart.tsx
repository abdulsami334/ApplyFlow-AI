import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyStats } from "@/types/dashboard";

export function MonthlyBarChart({ stats }: { stats: MonthlyStats[] }) {
  const maxCount = Math.max(...stats.map((item) => item.count), 1);

  return (
    <Card className="overflow-hidden hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80">
      <div className="h-1 bg-gradient-to-r from-slate-900 via-indigo-500 to-cyan-400" />
      <CardHeader>
        <CardTitle className="text-lg">Monthly Applications</CardTitle>
        <p className="text-sm text-slate-500">
          Application volume grouped by month to spot momentum.
        </p>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No monthly activity yet.
          </p>
        ) : (
          <div className="flex h-72 items-end gap-3 overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/70 px-4 pb-4 pt-6">
            {stats.map((item) => {
              const height = Math.max((item.count / maxCount) * 100, 8);

              return (
                <div
                  key={`${item.year}-${item.month}`}
                  className="flex min-w-20 flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-44 w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-lg shadow-indigo-100 transition-all duration-300 hover:scale-x-105 hover:from-indigo-700 hover:to-cyan-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{item.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.monthName.slice(0, 3)} {item.year}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
