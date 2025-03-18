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

  // Mock data generators for each analytics type
  const getResolutionData = () => {
    if (resolutionMetrics) return resolutionMetrics;
    
    // Fallback mock data
    return {
      overall: {
        total: 847,
        resolved: 623,
        resolutionRate: 73.6,
        avgResolutionTime: 56.2, // hours
      },
      byCategory: [
        { category: 'infrastructure', total: 312, resolved: 248, resolutionRate: 79.5 },
        { category: 'safety', total: 187, resolved: 153, resolutionRate: 81.8 },
        { category: 'environment', total: 145, resolved: 93, resolutionRate: 64.1 },
        { category: 'public_services', total: 203, resolved: 129, resolutionRate: 63.5 }
      ],
      trend: [
        { date: '2025-02-15', resolutionRate: 65.2 },
        { date: '2025-02-22', resolutionRate: 68.7 },
        { date: '2025-03-01', resolutionRate: 70.3 },
        { date: '2025-03-08', resolutionRate: 72.1 },
        { date: '2025-03-15', resolutionRate: 73.6 }
      ]
    };
  };

  const getCategoryTrendsData = () => {
    if (categoryTrends) return categoryTrends;
    
    // Fallback mock data
    return {
      distribution: [
        { category: 'infrastructure', count: 312, percentage: 36.8 },
        { category: 'safety', count: 187, percentage: 22.1 },
        { category: 'environment', count: 145, percentage: 17.1 },
        { category: 'public_services', count: 203, percentage: 24.0 }
      ],
      trend: [
        { 
          date: '2025-02-15', 
          infrastructure: 72, safety: 43, environment: 32, public_services: 47
        },
        { 
          date: '2025-02-22', 
          infrastructure: 68, safety: 39, environment: 29, public_services: 42
        },
        { 
          date: '2025-03-01', 
          infrastructure: 83, safety: 46, environment: 37, public_services: 51
        },
        { 
          date: '2025-03-08', 
          infrastructure: 89, safety: 59, environment: 47, public_services: 63
        }
      ],
      growth: [
        { category: 'infrastructure', monthlyGrowth: 12.5 },
        { category: 'safety', monthlyGrowth: 8.3 },
        { category: 'environment', monthlyGrowth: 15.2 },
        { category: 'public_services', monthlyGrowth: 6.7 }
      ]
    };
  };

  const getGeographicData = () => {
    if (geographicDistribution) return geographicDistribution;
    
    // Fallback mock data
    return {
      regions: [
        { region: 'Central District', count: 283, percentage: 33.4 },
        { region: 'Western District', count: 204, percentage: 24.1 },
        { region: 'Eastern District', count: 178, percentage: 21.0 },
        { region: 'Southern District', count: 182, percentage: 21.5 }
      ],
      hotspots: [
        { location: 'Downtown Center', lat: 41.881832, lng: -87.623177, count: 78 },
        { location: 'West Park Area', lat: 41.878113, lng: -87.629799, count: 53 },
        { location: 'North Station', lat: 41.883229, lng: -87.632398, count: 47 },
        { location: 'East River Bridge', lat: 41.886215, lng: -87.626186, count: 39 }
      ],
      regionTrends: [
        { 
          date: '2025-02-15', 
          central: 65, western: 48, eastern: 42, southern: 44
        },
        { 
          date: '2025-02-22', 
          central: 70, western: 51, eastern: 39, southern: 49
        },
        { 
          date: '2025-03-01', 
          central: 74, western: 53, eastern: 47, southern: 46
        },
        { 
          date: '2025-03-08', 
          central: 74, western: 52, eastern: 50, southern: 43
        }
      ]
    };
  };

  const getResponseTimeData = () => {
    if (responseTimeMetrics) return responseTimeMetrics;
    
    // Fallback mock data
    return {
      overall: {
        averageResponseTime: 38.6, // hours
        medianResponseTime: 32.1,
        percentile90: 72.4,
        target: 48
      },
      byCategory: [
        { category: 'infrastructure', avgResponseTime: 32.4 },
        { category: 'safety', avgResponseTime: 24.7 },
        { category: 'environment', avgResponseTime: 46.3 },
        { category: 'public_services', avgResponseTime: 42.8 }
      ],
      byRegion: [
        { region: 'Central District', avgResponseTime: 29.3 },
        { region: 'Western District', avgResponseTime: 41.6 },
        { region: 'Eastern District', avgResponseTime: 35.8 },
        { region: 'Southern District', avgResponseTime: 44.2 }
      ],
      trend: [
        { date: '2025-02-15', avgResponseTime: 43.2 },
        { date: '2025-02-22', avgResponseTime: 41.8 },
        { date: '2025-03-01', avgResponseTime: 40.5 },
        { date: '2025-03-08', avgResponseTime: 38.6 }
      ]
    };
  };

  const getUserEngagementData = () => {
    if (userEngagementMetrics) return userEngagementMetrics;
    
    // Fallback mock data
    return {
      overall: {
        activeUsers: 3842,
        newUsers: 146,
        reportingUsers: 974,
        avgReportsPerUser: 2.4
      },
      demographics: {
        ageGroups: [
          { group: '18-24', percentage: 12 },
          { group: '25-34', percentage: 28 },
          { group: '35-44', percentage: 23 },
          { group: '45-54', percentage: 18 },
          { group: '55+', percentage: 19 }
        ],
        topDistricts: [
          { district: 'Central District', users: 1247 },
          { district: 'Western District', users: 986 },
          { district: 'Eastern District', users: 831 },
          { district: 'Southern District', users: 778 }
        ]
      },
      retention: {
        monthlyRetention: 86,
        quarterlyRetention: 73,
        yearlyRetention: 58
      }
    };
  };

  const getComparativeData = () => {
    if (comparativeAnalysis) return comparativeAnalysis;
    
    // Fallback mock data
    return {
      currentPeriod: {
        total: 384,
        resolved: 287,
        resolutionRate: 74.7,
        avgResponseTime: 38.6
      },
      previousPeriod: {
        total: 347,
        resolved: 246,
        resolutionRate: 70.9,
        avgResponseTime: 42.3
      },
      changes: {
        totalChange: 10.7,
        resolvedChange: 16.7,
        resolutionRateChange: 3.8,
        responseTimeChange: -8.7
      },
      byCategory: [
        { 
          category: 'infrastructure', 
          current: 143, previous: 126, 
          change: 13.5
        },
        { 
          category: 'safety', 
          current: 85, previous: 78, 
          change: 9.0
        },
        { 
          category: 'environment', 
          current: 67, previous: 59, 
          change: 13.6
        },
        { 
          category: 'public_services', 
          current: 89, previous: 84, 
          change: 6.0
        }
      ]
    };
  };

  const getKeywordsData = () => {
    if (trendingKeywords) return trendingKeywords;
    
    // Fallback mock data
    return {
      top: [
        { keyword: 'pothole', count: 87, trend: 12.4 },
        { keyword: 'streetlight', count: 63, trend: 8.3 },
        { keyword: 'garbage', count: 58, trend: -4.2 },
        { keyword: 'park', count: 47, trend: 15.6 },
        { keyword: 'sidewalk', count: 42, trend: 3.8 },
        { keyword: 'noise', count: 38, trend: 7.2 },
        { keyword: 'water', count: 35, trend: 2.1 },
        { keyword: 'bus', count: 31, trend: 9.4 }
      ],
      emerging: [
        { keyword: 'flooding', count: 18, trend: 125.0 },
        { keyword: 'construction', count: 23, trend: 76.9 },
        { keyword: 'graffiti', count: 19, trend: 58.3 },
        { keyword: 'playground', count: 21, trend: 50.0 }
      ],
      byCategory: {
        infrastructure: ['pothole', 'streetlight', 'sidewalk', 'road'],
        safety: ['crime', 'police', 'light', 'camera'],
        environment: ['trash', 'tree', 'park', 'water'],
        public_services: ['garbage', 'bus', 'recycling', 'maintenance']
      }
    };
  };

  // Get actual data or fallback
  const resolutionData = getResolutionData();
  const categoryTrendsData = getCategoryTrendsData();
  const geographicData = getGeographicData();
  const responseTimeData = getResponseTimeData();
  const userEngagementData = getUserEngagementData();
  const comparativeData = getComparativeData();
  const keywordsData = getKeywordsData();

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
                <div className="text-2xl font-bold">{comparativeData.currentPeriod.total}</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>{comparativeData.changes.totalChange}% from previous period</span>
                </div>
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
                <div className="text-2xl font-bold">{resolutionData.overall.resolutionRate}%</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>{comparativeData.changes.resolutionRateChange}% from previous period</span>
                </div>
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
                <div className="text-2xl font-bold">{responseTimeData.overall.averageResponseTime}h</div>
                <div className="flex items-center text-xs text-green-500">
                  {responseTimeData.overall.averageResponseTime < responseTimeData.overall.target ? (
                    <>
                      <ArrowDown className="h-3 w-3 mr-1" />
                      <span>
                        {Math.abs(comparativeData.changes.responseTimeChange)}% faster than previous
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>
                        {Math.abs(comparativeData.changes.responseTimeChange)}% slower than previous
                      </span>
                    </>
                  )}
                </div>
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
                <div className="text-2xl font-bold">{userEngagementData.overall.activeUsers}</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>{userEngagementData.overall.newUsers} new this period</span>
                </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Resolution Metrics</h3>
                  <p className="text-sm text-muted-foreground mt-0">
                    Analysis of report resolution rates and efficiency
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{resolutionData.overall.resolved} Resolved</span>
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
                      <p className="text-2xl font-bold">{resolutionData.overall.total}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Resolved</p>
                      <p className="text-2xl font-bold">{resolutionData.overall.resolved}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Resolution Rate</p>
                      <p className="text-2xl font-bold">{resolutionData.overall.resolutionRate}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg. Resolution Time</p>
                      <p className="text-2xl font-bold">{resolutionData.overall.avgResolutionTime}h</p>
                    </div>
                  </div>
              
                  {/* Resolution by category */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Resolution Rate by Category</h4>
                    <div className="space-y-4">
                      {resolutionData.byCategory.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium capitalize">{item.category.replace(/_/g, ' ')}</p>
                            <p className="font-medium">{item.resolutionRate}%</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${item.resolutionRate}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>{item.resolved} resolved</span>
                            <span>{item.total} total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              
                  {/* Resolution trend over time */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Resolution Rate Trend</h4>
                    <div className="h-[200px] w-full">
                      <div className="flex h-[170px] items-end gap-2">
                        {resolutionData.trend.map((point, i) => (
                          <div key={i} className="flex-1 group relative">
                            <div 
                              className="bg-primary/90 rounded-sm hover:bg-primary w-full transition-all"
                              style={{ height: `${point.resolutionRate}%` }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                {point.resolutionRate}%
                              </div>
                            </div>
                            <div className="mt-1.5 text-[10px] text-muted-foreground text-center">
                              {format(new Date(point.date), 'MMM d')}
                            </div>
                          </div>
                        ))}
                      </div>
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
                <p className="text-sm text-muted-foreground mt-0">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {categoryTrendsData.distribution.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold mb-1">{item.count}</div>
                          <div className="text-sm text-gray-500 capitalize">{item.category.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-primary mt-1">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Category growth */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Category Growth (Monthly)</h4>
                    <div className="space-y-3">
                      {categoryTrendsData.growth.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="capitalize">{item.category.replace(/_/g, ' ')}</div>
                          </div>
                          <div className="flex items-center">
                            {item.monthlyGrowth > 0 ? (
                              <div className="flex items-center text-green-500">
                                <ArrowUp className="h-4 w-4 mr-1" />
                                <span>{item.monthlyGrowth}%</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <ArrowDown className="h-4 w-4 mr-1" />
                                <span>{Math.abs(item.monthlyGrowth)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Category trends visualization would go here */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Category Trends Over Time</h4>
                    <div className="h-60 border rounded-md flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Interactive category trend chart would appear here</p>
                    </div>
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
                <p className="text-sm text-muted-foreground mt-0">
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
                  {/* Region distribution */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Reports by Region</h4>
                    <div className="space-y-3">
                      {geographicData.regions.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium">{item.region}</p>
                            <p className="font-medium">{item.count} reports</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-end mt-1 text-xs text-gray-500">
                            <span>{item.percentage}% of total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hotspots */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Report Hotspots</h4>
                    <div className="border rounded-lg p-4">
                      <div className="h-80 mb-4 bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Interactive map with hotspots would appear here</p>
                      </div>
                      <div className="space-y-2">
                        {geographicData.hotspots.map((spot, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span>{spot.location}</span>
                            </div>
                            <span className="font-medium">{spot.count} reports</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                <p className="text-sm text-muted-foreground mt-0">
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
                      <p className="text-2xl font-bold">{responseTimeData.overall.averageResponseTime}h</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Median Response</p>
                      <p className="text-2xl font-bold">{responseTimeData.overall.medianResponseTime}h</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">90th Percentile</p>
                      <p className="text-2xl font-bold">{responseTimeData.overall.percentile90}h</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Target Time</p>
                      <p className="text-2xl font-bold">{responseTimeData.overall.target}h</p>
                    </div>
                  </div>
                  
                  {/* Response time by category */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Response Time by Category</h4>
                    <div className="space-y-3">
                      {responseTimeData.byCategory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="capitalize">{item.category.replace(/_/g, ' ')}</div>
                          <div className="flex items-center font-medium">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            {item.avgResponseTime}h
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Response time trend */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Response Time Trend</h4>
                    <div className="h-60 border rounded-md flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Response time trend chart would appear here</p>
                    </div>
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
                <p className="text-sm text-muted-foreground mt-0">
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
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-2xl font-bold">{userEngagementData.overall.activeUsers}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">New Users</p>
                      <p className="text-2xl font-bold">{userEngagementData.overall.newUsers}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Reporting Users</p>
                      <p className="text-2xl font-bold">{userEngagementData.overall.reportingUsers}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg Reports/User</p>
                      <p className="text-2xl font-bold">{userEngagementData.overall.avgReportsPerUser}</p>
                    </div>
                  </div>
                  
                  {/* User demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Age distribution */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Age Distribution</h4>
                      <div className="space-y-2">
                        {userEngagementData.demographics.ageGroups.map((group, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between mb-1">
                              <p>{group.group}</p>
                              <p>{group.percentage}%</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${group.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Top districts */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Districts by Users</h4>
                      <div className="space-y-3">
                        {userEngagementData.demographics.topDistricts.map((district, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>{district.district}</div>
                            <div className="font-medium">{district.users} users</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* User retention */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">User Retention</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{userEngagementData.retention.monthlyRetention}%</div>
                        <p className="text-sm text-gray-500">Monthly</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{userEngagementData.retention.quarterlyRetention}%</div>
                        <p className="text-sm text-gray-500">Quarterly</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{userEngagementData.retention.yearlyRetention}%</div>
                        <p className="text-sm text-gray-500">Yearly</p>
                      </div>
                    </div>
                  </div>
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
                <p className="text-sm text-muted-foreground mt-0">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-xs text-gray-500 mb-2">Total Reports</h5>
                      <div className="flex justify-between items-end">
                        <div className="font-bold text-lg">{comparativeData.currentPeriod.total}</div>
                        <div className={`text-xs flex items-center ${comparativeData.changes.totalChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {comparativeData.changes.totalChange > 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          <span>{Math.abs(comparativeData.changes.totalChange)}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">vs. {comparativeData.previousPeriod.total}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-xs text-gray-500 mb-2">Resolved</h5>
                      <div className="flex justify-between items-end">
                        <div className="font-bold text-lg">{comparativeData.currentPeriod.resolved}</div>
                        <div className={`text-xs flex items-center ${comparativeData.changes.resolvedChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {comparativeData.changes.resolvedChange > 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          <span>{Math.abs(comparativeData.changes.resolvedChange)}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">vs. {comparativeData.previousPeriod.resolved}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-xs text-gray-500 mb-2">Resolution Rate</h5>
                      <div className="flex justify-between items-end">
                        <div className="font-bold text-lg">{comparativeData.currentPeriod.resolutionRate}%</div>
                        <div className={`text-xs flex items-center ${comparativeData.changes.resolutionRateChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {comparativeData.changes.resolutionRateChange > 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          <span>{Math.abs(comparativeData.changes.resolutionRateChange)}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">vs. {comparativeData.previousPeriod.resolutionRate}%</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-xs text-gray-500 mb-2">Avg Response Time</h5>
                      <div className="flex justify-between items-end">
                        <div className="font-bold text-lg">{comparativeData.currentPeriod.avgResponseTime}h</div>
                        <div className={`text-xs flex items-center ${comparativeData.changes.responseTimeChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {comparativeData.changes.responseTimeChange < 0 ? (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          )}
                          <span>{Math.abs(comparativeData.changes.responseTimeChange)}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">vs. {comparativeData.previousPeriod.avgResponseTime}h</div>
                    </div>
                  </div>
                  
                  {/* Category comparison */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Category Comparison</h4>
                    <div className="space-y-3">
                      {comparativeData.byCategory.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="capitalize">{item.category.replace(/_/g, ' ')}</div>
                            <div className={`text-xs flex items-center ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {item.change > 0 ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              <span>{Math.abs(item.change)}%</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-gray-400 h-2.5 rounded-full" 
                                style={{ width: `${(item.previous / Math.max(item.current, item.previous)) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">{item.previous}</div>
                            <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(item.current / Math.max(item.current, item.previous)) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">{item.current}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                <p className="text-sm text-muted-foreground mt-0">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {keywordsData.top.slice(0, 8).map((keyword, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className={`text-xs flex items-center ${keyword.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {keyword.trend > 0 ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              <span>{Math.abs(keyword.trend)}%</span>
                            </div>
                          </div>
                          <div className="text-xl font-bold">{keyword.count}</div>
                          <div className="text-xs text-gray-500">mentions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Emerging keywords */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Emerging Keywords</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {keywordsData.emerging.map((keyword, index) => (
                        <div key={index} className="bg-green-50 border border-green-100 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className="text-xs text-green-600 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+{keyword.trend}%</span>
                            </div>
                          </div>
                          <div className="text-xl font-bold">{keyword.count}</div>
                          <div className="text-xs text-gray-500">mentions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Keywords by category */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Keywords by Category</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(keywordsData.byCategory).map(([category, keywords], index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium capitalize mb-2">{category.replace(/_/g, ' ')}</h5>
                          <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, i) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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