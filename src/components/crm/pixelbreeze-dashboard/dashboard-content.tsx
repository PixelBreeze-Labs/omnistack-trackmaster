"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronUp,
  Clock,
  DollarSign,
  Download,
  Grid,
  Image as ImageIcon,
  Link as LinkIcon,
  PenTool,
  PieChart,
  PlusCircle,
  RefreshCw,
  Star,
  ThumbsUp,
  Users,
  Video,
  Wand2,
  Zap,
} from "lucide-react"

// Mock template data
const templateStats = [
  { name: 'Social Media Posts', count: 48, icon: <ImageIcon className="h-5 w-5" />, color: 'bg-blue-100' },
  { name: 'Story Templates', count: 24, icon: <Grid className="h-5 w-5" />, color: 'bg-purple-100' },
  { name: 'Video Thumbnails', count: 16, icon: <Video className="h-5 w-5" />, color: 'bg-green-100' },
  { name: 'Profile Graphics', count: 12, icon: <Users className="h-5 w-5" />, color: 'bg-orange-100' },
]

// Mock recent generations
const recentGenerations = [
  { 
    name: 'Summer Promo Post', 
    template: 'Seasonal Collection', 
    date: '2025-03-07', 
    status: 'completed',
    engagement: 245 
  },
  { 
    name: 'Product Launch Announcement', 
    template: 'New Product', 
    date: '2025-03-06', 
    status: 'completed',
    engagement: 387 
  },
  { 
    name: 'Customer Testimonial', 
    template: 'Quote Card', 
    date: '2025-03-05', 
    status: 'completed',
    engagement: 156 
  },
  { 
    name: 'Weekly Tips Series', 
    template: 'How-To Guide', 
    date: '2025-03-04', 
    status: 'completed',
    engagement: 219 
  },
]

// Mock generation data for chart
const generationData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 145 },
  { month: 'Mar', value: 168 },
  { month: 'Apr', value: 190 },
  { month: 'May', value: 210 },
  { month: 'Jun', value: 252 },
  { month: 'Jul', value: 265 },
  { month: 'Aug', value: 280 },
  { month: 'Sep', value: 295 },
  { month: 'Oct', value: 315 },
  { month: 'Nov', value: 340 },
  { month: 'Dec', value: 360 },
]

// Mock popular templates
const popularTemplates = [
  { name: 'Minimalist Quote', uses: 487, rating: 4.8 },
  { name: 'Product Showcase', uses: 362, rating: 4.7 },
  { name: 'Seasonal Promotion', uses: 298, rating: 4.9 },
  { name: 'Tips & Tricks', uses: 256, rating: 4.6 },
]

export default function PixelBreezeDashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">PixelBreeze Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
            Your AI-powered social media content generation platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="default" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Quick Actions - Redesigned as a card with icon buttons */}
      <div className="flex flex-col gap-2">
  <div className="flex items-center">
    <Wand2 className="h-4 w-4 mr-2 text-primary" />
    <span className="text-sm font-medium">Quick Actions</span>
  </div>
  <div className="grid grid-cols-3 gap-2">
    <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
      <div className="flex items-center">
        <PenTool className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="whitespace-nowrap text-ellipsis overflow-hidden">Generate Image</span>
      </div>
    </Button>
    <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
      <div className="flex items-center">
        <Grid className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="whitespace-nowrap text-ellipsis overflow-hidden">Templates</span>
      </div>
    </Button>
    <Button size="sm" variant="cta" className="h-10 flex justify-start px-3 overflow-hidden">
      <div className="flex items-center">
        <PlusCircle className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="whitespace-nowrap text-ellipsis overflow-hidden">Connect Social Profile</span>
      </div>
    </Button>
  </div>
</div>
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Image Generations</CardTitle>
            <Wand2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>18% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <Grid className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>12 new this month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Profiles</CardTitle>
            <LinkIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>2 added recently</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Downloaded Images</CardTitle>
            <Download className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">843</div>
            <p className="text-xs text-gray-500">67% of generations</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Template Categories & Generation Trend */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Template Categories */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Template Categories</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Distribution of templates by type
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templateStats.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`p-2 rounded-md mr-3 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{stat.name}</p>
                      </div>
                      <div className="font-medium">
                        {stat.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generation Trend */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Generation Trend</h3>
                  <p className="text-sm text-muted-foreground mt-0 mb-4">
                    Number of images generated per month
                  </p>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full">
                  {/* This would be replaced with a Chart component */}
                  <div className="flex h-[270px] items-end gap-2">
                    {generationData.map((month, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div 
                          className="bg-primary/90 rounded-sm hover:bg-primary w-full transition-all"
                          style={{ height: `${(month.value / 370) * 100}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {month.value} images
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

          {/* Recent Generations */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Recent Generations</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Your recently generated content
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGenerations.map((generation, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="font-medium">{generation.name}</p>
                      <p className="text-sm text-gray-500">Template: {generation.template}</p>
                    </div>
                    <div className="text-sm">
                      {new Date(generation.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        generation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {generation.status}
                      </span>
                    </div>
                    <div className="text-sm flex items-center">
                      <ThumbsUp className="h-4 w-4 text-gray-500 mr-2" />
                      {generation.engagement} engagements
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Templates */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Popular Templates</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Your most-used templates by generation count
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <Grid className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-gray-500">{template.uses} uses</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">4.6%</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">0.8%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Industry average: 3.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Content Efficiency</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">92%</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">5%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Time saved vs manual creation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Generation Quality</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">4.8/5</div>
                  <div className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">0.3</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on user ratings</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Template Library</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Browse and manage your templates
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Select the "Templates" section from the sidebar to manage your templates in detail.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Performance Analytics</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Track your content performance metrics
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Select the "Analytics" section from the sidebar for detailed performance metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Connected Social Accounts</h3>
                <p className="text-sm text-muted-foreground mt-0 mb-4">
                  Manage your connected social media platforms
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Select the "Social Profiles" section from the sidebar to manage your connected accounts.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  )
}