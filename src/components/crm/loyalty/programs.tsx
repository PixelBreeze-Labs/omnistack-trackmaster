"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Settings,
  Users,
  Gift,
  Crown,
  Calendar,
  ArrowUpRight,
  BadgePercent,
  TrendingUp,
  MessageSquare,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PROGRAM_STATS = [
  {
    title: "Total Members",
    value: "1,274",
    change: "+12%",
    subtitle: "Across all tiers",
    icon: Users
  },
  {
    title: "Points Issued",
    value: "45,230",
    change: "+8%",
    subtitle: "Last 30 days",
    icon: Star
  },
  {
    title: "Redemption Rate",
    value: "68%",
    change: "+5%",
    subtitle: "Points redeemed",
    icon: Gift
  },
  {
    title: "Avg. Member Value",
    value: "€285",
    change: "+15%",
    subtitle: "Per member",
    icon: Crown
  }
];

const TIERS_OVERVIEW = [
  {
    name: "Bronze",
    members: 850,
    spendRange: "€0 - €499",
    color: "bg-amber-500/10 text-amber-600"
  },
  {
    name: "Silver",
    members: 285,
    spendRange: "€500 - €999",
    color: "bg-slate-500/10 text-slate-600"
  },
  {
    name: "Gold",
    members: 98,
    spendRange: "€1000 - €2499",
    color: "bg-yellow-500/10 text-yellow-600"
  },
  {
    name: "Platinum",
    members: 41,
    spendRange: "€2500+",
    color: "bg-blue-500/10 text-blue-600"
  }
];

export function LoyaltyProgramsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Loyalty Programs</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your loyalty program tiers and rewards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Program Settings
          </Button>
          <Button style={{ backgroundColor: "#5FC4D0" }}>
            <Shield className="h-4 w-4 mr-2" />
            View Member Portal
          </Button>
        </div>
      </div>

      {/* Program Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PROGRAM_STATS.map((stat) => (
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

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BadgePercent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Special Promotions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  2 active bonus point events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Next: Black Friday 2x Points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Member Feedback</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  92% satisfaction rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Membership Tiers</CardTitle>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure Tiers
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIERS_OVERVIEW.map((tier) => (
              <Card key={tier.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={tier.color}>{tier.name}</Badge>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Members</span>
                      <span className="font-medium">{tier.members}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Spend Range</span>
                      <span className="font-medium">{tier.spendRange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Point Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Points Earned</span>
                <Badge variant="secondary">1 per €1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Redemption Rate</span>
                <Badge variant="secondary">€5 per 100 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sign-up Bonus</span>
                <Badge variant="secondary">50 points</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Program Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Members</span>
                <Badge variant="secondary">85%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Points Usage</span>
                <Badge variant="secondary">68%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Member Retention</span>
                <Badge variant="secondary">92%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bonus Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Black Friday</span>
                <Badge variant="secondary">2x Points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Store Anniversary</span>
                <Badge variant="secondary">2x Points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Member Days</span>
                <Badge variant="secondary">1.5x Points</Badge>
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

export default LoyaltyProgramsContent;