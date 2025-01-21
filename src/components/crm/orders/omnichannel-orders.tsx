"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CircleDollarSign, 
  TrendingUp, 
  TrendingDown,
  Store,
  Package,
  Truck,
  ArrowUpRight,
  ShoppingBag
} from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const channelData = [
  { name: 'Online Store', value: 45, color: '#0ea5e9' },
  { name: 'Physical Store', value: 30, color: '#8b5cf6' },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  online: Math.floor(Math.random() * 50) + 10,
  store: Math.floor(Math.random() * 30) + 5,
}));

const weeklyTrends = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
    online: Math.floor(Math.random() * 100) + 50,
    store: Math.floor(Math.random() * 80) + 40,
  };
});

export function OmnichannelOrders() {
  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendClass = (percentage: number) => {
    return percentage > 0 ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Omnichannel Overview</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Comprehensive view of orders across all sales channels
        </p>
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">2,874</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(12)}
                <span className={`text-sm ${getTrendClass(12)}`}>+12%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">15.4M ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(8)}
                <span className={`text-sm ${getTrendClass(8)}`}>+8%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All channels combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">5,350 ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(5)}
                <span className={`text-sm ${getTrendClass(5)}`}>+5%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Channel Count</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">3</div>
              <div className="flex gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <Store className="h-4 w-4 text-muted-foreground" />
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active sales channels</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Order Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Hourly Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="online" name="Online" fill="#0ea5e9" />
                  <Bar dataKey="store" name="Store" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card className="mb-8 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Weekly Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="online" 
                    name="Online"
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="store" 
                    name="Store"
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
         
      </div>
    </div>
  );
}