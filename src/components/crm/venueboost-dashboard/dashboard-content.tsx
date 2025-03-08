"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Building,
  Calendar,
  ChevronUp,
  Clock,
  Coffee,
  DollarSign,
  Hotel,
  Percent,
  ShoppingBasket,
  Tag,
  Ticket,
  Users,
  Film,
  BarChart3,
  ArrowDown,
  ArrowUp,
} from "lucide-react"

// Mock venue data
const venueStats = [
  { type: 'Food & Beverage', count: 12, icon: <Coffee className="h-5 w-5" />, color: 'bg-orange-100' },
  { type: 'Accommodation', count: 5, icon: <Hotel className="h-5 w-5" />, color: 'bg-blue-100' },
  { type: 'Retail', count: 8, icon: <ShoppingBasket className="h-5 w-5" />, color: 'bg-green-100' },
  { type: 'Entertainment', count: 7, icon: <Film className="h-5 w-5" />, color: 'bg-purple-100' },
]

// Mock event data
const upcomingEvents = [
  { name: 'Summer Music Festival', venue: 'Central Park Stage', date: '2025-06-15', ticketsSold: 1245, capacity: 1500 },
  { name: 'Corporate Expo 2025', venue: 'Grand Convention Center', date: '2025-04-22', ticketsSold: 876, capacity: 1000 },
  { name: 'Food & Wine Exhibition', venue: 'Gourmet Gallery', date: '2025-05-10', ticketsSold: 643, capacity: 800 },
  { name: 'Theater Production: Hamlet', venue: 'Downtown Theater', date: '2025-04-05', ticketsSold: 412, capacity: 450 },
]

// Mock revenue data for chart
const revenueData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 49000 },
  { month: 'Apr', value: 63000 },
  { month: 'May', value: 58000 },
  { month: 'Jun', value: 72000 },
  { month: 'Jul', value: 85000 },
  { month: 'Aug', value: 91000 },
  { month: 'Sep', value: 82000 },
  { month: 'Oct', value: 74000 },
  { month: 'Nov', value: 68000 },
  { month: 'Dec', value: 79000 },
]

export default function VenueBoostDashboard() {
  // Calculate percentages for upcoming events
  const eventsWithPercentage = upcomingEvents.map(event => ({
    ...event,
    percentage: Math.round((event.ticketsSold / event.capacity) * 100)
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">VenueBoost Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Comprehensive overview of your venue management platform
        </p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Date Range
        </Button>
        <Button variant="default" size="sm">
          <Activity className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-gray-500">Across 4 categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>14% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$818,000</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>8.2% year over year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Sales</CardTitle>
            <Ticket className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,176</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Venue Categories & Revenue Trend */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Venue Types */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Venue Categories</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Breakdown of venues by type
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venueStats.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`p-2 rounded-md mr-3 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stat.type}</p>
                      </div>
                      <div className="font-medium">
                        {stat.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Revenue Trend</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Monthly revenue for the past year
                  </p>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full">
                  {/* This would be replaced with a Chart component */}
                  <div className="flex h-[270px] items-end gap-2">
                    {revenueData.map((month, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div 
                          className="bg-primary/90 rounded-sm hover:bg-primary w-full transition-all"
                          style={{ height: `${(month.value / 95000) * 100}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            ${month.value.toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1.5 text-[10px] text-muted-foreground text-center">
                          {month.month}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Events scheduled in the next 90 days
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventsWithPercentage.map((event, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-gray-500">{event.venue}</p>
                    </div>
                    <div className="text-sm">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm">
                      {`${event.ticketsSold}/${event.capacity} tickets`}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              event.percentage >= 90 
                                ? 'bg-green-600' 
                                : event.percentage >= 70 
                                ? 'bg-green-400' 
                                : event.percentage >= 50 
                                ? 'bg-yellow-400' 
                                : 'bg-red-400'
                            }`}
                            style={{ width: `${event.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{event.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Indicators */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">78.5%</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">4.3%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Across all venue types</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Revenue per Venue</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">$25,560</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">6.8%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Monthly average for Q1</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">4.7/5</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">0.2</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on 2,345 reviews</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="venues">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Venue Management</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  View and manage all your venues
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Select the "Venues" section from the sidebar to manage your venues in detail.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Event Calendar</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  View and manage upcoming events
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Select the "Events" section from the sidebar to manage your events in detail.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Performance Reports</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Detailed analytics and reports
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Select specific report types from the sidebar for detailed performance metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

       {/* Add bottom spacing */}
       <div className="h-8"></div>
    </div>
  )
}