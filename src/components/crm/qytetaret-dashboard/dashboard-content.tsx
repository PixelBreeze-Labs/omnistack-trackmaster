"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowUp,
  BarChart3,
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
    try {
      return format(new Date(dateString), 'MMMM do, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleRefresh = () => {
    loadAllDashboardData();
  };

  // Generate mock data if real data is not available
  const getCategoryData = () => {
    if (reportsByCategory && reportsByCategory.length > 0) {
      return reportsByCategory;
    }
    
    // Fallback mock data
    return [
      { name: 'Infrastructure', count: 127, category: 'infrastructure' },
      { name: 'Safety', count: 85, category: 'safety' },
      { name: 'Environment', count: 64, category: 'environment' },
      { name: 'Public Services', count: 103, category: 'public_services' },
      { name: 'Health Services', count: 42, category: 'health_services' },
      { name: 'Transportation', count: 73, category: 'transportation' }
    ];
  };

  const getTrendData = () => {
    if (monthlyTrends && monthlyTrends.length > 0) {
      return monthlyTrends;
    }
    
    // Fallback mock data
    return [
      { month: 'Jan', value: 87 },
      { month: 'Feb', value: 95 },
      { month: 'Mar', value: 112 },
      { month: 'Apr', value: 108 },
      { month: 'May', value: 125 },
      { month: 'Jun', value: 136 },
      { month: 'Jul', value: 142 },
      { month: 'Aug', value: 156 },
      { month: 'Sep', value: 168 },
      { month: 'Oct', value: 173 },
      { month: 'Nov', value: 182 },
      { month: 'Dec', value: 195 }
    ];
  };

  const getStatusData = () => {
    if (reportsByStatus && reportsByStatus.length > 0) {
      return reportsByStatus;
    }
    
    // Fallback mock data
    return [
      { status: ReportStatus.PENDING_REVIEW, count: 43 },
      { status: ReportStatus.ACTIVE, count: 156 },
      { status: ReportStatus.IN_PROGRESS, count: 98 },
      { status: ReportStatus.RESOLVED, count: 320 },
      { status: ReportStatus.CLOSED, count: 87 },
      { status: ReportStatus.NO_RESOLUTION, count: 32 },
      { status: ReportStatus.REJECTED, count: 19 }
    ];
  };

  const getLocationData = () => {
    if (topLocations && topLocations.length > 0) {
      return topLocations;
    }
    
    // Fallback mock data
    return [
      { name: 'Central District', reports: 243, resolvedRate: 78 },
      { name: 'Western District', reports: 187, resolvedRate: 82 },
      { name: 'Southern District', reports: 156, resolvedRate: 75 },
      { name: 'Eastern District', reports: 129, resolvedRate: 81 }
    ];
  };

  const getRecentReportsData = () => {
    if (recentReports && recentReports.length > 0) {
      return recentReports;
    }
    
    // Fallback mock data
    return [
      { 
        title: 'Street Light Malfunction', 
        category: 'infrastructure', 
        createdAt: '2025-03-10T12:34:56Z', 
        status: ReportStatus.IN_PROGRESS,
        location: 'Main Street, Central District',
        _id: '1'
      },
      { 
        title: 'Garbage Collection Issue', 
        category: 'public_services', 
        createdAt: '2025-03-09T09:23:45Z', 
        status: ReportStatus.PENDING_REVIEW,
        location: 'Oak Avenue, Western District',
        _id: '2'
      },
      { 
        title: 'Pothole Reported', 
        category: 'infrastructure', 
        createdAt: '2025-03-08T15:12:33Z', 
        status: ReportStatus.RESOLVED,
        location: 'Maple Road, Southern District',
        _id: '3'
      },
      { 
        title: 'Park Maintenance Request', 
        category: 'environment', 
        createdAt: '2025-03-07T11:45:22Z',
        status: ReportStatus.IN_PROGRESS,
        location: 'Community Park, Eastern District',
        _id: '4'
      }
    ];
  };

  // Extract metrics or use fallback values
  const totalReports = dashboardStats?.totalReports || 1679;
  const resolvedReports = dashboardStats?.resolvedReports || 1248;
  const activeCitizens = dashboardStats?.activeCitizens || 3842;
  const averageResponseTime = dashboardStats?.averageResponseTime || 38;
  
  // Calculate metrics
  const resolutionRate = Math.round((resolvedReports / totalReports) * 100);
  const newCitizensThisMonth = citizenMetrics?.newUsersThisMonth || 146;
  const responseTimeTarget = 48; // Target in hours
  
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

      {/* Quick Actions */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Link href="/crm/platform/reports/all">
            <Button size="sm" variant="outline" className="h-10 flex justify-start px-3 overflow-hidden w-full">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap text-ellipsis overflow-hidden">View Reports</span>
              </div>
            </Button>
          </Link>
          <Link href="/crm/platform/map">
            <Button size="sm" variant="outline" className="h-10 flex justify-start px-3 overflow-hidden w-full">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap text-ellipsis overflow-hidden">View Map</span>
              </div>
            </Button>
          </Link>
          <Link href="/crm/platform/analytics">
            <Button size="sm" variant="outline" className="h-10 flex justify-start px-3 overflow-hidden w-full">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap text-ellipsis overflow-hidden">Analytics</span>
              </div>
            </Button>
          </Link>
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
                <div className="flex items-center text-xs text-green-500">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span>12% from last month</span>
                </div>
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
                <div className="flex items-center text-xs text-green-500">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span>{newCitizensThisMonth} new this month</span>
                </div>
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
                <p className="text-xs text-gray-500">Target: {responseTimeTarget} hours</p>
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
                ) : (
                  <div className="space-y-4">
                    {getCategoryData().map((stat, index) => (
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
                ) : (
                  <div className="h-full w-full">
                    <div className="flex h-[270px] items-end gap-2">
                      {getTrendData().map((month, i) => (
                        <div key={i} className="flex-1 group relative">
                          <div 
                            className="bg-primary/90 rounded-sm hover:bg-primary w-full transition-all"
                            style={{ height: `${(month.value / 200) * 100}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {month.value} reports
                            </div>
                          </div>
                          <div className="mt-1.5 text-[10px] text-muted-foreground text-center">
                            {month.month}
                          </div>
                        </div>
                      ))}
                    </div>
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
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getStatusData().map((item, index) => (
                    <div key={index} className="flex flex-col items-center p-4 border rounded-md bg-card">
                      <div className="text-2xl font-bold mb-1">{item.count}</div>
                      <div className="text-xs text-center text-muted-foreground">{statusLabels[item.status] || item.status}</div>
                    </div>
                  ))}
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
              ) : (
                <div className="space-y-4">
                  {getRecentReportsData().map((report, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <div className="md:col-span-2">
                        <Link href={`/crm/platform/reports/${report._id}`}>
                          <p className="font-medium hover:text-primary">{report.title}</p>
                        </Link>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {categoryIcons[report.category] || <ClipboardList className="h-3.5 w-3.5" />}
                          <span>{report.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
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
                          {statusLabels[report.status] || report.status}
                        </span>
                      </div>
                      <div className="text-sm flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        {report.location}
                      </div>
                    </div>
                  ))}
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
              ) : (
                <div className="space-y-4">
                  {getLocationData().map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-md mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-gray-500">{location.reports} reports</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>{location.resolvedRate}% resolved</span>
                      </div>
                    </div>
                  ))}
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
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">26%</div>
                      <div className="flex items-center text-green-500">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">3.2%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Active reporting citizens</p>
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
                      <div className="flex items-center text-green-500">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">5%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Issues resolved vs reported</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Citizen Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">4.2/5</div>
                      <div className="flex items-center text-green-500">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">0.3</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Based on issue resolution ratings</p>
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
              <Link href="/crm/platform/analytics">
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
              <Link href="/crm/platform/citizens">
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