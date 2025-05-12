"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Building2
} from "lucide-react";
import { 
  BusinessCronStats, 
  BusinessTaskStats,
  BusinessAutoAssignStats,
  BusinessEmployeeStats
} from "@/app/api/external/omnigateway/types/cron-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type BusinessStatsType = 'cron' | 'task' | 'employee' | 'autoAssign';

interface BusinessStatsListProps {
  businessStats: BusinessCronStats[] | BusinessTaskStats[] | BusinessAutoAssignStats[] | BusinessEmployeeStats[];
  type: BusinessStatsType;
}

export default function BusinessStatsList({
  businessStats,
  type
}: BusinessStatsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
    return sortOrder === "asc" 
      ? <ChevronUp className="ml-1 h-3 w-3" /> 
      : <ChevronDown className="ml-1 h-3 w-3" />;
  };

  const filteredStats = businessStats.filter(stat => 
    stat.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStats = [...filteredStats].sort((a, b) => {
    // @ts-ignore - we know the field exists on the object
    const aValue = a[sortField];
    // @ts-ignore - we know the field exists on the object
    const bValue = b[sortField];
    
    if (sortOrder === "asc") {
      return (aValue > bValue) ? 1 : -1;
    } else {
      return (aValue < bValue) ? 1 : -1;
    }
  });

  if (businessStats.length === 0) {
    return (
      <div className="flex flex-col items-center py-8">
        <Building2 className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">No Business Statistics Available</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
          There are no business statistics available for the selected time period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex w-full mb-4">
        <div className="relative w-full">
          <Input
            className="w-full"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {type === 'cron' && (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-4 text-xs font-medium px-3 py-2 bg-muted rounded-md">
            <div>Business</div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('total')}>
              Total Jobs {getSortIcon('total')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('successful')}>
              Success Rate {getSortIcon('successful')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('failed')}>
              Failed Jobs {getSortIcon('failed')}
            </div>
          </div>

          {sortedStats.map((stat, index) => {
            const cronStat = stat as BusinessCronStats;
            const successRate = cronStat.total > 0 
              ? Math.round((cronStat.successful / cronStat.total) * 100) 
              : 0;
              
            return (
              <div 
                key={cronStat.businessId || index} 
                className="grid grid-cols-4 text-sm border-b last:border-0 py-2"
              >
                <div className="font-medium truncate" title={cronStat.businessName}>
                  {cronStat.businessName}
                </div>
                <div>{cronStat.total}</div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                  <span>{successRate}%</span>
                </div>
                <div className={cronStat.failed > 0 ? "text-red-600" : "text-muted-foreground"}>
                  {cronStat.failed}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'task' && (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-4 text-xs font-medium px-3 py-2 bg-muted rounded-md">
            <div>Business</div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('totalTasks')}>
              Total Tasks {getSortIcon('totalTasks')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('unassigned')}>
              Unassigned {getSortIcon('unassigned')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('completed')}>
              Completed {getSortIcon('completed')}
            </div>
          </div>

          {sortedStats.map((stat, index) => {
            const taskStat = stat as BusinessTaskStats;
            const completionRate = taskStat.totalTasks > 0 
              ? Math.round((taskStat.completed / taskStat.totalTasks) * 100) 
              : 0;
              
            return (
              <div 
                key={taskStat.businessId || index} 
                className="grid grid-cols-4 text-sm border-b last:border-0 py-2"
              >
                <div className="font-medium truncate" title={taskStat.businessName}>
                  {taskStat.businessName}
                  {taskStat.autoAssignEnabled && (
                    <Badge className="ml-1 bg-blue-100 text-blue-800 text-xs">AI</Badge>
                  )}
                </div>
                <div>{taskStat.totalTasks}</div>
                <div>{taskStat.unassigned}</div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <span>{taskStat.completed} ({completionRate}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'autoAssign' && (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-4 text-xs font-medium px-3 py-2 bg-muted rounded-md">
            <div>Business</div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('totalAssignments')}>
              Total Assignments {getSortIcon('totalAssignments')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('successful')}>
              Success Rate {getSortIcon('successful')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('pendingApproval')}>
              Pending Approval {getSortIcon('pendingApproval')}
            </div>
          </div>

          {sortedStats.map((stat, index) => {
            const autoStat = stat as BusinessAutoAssignStats;
            const successRate = autoStat.totalAssignments > 0 
              ? Math.round((autoStat.successful / autoStat.totalAssignments) * 100) 
              : 0;
              
            return (
              <div 
                key={autoStat.businessId || index} 
                className="grid grid-cols-4 text-sm border-b last:border-0 py-2"
              >
                <div className="font-medium truncate" title={autoStat.businessName}>
                  {autoStat.businessName}
                  {!autoStat.enabled && (
                    <Badge variant="outline" className="ml-1 text-xs">Disabled</Badge>
                  )}
                </div>
                <div>{autoStat.totalAssignments}</div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                  <span>{successRate}%</span>
                </div>
                <div>{autoStat.pendingApproval}</div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'employee' && (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 text-xs font-medium px-3 py-2 bg-muted rounded-md">
            <div>Business</div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('totalEmployees')}>
              Total Employees {getSortIcon('totalEmployees')}
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('activeEmployees')}>
              Active Employees {getSortIcon('activeEmployees')}
            </div>
          </div>

          {sortedStats.map((stat, index) => {
            const empStat = stat as BusinessEmployeeStats;
            const activeRate = empStat.totalEmployees > 0 
              ? Math.round((empStat.activeEmployees / empStat.totalEmployees) * 100) 
              : 0;
              
            return (
              <div 
                key={empStat.businessId || index} 
                className="grid grid-cols-3 text-sm border-b last:border-0 py-2"
              >
                <div className="font-medium truncate" title={empStat.businessName}>
                  {empStat.businessName}
                </div>
                <div>{empStat.totalEmployees}</div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${activeRate}%` }}
                    ></div>
                  </div>
                  <span>{empStat.activeEmployees} ({activeRate}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-2 text-center">
        Showing {filteredStats.length} of {businessStats.length} businesses
      </div>
    </div>
  );
}