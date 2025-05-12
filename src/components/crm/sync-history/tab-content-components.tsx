// Updated TabsContent components for the three remaining tabs
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/new-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { 
  TaskAssignmentStats, 
  EmployeeStatsComponent, 
  AutoAssignmentStats 
} from "./stats-components";

// Task Assignment Tab Content
export const TaskAssignmentTabContent = ({ taskStats, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Assignment Statistics</CardTitle>
        <CardDescription>Distribution of task statuses across businesses</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : taskStats ? (
          <TaskAssignmentStats taskStats={taskStats} />
        ) : (
          <div className="flex flex-col items-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No task statistics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Employee Stats Tab Content
export const EmployeeStatsTabContent = ({ employeeStats, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Statistics</CardTitle>
        <CardDescription>Staff specializations and skill levels</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : employeeStats ? (
          <EmployeeStatsComponent employeeStats={employeeStats} />
        ) : (
          <div className="flex flex-col items-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No employee statistics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// AI Auto-Assignment Tab Content
export const AutoAssignmentTabContent = ({ autoAssignStats, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Auto-Assignment Performance</CardTitle>
        <CardDescription>AI agent task assignment success metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : autoAssignStats ? (
          <AutoAssignmentStats autoAssignStats={autoAssignStats} />
        ) : (
          <div className="flex flex-col items-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No auto-assignment data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};