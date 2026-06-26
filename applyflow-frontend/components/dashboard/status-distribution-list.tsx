import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatusDistribution } from "@/types/dashboard";

export function StatusDistributionList({
  distribution,
}: {
  distribution: StatusDistribution[];
}) {
  const maxCount = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {distribution.map((item) => (
          <div key={item.status} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.status}</span>
              <span className="text-muted-foreground">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
