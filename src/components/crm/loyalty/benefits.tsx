"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Settings,
  Cake,
  Truck,
  Headphones,
  Star,
  Heart,
  Calendar,
  UserPlus,
  ShieldCheck,
  Crown,
  Sparkles,
  Clock,
  RefreshCcw
} from "lucide-react";

const BENEFITS_OVERVIEW = [
  {
    title: "Active Benefits",
    value: "24",
    subtitle: "Across all tiers",
    icon: Gift
  },
  {
    title: "Birthday Rewards",
    value: "156",
    subtitle: "This month",
    icon: Cake
  },
  {
    title: "Referral Bonuses",
    value: "85",
    subtitle: "Last 30 days",
    icon: UserPlus
  },
  {
    title: "Exclusive Rewards",
    value: "12",
    subtitle: "Available now",
    icon: Crown
  }
];

const TIER_BENEFITS = [
  {
    tier: "Platinum",
    color: "bg-blue-500/10",
    textColor: "text-blue-600",
    icon: Crown,
    benefits: [
      { icon: Truck, title: "Free express shipping on all orders" },
      { icon: Headphones, title: "VIP customer service hotline" },
      { icon: RefreshCcw, title: "Free returns and priority processing" },
      { icon: Star, title: "30€ birthday reward" },
      { icon: UserPlus, title: "20 points per referral" }
    ]
  },
  {
    tier: "Gold",
    color: "bg-yellow-500/10",
    textColor: "text-yellow-600",
    icon: Star,
    benefits: [
      { icon: Truck, title: "Free express shipping over 50€" },
      { icon: Calendar, title: "Invitations to exclusive events" },
      { icon: Star, title: "20€ birthday reward" },
      { icon: UserPlus, title: "15 points per referral" }
    ]
  },
  {
    tier: "Silver",
    color: "bg-slate-500/10",
    textColor: "text-slate-600",
    icon: ShieldCheck,
    benefits: [
      { icon: Truck, title: "Free standard shipping over 50€" },
      { icon: Clock, title: "Early access to sales" },
      { icon: Star, title: "10€ birthday reward" },
      { icon: UserPlus, title: "10 points per referral" }
    ]
  },
  {
    tier: "Bronze",
    color: "bg-amber-500/10",
    textColor: "text-amber-600",
    icon: Heart,
    benefits: [
      { icon: Star, title: "5€ birthday reward" },
      { icon: UserPlus, title: "5 points per referral" }
    ]
  }
];

const SPECIAL_BENEFITS = [
  {
    title: "Free Shipping Program",
    description: "Based on tier and order value",
    icon: Truck,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Birthday Rewards",
    description: "Special gifts and points",
    icon: Cake,
    color: "bg-pink-50 text-pink-600"
  },
  {
    title: "Referral Program",
    description: "Points for bringing friends",
    icon: UserPlus,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Early Access",
    description: "Priority for sales and events",
    icon: Clock,
    color: "bg-purple-50 text-purple-600"
  }
];

const EXCLUSIVE_REWARDS = [
  {
    title: "VIP Shopping Day",
    description: "Exclusive 24-hour early access to new collection",
    tier: "Platinum",
    validUntil: "Dec 31, 2024"
  },
  {
    title: "Double Points Weekend",
    description: "Earn 2x points on all purchases",
    tier: "Gold & Above",
    validUntil: "Nov 30, 2024"
  },
  {
    title: "Free Gift with Purchase",
    description: "Special gift for orders over 100€",
    tier: "Silver & Above",
    validUntil: "Oct 15, 2024"
  }
];

export function BenefitsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Benefits</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage membership benefits and exclusive rewards
          </p>
        </div>
        <Button variant="default" style={{ backgroundColor: "#5FC4D0" }}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Benefits
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {BENEFITS_OVERVIEW.map((stat) => (
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

      {/* Special Benefits Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Core Benefits</CardTitle>
            <Button variant="outline" size="sm">
              <Gift className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SPECIAL_BENEFITS.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${benefit.color}`}>
                      <benefit.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tier Benefits</CardTitle>
              <Button variant="outline" size="sm">
                <Crown className="h-4 w-4 mr-2" />
                Manage Tiers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TIER_BENEFITS.map((tier) => (
                <Card key={tier.tier}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={`${tier.color} ${tier.textColor}`}>
                        {tier.tier}
                      </Badge>
                      <tier.icon className={`h-5 w-5 ${tier.textColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <benefit.icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{benefit.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exclusive Rewards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exclusive Rewards</CardTitle>
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Add Reward
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {EXCLUSIVE_REWARDS.map((reward, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{reward.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {reward.description}
                        </p>
                      </div>
                      <Badge variant="secondary">{reward.tier}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Valid until {reward.validUntil}
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

export default BenefitsContent;