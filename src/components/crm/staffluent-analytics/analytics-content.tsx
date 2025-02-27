"use client";

import { useEffect, useState } from "react";
import {
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  ChevronDown,
  DollarSign,
  BarChart4
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, PieChart } from "@/components/ui/charts";
import { useAnalytics } from "@/hooks/useStaffluentAnalytics";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function AnalyticsContent() {
  const { 
    isLoading, 
    businessAnalytics, 
    userAnalytics, 
    fetchBusinessAnalytics, 
    fetchUserAnalytics, 
    fetchAllAnalytics 
  } = useAnalytics();
  
  const [activeTab, setActiveTab] = useState("businesses");
  const [period, setPeriod] = useState("month");
  const [isBusinessStatsOpen, setIsBusinessStatsOpen] = useState(true);
  const [isUserStatsOpen, setIsUserStatsOpen] = useState(true);

  useEffect(() => {
    fetchAllAnalytics(period);
  }, [fetchAllAnalytics, period]);

  // Function to handle refresh
  const handleRefresh = () => {
    fetchAllAnalytics(period);
  };

  // Function to handle period change
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  // Helper to format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  // Helper to render trend indicator
  const renderTrend = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>{value}%</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>{Math.abs(value)}%</span>
        </div>
      );
    }
    return <span className="text-gray-500">0%</span>;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Detailed analytics and insights for your platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Period</SelectLabel>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="businesses" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="businesses">Business Analytics</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
        </TabsList>
        
        {/* Business Analytics Tab */}
        <TabsContent value="businesses" className="space-y-6">
          {/* Time Period Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Business Analytics</CardTitle>
              {/* <CardDescription> */}
                {period === 'week' ? 'Last 7 days' : 
                 period === 'month' ? 'Last 30 days' : 'Last 12 months'}
                {businessAnalytics?.timeframe ? ` (${new Date(businessAnalytics.timeframe.start).toLocaleDateString()} - ${new Date(businessAnalytics.timeframe.end).toLocaleDateString()})` : ''}
              {/* </CardDescription> */}
            </CardHeader>
          </Card>

          {/* Business Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* New Businesses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Businesses
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                      {businessAnalytics?.metrics.newBusinesses.current || 0}
                    </div>
                    {renderTrend(businessAnalytics?.metrics.newBusinesses.growth || 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Compared to {businessAnalytics?.metrics.newBusinesses.previous || 0} in previous period
                </p>
              </CardContent>
            </Card>

            {/* Active Businesses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Businesses
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                      {businessAnalytics?.metrics.activeBusinesses.current || 0}
                    </div>
                    {renderTrend(businessAnalytics?.metrics.activeBusinesses.growth || 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Compared to {businessAnalytics?.metrics.activeBusinesses.previous || 0} in previous period
                </p>
              </CardContent>
            </Card>

            {/* MRR Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue (MRR)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    {businessAnalytics?.metrics.mrr 
                      ? formatCurrency(businessAnalytics.metrics.mrr.value, businessAnalytics.metrics.mrr.currency)
                      : '$0.00'}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Total monthly recurring revenue
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Business Charts Section */}
          <Collapsible 
            open={isBusinessStatsOpen} 
            onOpenChange={setIsBusinessStatsOpen}
            className="space-y-4"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Business Growth & Distribution</h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isBusinessStatsOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Business Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Growth</CardTitle>
                    {/* <CardDescription>Total businesses over time</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : businessAnalytics?.businessGrowth ? (
                      <LineChart
                        data={{
                          labels: businessAnalytics.businessGrowth.labels,
                          datasets: [
                            {
                              label: 'Total Businesses',
                              data: businessAnalytics.businessGrowth.data.map(item => item.totalBusinesses),
                              fill: false,
                              borderColor: 'rgb(53, 162, 235)',
                              tension: 0.1
                            },
                          ],
                        }}
                        height={300}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Subscription Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Status</CardTitle>
                    {/* <CardDescription>Distribution of subscription statuses</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : businessAnalytics?.statusDistribution ? (
                      <div className="h-[300px]">
                        <PieChart
                          data={{
                            labels: Object.keys(businessAnalytics.statusDistribution).map(status => 
                              status.charAt(0).toUpperCase() + status.slice(1)
                            ),
                            datasets: [
                              {
                                data: Object.values(businessAnalytics.statusDistribution),
                                backgroundColor: [
                                  '#4CAF50', // active - green
                                  '#2196F3', // trialing - blue
                                  '#FFC107', // past_due - amber
                                  '#F44336', // canceled - red
                                  '#9E9E9E'  // incomplete - grey
                                ],
                              },
                            ],
                          }}
                          height={300}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>

        {/* User Analytics Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Time Period Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Analytics</CardTitle>
              {/* <CardDescription> */}
                {/* {period === 'week' ? 'Last 7 days' : 
                 period === 'month' ? 'Last 30 days' : 'Last 12 months'}
                {userAnalytics?.timeframe ? ` (${new Date(userAnalytics.timeframe.start).toLocaleDateString()} - ${new Date(userAnalytics.timeframe.end).toLocaleDateString()})` : ''}
              </CardDescription> */}
            </CardHeader>
          </Card>

          {/* User Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* New Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                      {userAnalytics?.metrics.newUsers.current || 0}
                    </div>
                    {renderTrend(userAnalytics?.metrics.newUsers.growth || 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Compared to {userAnalytics?.metrics.newUsers.previous || 0} in previous period
                </p>
              </CardContent>
            </Card>

            {/* Staff Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Staff Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userAnalytics?.metrics.staffUsers.total || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Total staff users on the platform
                </p>
              </CardContent>
            </Card>

            {/* Users with Businesses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Users with Businesses
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userAnalytics?.metrics.usersWithBusinesses.withBusinesses || 0}
                  </div>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">
                    {userAnalytics?.metrics.usersWithBusinesses.percentage || 0}% of total users
                  </p>
                  <p className="text-xs font-medium">
                    {userAnalytics?.metrics.usersWithBusinesses.withBusinesses || 0} / {userAnalytics?.metrics.usersWithBusinesses.total || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Charts Section */}
          <Collapsible 
            open={isUserStatsOpen} 
            onOpenChange={setIsUserStatsOpen}
            className="space-y-4"
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5" />
                  <h3 className="text-lg font-medium">User Growth & Distribution</h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isUserStatsOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* User Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    {/* <CardDescription>Total users over time</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : userAnalytics?.userGrowth ? (
                      <LineChart
                        data={{
                          labels: userAnalytics.userGrowth.labels,
                          datasets: [
                            {
                              label: 'Total Users',
                              data: userAnalytics.userGrowth.data.map(item => item.totalUsers),
                              fill: false,
                              borderColor: 'rgb(34, 197, 94)',
                              tension: 0.1
                            },
                          ],
                        }}
                        height={300}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Registration Source Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Sources</CardTitle>
                    {/* <CardDescription>Distribution of user registration sources</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : userAnalytics?.registrationSources ? (
                      <div className="h-[300px]">
                        <PieChart
                          data={{
                            labels: Object.keys(userAnalytics.registrationSources).map(source => 
                              source.charAt(0).toUpperCase() + source.slice(1)
                            ),
                            datasets: [
                              {
                                data: Object.values(userAnalytics.registrationSources),
                                backgroundColor: [
                                  '#8884d8', // purple
                                  '#82ca9d', // green
                                  '#ffc658', // yellow
                                  '#ff8042', // orange
                                  '#0088FE', // blue
                                  '#00C49F', // teal
                                  '#FFBB28', // amber
                                ],
                              },
                            ],
                          }}
                          height={300}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>
      </Tabs>
       {/* Add bottom spacing */}
       <div className="h-8"></div>
    </div>
  );
}