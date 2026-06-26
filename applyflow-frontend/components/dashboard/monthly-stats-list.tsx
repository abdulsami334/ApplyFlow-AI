import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyStats } from "@/types/dashboard";

export function MonthlyStatsList({ stats }: { stats: MonthlyStats[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <p className="text-sm text-muted-foreground">No monthly activity yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.map((item) => (
              <div
                key={`${item.year}-${item.month}`}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span>
                  {item.monthName} {item.year}
                </span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
