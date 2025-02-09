"use client"

import { useEffect, useState } from 'react';
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
  Loader2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';
import { PointsConfigForm } from './PointsConfigForm';
import { BonusDayForm } from './BonusDayForm';
import { BonusDayDto } from '@/app/api/external/omnigateway/types/points-system';
import { format } from 'date-fns';

export function PointsRewardsContent() {
  const {
    isLoading,
    program,
    error,
    fetchProgram,
    updatePointsSystem,
    addBonusDay,
    removeBonusDay
  } = useLoyaltyProgram();

  const [configFormOpen, setConfigFormOpen] = useState(false);
  const [bonusDayFormOpen, setBonusDayFormOpen] = useState(false);
  const [selectedBonusDay, setSelectedBonusDay] = useState<BonusDayDto | null>(null);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pointsSystem = program?.pointsSystem;

  const handleUpdateConfig = async (data: any) => {
    try {
      await updatePointsSystem(data);
      setConfigFormOpen(false);
    } catch (error) {
      console.error('Error updating points config:', error);
    }
  };

  const handleAddBonusDay = async (data: BonusDayDto) => {
    try {
      await addBonusDay(data);
      setBonusDayFormOpen(false);
    } catch (error) {
      console.error('Error adding bonus day:', error);
    }
  };

  const handleRemoveBonusDay = async (id: string) => {
    try {
      await removeBonusDay(id);
    } catch (error) {
      console.error('Error removing bonus day:', error);
    }
  };

  const renderPointsStats = () => {
    if (!pointsSystem) return null;

    const stats = [
      {
        title: "Points Per Spend",
        value: `${pointsSystem.earningPoints.spend}€ = 1 point`,
        subtitle: "Base earning rate",
        icon: ShoppingBag
      },
      {
        title: "Sign-up Bonus",
        value: `${pointsSystem.earningPoints.signUpBonus} points`,
        subtitle: "New member bonus",
        icon: Gift
      },
      {
        title: "Review Points",
        value: `${pointsSystem.earningPoints.reviewPoints} points`,
        subtitle: "Per review",
        icon: MessageSquare
      },
      {
        title: "Social Share",
        value: `${pointsSystem.earningPoints.socialSharePoints} points`,
        subtitle: "Per share",
        icon: Share2
      }
    ];

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
    );
  };

  const renderRedemptionOptions = () => {
    if (!pointsSystem) return null;

    const options = [
      {
        title: "Standard Redemption",
        description: `${pointsSystem.redeemingPoints.pointsPerDiscount} points = ${pointsSystem.redeemingPoints.discountValue}€ ${pointsSystem.redeemingPoints.discountType}`,
        icon: BadgePercent,
        color: "text-blue-500 bg-blue-50"
      },
      {
        title: "Sign-up Reward",
        description: `${pointsSystem.earningPoints.signUpBonus} points welcome bonus`,
        icon: Gift,
        color: "text-green-500 bg-green-50"
      },
      {
        title: "Review Bonus",
        description: `${pointsSystem.earningPoints.reviewPoints} points per review`,
        icon: MessageSquare,
        color: "text-purple-500 bg-purple-50"
      },
      {
        title: "Social Share",
        description: `${pointsSystem.earningPoints.socialSharePoints} points per share`,
        icon: Share2,
        color: "text-orange-500 bg-orange-50"
      }
    ];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Redemption Options</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure how members can redeem their points
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setConfigFormOpen(true)}
            >
              <BadgePercent className="h-4 w-4 mr-2" />
              Edit Options
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => (
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
    );
  };

  const renderBonusDays = () => {
    if (!pointsSystem) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bonus Days</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Special events with increased point earnings
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedBonusDay(null);
                setBonusDayFormOpen(true);
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Bonus Day
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pointsSystem.earningPoints.bonusDays.map((day) => (
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
                    <div className="flex items-center gap-2">
                      <Badge>{format(new Date(day.date), 'MMM dd, yyyy')}</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveBonusDay(day.name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

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
        <Button 
          variant="default" 
          style={{ backgroundColor: "#5FC4D0" }}
          onClick={() => setConfigFormOpen(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Points Stats */}
      {renderPointsStats()}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Redemption Options */}
        {renderRedemptionOptions()}

        {/* Bonus Days */}
        {renderBonusDays()}
      </div>

      {/* Configuration Form */}
      <PointsConfigForm
        open={configFormOpen}
        onClose={() => setConfigFormOpen(false)}
        onSubmit={handleUpdateConfig}
        initialData={program}
        title="Configure Points & Rewards"
      />

      {/* Bonus Day Form */}
      <BonusDayForm
        open={bonusDayFormOpen}
        onClose={() => {
          setBonusDayFormOpen(false);
          setSelectedBonusDay(null);
        }}
        onSubmit={handleAddBonusDay}
        initialData={selectedBonusDay || undefined}
      />

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

export default PointsRewardsContent;