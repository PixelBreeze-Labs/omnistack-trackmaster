import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Settings,
  Cake,
  Truck,
  UserPlus,
  Star,
  Crown,
  Clock,
  Shield,
  Heart
} from "lucide-react";

// Matching backend schema structure
const TIER_BENEFITS = [
  {
    name: "Platinum",
    spendRange: { min: 2500, max: 9999999 },
    pointsMultiplier: 2.5,
    birthdayReward: 30,
    referralPoints: 20,
    color: "bg-blue-500/10",
    textColor: "text-blue-600",
    icon: Crown,
    perks: [
      { icon: Truck, title: "Free express shipping on all orders" },
      { icon: Star, title: "30€ birthday reward" },
      { icon: UserPlus, title: "20 points per referral" },
      { icon: Clock, title: "Priority customer service" }
    ]
  },
  {
    name: "Gold",
    spendRange: { min: 1000, max: 2499 },
    pointsMultiplier: 2,
    birthdayReward: 20,
    referralPoints: 15,
    color: "bg-yellow-500/10",
    textColor: "text-yellow-600",
    icon: Star,
    perks: [
      { icon: Truck, title: "Free express shipping over 50€" },
      { icon: Star, title: "20€ birthday reward" },
      { icon: UserPlus, title: "15 points per referral" }
    ]
  },
  {
    name: "Silver",
    spendRange: { min: 500, max: 999 },
    pointsMultiplier: 1.5,
    birthdayReward: 10,
    referralPoints: 10,
    color: "bg-slate-500/10",
    textColor: "text-slate-600",
    icon: Shield,
    perks: [
      { icon: Truck, title: "Free standard shipping over 50€" },
      { icon: Star, title: "10€ birthday reward" },
      { icon: UserPlus, title: "10 points per referral" }
    ]
  },
  {
    name: "Bronze",
    spendRange: { min: 0, max: 499 },
    pointsMultiplier: 1,
    birthdayReward: 5,
    referralPoints: 5,
    color: "bg-amber-500/10",
    textColor: "text-amber-600",
    icon: Heart,
    perks: [
      { icon: Star, title: "5€ birthday reward" },
      { icon: UserPlus, title: "5 points per referral" }
    ]
  }
];

const CORE_BENEFITS = [
  {
    title: "Birthday Rewards",
    description: "Tier-based rewards",
    icon: Cake,
    color: "bg-pink-50 text-pink-600"
  },
  {
    title: "Referral Program",
    description: "Tier-based points",
    icon: UserPlus,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Shipping Benefits",
    description: "Based on tier",
    icon: Truck,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Points Multiplier",
    description: "Tier-based multipliers",
    icon: Star,
    color: "bg-purple-50 text-purple-600"
  }
];

const EXCLUSIVE_BENEFITS = [
  {
    title: "VIP Events Access",
    description: "Platinum & Gold members",
    date: "Quarterly",
    icon: Crown,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Early Sale Access",
    description: "All tier members",
    date: "Seasonal",
    icon: Clock,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Birthday Month",
    description: "Double points all month",
    date: "Member birthday",
    icon: Gift,
    color: "bg-pink-50 text-pink-600"
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
            Manage membership benefits and tier perks
          </p>
        </div>
        <Button variant="default" style={{ backgroundColor: "#5FC4D0" }}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Benefits
        </Button>
      </div>

      {/* Core Benefits */}
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
            {CORE_BENEFITS.map((benefit) => (
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
              <Card key={tier.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`${tier.color} ${tier.textColor}`}>
                      {tier.name}
                    </Badge>
                    <tier.icon className={`h-5 w-5 ${tier.textColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Spend Range: {tier.spendRange.min}€ - {tier.spendRange.max}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Points: {tier.pointsMultiplier}x multiplier
                    </div>
                    <div className="space-y-2">
                      {tier.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <perk.icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm">{perk.title}</span>
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

      {/* Exclusive Benefits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exclusive Benefits</CardTitle>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Add Exclusive
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {EXCLUSIVE_BENEFITS.map((benefit, idx) => (
              <Card key={idx}>
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
                      <p className="text-xs text-muted-foreground mt-1">
                        {benefit.date}
                      </p>
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