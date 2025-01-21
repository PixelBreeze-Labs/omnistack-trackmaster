"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  ShoppingCart,
  UserPlus,
  RefreshCw,
  Wallet,
  Store,
  Map,
  Filter
} from "lucide-react";

const SALES_DATA = [
  { month: 'Jan', revenue: 4000, customers: 240, orders: 350 },
  { month: 'Feb', revenue: 3000, customers: 198, orders: 280 },
  { month: 'Mar', revenue: 5000, customers: 280, orders: 400 },
  { month: 'Apr', revenue: 2780, customers: 190, orders: 300 },
  { month: 'May', revenue: 6890, customers: 390, orders: 600 },
  { month: 'Jun', revenue: 4390, customers: 280, orders: 450 },
];

const CUSTOMER_METRICS = [
  {
    title: "Customer Growth",
    value: "+124",
    change: "+12.5%",
    trend: "up",
    period: "vs last month",
    icon: UserPlus
  },
  {
    title: "Retention Rate",
    value: "68%",
    change: "+5.2%",
    trend: "up",
    period: "vs last month",
    icon: RefreshCw
  },
  {
    title: "Avg. Order Value",
    value: "€142",
    change: "+8.1%",
    trend: "up",
    period: "vs last month",
    icon: ShoppingCart
  },
  {
    title: "Customer LTV",
    value: "€850",
    change: "-2.3%",
    trend: "down",
    period: "vs last month",
    icon: Wallet
  }
];

const COHORT_DATA = [
  { month: "Jan '24", month0: "100%", month1: "68%", month2: "45%", month3: "38%" },
  { month: "Dec '23", month0: "100%", month1: "72%", month2: "48%", month3: "41%" },
  { month: "Nov '23", month0: "100%", month1: "65%", month2: "42%", month3: "35%" },
  { month: "Oct '23", month0: "100%", month1: "70%", month2: "46%", month3: "39%" }
];

const CUSTOMER_SEGMENTS = [
  { name: "New", value: 25, color: "#5FC4D0" },
  { name: "Regular", value: 45, color: "#22C55E" },
  { name: "Loyal", value: 20, color: "#6366F1" },
  { name: "VIP", value: 10, color: "#EC4899" }
];

const GEOGRAPHIC_DATA = [
  { city: "New York", customers: 450, revenue: "€45,670" },
  { city: "Los Angeles", customers: 320, revenue: "€32,450" },
  { city: "Chicago", customers: 280, revenue: "€28,900" },
  { city: "Houston", customers: 250, revenue: "€25,600" }
];

export function AnalyticsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Detailed insights into your business performance and customer behavior
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button style={{ backgroundColor: "#5FC4D0" }}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CUSTOMER_METRICS.map((metric) => (
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
                      <p className="text-xs text-muted-foreground">{metric.period}</p>
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

      {/* Revenue & Customer Growth */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue & Customer Growth</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Revenue</Badge>
              <Badge variant="outline">Customers</Badge>
              <Badge variant="outline">Orders</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#5FC4D0" 
                  strokeWidth={2} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#22C55E" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
  {/* Customer Segments */}
  <Card>
    <CardHeader>
      <CardTitle>Customer Segments</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-4">
        {/* Chart Container */}
        <div className="w-full aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CUSTOMER_SEGMENTS}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {CUSTOMER_SEGMENTS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {CUSTOMER_SEGMENTS.map((segment) => (
            <div key={segment.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-muted-foreground">{segment.name}</span>
              <span className="text-sm font-medium ml-auto">{segment.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Cohort Analysis */}
  <Card>
    <CardHeader>
      <CardTitle>Customer Retention Cohorts</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2">Cohort</th>
              <th className="text-center pb-2">Month 0</th>
              <th className="text-center pb-2">Month 1</th>
              <th className="text-center pb-2">Month 2</th>
              <th className="text-center pb-2">Month 3</th>
            </tr>
          </thead>
          <tbody>
            {COHORT_DATA.map((row) => (
              <tr key={row.month} className="border-b last:border-0">
                <td className="py-3 font-medium">{row.month}</td>
                <td className="text-center py-3">{row.month0}</td>
                <td className="text-center py-3">{row.month1}</td>
                <td className="text-center py-3">{row.month2}</td>
                <td className="text-center py-3">{row.month3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Geographic Distribution</CardTitle>
            <Button variant="outline" size="sm">
              <Map className="h-4 w-4 mr-2" />
              View Map
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {GEOGRAPHIC_DATA.map((location) => (
              <div key={location.city}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{location.city}</span>
                  </div>
                  <div className="space-x-4">
                    <span className="text-sm text-muted-foreground">
                      {location.customers} customers
                    </span>
                    <span className="font-medium">{location.revenue}</span>
                  </div>
                </div>
                <Progress value={location.customers / 5} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsContent;