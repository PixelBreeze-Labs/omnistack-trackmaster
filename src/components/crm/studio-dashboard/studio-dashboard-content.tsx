"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  CalendarDays,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Code,
  ArrowRight,
  Briefcase,
  Plus,
  Server,
  FileCode,
  Network,
  Check,
  AlertTriangle,
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import { useClientApps } from "@/hooks/useClientApps";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';

// App Type colors
const APP_TYPES_COLORS = {
  react: '#2A8E9E',
  wordpress: '#6366F1',
  vue: '#10B981',
  next: '#8B5CF6',
  other: '#EC4899'
};

export function StudioDashboardContent() {
  const { dashboardData, isDashboardLoading, fetchDashboardData } = useClientApps();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format data for the app types pie chart
  const appTypesPieData = dashboardData.metrics.appsByType.map(item => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1), // Capitalize first letter
    value: item.count
  }));

  // Handle refresh click
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Extract key metrics
  const keyMetrics = [
    {
      title: "Total Applications",
      value: dashboardData.metrics.totalApps.toString(),
      change: `+${dashboardData.metrics.recentApps}`,
      trend: "up",
      icon: Monitor,
      subtitle: "Last 30 days"
    },
    {
      title: "Active Applications",
      value: dashboardData.metrics.activeApps.toString(),
      change: `${dashboardData.metrics.activeApps}/${dashboardData.metrics.totalApps}`,
      trend: "up",
      icon: Check,
      subtitle: "Active rate"
    },
    {
      title: "Inactive Applications",
      value: dashboardData.metrics.inactiveApps.toString(),
      change: `${dashboardData.metrics.inactiveApps}/${dashboardData.metrics.totalApps}`,
      trend: "down",
      icon: AlertTriangle,
      subtitle: "Inactive rate"
    },
    {
      title: "Recent Applications",
      value: dashboardData.metrics.recentApps.toString(),
      change: "Last 30 days",
      trend: "up",
      icon: Code,
      subtitle: "New applications"
    }
  ];

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Overview of your client applications, clients, and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            style={{ backgroundColor: "#2A8E9E" }}
            onClick={() => router.push('/client-apps/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isDashboardLoading && (
        <div className="w-full flex justify-center my-12">
          <RefreshCcw className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      )}

      {!isDashboardLoading && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {keyMetrics.map((metric) => (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{metric.value}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center text-xs ${
                            metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metric.trend === 'up' ? 
                              <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            }
                            {metric.change}
                          </div>
                          <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* App Types & Recent Apps */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Application Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appTypesPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {appTypesPieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={APP_TYPES_COLORS[entry.name.toLowerCase()] || '#ccc'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-2">
                    {appTypesPieData.map((type) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: APP_TYPES_COLORS[type.name.toLowerCase()] || '#ccc' }}
                          ></div>
                          <span className="text-sm">{type.name}</span>
                        </div>
                        <span className="text-sm font-medium">{type.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Apps */}
            <Card className="md:col-span-3">
              <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <CardTitle className="text-xl font-semibold">Recent Applications</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="self-start"
                  onClick={() => router.push('/client-apps')}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentApps.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No recent applications available
                    </div>
                  ) : (
                    dashboardData.recentApps.map((app) => (
                      <Card key={app._id}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div 
                                className="p-2 rounded-lg" 
                                style={{ backgroundColor: `${APP_TYPES_COLORS[app.type] || '#ccc'}20` }}
                              >
                                <Monitor 
                                  className="h-4 w-4" 
                                  style={{ color: APP_TYPES_COLORS[app.type] || '#ccc' }} 
                                />
                              </div>
                              <div>
                                <div className="font-medium">{app.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {Array.isArray(app.domain) && app.domain.length > 0 
                                    ? app.domain[0] 
                                    : 'No domain'} • {app.type.charAt(0).toUpperCase() + app.type.slice(1)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">
                                {formatDate(app.configuredAt)}
                              </div>
                              <Badge 
                                variant={app.status === 'active' ? 'default' : 'destructive'}
                                className={app.status === 'active' ? 'bg-green-500' : ''}
                              >
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clients with Most Apps */}
          <Card>
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
              <CardTitle className="text-xl font-semibold">Clients with Most Applications</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="self-start"
                onClick={() => router.push('/clients')}
              >
                View All Clients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {dashboardData.clientsWithMostApps.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No client data available
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                    <div>Client</div>
                    <div>Code</div>
                    <div>Application Count</div>
                    <div>Actions</div>
                  </div>
                  {dashboardData.clientsWithMostApps.map((client) => (
                    <div key={client._id} className="grid grid-cols-4 border-t p-3 text-sm">
                      <div className="font-medium">{client.name}</div>
                      <div>{client.code}</div>
                      <div>{client.appCount}</div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/clients/${client._id}`)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Applications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dashboardData.metrics.activeApps} Active / {dashboardData.metrics.totalApps} Total
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full"
                  onClick={() => router.push('/crm/platform/os-client-apps')}
                >
                  Manage Applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Clients</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dashboardData.clientsWithMostApps.length} clients with applications
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full"
                  onClick={() => router.push('/crm/platform/os-clients')}
                >
                  Manage Clients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileCode className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create New</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add a new client or application
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/clients/new')}
                  >
                    <Briefcase className="h-4 w-4 mr-1" />
                    New Client
                  </Button>
                  <Button 
                    onClick={() => router.push('/client-apps/new')}
                  >
                    <Monitor className="h-4 w-4 mr-1" />
                    New App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add bottom spacing */}
          <div className="h-8"></div>
        </>
      )}
    </div>
  );
}

export default StudioDashboardContent;