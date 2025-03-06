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
  Legend
} from 'recharts';
import {
  CircleDollarSign,
  Users,
  CalendarDays,
  Home,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BedDouble,
  ArrowRight,
  MessageSquare,
  Building,
  Tag,
  Check
} from "lucide-react";

// Sample data for the bookings chart
const bookingsData = [
  { month: 'Jan', revenue: 3200, bookings: 12, guests: 18 },
  { month: 'Feb', revenue: 4000, bookings: 15, guests: 25 },
  { month: 'Mar', revenue: 4800, bookings: 19, guests: 30 },
  { month: 'Apr', revenue: 3500, bookings: 14, guests: 22 },
  { month: 'May', revenue: 5200, bookings: 21, guests: 34 },
  { month: 'Jun', revenue: 6100, bookings: 24, guests: 38 },
];

const KEY_METRICS = [
  {
    title: "Total Revenue",
    value: "€12,650",
    change: "+15.3%",
    trend: "up",
    icon: CircleDollarSign,
    subtitle: "Last 30 days"
  },
  {
    title: "Total Bookings",
    value: "42",
    change: "+8.7%",
    trend: "up",
    icon: CalendarDays,
    subtitle: "Last 30 days"
  },
  {
    title: "Active Guests",
    value: "65",
    change: "+12.1%",
    trend: "up",
    icon: Users,
    subtitle: "Last 30 days"
  },
  {
    title: "Avg. Booking Value",
    value: "€301",
    change: "+5.4%",
    trend: "up",
    icon: TrendingUp,
    subtitle: "Last 30 days"
  }
];

const UPCOMING_BOOKINGS = [
  {
    id: "BK-2024-001",
    guest: "Griseld Gerveni",
    property: "Apartment 9B",
    checkIn: "Mar 10, 2024",
    checkOut: "Mar 15, 2024",
    total: "€450",
    status: "Confirmed"
  },
  {
    id: "BK-2024-002",
    guest: "Klea Gonzalez",
    property: "Apartment 8A",
    checkIn: "Mar 12, 2024",
    checkOut: "Mar 18, 2024",
    total: "€720",
    status: "Pending"
  },
  {
    id: "BK-2024-003",
    guest: "Ejona Chen",
    property: "Apartment 9A",
    checkIn: "Mar 14, 2024",
    checkOut: "Mar 17, 2024",
    total: "€360",
    status: "Confirmed"
  }
];

const PROPERTY_STATUS = [
  {
    name: "Currently Hosting",
    value: 4,
    percent: 40,
    icon: BedDouble,
    color: "bg-blue-500"
  },
  {
    name: "Available",
    value: 5,
    percent: 50,
    icon: Home,
    color: "bg-green-500"
  },
  {
    name: "Maintenance",
    value: 1,
    percent: 10,
    icon: Building,
    color: "bg-amber-500"
  }
];

// Monthly occupancy rate data
const monthlyOccupancyData = [
  { month: 'Jan', occupancy: 65 },
  { month: 'Feb', occupancy: 70 },
  { month: 'Mar', occupancy: 85 },
  { month: 'Apr', occupancy: 75 },
  { month: 'May', occupancy: 80 },
  { month: 'Jun', occupancy: 90 },
];

export function BookingDashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Booking Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Overview of your properties, bookings, and guest metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button style={{ backgroundColor: "#2A8E9E" }}>
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

      {/* Booking Status */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-blue-700">0</span>
                  <p className="text-sm text-muted-foreground mt-1">Currently Hosting</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-green-700">0</span>
                  <p className="text-sm text-muted-foreground mt-1">Arriving Soon</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-purple-700">0</span>
                  <p className="text-sm text-muted-foreground mt-1">Upcoming</p>
                </div>
                <div className="bg-amber-100 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-amber-700">0</span>
                  <p className="text-sm text-muted-foreground mt-1">Pending Review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <CardTitle className="text-xl font-semibold">Revenue Overview</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Revenue</Badge>
              <Badge variant="outline">Bookings</Badge>
              <Badge variant="outline">Guests</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2A8E9E" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Status & Upcoming Bookings */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PROPERTY_STATUS.map((property) => (
                <div key={property.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <property.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{property.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{property.value} units</span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={property.percent} className={property.color} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{property.percent}% of total properties</span>
                      <span>{property.value} properties</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <CardTitle className="text-xl font-semibold">Upcoming Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="self-start">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {UPCOMING_BOOKINGS.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CalendarDays className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{booking.guest}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.property} • {booking.checkIn} to {booking.checkOut}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{booking.total}</div>
                        <Badge variant="secondary">{booking.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Occupancy Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupancy" name="Occupancy Rate %" fill="#2A8E9E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Guest Messages</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  5 unread messages
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Active Promotions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  2 campaigns running
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Rental Units</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  5 active properties
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

export default BookingDashboardContent;