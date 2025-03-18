"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowUp,
  BarChart3,
  Calendar,
  Clock,
  FileText,
  MapPin,
  AlertTriangle,
  Download,
  Building2,
  PlusCircle,
  RefreshCw,
  Users,
  CheckCircle,
  Filter,
  MessageSquare,
  Eye,
  ArrowDown,
  TrendingUp,
  BarChart2,
  PieChart,
  Map,
  Clock3,
  ThumbsUp,
  UserCheck,
  Shuffle,
  Hash,
  ChevronDown,
  ListFilter
} from "lucide-react"
import { Badge } from '@/components/ui/badge'
import { useReportAnalytics } from '@/hooks/useReportAnalytics'
import { format, subDays, subMonths } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ReportStatus } from '@/app/api/external/omnigateway/types/admin-reports'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CategoryTrendsChart from './CategoryTrendsChart'

export default function ReportAnalyticsContent() {
  const {
    isLoading,
    resolutionMetrics,
    categoryTrends,
    geographicDistribution,
    responseTimeMetrics,
    userEngagementMetrics,
    comparativeAnalysis,
    trendingKeywords,
    loadAllAnalyticsData,
    isInitialized
  } = useReportAnalytics();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('resolution');

  useEffect(() => {
    if (isInitialized) {
      loadAllAnalyticsData({
        startDate,
        endDate,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      });
    }
  }, [isInitialized, loadAllAnalyticsData, startDate, endDate, categoryFilter]);

  // Update date range when dropdown selection changes
  useEffect(() => {
    const now = new Date();
    
    switch(dateRange) {
      case '7d':
        setStartDate(format(subDays(now, 7), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case '30d':
        setStartDate(format(subDays(now, 30), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case '90d':
        setStartDate(format(subDays(now, 90), 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        break;
      case 'custom':
        // Don't change the dates for custom selection
        break;
    }
  }, [dateRange]);

  const handleRefresh = () => {
    loadAllAnalyticsData({
      startDate,
      endDate,
      category: categoryFilter !== 'all' ? categoryFilter : undefined
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
            Detailed analysis and insights for community reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange === 'custom' 
                  ? `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d')}` 
                  : dateRange === '7d' 
                    ? 'Last 7 days' 
                    : dateRange === '30d' 
                      ? 'Last 30 days' 
                      : 'Last 90 days'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Date Range</h4>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={dateRange === '7d' ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setDateRange('7d')}
                  >
                    7 days
                  </Button>
                  <Button 
                    variant={dateRange === '30d' ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setDateRange('30d')}
                  >
                    30 days
                  </Button>
                  <Button 
                    variant={dateRange === '90d' ? "default" : "outline"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setDateRange('90d')}
                  >
                    90 days
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Custom Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Start Date</label>
                      <Input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setDateRange('custom');
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">End Date</label>
                      <Input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setDateRange('custom');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('infrastructure')}>
                Infrastructure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('safety')}>
                Safety
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('environment')}>
                Environment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('public_services')}>
                Public Services
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {comparativeAnalysis?.metrics?.reports?.current || 0}
                </div>
                {comparativeAnalysis?.metrics?.reports?.change && (
                  <div className={`flex items-center text-xs ${
                    (comparativeAnalysis.metrics.reports.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(comparativeAnalysis.metrics.reports.change || 0) > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{Math.abs(comparativeAnalysis.metrics.reports.change || 0)}% from previous period</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {resolutionMetrics?.overall?.resolutionRate?.toFixed(1) || '0'}%
                </div>
                {comparativeAnalysis?.metrics?.resolved?.change && (
                  <div className={`flex items-center text-xs ${
                    (comparativeAnalysis.metrics.resolved.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(comparativeAnalysis.metrics.resolved.change || 0) > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{Math.abs(comparativeAnalysis.metrics.resolved.change || 0)}% from previous period</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {responseTimeMetrics?.averageResponseTime?.toFixed(1) || '0'}h
                </div>
                {comparativeAnalysis?.metrics?.responseTime?.change && (
                  <div className={`flex items-center text-xs ${
                    (comparativeAnalysis.metrics.responseTime?.change || 0) < 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(comparativeAnalysis.metrics.responseTime?.change || 0) < 0 ? (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {Math.abs(comparativeAnalysis.metrics.responseTime?.change || 0)}% 
                      {(comparativeAnalysis.metrics.responseTime?.change || 0) < 0 ? ' faster' : ' slower'} than previous
                    </span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {userEngagementMetrics?.totalUsers || 0}
                </div>
                {comparativeAnalysis?.metrics?.users?.change && (
                  <div className={`flex items-center text-xs ${
                    (comparativeAnalysis.metrics.users.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(comparativeAnalysis.metrics.users.change || 0) > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{Math.abs(comparativeAnalysis.metrics.users.change || 0)}% from previous period</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="resolution" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="resolution">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Resolution</span>
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="geographic">
            <Map className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Geographic</span>
          </TabsTrigger>
          <TabsTrigger value="response">
            <Clock3 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Response Time</span>
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <UserCheck className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">User Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Shuffle className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Hash className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Keywords</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Resolution Metrics Tab */}
        <TabsContent value="resolution" className="space-y-4">
          <Card>
          <CardHeader>
  <div className="relative w-full">
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Resolution Metrics</h3>
      <p className="text-sm text-muted-foreground mt-0 mb-2">
        Analysis of report resolution rates and efficiency
      </p>
    </div>
    <Badge variant="secondary" className="absolute right-0 top-0 flex items-center gap-1">
      <CheckCircle className="h-3.5 w-3.5" />
      <span>{resolutionMetrics?.overall?.resolved || 0} Resolved</span>
    </Badge>
  </div>
</CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Overall resolution metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Reports</p>
                      <p className="text-2xl font-bold">{resolutionMetrics?.overall?.total || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Resolved</p>
                      <p className="text-2xl font-bold">{resolutionMetrics?.overall?.resolved || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Resolution Rate</p>
                      <p className="text-2xl font-bold">{resolutionMetrics?.overall?.resolutionRate?.toFixed(1) || '0'}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg. Resolution Time</p>
                      <p className="text-2xl font-bold">{resolutionMetrics?.overall?.avgResolutionTime?.toFixed(1) || '0'}h</p>
                    </div>
                  </div>
              
                  {/* Resolution by category */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Resolution Rate by Category</h4>
                    <div className="space-y-4">
                      {resolutionMetrics?.byCategory?.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium capitalize">{(item.category || '').replace(/_/g, ' ')}</p>
                            <p className="font-medium">{item.resolutionRate?.toFixed(1) || '0'}%</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${item.resolutionRate || 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>{item.resolved || 0} resolved</span>
                            <span>{item.total || 0} total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              
                  {/* Resolution trend over time */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Resolution Rate Trend</h4>
                    <div className="h-[200px] w-full">
                      {resolutionMetrics?.trend && resolutionMetrics.trend.length > 0 ? (
                        <div className="flex h-[170px] items-end gap-2">
                          {resolutionMetrics.trend.map((point, i) => (
                            <div key={i} className="flex-1 group relative">
                              <div 
                                className="bg-primary/90 rounded-sm hover:bg-primary w-full transition-all"
                                style={{ height: `${point.resolutionRate || 0}%` }}
                              >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  {point.resolutionRate?.toFixed(1) || '0'}%
                                </div>
                              </div>
                              <div className="mt-1.5 text-[10px] text-muted-foreground text-center">
                                {format(new Date(point.date), 'MMM d')}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-500">
                          No trend data available
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Analysis Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Category Analysis</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-2">
                  Distribution and trends of reports by category
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Category distribution */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Report Distribution by Category</h4>
                    {categoryTrends?.distribution && categoryTrends.distribution.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {categoryTrends.distribution.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold mb-1">{item.count || 0}</div>
                            <div className="text-sm text-gray-500 capitalize">{(item.category || '').replace(/_/g, ' ')}</div>
                            <div className="text-xs text-primary mt-1">{item.percentage?.toFixed(1) || '0'}%</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No category distribution data available
                      </div>
                    )}
                  </div>
                  
                  {/* Category growth */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Category Growth (Monthly)</h4>
                    {categoryTrends?.growth && categoryTrends.growth.length > 0 ? (
                      <div className="space-y-3">
                        {categoryTrends.growth.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="capitalize">{(item.category || '').replace(/_/g, ' ')}</div>
                            </div>
                            <div className="flex items-center">
                              {(item.monthlyGrowth || 0) > 0 ? (
                                <div className="flex items-center text-green-500">
                                  <ArrowUp className="h-4 w-4 mr-1" />
                                  <span>{item.monthlyGrowth?.toFixed(1) || '0'}%</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-500">
                                  <ArrowDown className="h-4 w-4 mr-1" />
                                  <span>{Math.abs(item.monthlyGrowth || 0)?.toFixed(1) || '0'}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No category growth data available
                      </div>
                    )}
                  </div>
                  
                 
                  {/* Category trends visualization */}
<div>
  <h4 className="text-sm font-medium mb-3">Category Trends Over Time</h4>
  {categoryTrends?.trends && categoryTrends.trends.length > 0 ? (
    <CategoryTrendsChart data={categoryTrends.trends} />
  ) : (
    <div className="h-60 border rounded-md flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">No category trend data available</p>
    </div>
  )}
</div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Geographic Analysis Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Geographic Analysis</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-2">
                  Spatial distribution of reports by region
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Hotspots */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Report Hotspots</h4>
                    {geographicDistribution?.hotspots && geographicDistribution.hotspots.length > 0 ? (
                      <div className="border rounded-lg p-4">
                        <div className="h-80 mb-4 bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-500">Interactive map with hotspots would appear here</p>
                        </div>
                        <div className="space-y-2">
                          {geographicDistribution.hotspots.map((spot, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-primary" />
                                <span>
                                  Location ({spot.location?.lat?.toFixed(2) || '0'}, {spot.location?.lng?.toFixed(2) || '0'})
                                </span>
                              </div>
                              <span className="font-medium">{spot.count || 0} reports</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 text-center py-8">
                        <p className="text-gray-500">No geographic hotspot data available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Category distribution by location */}
{geographicDistribution?.hotspots && geographicDistribution.hotspots.length > 0 && (
  <div>
    <h4 className="text-sm font-medium mb-3">Category Distribution by Hotspot</h4>
    <div className="space-y-4">
      {geographicDistribution.hotspots.slice(0, 3).map((spot, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg">
          <div className="font-medium mb-2">
            Location ({spot.location?.lat?.toFixed(2) || '0'}, {spot.location?.lng?.toFixed(2) || '0'})
          </div>
          {spot.categories && spot.categories.length > 0 ? (
            <div className="space-y-2">
              {spot.categories.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="capitalize">{(cat.name || '').replace(/_/g, ' ')}</span>
                  <span>{cat.count || 0} reports</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No category data available</p>
          )}
        </div>
      ))}
    </div>
  </div>
)}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Response Time Tab */}
        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Response Time Analysis</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-2">
                  Metrics on report response and resolution times
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Overall response metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg Response Time</p>
                      <p className="text-2xl font-bold">{responseTimeMetrics?.averageResponseTime?.toFixed(1) || '0'}h</p>
                    </div>
                    {responseTimeMetrics?.byCategory && responseTimeMetrics.byCategory.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Best Category</p>
                        <p className="text-2xl font-bold">
                          {responseTimeMetrics.byCategory.reduce((best, current) => 
                            (!best || (current.averageResponseTime || 0) < (best.averageResponseTime || 0)) ? current : best, null)?.averageResponseTime?.toFixed(1) || '0'}h
                        </p>
                      </div>
                    )}
                    {responseTimeMetrics?.byWeekday && responseTimeMetrics.byWeekday.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Best Day</p>
                        <p className="text-2xl font-bold">
                          {responseTimeMetrics.byWeekday.reduce((best, current) => 
                            (!best || (current.averageResponseTime || 0) < (best.averageResponseTime || 0)) ? current : best, null)?.weekday || ''}
                        </p>
                      </div>
                    )}
                    {responseTimeMetrics?.responseTimeTrend && responseTimeMetrics.responseTimeTrend.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Trend</p>
                        <p className="text-2xl font-bold flex items-center">
                          {responseTimeMetrics.responseTimeTrend[responseTimeMetrics.responseTimeTrend.length - 1].averageResponseTime < 
                           responseTimeMetrics.responseTimeTrend[0].averageResponseTime ? (
                             <>
                               <ArrowDown className="h-5 w-5 text-green-500 mr-1" />
                               <span className="text-green-500">Improving</span>
                             </>
                           ) : (
                             <>
                               <ArrowUp className="h-5 w-5 text-red-500 mr-1" />
                               <span className="text-red-500">Slowing</span>
                             </>
                           )
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Response time by category */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Response Time by Category</h4>
                    {responseTimeMetrics?.byCategory && responseTimeMetrics.byCategory.length > 0 ? (
                      <div className="space-y-3">
                        {responseTimeMetrics.byCategory.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="capitalize">{(item.category || '').replace(/_/g, ' ')}</div>
                            <div className="flex items-center font-medium">
                              <Clock className="h-4 w-4 mr-2 text-primary" />
                              {item.averageResponseTime?.toFixed(1) || '0'}h
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No response time by category data available
                      </div>
                    )}
                  </div>
                  
                  {/* Response time by weekday */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Response Time by Weekday</h4>
                    {responseTimeMetrics?.byWeekday && responseTimeMetrics.byWeekday.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {responseTimeMetrics.byWeekday.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-sm text-gray-500">{item.weekday}</div>
                            <div className="text-xl font-bold mt-1">{item.averageResponseTime?.toFixed(1) || '0'}h</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No response time by weekday data available
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* User Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">User Engagement</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-2">
                  Citizen engagement and participation metrics
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Engagement overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold">{userEngagementMetrics?.totalUsers || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-2xl font-bold">{userEngagementMetrics?.activeUsers || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg Reports/User</p>
                      <p className="text-2xl font-bold">{userEngagementMetrics?.averageReportsPerUser?.toFixed(1) || '0'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Retention Rate</p>
                      <p className="text-2xl font-bold">{userEngagementMetrics?.retention?.retentionRate?.toFixed(1) || '0'}%</p>
                    </div>
                  </div>
                  
                  {/* User breakdown */}
                  {userEngagementMetrics?.userBreakdown && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">User Breakdown</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold">{userEngagementMetrics.userBreakdown.powerUsers || 0}</div>
                          <p className="text-sm text-gray-500">Power Users</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold">{userEngagementMetrics.userBreakdown.regularUsers || 0}</div>
                          <p className="text-sm text-gray-500">Regular Users</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold">{userEngagementMetrics.userBreakdown.oneTimeUsers || 0}</div>
                          <p className="text-sm text-gray-500">One-Time Users</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* User engagement trend */}
                  {userEngagementMetrics?.engagement && userEngagementMetrics.engagement.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Engagement Trend</h4>
                      <div className="space-y-3">
                        {userEngagementMetrics.engagement.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>{item.date}</div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-1 text-primary" />
                                <span>{item.reports || 0} reports</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-primary" />
                                <span>{item.users || 0} users</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Comparative Analysis Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Comparative Analysis</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-2">
                  Comparing current period with previous period
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Key metrics comparison */}
                  {comparativeAnalysis?.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {comparativeAnalysis.metrics.reports && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-xs text-gray-500 mb-2">Total Reports</h5>
                          <div className="flex justify-between items-end">
                            <div className="font-bold text-lg">{comparativeAnalysis.metrics.reports.current || 0}</div>
                            {comparativeAnalysis.metrics.reports.change !== undefined && (
                              <div className={`text-xs flex items-center ${
                                (comparativeAnalysis.metrics.reports.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {(comparativeAnalysis.metrics.reports.change || 0) > 0 ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(comparativeAnalysis.metrics.reports.change || 0)?.toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">vs. {comparativeAnalysis.metrics.reports.previous || 0}</div>
                        </div>
                      )}
                      
                      {comparativeAnalysis.metrics.resolved && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-xs text-gray-500 mb-2">Resolved</h5>
                          <div className="flex justify-between items-end">
                            <div className="font-bold text-lg">{comparativeAnalysis.metrics.resolved.current || 0}</div>
                            {comparativeAnalysis.metrics.resolved.change !== undefined && (
                              <div className={`text-xs flex items-center ${
                                (comparativeAnalysis.metrics.resolved.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {(comparativeAnalysis.metrics.resolved.change || 0) > 0 ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(comparativeAnalysis.metrics.resolved.change || 0)?.toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">vs. {comparativeAnalysis.metrics.resolved.previous || 0}</div>
                        </div>
                      )}
                      
                      {comparativeAnalysis.metrics.users && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-xs text-gray-500 mb-2">Active Users</h5>
                          <div className="flex justify-between items-end">
                            <div className="font-bold text-lg">{comparativeAnalysis.metrics.users.current || 0}</div>
                            {comparativeAnalysis.metrics.users.change !== undefined && (
                              <div className={`text-xs flex items-center ${
                                (comparativeAnalysis.metrics.users.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {(comparativeAnalysis.metrics.users.change || 0) > 0 ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(comparativeAnalysis.metrics.users.change || 0)?.toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">vs. {comparativeAnalysis.metrics.users.previous || 0}</div>
                        </div>
                      )}
                      
                      {comparativeAnalysis.metrics.responseTime && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-xs text-gray-500 mb-2">Avg Response Time</h5>
                          <div className="flex justify-between items-end">
                            <div className="font-bold text-lg">{comparativeAnalysis.metrics.responseTime.current?.toFixed(1) || '0'}h</div>
                            {comparativeAnalysis.metrics.responseTime.change !== undefined && (
                              <div className={`text-xs flex items-center ${
                                (comparativeAnalysis.metrics.responseTime.change || 0) < 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {(comparativeAnalysis.metrics.responseTime.change || 0) < 0 ? (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(comparativeAnalysis.metrics.responseTime.change || 0)?.toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">vs. {comparativeAnalysis.metrics.responseTime.previous?.toFixed(1) || '0'}h</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Category comparison */}
                  {comparativeAnalysis?.categories && comparativeAnalysis.categories.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Category Comparison</h4>
                      <div className="space-y-3">
                        {comparativeAnalysis.categories.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div className="capitalize">{(item.category || '').replace(/_/g, ' ')}</div>
                              {item.change !== null && item.change !== undefined && (
                                <div className={`text-xs flex items-center ${
                                  (item.change || 0) > 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {(item.change || 0) > 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  )}
                                  <span>{Math.abs(item.change || 0)?.toFixed(1)}%</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-gray-400 h-2.5 rounded-full" 
                                  style={{ width: `${item.previous && item.current ? 
                                    ((item.previous || 0) / Math.max((item.current || 0), (item.previous || 0)) * 100) : 0}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">{item.previous || 0}</div>
                              <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${item.previous && item.current ? 
                                    ((item.current || 0) / Math.max((item.current || 0), (item.previous || 0)) * 100) : 0}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">{item.current || 0}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Keywords Analysis Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Keyword Analysis</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-2">
                  Trending keywords and topics from report content
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Top keywords */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Keywords</h4>
                    {trendingKeywords?.topKeywords && trendingKeywords.topKeywords.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {trendingKeywords.topKeywords.slice(0, 8).map((keyword, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className="text-xl font-bold">{keyword.count || 0}</div>
                            <div className="text-xs text-gray-500">mentions</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No keyword data available
                      </div>
                    )}
                  </div>
                  
                  {/* Trending by period */}
                  {trendingKeywords?.trendsByPeriod && trendingKeywords.trendsByPeriod.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Keywords by Period</h4>
                      <div className="space-y-4">
                        {trendingKeywords.trendsByPeriod.map((period, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium mb-2">
                              {period.period?.start && period.period?.end ? 
                                `${format(new Date(period.period.start), 'MMM d')} - ${format(new Date(period.period.end), 'MMM d')}` :
                                `Period ${index + 1}`
                              }
                            </div>
                            {period.keywords && period.keywords.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {period.keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-white">
                                    {keyword.keyword} ({keyword.count})
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No keywords for this period</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  )
}