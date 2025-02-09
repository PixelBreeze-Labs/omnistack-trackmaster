"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Crown,
  Plus,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLoyaltyProgram } from "@/hooks/useLoyaltyProgram";
import { ProgramPreview } from "./loyalty-program-preview";
import { toast } from "react-hot-toast";
import { MembershipTier } from "@/app/api/external/omnigateway/types/loyalty-program";

export function ProgramContent() {
  const { 
    isLoading, 
    program, 
    fetchProgram, 
    updateProgram 
  } = useLoyaltyProgram();

  const [localProgram, setLocalProgram] = useState(program);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  useEffect(() => {
    if (program) {
      setLocalProgram(program);
    }
  }, [program]);

  const handleInputChange = (field: string, value: string) => {
    setLocalProgram(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
    setHasChanges(true);
  };

  const handleTierChange = (index: number, field: string, value: any) => {
    setLocalProgram(prev => {
      if (!prev) return prev;
      const newTiers = [...prev.membershipTiers];
      newTiers[index] = {
        ...newTiers[index],
        [field]: value
      };
      return {
        ...prev,
        membershipTiers: newTiers
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!localProgram) return;
      await updateProgram(localProgram);
      setHasChanges(false);
      toast.success('Program updated successfully');
    } catch (error) {
      toast.error('Failed to update program');
    }
  };

  const addNewTier = () => {
    if (!localProgram) return;
    
    const newTier: MembershipTier = {
      name: "New Tier",
      spendRange: { min: 0, max: 999 },
      pointsMultiplier: 1,
      birthdayReward: 5,
      perks: [],
      referralPoints: 5
    };

    setLocalProgram(prev => ({
      ...prev!,
      membershipTiers: [...prev!.membershipTiers, newTier]
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!localProgram) return null;

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
          <Button 
            variant="outline"
            onClick={() => setPreviewOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Preview Program
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
          >
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
                value={localProgram.programName}
                onChange={(e) => handleInputChange('programName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input 
                placeholder="EUR" 
                value={localProgram.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Tiers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membership Tiers</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={addNewTier}
          >
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
              {localProgram.membershipTiers.map((tier, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={tier.name}
                      onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Input 
                        type="number"
                        value={tier.spendRange.min}
                        onChange={(e) => handleTierChange(index, 'spendRange', {
                          ...tier.spendRange,
                          min: parseInt(e.target.value)
                        })}
                      />
                     <span>-</span>
                      <Input 
                        type="number"
                        value={tier.spendRange.max}
                        onChange={(e) => handleTierChange(index, 'spendRange', {
                          ...tier.spendRange,
                          max: parseInt(e.target.value)
                        })}
                      />
                      <span>{localProgram.currency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input 
                        type="number"
                        value={tier.pointsMultiplier}
                        onChange={(e) => handleTierChange(index, 'pointsMultiplier', parseFloat(e.target.value))}
                      />
                      <span>x</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input 
                        type="number"
                        value={tier.birthdayReward}
                        onChange={(e) => handleTierChange(index, 'birthdayReward', parseInt(e.target.value))}
                      />
                      <span>{localProgram.currency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input 
                        type="number"
                        value={tier.referralPoints}
                        onChange={(e) => handleTierChange(index, 'referralPoints', parseInt(e.target.value))}
                      />
                      <span>points</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={tier.perks.join(', ')}
                      onChange={(e) => handleTierChange(index, 'perks', e.target.value.split(',').map(p => p.trim()).filter(Boolean))}
                      placeholder="Comma-separated perks"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        const newTiers = localProgram.membershipTiers.filter((_, i) => i !== index);
                        setLocalProgram(prev => ({
                          ...prev!,
                          membershipTiers: newTiers
                        }));
                        setHasChanges(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {localProgram && (
        <ProgramPreview 
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          program={localProgram}
        />
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );

}

export default ProgramContent;