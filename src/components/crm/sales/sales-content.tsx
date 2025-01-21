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
  ResponsiveContainer
} from 'recharts';
import {
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  ShoppingBag,
  Package,
  Store,
  TrendingUp,
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  BellRing,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import InputSelect from "@/components/Common/InputSelect";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

const SALES_METRICS = [
  {
    title: "Total Sales",
    value: "€45,231",
    change: "+12.5%",
    trend: "up",
    period: "vs last month",
    icon: CircleDollarSign
  },
  {
    title: "Orders",
    value: "1,245",
    change: "+8.2%",
    trend: "up",
    period: "vs last month",
    icon: ShoppingBag
  },
  {
    title: "Average Order",
    value: "€142",
    change: "+5.3%",
    trend: "up",
    period: "vs last month",
    icon: TrendingUp
  },
  {
    title: "Conversion",
    value: "3.2%",
    change: "-0.4%",
    trend: "down",
    period: "vs last month",
    icon: Percent
  }
];

const SALES_DATA = [
  { date: '2024-01-15', sales: 4000, orders: 240 },
  { date: '2024-01-16', sales: 3000, orders: 198 },
  { date: '2024-01-17', sales: 5000, orders: 280 },
  { date: '2024-01-18', sales: 2780, orders: 190 },
  { date: '2024-01-19', sales: 6890, orders: 390 },
  { date: '2024-01-20', sales: 4390, orders: 280 },
];

const RECENT_ORDERS = [
  {
    id: "ORD-2024-001",
    customer: "John Doe",
    date: "2024-01-20",
    total: "€299.99",
    items: 3,
    status: "Processing",
    payment: "Credit Card"
  },
  {
    id: "ORD-2024-002",
    customer: "Sarah Smith",
    date: "2024-01-20",
    total: "€150.50",
    items: 2,
    status: "Shipped",
    payment: "PayPal"
  },
  {
    id: "ORD-2024-003",
    customer: "Mike Johnson",
    date: "2024-01-19",
    total: "€89.99",
    items: 1,
    status: "Delivered",
    payment: "Credit Card"
  },
  {
    id: "ORD-2024-004",
    customer: "Emma Wilson",
    date: "2024-01-19",
    total: "€245.00",
    items: 4,
    status: "Processing",
    payment: "Debit Card"
  }
];

const SALES_CHANNELS = [
  {
    name: "Website",
    orders: 856,
    revenue: "€25,678",
    growth: "+12.3%"
  },
  {
    name: "Mobile App",
    orders: 432,
    revenue: "€15,432",
    growth: "+18.5%"
  },
  {
    name: "Marketplace",
    orders: 267,
    revenue: "€8,921",
    growth: "+5.7%"
  }
];

const getOrderStatusColor = (status: string) => {
  const colors = {
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Shipped': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export function SalesContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Overview</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor your sales performance and order metrics
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

      {/* Sales Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SALES_METRICS.map((metric) => (
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

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Performance</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Revenue</Badge>
              <Badge variant="outline">Orders</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#5FC4D0" 
                  strokeWidth={2} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#22C55E" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sales Channels & Order Management */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Channels */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Channels</CardTitle>
              <Button variant="outline" size="sm">
                <Store className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {SALES_CHANNELS.map((channel) => (
                <div key={channel.name} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {channel.orders} orders
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{channel.revenue}</div>
                      <div className="text-sm text-green-600">{channel.growth}</div>
                    </div>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Overview */}
<Card>
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardTitle>Order Management</CardTitle>
      <div className="flex items-center gap-2">
        <Badge variant="default">{RECENT_ORDERS.length} new orders</Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <BellRing className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-2">
      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-sm text-green-700">12 completed today</span>
      </div>
      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-yellow-50">
        <Clock className="h-4 w-4 text-yellow-500" />
        <span className="text-sm text-yellow-700">5 pending</span>
      </div>
      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-700">2 flagged</span>
      </div>
    </div>
  </CardContent>
</Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search orders..." 
                    className="pl-8 w-[250px]"
                  />
                </div>
                <InputSelect
                  name="status"
                  label=""
                  value="all"
                  onChange={() => {}}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "delivered", label: "Delivered" }
                  ]}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ORDERS.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{order.id}</span>
                          <span>•</span>
                          <span>{order.items} items</span>
                          <span>•</span>
                          <span>{order.payment}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{order.total}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Pagination */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <InputSelect
            name="pageSize"
            label=""
            value="10"
            onChange={() => {}}
            options={[
              { value: "10", label: "10 rows" },
              { value: "20", label: "20 rows" },
              { value: "50", label: "50 rows" }
            ]}
          />
          
          <div className="flex-1 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious />
                </PaginationItem>
                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <p className="text-sm text-muted-foreground min-w-[180px] text-right">
            Showing <span className="font-medium">10</span> of{" "}
            <span className="font-medium">100</span> orders
          </p>
        </div>
      </div>
        </CardContent>
      </Card>

          {/* Add bottom spacing */}
          <div className="h-8"></div>
    </div>
  );
}

export default SalesContent;