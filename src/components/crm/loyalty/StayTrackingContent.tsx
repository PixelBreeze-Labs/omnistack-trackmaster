// src/components/loyalty/StayTrackingContent.tsx
"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bed,
  CalendarClock,
  Settings,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';
import { useSession } from "next-auth/react";

export function StayTrackingContent() {
  const { data: session } = useSession();
  const {
    isLoading,
    program,
    error,
    fetchProgram,
    updateProgram
  } = useLoyaltyProgram();

  const [stayTracking, setStayTracking] = useState({
    evaluationPeriod: {
      upgrade: 12,
      downgrade: 6
    },
    stayDefinition: {
      minimumNights: 1,
      checkoutRequired: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  useEffect(() => {
    if (program?.stayTracking) {
      setStayTracking(program.stayTracking);
    }
  }, [program]);

  const handleChange = (section, field, value) => {
    setStayTracking(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!program) return;
      
      await updateProgram({
        ...program,
        stayTracking
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating stay tracking settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stay Tracking</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Configure settings for how stays are tracked and tier upgrades are calculated
          </p>
        </div>
        <Button 
          variant="default" 
          onClick={handleSave}
          disabled={!hasChanges}
          style={{ backgroundColor: "#5FC4D0" }}
        >
          <Settings className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Evaluation Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Evaluation Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upgrade-period">Tier Upgrade Period (months)</Label>
              <Input 
                id="upgrade-period"
                type="number" 
                value={stayTracking.evaluationPeriod.upgrade}
                onChange={(e) => handleChange('evaluationPeriod', 'upgrade', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Number of months to evaluate guest stays for tier upgrades
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="downgrade-period">Tier Downgrade Period (months)</Label>
              <Input 
                id="downgrade-period"
                type="number" 
                value={stayTracking.evaluationPeriod.downgrade}
                onChange={(e) => handleChange('evaluationPeriod', 'downgrade', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Number of months of inactivity before downgrading a tier
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stay Definition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Stay Definition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-nights">Minimum Nights</Label>
              <Input 
                id="min-nights"
                type="number" 
                value={stayTracking.stayDefinition.minimumNights}
                onChange={(e) => handleChange('stayDefinition', 'minimumNights', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Minimum nights required for a booking to count as a stay
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Switch 
                id="checkout-required" 
                checked={stayTracking.stayDefinition.checkoutRequired}
                onCheckedChange={(checked) => handleChange('stayDefinition', 'checkoutRequired', checked)}
              />
              <Label htmlFor="checkout-required">Require checkout for stay credit</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, guests must complete their stay to receive loyalty credit
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StayTrackingContent;