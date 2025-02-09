// components/benefits/TierBenefitForm.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, Plus, AlertCircle } from 'lucide-react';
import { LoyaltyProgram } from "@/app/api/external/omnigateway/types/loyalty-program";

interface TierBenefitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  selectedTier: string | null;
  loyaltyProgram: LoyaltyProgram | null;
}

interface FormErrors {
  name?: string;
  pointsMultiplier?: string;
  birthdayReward?: string;
  referralPoints?: string;
  spendRange?: string;
  perks?: string;
}

export function TierBenefitForm({
  open,
  onClose,
  onSubmit,
  selectedTier,
  loyaltyProgram
}: TierBenefitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    pointsMultiplier: 1,
    birthdayReward: 0,
    referralPoints: 0,
    spendRange: {
      min: 0,
      max: 0
    },
    perks: [''],
    description: '',
    requiredSpendPeriod: 30, // days
    isActive: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showOverlap, setShowOverlap] = useState(false);

  useEffect(() => {
    if (selectedTier && loyaltyProgram) {
      const tier = loyaltyProgram.membershipTiers.find(t => t.name === selectedTier);
      if (tier) {
        setFormData({
          name: tier.name,
          pointsMultiplier: tier.pointsMultiplier,
          birthdayReward: tier.birthdayReward,
          referralPoints: tier.referralPoints,
          spendRange: tier.spendRange,
          perks: tier.perks.length > 0 ? tier.perks : [''],
          description: tier.description || '',
          requiredSpendPeriod: tier.requiredSpendPeriod || 30,
          isActive: tier.isActive ?? true
        });
      }
    } else {
      resetForm();
    }
  }, [selectedTier, loyaltyProgram]);

  const resetForm = () => {
    setFormData({
      name: '',
      pointsMultiplier: 1,
      birthdayReward: 0,
      referralPoints: 0,
      spendRange: {
        min: 0,
        max: 0
      },
      perks: [''],
      description: '',
      requiredSpendPeriod: 30,
      isActive: true
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Tier name is required';
      isValid = false;
    }

    if (formData.pointsMultiplier < 1) {
      newErrors.pointsMultiplier = 'Points multiplier must be at least 1';
      isValid = false;
    }

    if (formData.birthdayReward < 0) {
      newErrors.birthdayReward = 'Birthday reward cannot be negative';
      isValid = false;
    }

    if (formData.referralPoints < 0) {
      newErrors.referralPoints = 'Referral points cannot be negative';
      isValid = false;
    }

    if (formData.spendRange.min >= formData.spendRange.max) {
      newErrors.spendRange = 'Maximum spend must be greater than minimum spend';
      isValid = false;
    }

    // Check for spend range overlap with other tiers
    if (loyaltyProgram && !selectedTier) {
      const hasOverlap = loyaltyProgram.membershipTiers.some(tier => {
        return (formData.spendRange.min <= tier.spendRange.max && 
                formData.spendRange.max >= tier.spendRange.min);
      });

      if (hasOverlap) {
        setShowOverlap(true);
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const addPerk = () => {
    setFormData(prev => ({
      ...prev,
      perks: [...prev.perks, '']
    }));
  };

  const removePerk = (index: number) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index)
    }));
  };

  const updatePerk = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.map((perk, i) => i === index ? value : perk)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const cleanedData = {
        ...formData,
        perks: formData.perks.filter(perk => perk.trim() !== '')
      };
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error('Error submitting tier benefit:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTier ? `Edit ${selectedTier} Tier Benefits` : 'Add New Tier Benefits'}
          </DialogTitle>
          <DialogDescription>
            Configure tier benefits and requirements
          </DialogDescription>
        </DialogHeader>

        {showOverlap && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Spend range overlaps with existing tiers. Please adjust the range.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!selectedTier && (
            <div className="space-y-2">
              <Label htmlFor="name">Tier Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Enter tier name"
                className={errors.name ? 'border-red-500' : ''}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Enter tier description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pointsMultiplier">Points Multiplier</Label>
              <Input
                id="pointsMultiplier"
                type="number"
                step="0.1"
                min="1"
                value={formData.pointsMultiplier}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pointsMultiplier: parseFloat(e.target.value)
                }))}
                className={errors.pointsMultiplier ? 'border-red-500' : ''}
                required
              />
              {errors.pointsMultiplier && (
                <p className="text-sm text-red-500">{errors.pointsMultiplier}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdayReward">Birthday Reward (€)</Label>
              <Input
                id="birthdayReward"
                type="number"
                min="0"
                value={formData.birthdayReward}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  birthdayReward: parseInt(e.target.value)
                }))}
                className={errors.birthdayReward ? 'border-red-500' : ''}
                required
              />
              {errors.birthdayReward && (
                <p className="text-sm text-red-500">{errors.birthdayReward}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSpend">Minimum Spend (€)</Label>
              <Input
                id="minSpend"
                type="number"
                min="0"
                value={formData.spendRange.min}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spendRange: {
                    ...prev.spendRange,
                    min: parseInt(e.target.value)
                  }
                }))}
                className={errors.spendRange ? 'border-red-500' : ''}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSpend">Maximum Spend (€)</Label>
              <Input
                id="maxSpend"
                type="number"
                min="0"
                value={formData.spendRange.max}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  spendRange: {
                    ...prev.spendRange,
                    max: parseInt(e.target.value)
                  }
                }))}
                className={errors.spendRange ? 'border-red-500' : ''}
                required
              />
            </div>
          </div>

          {errors.spendRange && (
            <p className="text-sm text-red-500 -mt-2">{errors.spendRange}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="referralPoints">Referral Points</Label>
            <Input
              id="referralPoints"
              type="number"
              min="0"
              value={formData.referralPoints}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                referralPoints: parseInt(e.target.value)
              }))}
              className={errors.referralPoints ? 'border-red-500' : ''}
              required
            />
            {errors.referralPoints && (
              <p className="text-sm text-red-500">{errors.referralPoints}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Perks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPerk}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Perk
              </Button>
            </div>
            <div className="space-y-2">
              {formData.perks.map((perk, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={perk}
                    onChange={(e) => updatePerk(index, e.target.value)}
                    placeholder="Enter perk description"
                  />
                  {formData.perks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePerk(index)}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedTier ? 'Update' : 'Create'} Tier Benefits
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}