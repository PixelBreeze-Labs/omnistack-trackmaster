import { AdminReport } from "@/app/api/external/omnigateway/types/admin-reports";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MessageSquare, Flag } from "lucide-react";

interface ReportMetricsCardProps {
  report: AdminReport;
  isLoading?: boolean;
}

export function ReportMetricsCard({ report, isLoading = false }: ReportMetricsCardProps) {
  const viewCount = report?.viewCount || 0;
  const commentCount = report?.commentCount || 0;
  const flagCount = report?.flagCount || 0;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Views</CardTitle>
          <Eye className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-2xl font-bold">
              {viewCount.toLocaleString()}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Total number of views for this report
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Comments</CardTitle>
          <MessageSquare className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-2xl font-bold">
              {commentCount.toLocaleString()}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Total comments received on this report
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Flags</CardTitle>
          <Flag className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-2xl font-bold">
              {flagCount.toLocaleString()}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Number of times this report has been flagged
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReportMetricsCard;