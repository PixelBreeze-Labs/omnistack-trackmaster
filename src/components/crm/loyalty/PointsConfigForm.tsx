// components/points/PointsConfigForm.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoyaltyProgram } from '@/app/api/external/omnigateway/types/loyalty-program';
import { UpdatePointsSystemDto } from '@/app/api/external/omnigateway/types/points-system';

interface PointsConfigFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePointsSystemDto) => Promise<void>;
  initialData?: LoyaltyProgram;
  title: string;
}

export function PointsConfigForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title
}: PointsConfigFormProps) {
  const [formData, setFormData] = useState({
    earningPoints: {
      spend: initialData?.pointsSystem?.earningPoints?.spend || 1,
      signUpBonus: initialData?.pointsSystem?.earningPoints?.signUpBonus || 50,
      reviewPoints: initialData?.pointsSystem?.earningPoints?.reviewPoints || 10,
      socialSharePoints: initialData?.pointsSystem?.earningPoints?.socialSharePoints || 5
    },
    redeemingPoints: {
      pointsPerDiscount: initialData?.pointsSystem?.redeemingPoints?.pointsPerDiscount || 100,
      discountValue: initialData?.pointsSystem?.redeemingPoints?.discountValue || 5,
      discountType: initialData?.pointsSystem?.redeemingPoints?.discountType || 'fixed'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Earning Points Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Earning Points</h3>
            
            <div className="space-y-2">
              <Label>Points per Spend (€)</Label>
              <Input
                type="number"
                value={formData.earningPoints.spend}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  earningPoints: {
                    ...prev.earningPoints,
                    spend: parseInt(e.target.value)
                  }
                }))}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Sign-up Bonus</Label>
              <Input
                type="number"
                value={formData.earningPoints.signUpBonus}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  earningPoints: {
                    ...prev.earningPoints,
                    signUpBonus: parseInt(e.target.value)
                  }
                }))}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Review Points</Label>
              <Input
                type="number"
                value={formData.earningPoints.reviewPoints}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  earningPoints: {
                    ...prev.earningPoints,
                    reviewPoints: parseInt(e.target.value)
                  }
                }))}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Social Share Points</Label>
              <Input
                type="number"
                value={formData.earningPoints.socialSharePoints}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  earningPoints: {
                    ...prev.earningPoints,
                    socialSharePoints: parseInt(e.target.value)
                  }
                }))}
                min="0"
                required
              />
            </div>
          </div>

          {/* Redeeming Points Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Redeeming Points</h3>
            
            <div className="space-y-2">
              <Label>Points per Discount</Label>
              <Input
                type="number"
                value={formData.redeemingPoints.pointsPerDiscount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  redeemingPoints: {
                    ...prev.redeemingPoints,
                    pointsPerDiscount: parseInt(e.target.value)
                  }
                }))}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={formData.redeemingPoints.discountValue}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  redeemingPoints: {
                    ...prev.redeemingPoints,
                    discountValue: parseInt(e.target.value)
                  }
                }))}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={formData.redeemingPoints.discountType}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  redeemingPoints: {
                    ...prev.redeemingPoints,
                    discountType: value as 'fixed' | 'percentage'
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}