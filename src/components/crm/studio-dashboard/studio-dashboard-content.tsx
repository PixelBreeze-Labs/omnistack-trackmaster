"use client"

import React from 'react';
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
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  CircleDollarSign,
  Users,
  CalendarDays,
  Monitor,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Code,
  ArrowRight,
  MessageSquare,
  Briefcase,
  Globe,
  Check,
  Plus,
  Clock,
  Terminal,
  Server,
  FileCode,
  Network
} from "lucide-react";

// Sample data for clients overview
const clientsData = [
  { month: 'Jan', projects: 8, revenue: 12000, deployments: 5 },
  { month: 'Feb', projects: 10, revenue: 15000, deployments: 7 },
  { month: 'Mar', projects: 12, revenue: 18000, deployments: 9 },
  { month: 'Apr', projects: 14, revenue: 21000, deployments: 11 },
  { month: 'May', projects: 12, revenue: 19000, deployments: 8 },
  { month: 'Jun', projects: 15, revenue: 25000, deployments: 14 },
];

const KEY_METRICS = [
  {
    title: "Total Clients",
    value: "10",
    change: "+2",
    trend: "up",
    icon: Briefcase,
    subtitle: "Last 30 days"
  },
  {
    title: "Active Projects",
    value: "15",
    change: "+3",
    trend: "up",
    icon: Code,
    subtitle: "Last 30 days"
  },
  {
    title: "Deployments",
    value: "23",
    change: "+7",
    trend: "up",
    icon: Globe,
    subtitle: "Last 30 days"
  },
  {
    title: "Monthly Revenue",
    value: "€25,000",
    change: "+12.4%",
    trend: "up",
    icon: CircleDollarSign,
    subtitle: "Last 30 days"
  }
];

// Client Application Types Distribution
const APP_TYPES_DATA = [
  { name: 'React', value: 5 },
  { name: 'WordPress', value: 2 },
  { name: 'Other', value: 3 },
];

const APP_TYPES_COLORS = ['#2A8E9E', '#6366F1', '#EC4899'];

// Recent clients
const RECENT_CLIENTS = [
  {
    id: "67feacd0d5060f88345d005a",
    name: "Studio OmniStack",
    code: "STUDIOOS",
    appType: "React",
    domain: "studio.omnistackhub.xyz",
    status: "Active",
    created: "Apr 15, 2025"
  },
  {
    id: "67feac2cd5060f88345d0056",
    name: "GazetaReforma",
    code: "GAZETAREFORMA",
    appType: "WordPress",
    domain: "gazetareforma.com",
    status: "Active",
    created: "Apr 15, 2025"
  },
  {
    id: "67d6c95a72adfbad69d0a423",
    name: "VisionTrack",
    code: "VISIONTRACK",
    appType: "Other",
    domain: "visiontrack.xyz",
    status: "Active",
    created: "Mar 16, 2025"
  },
  {
    id: "67d1490fda40caa565077c90",
    name: "Qytetaret",
    code: "QYTETARET",
    appType: "Other",
    domain: "qytetaret.al",
    status: "Active",
    created: "Mar 12, 2025"
  }
];

// Recent deployments
const RECENT_DEPLOYMENTS = [
  {
    id: "DP-2025-001",
    client: "Studio OmniStack",
    environment: "Production",
    timestamp: "Apr 15, 2025, 19:00:32",
    status: "Successful"
  },
  {
    id: "DP-2025-002",
    client: "GazetaReforma",
    environment: "Production",
    timestamp: "Apr 15, 2025, 18:57:48",
    status: "Successful"
  },
  {
    id: "DP-2025-003",
    client: "VisionTrack",
    environment: "Staging",
    timestamp: "Apr 14, 2025, 15:30:12",
    status: "In Progress"
  }
];

// Project status
const PROJECT_STATUS = [
  {
    name: "Active Development",
    value: 6,
    percent: 60,
    icon: Code,
    color: "bg-blue-500"
  },
  {
    name: "Maintenance Mode",
    value: 3,
    percent: 30,
    icon: Terminal,
    color: "bg-green-500"
  },
  {
    name: "Planning Phase",
    value: 1,
    percent: 10,
    icon: Clock,
    color: "bg-amber-500"
  }
];

export function StudioDashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Studio Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Overview of your clients, applications, deployments, and project metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarDays className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button style={{ backgroundColor: "#2A8E9E" }}>
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KEY_METRICS.map((metric) => (
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

      {/* App Types & Projects Chart */}
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
                    data={APP_TYPES_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {APP_TYPES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={APP_TYPES_COLORS[index % APP_TYPES_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {APP_TYPES_DATA.map((type, index) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: APP_TYPES_COLORS[index] }}
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

        {/* Projects Chart */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <CardTitle className="text-xl font-semibold">Projects Overview</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Projects</Badge>
              <Badge variant="outline">Revenue</Badge>
              <Badge variant="outline">Deployments</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clientsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="#2A8E9E" 
                    strokeWidth={2} 
                    name="Active Projects"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status & Recent Clients */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PROJECT_STATUS.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <project.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{project.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{project.value} projects</span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={project.percent} className={project.color} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project.percent}% of total projects</span>
                      <span>{project.value} projects</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <CardTitle className="text-xl font-semibold">Recent Clients</CardTitle>
            <Button variant="ghost" size="sm" className="self-start">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_CLIENTS.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.domain} • {client.appType}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{client.code}</div>
                        <Badge variant="secondary">{client.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deployments */}
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl font-semibold">Recent Deployments</CardTitle>
          <Button variant="ghost" size="sm" className="self-start">
            View All Deployments
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
              <div>ID</div>
              <div>Client</div>
              <div>Environment</div>
              <div>Timestamp</div>
              <div>Status</div>
            </div>
            {RECENT_DEPLOYMENTS.map((deployment) => (
              <div key={deployment.id} className="grid grid-cols-5 border-t p-3 text-sm">
                <div className="font-medium">{deployment.id}</div>
                <div>{deployment.client}</div>
                <div>{deployment.environment}</div>
                <div>{deployment.timestamp}</div>
                <div>
                  <Badge
                    className={deployment.status === "Successful" ? "bg-green-500" : 
                              deployment.status === "In Progress" ? "bg-blue-500" : "bg-red-500"}
                  >
                    {deployment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
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
                <h3 className="font-semibold">Infrastructure Status</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All systems operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Code Repositories</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  15 active repositories
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">API Endpoints</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  28 active endpoints
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}

export default StudioDashboardContent;