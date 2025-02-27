"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Clock,
  AlertCircle,
  RefreshCcw,
  Mail,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
//   CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/hooks/useStaffluentDashboard";
import { format } from "date-fns";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";

export default function DashboardContent() {
  const router = useRouter();
  const { isLoading, dashboardData, fetchDashboardSummary } = useDashboard();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  // Function to handle refresh
  const handleRefresh = () => {
    fetchDashboardSummary();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
            Overview of your business and platform metrics
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Businesses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Businesses
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                      {dashboardData?.summary.businesses.total || 0}
                    </div>
                    {renderTrend(dashboardData?.summary.businesses.growth || 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {dashboardData?.summary.businesses.new || 0} new in the last 30 days
                </p>
              </CardContent>
            </Card>

            {/* Total Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                      {dashboardData?.summary.users.total || 0}
                    </div>
                    {renderTrend(dashboardData?.summary.users.growth || 0)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {dashboardData?.summary.users.new || 0} new in the last 30 days
                </p>
              </CardContent>
            </Card>

            {/* Active Subscriptions Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    {dashboardData?.summary.subscriptions.active || 0}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">Active customers</p>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => router.push("/crm/platform/subscriptions")}>
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* MRR Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    {dashboardData?.summary.subscriptions.mrr 
                      ? formatCurrency(dashboardData.summary.subscriptions.mrr.value, dashboardData.summary.subscriptions.mrr.currency)
                      : '$0.00'}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {dashboardData?.summary.subscriptions.trial || 0} trials
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {dashboardData?.summary.subscriptions.pastDue || 0} past due
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Business Growth Chart */}
            <Card>
              <CardHeader>
              <div>
              <h2 className="text-lg font-medium">Business Growth</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Monthly new businesses over the last 6 months
            </p>
            </div>
                
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : dashboardData?.charts.businessGrowth ? (
                  <BarChart
                    data={{
                      labels: dashboardData.charts.businessGrowth.labels,
                      datasets: [
                        {
                          label: 'New Businesses',
                          data: dashboardData.charts.businessGrowth.data,
                          backgroundColor: '#4f46e5',
                        },
                      ],
                    }}
                    height={200}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
              <div>
              <h2 className="text-lg font-medium">User Growth</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Monthly new users over the last 6 months
            </p>
            </div>
               
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : dashboardData?.charts.userGrowth ? (
                  <BarChart
                    data={{
                      labels: dashboardData.charts.userGrowth.labels,
                      datasets: [
                        {
                          label: 'New Users',
                          data: dashboardData.charts.userGrowth.data,
                          backgroundColor: '#22c55e',
                        },
                      ],
                    }}
                    height={200}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subscription Status Chart and Recent Activities */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Subscription Status Chart */}
            <Card>
              <CardHeader>
              <div>
              <h2 className="text-lg font-medium">Subscription Status</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Distribution of subscription statuses
            </p>
            </div>
                
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : dashboardData?.charts.subscriptionDistribution ? (
                  <div className="h-[200px]">
                    <PieChart
                      data={{
                        labels: dashboardData.charts.subscriptionDistribution.labels,
                        datasets: [
                          {
                            data: dashboardData.charts.subscriptionDistribution.data,
                            backgroundColor: dashboardData.charts.subscriptionDistribution.backgroundColor,
                          },
                        ],
                      }}
                      height={200}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
              <div>
              <h2 className="text-lg font-medium">Recent Activity</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Latest businesses and users
            </p>
            </div>
               
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="businesses" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="businesses">Businesses</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                  </TabsList>
                  <TabsContent value="businesses" className="mt-2">
                    <div className="space-y-2">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2 p-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                        ))
                      ) : dashboardData?.recentData.businesses && dashboardData.recentData.businesses.length > 0 ? (
                        dashboardData.recentData.businesses.map((business, index) => (
                          <div 
                            key={business._id || index} 
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                            onClick={() => router.push(`/crm/platform/businesses/${business._id}`)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{business.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(business.createdAt), 'MMM d, yyyy')}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No recent businesses
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="users" className="mt-2">
                    <div className="space-y-2">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2 p-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                        ))
                      ) : dashboardData?.recentData.users && dashboardData.recentData.users.length > 0 ? (
                        dashboardData.recentData.users.map((user, index) => (
                          <div 
                            key={user._id || index} 
                            className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                            onClick={() => router.push(`/crm/platform/users/${user._id}`)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.name.charAt(0)}{user.surname?.charAt(0) || ''}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{user.name} {user.surname}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No recent users
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Businesses Tab */}
        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader>
                <div>
            <h2 className="text-lg font-medium">Business Overview</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Detailed view of your businesses
            </p>
            </div>
             
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-8">
                  {/* Business Status Distribution */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Subscription Status</h3>
                    {dashboardData?.charts.subscriptionDistribution ? (
                      <div className="h-[300px]">
                        <PieChart
                          data={{
                            labels: dashboardData.charts.subscriptionDistribution.labels,
                            datasets: [
                              {
                                data: dashboardData.charts.subscriptionDistribution.data,
                                backgroundColor: dashboardData.charts.subscriptionDistribution.backgroundColor,
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
                  </div>
                  
                  {/* Business Growth Trend */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Business Growth Trend</h3>
                    {dashboardData?.charts.businessGrowth ? (
                      <LineChart
                        data={{
                          labels: dashboardData.charts.businessGrowth.labels,
                          datasets: [
                            {
                              label: 'Total Businesses',
                              data: dashboardData.charts.businessGrowth.data,
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
                  </div>
                  
                  {/* Recent Businesses Table */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Businesses</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Business Name</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dashboardData?.recentData.businesses && dashboardData.recentData.businesses.length > 0 ? (
                            dashboardData.recentData.businesses.map((business, index) => (
                              <TableRow 
                                key={business._id || index}
                                className="cursor-pointer"
                                onClick={() => router.push(`/crm/platform/businesses/${business._id}`)}
                              >
                                <TableCell className="font-medium">{business.name}</TableCell>
                                <TableCell>
                                  {business.adminUserId && typeof business.adminUserId !== 'string' ? 
                                    `${business.adminUserId.name} ${business.adminUserId.surname}` : 
                                    'N/A'
                                  }
                                </TableCell>
                                <TableCell>
                                  {business.type?.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      business.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                                      business.subscriptionStatus === 'trialing' ? 'bg-blue-100 text-blue-800' :
                                      business.subscriptionStatus === 'past_due' ? 'bg-amber-100 text-amber-800' :
                                      business.subscriptionStatus === 'canceled' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }
                                  >
                                    {business.subscriptionStatus?.charAt(0).toUpperCase() + business.subscriptionStatus?.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {format(new Date(business.createdAt), 'MMM d, yyyy')}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                No businesses available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline"
                        onClick={() => router.push('/crm/platform/businesses')}
                      >
                        View All Businesses
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
            <div>
            <h2 className="text-lg font-medium">User Overview</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Detailed view of your users
            </p>
            </div>
             
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-8">
                  {/* User Growth Trend */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">User Growth Trend</h3>
                    {dashboardData?.charts.userGrowth ? (
                      <LineChart
                        data={{
                          labels: dashboardData.charts.userGrowth.labels,
                          datasets: [
                            {
                              label: 'Total Users',
                              data: dashboardData.charts.userGrowth.data,
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
                  </div>
                  
                  {/* Recent Users Table */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Users</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Registration Source</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dashboardData?.recentData.users && dashboardData.recentData.users.length > 0 ? (
                            dashboardData.recentData.users.map((user, index) => (
                              <TableRow 
                                key={user._id || index}
                                className="cursor-pointer"
                                onClick={() => router.push(`/crm/platform/users/${user._id}`)}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{user.name.charAt(0)}{user.surname?.charAt(0) || ''}</AvatarFallback>
                                    </Avatar>
                                    <div className="font-medium">{user.name} {user.surname}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {user.registrationSource?.charAt(0).toUpperCase() + user.registrationSource?.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                No users available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-end">
                    <Button 
                        variant="outline"
                        onClick={() => router.push('/crm/platform/users')}
                      >
                        View All Users
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       
      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}