"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BadgePercent,
  Mail,
  Users,
  Target,
  TrendingUp,
  Filter,
  Download,
  Share2,
  Tag,
  Globe,
  Clock,
  Plus
} from "lucide-react";

const MARKETING_METRICS = [
  {
    title: "Campaign Reach",
    value: "45.2K",
    change: "+12.3%",
    trend: "up",
    period: "vs last month",
    icon: Users
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.8%",
    trend: "up",
    period: "vs last month",
    icon: Target
  },
  {
    title: "Avg. ROI",
    value: "285%",
    change: "+15.5%",
    trend: "up",
    period: "vs last month",
    icon: TrendingUp
  },
  {
    title: "Active Campaigns",
    value: "12",
    change: "-2",
    trend: "down",
    period: "vs last month",
    icon: Megaphone
  }
];

const CAMPAIGN_PERFORMANCE = [
  { date: '2024-01', reach: 25000, engagement: 15000, conversions: 750 },
  { date: '2024-02', reach: 28000, engagement: 16800, conversions: 840 },
  { date: '2024-03', reach: 32000, engagement: 19200, conversions: 960 },
  { date: '2024-04', reach: 35000, engagement: 21000, conversions: 1050 },
  { date: '2024-05', reach: 40000, engagement: 24000, conversions: 1200 },
  { date: '2024-06', reach: 45000, engagement: 27000, conversions: 1350 }
];

const ACTIVE_CAMPAIGNS = [
  {
    name: "Summer Sale",
    type: "Promotional",
    status: "Active",
    reach: 15000,
    conversions: 450,
    budget: "€2,500",
    endDate: "2024-08-31"
  },
  {
    name: "Email Newsletter",
    type: "Email",
    status: "Active",
    reach: 8500,
    conversions: 255,
    budget: "€1,200",
    endDate: "2024-07-15"
  },
  {
    name: "Social Media Ads",
    type: "Social",
    status: "Active",
    reach: 25000,
    conversions: 750,
    budget: "€3,500",
    endDate: "2024-07-31"
  }
];

const PROMOTIONS = [
  {
    code: "SUMMER24",
    discount: "20% OFF",
    type: "Percentage",
    usageCount: 245,
    revenue: "€12,450",
    status: "Active"
  },
  {
    code: "FREESHIP",
    discount: "Free Shipping",
    type: "Shipping",
    usageCount: 189,
    revenue: "€9,450",
    status: "Active"
  },
  {
    code: "WELCOME10",
    discount: "€10 OFF",
    type: "Fixed",
    usageCount: 156,
    revenue: "€7,800",
    status: "Active"
  }
];

const CHANNEL_PERFORMANCE = [
  {
    channel: "Email",
    metrics: {
      sent: 25000,
      opened: 8750,
      clicked: 2125,
      converted: 425
    },
    growth: "+12.3%"
  },
  {
    channel: "Social Media",
    metrics: {
      impressions: 150000,
      engagement: 15000,
      clicks: 7500,
      converted: 750
    },
    growth: "+18.5%"
  },
  {
    channel: "Website",
    metrics: {
      visits: 85000,
      engagement: 25500,
      leads: 4250,
      converted: 850
    },
    growth: "+15.2%"
  }
];

export function MarketingContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Overview</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor your marketing campaigns and promotional performance
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
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Marketing Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {MARKETING_METRICS.map((metric) => (
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

      {/* Campaign Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaign Performance</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Reach</Badge>
              <Badge variant="outline">Engagement</Badge>
              <Badge variant="outline">Conversions</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CAMPAIGN_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#5FC4D0" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#22C55E" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#6366F1" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns & Promotions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Campaigns</CardTitle>
              <Button variant="outline" size="sm">
                <Megaphone className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVE_CAMPAIGNS.map((campaign) => (
                <Card key={campaign.name}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <Badge variant="secondary">{campaign.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {campaign.reach.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {campaign.conversions.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(campaign.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0">
                        {campaign.budget}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Promotions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Promotions</CardTitle>
              <Button variant="outline" size="sm">
                <BadgePercent className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PROMOTIONS.map((promo) => (
                <Card key={promo.code}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{promo.code}</h4>
                          <Badge variant="secondary">{promo.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {promo.discount}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {promo.usageCount} uses
                          </div>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0">
                        {promo.revenue}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Channel Performance</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {CHANNEL_PERFORMANCE.map((channel) => (
              <Card key={channel.channel}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {channel.channel === "Email" ? (
                          <Mail className="h-4 w-4 text-primary" />
                        ) : channel.channel === "Social Media" ? (
                          <Share2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Globe className="h-4 w-4 text-primary" />
                        )}
                        <h4 className="font-medium">{channel.channel}</h4>
                      </div>
                      <Badge variant="secondary" className="text-green-600">
                        {channel.growth}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(channel.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key}
                          </span>
                          <span className="font-medium">
                            {value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
       {/* Add bottom spacing */}
       <div className="h-8"></div>
    </div>
  );
}

export default MarketingContent;