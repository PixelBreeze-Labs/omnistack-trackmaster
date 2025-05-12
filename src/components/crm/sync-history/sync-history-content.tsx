"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Bot,
  Users,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/new-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import InputSelect from "@/components/Common/InputSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/new-tab";
import { useSyncHistory } from "@/hooks/useSyncHistory";
import { format, formatDistance } from "date-fns";
import StatisticsOverviewCards from "./statistics-overview";
import CronJobFilters from "./cron-job-filters";
import { CronJobHistoryItem } from "@/app/api/external/omnigateway/types/cron-history";
import BusinessStatsList from "./business-stats-list";

export default function SyncHistoryContent() {
  const {
    isLoading,
    cronJobs,
    cronStats,
    totalItems,
    totalPages,
    currentPage,
    fetchCronJobHistory,
    fetchCronJobStats,
    fetchTaskStats,
    fetchEmployeeStats,
    fetchAutoAssignStats,
    isInitialized
  } = useSyncHistory();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [businessFilter, setBusinessFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [daysPeriod, setDaysPeriod] = useState(7);
  const [activeTab, setActiveTab] = useState("history");
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized]);

  const loadData = async () => {
    if (activeTab === "history") {
      fetchCronJobHistory({
        page: 1,
        limit: itemsPerPage,
        status: statusFilter !== "all" ? statusFilter as any : undefined,
        jobName: jobTypeFilter !== "all" ? jobTypeFilter : undefined,
        businessId: businessFilter || undefined
      });
    } else if (activeTab === "statistics") {
      Promise.all([
        fetchCronJobStats(daysPeriod),
        fetchTaskStats(),
        fetchEmployeeStats(),
        fetchAutoAssignStats(daysPeriod)
      ]);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "history" && cronJobs.length === 0) {
      fetchCronJobHistory({
        page: 1,
        limit: itemsPerPage
      });
    } else if (value === "statistics" && !cronStats) {
      Promise.all([
        fetchCronJobStats(daysPeriod),
        fetchTaskStats(),
        fetchEmployeeStats(),
        fetchAutoAssignStats(daysPeriod)
      ]);
    }
  };

  const handleSearch = () => {
    fetchCronJobHistory({
      page: 1,
      limit: itemsPerPage,
      status: statusFilter !== "all" ? statusFilter as any : undefined,
      jobName: jobTypeFilter !== "all" ? jobTypeFilter : undefined,
      businessId: businessFilter || undefined
    });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleJobTypeChange = (value: string) => {
    setJobTypeFilter(value);
  };

  const handleBusinessFilterChange = (value: string) => {
    setBusinessFilter(value);
  };

  const handlePageChange = (page: number) => {
    fetchCronJobHistory({
      page,
      limit: itemsPerPage,
      status: statusFilter !== "all" ? statusFilter as any : undefined,
      jobName: jobTypeFilter !== "all" ? jobTypeFilter : undefined,
      businessId: businessFilter || undefined
    });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value);
    setItemsPerPage(limit);
    fetchCronJobHistory({
      page: 1,
      limit,
      status: statusFilter !== "all" ? statusFilter as any : undefined,
      jobName: jobTypeFilter !== "all" ? jobTypeFilter : undefined,
      businessId: businessFilter || undefined
    });
  };

  const handleDaysPeriodChange = (days: number) => {
    setDaysPeriod(days);
    fetchCronJobStats(days);
    fetchAutoAssignStats(days);
  };

  const refreshData = () => {
    loadData();
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  // Utility function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "started":
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format time for display
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "MMM d, yyyy HH:mm:ss");
  };

  // Simplified job name for display
  const getReadableJobName = (jobName: string) => {
    // Map of job names to human-readable names
    const jobNameMap: Record<string, string> = {
      "scheduledEmployeeSync": "Employee Sync",
      "scheduledTaskSync": "Task Sync",
      "processUnassignedTasks": "Process Unassigned Tasks",
      "businessAutoAssign": "Business Auto Assignment",
      "findOptimalAssigneeForVenueBoostTask": "Find Optimal Assignee",
      "manuallyTriggeredAutoAssign": "Manual Auto Assignment",
      "manuallyApproveAssignment": "Manual Approve Assignment",
      "manuallyRejectAssignment": "Manual Reject Assignment"
    };
    
    return jobNameMap[jobName] || jobName;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Synchronization</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor system sync operations, task assignments, and automation statistics
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Tabs 
        defaultValue="history" 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="history">Sync History</TabsTrigger>
          <TabsTrigger value="statistics">Statistics & Analytics</TabsTrigger>
        </TabsList>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <CronJobFilters 
            statusFilter={statusFilter}
            jobTypeFilter={jobTypeFilter}
            businessFilter={businessFilter}
            onStatusChange={handleStatusChange}
            onJobTypeChange={handleJobTypeChange}
            onBusinessFilterChange={handleBusinessFilterChange}
            onSearch={handleSearch}
          />

          {/* Cron Jobs Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : cronJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <AlertCircle className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Sync Jobs Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {statusFilter !== 'all' || jobTypeFilter !== 'all' || businessFilter
                              ? "No sync jobs match your search criteria. Try adjusting your filters."
                              : "No sync jobs have been recorded yet."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cronJobs.map((job) => (
                      <>
                        <TableRow
                          key={job.id}
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() => toggleJobExpansion(job.id)}
                        >
                          <TableCell>
                            <div className="font-medium">{getReadableJobName(job.jobName)}</div>
                            <div className="text-xs text-muted-foreground">{job.jobName}</div>
                          </TableCell>
                          <TableCell>
                            {job.businessName || "Multiple Businesses"}
                          </TableCell>
                          <TableCell>
                            <div>{formatTime(job.startTime)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistance(new Date(job.startTime), new Date(), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {job.duration ? `${job.duration.toFixed(2)}s` : "In Progress"}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(job.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleJobExpansion(job.id);
                              }}
                            >
                              {expandedJobs[job.id] ? "Hide Details" : "View Details"}
                            </Button>
                          </TableCell>
                        </TableRow>

                        {/* Expanded details */}
                        {expandedJobs[job.id] && (
                          <TableRow className="bg-slate-50 border-t-0">
                            <TableCell colSpan={6} className="p-4">
                              <div className="space-y-4">
                                {job.error && (
                                  <div className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md">
                                    <div className="font-medium mb-1">Error:</div>
                                    <div className="text-sm">{job.error}</div>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Job Information</h4>
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-3 text-sm">
                                        <div className="text-muted-foreground">Job ID:</div>
                                        <div className="col-span-2 font-mono text-xs">{job.id}</div>
                                      </div>
                                      <div className="grid grid-cols-3 text-sm">
                                        <div className="text-muted-foreground">Job Name:</div>
                                        <div className="col-span-2">{job.jobName}</div>
                                      </div>
                                      <div className="grid grid-cols-3 text-sm">
                                        <div className="text-muted-foreground">Status:</div>
                                        <div className="col-span-2">{getStatusBadge(job.status)}</div>
                                      </div>
                                      <div className="grid grid-cols-3 text-sm">
                                        <div className="text-muted-foreground">Start Time:</div>
                                        <div className="col-span-2">{formatTime(job.startTime)}</div>
                                      </div>
                                      <div className="grid grid-cols-3 text-sm">
                                        <div className="text-muted-foreground">End Time:</div>
                                        <div className="col-span-2">{formatTime(job.endTime)}</div>
                                      </div>
                                      <div className="grid grid-cols-3 text-sm">
                                        <div className="text-muted-foreground">Duration:</div>
                                        <div className="col-span-2">{job.duration ? `${job.duration.toFixed(2)} seconds` : "N/A"}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Job Details</h4>
                                    {job.details && Object.keys(job.details).length > 0 ? (
                                      <div className="space-y-2">
                                        {Object.entries(job.details).map(([key, value]) => (
                                          <div key={key} className="grid grid-cols-3 text-sm">
                                            <div className="text-muted-foreground">{key}:</div>
                                            <div className="col-span-2">
                                              {typeof value === 'object' 
                                                ? JSON.stringify(value) 
                                                : String(value)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground">No additional details available</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {!isLoading && cronJobs.length > 0 && (
                <div className="border-t px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Rows per page</span>
                      <div className="w-20">
                        <InputSelect
                          name="pageSize"
                          label=""
                          value={itemsPerPage.toString()}
                          onChange={handleLimitChange}
                          options={[
                            { value: "10", label: "10" },
                            { value: "20", label: "20" },
                            { value: "50", label: "50" },
                            { value: "100", label: "100" }
                          ]}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logic for showing correct page numbers
                            let pageNum = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                              pageNum = currentPage - 3 + i + 1;
                              if (pageNum > totalPages) {
                                pageNum = totalPages - (5 - (i + 1));
                              }
                            }
                            
                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => handlePageChange(pageNum)}
                                  isActive={pageNum === currentPage}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                      Showing <span className="font-medium">{cronJobs.length}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> jobs
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">System Performance Analytics</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Time Period:</span>
              <div className="w-32">
                <InputSelect
                  name="daysPeriod"
                  label=""
                  value={daysPeriod.toString()}
                  onChange={(value) => handleDaysPeriodChange(parseInt(value))}
                  options={[
                    { value: "1", label: "1 day" },
                    { value: "7", label: "7 days" },
                    { value: "30", label: "30 days" },
                    { value: "90", label: "90 days" }
                  ]}
                />
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <StatisticsOverviewCards 
              cronStats={cronStats}
              daysPeriod={daysPeriod}
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Job Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Job Type Performance</CardTitle>
                <CardDescription>Success rates and average durations by job type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : cronStats && cronStats.jobTypes ? (
                  <div className="space-y-4">
                    {Object.entries(cronStats.jobTypes).map(([jobName, stats]) => (
                      <div key={jobName} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{getReadableJobName(jobName)}</div>
                          <div className="text-xs text-muted-foreground">{jobName}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Success Rate</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                                <div 
                                  className="bg-green-600 h-2.5 rounded-full"
                                  style={{ width: `${(stats.successful / stats.total) * 100}%` }}
                                ></div>
                              </div>
                              <span>{Math.round((stats.successful / stats.total) * 100)}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Avg. Duration</div>
                            <div>{stats.avgDuration}s</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-medium">{stats.total}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Successful</div>
                            <div className="font-medium text-green-600">{stats.successful}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Failed</div>
                            <div className="font-medium text-red-600">{stats.failed}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No job statistics available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Business Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Business Performance</CardTitle>
                <CardDescription>Sync job success rates by business</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : cronStats && cronStats.businessStats ? (
                  <BusinessStatsList 
                    businessStats={cronStats.businessStats}
                    type="cron"
                  />
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No business statistics available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Statistics Tabs */}
          <Tabs defaultValue="task" className="mt-6">
            <TabsList>
              <TabsTrigger value="task"><ClipboardList className="h-4 w-4 mr-2" /> Task Assignment</TabsTrigger>
              <TabsTrigger value="employee"><Users className="h-4 w-4 mr-2" /> Employee Stats</TabsTrigger>
              <TabsTrigger value="autoassign"><Bot className="h-4 w-4 mr-2" /> AI Auto-Assignment</TabsTrigger>
            </TabsList>
            
            {/* Task Assignment Stats */}
            <TabsContent value="task" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task Assignment Statistics</CardTitle>
                  <CardDescription>Distribution of task statuses across businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Content will be added in a separate component */}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Employee Stats */}
            <TabsContent value="employee" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Statistics</CardTitle>
                  <CardDescription>Staff specializations and skill levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Content will be added in a separate component */}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Auto-Assignment Stats */}
            <TabsContent value="autoassign" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Auto-Assignment Performance</CardTitle>
                  <CardDescription>AI agent task assignment success metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Content will be added in a separate component */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}