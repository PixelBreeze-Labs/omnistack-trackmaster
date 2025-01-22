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
  ResponsiveContainer
} from 'recharts';
import {
  CircleDollarSign,
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Calendar,
  Store,
  Percent,
  ArrowRight,
  Clock,
  Gift,
  UserPlus
} from "lucide-react";

// Sample data for the sales chart
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240, customers: 150 },
  { month: 'Feb', sales: 3000, orders: 198, customers: 120 },
  { month: 'Mar', sales: 5000, orders: 280, customers: 180 },
  { month: 'Apr', sales: 2780, orders: 190, customers: 140 },
  { month: 'May', sales: 6890, orders: 390, customers: 220 },
  { month: 'Jun', sales: 4390, orders: 280, customers: 190 },
];

const KEY_METRICS = [
  {
    title: "Total Revenue",
    value: "€24,567",
    change: "+12.5%",
    trend: "up",
    icon: CircleDollarSign,
    subtitle: "Last 30 days"
  },
  {
    title: "Total Orders",
    value: "1,345",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    subtitle: "Last 30 days"
  },
  {
    title: "Active Customers",
    value: "892",
    change: "+5.3%",
    trend: "up",
    icon: Users,
    subtitle: "Last 30 days"
  },
  {
    title: "Avg. Order Value",
    value: "€142",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
    subtitle: "Last 30 days"
  }
];

const RECENT_ORDERS = [
  {
    id: "ORD-2024-001",
    customer: "John Doe",
    items: 3,
    total: "€245.99",
    status: "Processing"
  },
  {
    id: "ORD-2024-002",
    customer: "Sarah Smith",
    items: 1,
    total: "€89.99",
    status: "Shipped"
  },
  {
    id: "ORD-2024-003",
    customer: "Mike Johnson",
    items: 5,
    total: "€567.50",
    status: "Delivered"
  }
];

const SALES_CHANNELS = [
  {
    name: "Online Store",
    value: 65,
    sales: "€12,456",
    icon: Store,
    color: "bg-blue-500"
  },
  {
    name: "Mobile App",
    value: 25,
    sales: "€5,892",
    icon: Package,
    color: "bg-green-500"
  },
  {
    name: "Marketplaces",
    value: 10,
    sales: "€2,345",
    icon: ShoppingBag,
    color: "bg-purple-500"
  }
];

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Overview of your store's performance and key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button style={{ backgroundColor: "#5FC4D0" }}>
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
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

    {/* Sales Chart */}
<Card>
  <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
    <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
    <div className="flex items-center space-x-2">
      <Badge variant="secondary">Sales</Badge>
      <Badge variant="outline">Orders</Badge>
      <Badge variant="outline">Customers</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#5FC4D0" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
      {/* Sales Channels & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SALES_CHANNELS.map((channel) => (
                <div key={channel.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <channel.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{channel.sales}</span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={channel.value} className={channel.color} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{channel.value}% of total sales</span>
                      <span>{channel.sales}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      
        <Card>
  <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
    <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
    <Button variant="ghost" size="sm" className="self-start">
      View All
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {RECENT_ORDERS.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{order.customer}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.id} • {order.items} items
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{order.total}</div>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </CardContent>
</Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Active Promotions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  3 campaigns running
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Loyalty Program</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  892 active members
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Last update 5m ago
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

export default DashboardContent;