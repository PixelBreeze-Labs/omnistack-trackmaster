"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  BarChart4
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CronJobStats } from "@/app/api/external/omnigateway/types/cron-history";

interface StatisticsOverviewCardsProps {
  cronStats: CronJobStats | null;
  daysPeriod: number;
}

export default function StatisticsOverviewCards({
  cronStats,
  daysPeriod
}: StatisticsOverviewCardsProps) {
  if (!cronStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const { totalRuns, successful, failed } = cronStats;
  const successRate = totalRuns > 0 ? Math.round((successful / totalRuns) * 100) : 0;
  const failureRate = totalRuns > 0 ? Math.round((failed / totalRuns) * 100) : 0;
  const dailyAverage = Math.round(totalRuns / daysPeriod);
  
  // Calculate average duration across all jobs
  let totalDuration = 0;
  let durationCount = 0;
  
  Object.values(cronStats.jobTypes).forEach(jobType => {
    if (jobType.avgDuration > 0) {
      totalDuration += jobType.avgDuration * jobType.successful;
      durationCount += jobType.successful;
    }
  });
  
  const avgDuration = durationCount > 0 ? (totalDuration / durationCount).toFixed(2) : "N/A";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Runs Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sync Jobs</CardTitle>
          <BarChart4 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRuns}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. {dailyAverage} jobs per day over {daysPeriod} days
          </p>
        </CardContent>
      </Card>

      {/* Success Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{successRate}%</div>
          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {successful} successful jobs
          </p>
        </CardContent>
      </Card>

      {/* Failure Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{failureRate}%</div>
          <div className="mt-1 h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-2 bg-red-600 rounded-full"
              style={{ width: `${failureRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {failed} failed jobs
          </p>
        </CardContent>
      </Card>

      {/* Average Duration Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDuration}s</div>
          <p className="text-xs text-muted-foreground mt-1">
            Average execution time per job
          </p>
        </CardContent>
      </Card>
    </div>
  );
}