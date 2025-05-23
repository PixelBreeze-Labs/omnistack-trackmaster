// components/crm/weather-monitoring/weather-monitoring-content.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  CloudRainWind,
  MapPin,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/new-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import InputSelect from "@/components/Common/InputSelect";
import { format, formatDistance } from "date-fns";
import { useWeatherMonitoring } from "@/hooks/useWeatherMonitoring";
import Link from "next/link";

export default function WeatherMonitoringContent() {
  const {
    isLoading,
    weatherStats,
    fetchWeatherMonitoringStats,
    isInitialized
  } = useWeatherMonitoring();

  const [daysPeriod, setDaysPeriod] = useState(7);
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized) {
      fetchWeatherMonitoringStats(daysPeriod);
    }
  }, [isInitialized, fetchWeatherMonitoringStats, daysPeriod]);

  const handleDaysPeriodChange = (value: string) => {
    setDaysPeriod(parseInt(value));
  };

  const refreshData = () => {
    fetchWeatherMonitoringStats(daysPeriod);
  };

  const toggleBusinessExpansion = (businessId: string) => {
    if (expandedBusiness === businessId) {
      setExpandedBusiness(null);
    } else {
      setExpandedBusiness(businessId);
    }
  };

  // Format time for display
  const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "MMM d, yyyy HH:mm:ss");
  };

  // Get time ago for display
  const getTimeAgo = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return formatDistance(new Date(dateStr), new Date(), { addSuffix: true });
  };

  // Get status badge
  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
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

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Weather Monitoring</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track and manage weather conditions for all sites
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Period:</span>
            <div className="w-32">
              <InputSelect
                name="daysPeriod"
                label=""
                value={daysPeriod.toString()}
                onChange={handleDaysPeriodChange}
                options={[
                  { value: "1", label: "1 day" },
                  { value: "7", label: "7 days" },
                  { value: "30", label: "30 days" },
                  { value: "90", label: "90 days" }
                ]}
              />
            </div>
          </div>
          <Button onClick={refreshData} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))
        ) : weatherStats ? (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <CloudRainWind className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Weather Jobs</p>
                      <h3 className="text-2xl font-bold">{weatherStats.stats.totalJobs}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                    <p className="text-lg font-bold text-green-600">
                      {weatherStats.stats.totalJobs > 0 
                        ? Math.round((weatherStats.stats.successful / weatherStats.stats.totalJobs) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Weather Alerts</p>
                      <h3 className="text-2xl font-bold">{weatherStats.stats.totalAlerts}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Businesses with Alerts</p>
                    <p className="text-lg font-bold">{weatherStats.stats.businessesWithAlerts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Building2 className="h-8 w-8 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Enabled Businesses</p>
                      <h3 className="text-2xl font-bold">{weatherStats.stats.businessesWithWeatherEnabled}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Average Job Duration</p>
                    <p className="text-lg font-bold">{weatherStats.stats.avgDuration.toFixed(2)}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full p-2 bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success / Failed</p>
                      <h3 className="text-2xl font-bold">
                        <span className="text-green-600">{weatherStats.stats.successful}</span>
                        <span className="text-sm text-muted-foreground mx-1">/</span>
                        <span className="text-red-600">{weatherStats.stats.failed}</span>
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ 
                          width: weatherStats.stats.totalJobs > 0 
                            ? `${(weatherStats.stats.successful / weatherStats.stats.totalJobs) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="col-span-4 flex justify-center items-center h-32">
            <p className="text-muted-foreground">No weather monitoring data available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Weather Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Weather Monitoring Jobs</CardTitle>
            <CardDescription>History of recent weather check operations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Businesses</TableHead>
                  <TableHead>Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : weatherStats && weatherStats.recentJobs.length > 0 ? (
                  weatherStats.recentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>{formatTime(job.startTime)}</div>
                        <div className="text-xs text-muted-foreground">
                          {getTimeAgo(job.startTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.duration ? `${job.duration.toFixed(2)}s` : "In Progress"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(job.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{job.processedBusinesses} processed</span>
                          {job.failedBusinesses > 0 && (
                            <span className="text-xs text-red-500">
                              {job.failedBusinesses} failed
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-100">
                          {job.totalAlerts}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <CloudRainWind className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No Weather Jobs Found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm text-center">
                          No weather monitoring jobs have been recorded in this time period.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Weather monitoring service health</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : weatherStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Monitoring Service</div>
                      <div className="text-xs text-muted-foreground">
                        {weatherStats.stats.totalJobs > 0 ? 'Active' : 'No recent activity'}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-blue-100">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Check Frequency</div>
                      <div className="text-xs text-muted-foreground">
                        Every 3 hours
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-500">Scheduled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-amber-100">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium">Alert Generation</div>
                      <div className="text-xs text-muted-foreground">
                        {weatherStats.stats.totalAlerts > 0 ? 'Alert pipeline active' : 'No recent alerts'}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-amber-500">Active</Badge>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No system status data available</p>
              </div>
            )}
          </CardContent>

        </Card>
      </div>

      {/* Business Weather Status */}
      <Card>
        <CardHeader>
          <CardTitle>Business Weather Monitoring</CardTitle>
          <CardDescription>Weather monitoring status by business</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : weatherStats?.businessStats && weatherStats.businessStats.length > 0 ? (
            <div className="space-y-4">
              {weatherStats.businessStats.map((business) => (
                <div key={business.businessId}>
                  <div 
                    className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleBusinessExpansion(business.businessId)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium flex items-center">
                        {business.businessName}
                        {business.weatherEnabled ? (
                          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">Enabled</Badge>
                        ) : (
                          <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200">Disabled</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        {business.lastRunDate ? (
                          <>Last check: {getTimeAgo(business.lastRunDate)}</>
                        ) : (
                          'Never checked'
                        )}
                        <Button variant="ghost" size="sm" className="ml-2">
                          {expandedBusiness === business.businessId ? 'Hide Details' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <div className="text-muted-foreground mb-1">Total Jobs</div>
                        <div className="font-medium">{business.totalJobs}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Successful</div>
                        <div className="font-medium text-green-600">{business.successful}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Failed</div>
                        <div className="font-medium text-red-600">{business.failed}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Weather Alerts</div>
                        <div className="font-medium text-amber-600">{business.alertCount}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded business details */}
                  {expandedBusiness === business.businessId && (
                    <div className="mt-2 ml-2 border-l-2 pl-4 py-2 border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Business Settings</h4>
                          <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <div className="text-muted-foreground">Weather Monitoring:</div>
                            <div>{business.weatherEnabled ? 'Enabled' : 'Disabled'}</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <div className="text-muted-foreground">Last Check Status:</div>
                            <div>{getStatusBadge(business.lastRunStatus)}</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm border-b pb-2">
                            <div className="text-muted-foreground">Last Check Date:</div>
                            <div>{business.lastRunDate ? formatTime(business.lastRunDate) : 'Never'}</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="text-muted-foreground">Success Rate:</div>
                            <div>
                              {business.totalJobs > 0
                                ? `${Math.round((business.successful / business.totalJobs) * 100)}%`
                                : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Alert History</h4>
                          {business.alertCount > 0 ? (
                            <>
                              <div className="flex items-center justify-between text-sm border-b pb-2">
                                <div>Total Weather Alerts:</div>
                                <Badge variant="outline" className="bg-amber-100">
                                  {business.alertCount}
                                </Badge>
                              </div>
                              <div className="text-sm">
                                <div className="mb-2">Recent alert types:</div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline">Heavy Rain</Badge>
                                  <Badge variant="outline">High Winds</Badge>
                                  <Badge variant="outline">Temperature</Badge>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground pt-2">
                              No weather alerts recorded for this business.
                            </div>
                          )}
                        </div>
                      </div>
                      
                    
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No business statistics available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-10"></div>
    </div>
  );
}