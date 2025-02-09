"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Crown,
  Star,
  Edit,
  Plus
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// This matches our backend schema
interface MembershipTier {
  name: string;
  spendRange: {
    min: number;
    max: number;
  };
  pointsMultiplier: number;
  birthdayReward: number;
  perks: string[];
  referralPoints: number;
}

interface LoyaltyProgram {
  programName: string;
  currency: string;
  membershipTiers: MembershipTier[];
}

export function ProgramContent() {
  // Demo data matching our schema
  const currentProgram: LoyaltyProgram = {
    programName: "ByBest Rewards Club",
    currency: "EUR",
    membershipTiers: [
      {
        name: "Bronze",
        spendRange: { min: 0, max: 499 },
        pointsMultiplier: 1,
        birthdayReward: 5,
        perks: [],
        referralPoints: 5
      },
      {
        name: "Silver",
        spendRange: { min: 500, max: 999 },
        pointsMultiplier: 1.5,
        birthdayReward: 10,
        perks: ['Free standard shipping on orders over 50 EUR'],
        referralPoints: 10
      },
      {
        name: "Gold",
        spendRange: { min: 1000, max: 2499 },
        pointsMultiplier: 2,
        birthdayReward: 20,
        perks: ['Free express shipping'],
        referralPoints: 15
      },
      {
        name: "Platinum",
        spendRange: { min: 2500, max: 9999999 },
        pointsMultiplier: 2.5,
        birthdayReward: 30,
        perks: ['VIP customer service'],
        referralPoints: 20
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Loyalty Program Settings</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Configure your loyalty program tiers and basic settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Preview Program
          </Button>
          <Button>
            <Crown className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Program Name</label>
              <Input 
                placeholder="Enter program name" 
                value={currentProgram.programName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input 
                placeholder="EUR" 
                value={currentProgram.currency}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Tiers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membership Tiers</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier Name</TableHead>
                <TableHead>Spend Range</TableHead>
                <TableHead>Points Multiplier</TableHead>
                <TableHead>Birthday Reward</TableHead>
                <TableHead>Referral Points</TableHead>
                <TableHead>Perks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProgram.membershipTiers.map((tier) => (
                <TableRow key={tier.name}>
                  <TableCell className="font-medium">{tier.name}</TableCell>
                  <TableCell>
                    {tier.spendRange.min} - {tier.spendRange.max} {currentProgram.currency}
                  </TableCell>
                  <TableCell>{tier.pointsMultiplier}x</TableCell>
                  <TableCell>{tier.birthdayReward} {currentProgram.currency}</TableCell>
                  <TableCell>{tier.referralPoints} points</TableCell>
                  <TableCell>
                    {tier.perks.length > 0 ? (
                      <Badge variant="secondary">{tier.perks.length} perks</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No perks</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Panel - Read Only */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {currentProgram.membershipTiers.map((tier) => (
              <Card key={tier.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant="secondary" 
                      className={
                        tier.name === "Platinum" ? "bg-blue-100 text-blue-700" :
                        tier.name === "Gold" ? "bg-yellow-100 text-yellow-700" :
                        tier.name === "Silver" ? "bg-gray-100 text-gray-700" :
                        "bg-amber-100 text-amber-700"
                      }
                    >
                      {tier.name}
                    </Badge>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Spend Range: </span>
                      {tier.spendRange.min}-{tier.spendRange.max} {currentProgram.currency}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Points: </span>
                      {tier.pointsMultiplier}x multiplier
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Birthday: </span>
                      {tier.birthdayReward} {currentProgram.currency}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

export default ProgramContent;