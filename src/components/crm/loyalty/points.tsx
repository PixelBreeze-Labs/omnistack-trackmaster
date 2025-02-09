import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Share2,
  MessageSquare,
  Gift,
  Settings,
  ShoppingBag,
  Calendar,
  BadgePercent,
} from "lucide-react";

// Matching backend schema
const POINTS_STATS = [
  {
    title: "Points Per Spend",
    value: `${1}€ = ${1} point`,
    subtitle: "Base earning rate",
    icon: ShoppingBag
  },
  {
    title: "Sign-up Bonus",
    value: "50 points",
    subtitle: "New member bonus",
    icon: Gift
  },
  {
    title: "Review Points",
    value: "10 points",
    subtitle: "Per review",
    icon: MessageSquare
  },
  {
    title: "Social Share",
    value: "5 points",
    subtitle: "Per share",
    icon: Share2
  }
];

const REDEMPTION_OPTIONS = [
  {
    title: "Standard Redemption",
    description: `100 points = 5€ discount`,
    icon: BadgePercent,
    color: "text-blue-500 bg-blue-50"
  },
  {
    title: "Sign-up Reward",
    description: "50 points welcome bonus",
    icon: Gift,
    color: "text-green-500 bg-green-50"
  },
  {
    title: "Review Bonus",
    description: "10 points per review",
    icon: MessageSquare,
    color: "text-purple-500 bg-purple-50"
  },
  {
    title: "Social Share",
    description: "5 points per share",
    icon: Share2,
    color: "text-orange-500 bg-orange-50"
  }
];

const BONUS_DAYS = [
  {
    name: "Black Friday",
    date: "2024-11-25",
    multiplier: 2
  },
  {
    name: "Store Anniversary",
    date: "2024-05-20",
    multiplier: 2
  },
  {
    name: "Member Days",
    date: "Monthly",
    multiplier: 1.5
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
            Configure point earning rules and redemption options
          </p>
        </div>
        <Button variant="default" style={{ backgroundColor: "#5FC4D0" }}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {/* Points Earning Rules */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {POINTS_STATS.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
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
        {/* Redemption Options */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Redemption Options</CardTitle>
              <Button variant="outline" size="sm">
                <BadgePercent className="h-4 w-4 mr-2" />
                Edit Options
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REDEMPTION_OPTIONS.map((option) => (
                <Card key={option.title}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <option.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{option.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bonus Days */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bonus Days</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Bonus Days
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {BONUS_DAYS.map((day) => (
                <Card key={day.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Star className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{day.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {day.multiplier}x Points
                          </p>
                        </div>
                      </div>
                      <Badge>{day.date}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PointsRewardsContent;