"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  ArrowUpRight,
  Share2,
  MessageSquare,
  Gift,
  Settings,
  ShoppingBag,
  Trophy,
  Heart,
  Calendar,
  TrendingUp,
  ChevronRight,
  BadgePercent,
  CreditCard
} from "lucide-react";

const POINTS_STATS = [
  {
    title: "Active Points",
    value: "124,500",
    change: "+8.2%",
    subtitle: "Total points issued",
    icon: Star
  },
  {
    title: "Points Redeemed",
    value: "84,750",
    change: "+12.5%",
    subtitle: "Last 30 days",
    icon: Gift
  },
  {
    title: "Points Per Order",
    value: "285",
    change: "+5.3%",
    subtitle: "Average points",
    icon: ShoppingBag
  },
  {
    title: "Member Activity",
    value: "92%",
    change: "+3.1%",
    subtitle: "Points utilization",
    icon: TrendingUp
  }
];

const EARNING_ACTIVITIES = [
  {
    title: "Purchase Points",
    description: "€1 spent = 1 point earned",
    icon: CreditCard,
    color: "text-blue-500 bg-blue-50"
  },
  {
    title: "Review Bonus",
    description: "10 points per review",
    icon: MessageSquare,
    color: "text-green-500 bg-green-50"
  },
  {
    title: "Social Share",
    description: "5 points per share",
    icon: Share2,
    color: "text-purple-500 bg-purple-50"
  },
  {
    title: "Signup Bonus",
    description: "50 points welcome bonus",
    icon: Gift,
    color: "text-orange-500 bg-orange-50"
  }
];

const TIER_MULTIPLIERS = [
  {
    tier: "Bronze",
    multiplier: "1x",
    progress: 100,
    color: "bg-amber-500"
  },
  {
    tier: "Silver",
    multiplier: "1.5x",
    progress: 75,
    color: "bg-slate-500"
  },
  {
    tier: "Gold",
    multiplier: "2x",
    progress: 50,
    color: "bg-yellow-500"
  },
  {
    tier: "Platinum",
    multiplier: "2.5x",
    progress: 25,
    color: "bg-blue-500"
  }
];

const RECENT_ACTIVITIES = [
  {
    member: "John Doe",
    action: "Purchase Points",
    points: "+125",
    date: "2 hours ago",
    type: "earn"
  },
  {
    member: "Sarah Smith",
    action: "Review Bonus",
    points: "+10",
    date: "5 hours ago",
    type: "earn"
  },
  {
    member: "Mike Johnson",
    action: "Points Redemption",
    points: "-200",
    date: "1 day ago",
    type: "redeem"
  }
];

export function PointsRewardsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Points & Rewards</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage point earning rules and member rewards
          </p>
        </div>
        <Button variant="default" style={{ backgroundColor: "#5FC4D0" }}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {POINTS_STATS.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {stat.change}
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Earning Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Earning Activities</CardTitle>
              <Button variant="outline" size="sm">
                <BadgePercent className="h-4 w-4 mr-2" />
                Special Rules
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EARNING_ACTIVITIES.map((activity) => (
                <Card key={activity.title}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Multipliers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tier Multipliers</CardTitle>
              <Button variant="outline" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                View Tiers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TIER_MULTIPLIERS.map((tier) => (
                <div key={tier.tier} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{tier.tier}</Badge>
                      <span className="text-sm font-medium">{tier.multiplier} Points</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tier.progress} members
                    </span>
                  </div>
                  <Progress value={tier.progress} className={tier.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Special Events */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'earn' ? 'bg-green-50' : 'bg-orange-50'
                    }`}>
                      {activity.type === 'earn' ? (
                        <Star className="h-4 w-4 text-green-500" />
                      ) : (
                        <Gift className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.member}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      activity.type === 'earn' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {activity.points}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Special Events</CardTitle>
              <Button variant="ghost" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Star className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Black Friday</h4>
                        <p className="text-sm text-muted-foreground">2x Points on all purchases</p>
                      </div>
                    </div>
                    <Badge>Nov 25</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Gift className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Store Anniversary</h4>
                        <p className="text-sm text-muted-foreground">2x Points + Special Rewards</p>
                      </div>
                    </div>
                    <Badge>May 20</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-50 rounded-lg">
                        <Heart className="h-4 w-4 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Member Days</h4>
                        <p className="text-sm text-muted-foreground">1.5x Points for all members</p>
                      </div>
                    </div>
                    <Badge>Monthly</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
        {/* Add bottom spacing */}
        <div className="h-8"></div>
    </div>
  );
}

export default PointsRewardsContent;