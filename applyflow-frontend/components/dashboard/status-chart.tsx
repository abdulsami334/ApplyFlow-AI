import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getStatusBadgeClass } from "@/lib/utils";
import type { StatusDistribution } from "@/types/dashboard";

export function StatusChart({
  distribution,
}: {
  distribution: StatusDistribution[];
}) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="overflow-hidden hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
      <CardHeader>
        <CardTitle className="text-lg">Status Distribution</CardTitle>
        <p className="text-sm text-slate-500">
          Current pipeline split across every application status.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {distribution.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No status activity yet.
          </p>
        ) : distribution.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.status} className="space-y-2 rounded-xl p-2 transition-colors hover:bg-slate-50">
              <div className="flex items-center justify-between text-sm">
                <Badge className={cn("border", getStatusBadgeClass(item.status))}>
                  {item.status}
                </Badge>
                <span className="font-medium text-slate-500">
                  {item.count} / {percentage}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-[width] duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
