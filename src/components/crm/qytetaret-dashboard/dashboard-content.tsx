"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowUp,
  ArrowDown,
  Calendar,
  ChevronUp,
  Clock,
  FileText,
  MapPin,
  Building2,
  RefreshCw,
  Users,
  CheckCircle,
  ClipboardList,
  Bell,
  ShieldAlert,
  Leaf,
  Briefcase,
  Stethoscope,
  Bus,
  MessageSquare,
} from "lucide-react"
import { useQytetaretDashboard } from '@/hooks/useQytetaretDashboard'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ReportStatus } from '@/app/api/external/omnigateway/types/admin-reports'

// Type for category icons mapping
type CategoryIconMap = {
  [key: string]: React.ReactNode;
};

// Map for category icons
const categoryIcons: CategoryIconMap = {
  'infrastructure': <Building2 className="h-5 w-5" />,
  'safety': <ShieldAlert className="h-5 w-5" />,
  'environment': <Leaf className="h-5 w-5" />,
  'public_services': <Briefcase className="h-5 w-5" />,
  'health_services': <Stethoscope className="h-5 w-5" />,
  'transportation': <Bus className="h-5 w-5" />,
  'community': <Users className="h-5 w-5" />,
  'other': <ClipboardList className="h-5 w-5" />
};

// Map for category colors
const categoryColors: { [key: string]: string } = {
  'infrastructure': 'bg-blue-100 text-blue-800',
  'safety': 'bg-red-100 text-red-800',
  'environment': 'bg-green-100 text-green-800',
  'public_services': 'bg-orange-100 text-orange-800',
  'health_services': 'bg-pink-100 text-pink-800',
  'transportation': 'bg-purple-100 text-purple-800',
  'community': 'bg-indigo-100 text-indigo-800',
  'other': 'bg-gray-100 text-gray-800'
};

// Map for status labels
const statusLabels: { [key: string]: string } = {
  [ReportStatus.PENDING_REVIEW]: 'Pending Review',
  [ReportStatus.REJECTED]: 'Rejected',
  [ReportStatus.ACTIVE]: 'Active',
  [ReportStatus.IN_PROGRESS]: 'In Progress',
  [ReportStatus.RESOLVED]: 'Resolved',
  [ReportStatus.CLOSED]: 'Closed',
  [ReportStatus.NO_RESOLUTION]: 'No Resolution',
  'pending': 'Pending'
};

export default function DashboardContent() {
  const {
    isLoading,
    dashboardStats,
    reportsByCategory,
    monthlyTrends,
    reportsByStatus,
    topLocations,
    recentReports,
    citizenMetrics,
    loadAllDashboardData,
    isInitialized
  } = useQytetaretDashboard();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isInitialized) {
      loadAllDashboardData();
    }
  }, [isInitialized, loadAllDashboardData]);

  const formatDateString = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMMM do, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleRefresh = () => {
    loadAllDashboardData();
  };

  // Calculate metrics
  const totalReports = dashboardStats?.totalReports || 0;
  const resolvedReports = dashboardStats?.resolvedReports || 0;
  const activeCitizens = dashboardStats?.activeCitizens || 0;
  const averageResponseTime = dashboardStats?.averageResponseTime || 0;
  const responseTimeTarget = 48; // Target in hours
  
  // Calculate additional metrics
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
  const newCitizensThisMonth = citizenMetrics?.newUsersThisMonth || 0;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
            Community reporting platform for citizen engagement and issue tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="default" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

     {/* Quick Actions - Redesigned as a card with icon buttons */}
     <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">Quick Actions</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
          <a href="https://qytetaret.al/reports">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">View Reports</span>
            </div>
            </a>
          </Button>
          <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
          <a href="https://qytetaret.al/map">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">View Map</span>
            </div>
            </a>
          </Button>
          
          <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
          <a href="/crm/platform/contacts">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">Send Notification</span>
            </div>
            </a>
          </Button>
        
        </div>
      </div>
      
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalReports.toLocaleString()}</div>
                {citizenMetrics ? (
                  <div className="flex items-center text-xs text-green-500">
                    <ChevronUp className="h-3 w-3 mr-1" />
                    <span>{newCitizensThisMonth} new submissions this month</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Reports submitted</div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold">{resolvedReports.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-500">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span>{resolutionRate}% resolution rate</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold">{activeCitizens.toLocaleString()}</div>
                {citizenMetrics ? (
                  <div className="flex items-center text-xs text-green-500">
                    <ChevronUp className="h-3 w-3 mr-1" />
                    <span>{newCitizensThisMonth} new this month</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Registered users</div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold">{averageResponseTime}h</div>
                <div className="flex items-center text-xs">
                  {averageResponseTime < responseTimeTarget ? (
                    <div className="text-green-500 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      <span>{responseTimeTarget - averageResponseTime}h faster than target</span>
                    </div>
                  ) : (
                    <div className="text-red-500 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>{averageResponseTime - responseTimeTarget}h slower than target</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="citizens">Citizens</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Report Categories & Trend */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Report Categories */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Report Categories</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Distribution of reports by category
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : reportsByCategory && reportsByCategory.length > 0 ? (
                  <div className="space-y-4">
                    {reportsByCategory.map((stat, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`p-2 rounded-md mr-3 ${categoryColors[stat.category] || 'bg-gray-100'}`}>
                          {categoryIcons[stat.category] || <ClipboardList className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{stat.name}</p>
                        </div>
                        <div className="font-medium">
                          {stat.count}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reports Trend */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Reports Trend</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Number of reports submitted per month
                  </p>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-[270px] w-full" />
                ) : monthlyTrends && monthlyTrends.length > 0 ? (
                  <div className="h-full w-full">
                    <div className="flex h-[270px] items-end gap-2">
                      {monthlyTrends.map((month, i) => {
                        // Find max value to scale bars appropriately
                        const maxValue = Math.max(...monthlyTrends.map(m => m.value || 0));
                        const barHeight = maxValue > 0 ? ((month.value || 0) / maxValue) * 100 : 0;
                        
                        return (
                          <div key={i} className="flex-1 group relative">
                            <div 
                              className="bg-primary/90 rounded-sm hover:bg-primary w-full transition-all"
                              style={{ height: `${barHeight}%` }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                {month.value || 0} reports
                              </div>
                            </div>
                            <div className="mt-1.5 text-[10px] text-muted-foreground text-center">
                              {month.month}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No trend data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Report Status Distribution */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Report Status Distribution</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Breakdown of reports by current status
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : reportsByStatus && reportsByStatus.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {reportsByStatus.map((item, index) => (
                    <div key={index} className="flex flex-col items-center p-4 border rounded-md bg-card">
                      <div className="text-2xl font-bold mb-1">{item.count}</div>
                      <div className="text-xs text-center text-muted-foreground">{statusLabels[item.status] || item.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                  No status data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Recent Reports</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Latest community issues reported
                  </p>
                </div>
                <Link href="/crm/platform/reports/all">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentReports && recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="md:col-span-2">
                        <Link href={`/crm/platform/reports/${report._id}`}>
                          <p className="font-medium hover:text-primary">{report.title || 'Untitled Report'}</p>
                        </Link>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {categoryIcons[report.category || 'other'] || <ClipboardList className="h-3.5 w-3.5" />}
                          <span>{(report.category || 'other').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </p>
                      </div>
                      <div className="text-sm">
                        {formatDateString(report.createdAt)}
                      </div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.status === ReportStatus.RESOLVED ? 'bg-green-100 text-green-800' : 
                          report.status === ReportStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' : 
                          report.status === ReportStatus.ACTIVE ? 'bg-purple-100 text-purple-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {statusLabels[report.status || 'pending'] || report.status || 'Pending'}
                        </span>
                      </div>
                      <div className="text-sm flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        {report.location || 'Unknown location'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  No recent reports available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Report Locations */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Top Report Locations</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Areas with the most reported issues
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : topLocations && topLocations.length > 0 ? (
                <div className="space-y-4">
                  {topLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-md mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{location.name || 'Unknown Location'}</p>
                          <p className="text-sm text-gray-500">{location.reports || 0} reports</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>{location.resolvedRate || 0}% resolved</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  No location data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Citizen Engagement</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : citizenMetrics ? (
                  <div>
                    <div className="flex items-center justify-between">
                      {totalReports > 0 && activeCitizens > 0 ? (
                        <div className="text-2xl font-bold">
                          {Math.round((citizenMetrics.reportingUserCount / activeCitizens) * 100) || 0}%
                        </div>
                      ) : (
                        <div className="text-2xl font-bold">0%</div>
                      )}
                      <div className="flex items-center text-green-500">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">{citizenMetrics.newUsersThisMonth || 0}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Active reporting citizens</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-10 text-muted-foreground text-sm">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{resolutionRate}%</div>
                      {resolvedReports > 0 && (
                        <div className="flex items-center text-green-500">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-sm">{resolvedReports}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Issues resolved vs reported</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Reports Per User</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : citizenMetrics ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{citizenMetrics.avgReportsPerUser?.toFixed(1) || '0'}</div>
                      {citizenMetrics.reportingUserCount > 0 && (
                        <div className="flex items-center text-green-500">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-sm">{citizenMetrics.reportingUserCount}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Reports submitted per active user</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-10 text-muted-foreground text-sm">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Reports Management</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Track and manage community reports
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">View and manage all community reports in detail.</p>
              <Link href="/crm/platform/reports/all">
                <Button>Go to Reports Management</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Detailed Analytics</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Advanced metrics and reporting tools
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Explore detailed insights and performance metrics.</p>
              <Link href="/crm/platform/qytetaret-analytics/reports">
                <Button>Go to Analytics Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="citizens">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Citizen Management</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  View and manage citizen profiles and engagement
                </p>
              </div>
            </CardHeader>
            <CardContent>
            <p className="text-sm text-gray-500 mb-4">Access citizen profiles and engagement metrics.</p>
              <Link href="/crm/platform/citizens/all">
                <Button>Go to Citizen Management</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  )
}