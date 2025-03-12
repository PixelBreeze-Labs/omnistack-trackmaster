"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronUp,
  Clock,
  FileText,
  MapPin,
  AlertTriangle,
  Download,
  Building2,
  Link as LinkIcon,
  PlusCircle,
  RefreshCw,
  Star,
  ThumbsUp,
  Users,
  CheckCircle,
  ClipboardList,
  Filter,
  MessageSquare,
  Eye,
  Bell
} from "lucide-react"

// Mock report categories data
const reportCategoriesStats = [
  { name: 'Infrastructure', count: 127, icon: <Building2 className="h-5 w-5" />, color: 'bg-blue-100' },
  { name: 'Safety', count: 85, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-red-100' },
  { name: 'Environment', count: 64, icon: <ClipboardList className="h-5 w-5" />, color: 'bg-green-100' },
  { name: 'Public Services', count: 103, icon: <Users className="h-5 w-5" />, color: 'bg-orange-100' },
]

// Mock recent reports
const recentReports = [
  { 
    title: 'Street Light Malfunction', 
    category: 'Infrastructure', 
    date: '2025-03-10', 
    status: 'In Progress',
    location: 'Main Street, Central District' 
  },
  { 
    title: 'Garbage Collection Issue', 
    category: 'Public Services', 
    date: '2025-03-09', 
    status: 'Pending',
    location: 'Oak Avenue, Western District' 
  },
  { 
    title: 'Pothole Reported', 
    category: 'Infrastructure', 
    date: '2025-03-08', 
    status: 'Resolved',
    location: 'Maple Road, Southern District' 
  },
  { 
    title: 'Park Maintenance Request', 
    category: 'Environment', 
    date: '2025-03-07', 
    status: 'In Progress',
    location: 'Community Park, Eastern District' 
  },
]

// Mock reports data for chart
const reportData = [
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
  { month: 'Dec', value: 195 },
]

// Mock top report locations
const topReportLocations = [
  { name: 'Central District', reports: 243, resolvedRate: 78 },
  { name: 'Western District', reports: 187, resolvedRate: 82 },
  { name: 'Southern District', reports: 156, resolvedRate: 75 },
  { name: 'Eastern District', reports: 129, resolvedRate: 81 },
]

export default function QytetaretDashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Qytetaret Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
            Community reporting platform for citizen engagement and issue tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="default" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
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
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">View Reports</span>
            </div>
          </Button>
          <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">View Map</span>
            </div>
          </Button>
          <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden">Send Notification</span>
            </div>
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
            <div className="text-2xl font-bold">1,679</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>74% resolution rate</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Citizens</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,842</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>146 new this month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38h</div>
            <p className="text-xs text-gray-500">Target: 48 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
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
                <div className="space-y-4">
                  {reportCategoriesStats.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`p-2 rounded-md mr-3 ${stat.color}`}>
                        {stat.icon}
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
                <div className="h-full w-full">
                  {/* This would be replaced with a Chart component */}
                  <div className="flex h-[270px] items-end gap-2">
                    {reportData.map((month, i) => (
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
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Recent Reports</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Latest community issues reported
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-gray-500">Category: {report.category}</p>
                    </div>
                    <div className="text-sm">
                      {new Date(report.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                        report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      {report.location}
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {topReportLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
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
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Citizen Engagement</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">26%</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">3.2%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Active reporting citizens</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">74%</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">5%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Issues resolved vs reported</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Citizen Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">4.2/5</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">0.3</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on issue resolution ratings</p>
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
              <p className="text-sm text-gray-500">Select the "Reports" section from the sidebar to manage all reports in detail.</p>
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
              <p className="text-sm text-gray-500">Select the "Analytics" section from the sidebar for detailed performance insights.</p>
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
              <p className="text-sm text-gray-500">Select the "Citizens" section from the sidebar to manage all registered citizens.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  )
}