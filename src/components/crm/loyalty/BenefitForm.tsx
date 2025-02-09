// components/benefits/BenefitForm.tsx
import { useState, useEffect } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Benefit } from '@/hooks/useBenefits';
import { LoyaltyProgram } from "@/app/api/external/omnigateway/types/loyalty-program";
import InputSelect from '@/components/Common/InputSelect';

interface BenefitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<Benefit>;
  title: string;
  loyaltyProgram?: LoyaltyProgram | null;
}

export function BenefitForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
  loyaltyProgram
}: BenefitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'DISCOUNT' as Benefit['type'],
    value: 0,
    applicableTiers: [] as string[],
    minSpend: 0,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        type: initialData.type || 'DISCOUNT',
        value: initialData.value || 0,
        applicableTiers: initialData.applicableTiers || [],
        minSpend: initialData.minSpend || 0,
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'DISCOUNT',
        value: 0,
        applicableTiers: [],
        minSpend: 0,
        isActive: true
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }

    if (formData.type === 'DISCOUNT' && formData.value > 100) {
      newErrors.value = 'Discount cannot be greater than 100%';
    }

    if (formData.minSpend < 0) {
      newErrors.minSpend = 'Minimum spend cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting benefit:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="Enter benefit name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Enter benefit description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
                            <InputSelect
                name="type"
                label=""  // If you need a label, add it here
                value={formData.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value as Benefit['type']
                }))}
                options={[
                  { value: 'DISCOUNT', label: 'Discount' },
                  { value: 'CASHBACK', label: 'Cashback' },
                  { value: 'POINTS', label: 'Points' },
                  { value: 'FREE_SHIPPING', label: 'Free Shipping' }
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                {formData.type === 'DISCOUNT' ? 'Discount %' : 'Value'}
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  value: parseFloat(e.target.value)
                }))}
                placeholder="Enter value"
                className={errors.value ? 'border-red-500' : ''}
                min={0}
                max={formData.type === 'DISCOUNT' ? 100 : undefined}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minSpend">Minimum Spend (€)</Label>
            <Input
              id="minSpend"
              type="number"
              value={formData.minSpend}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                minSpend: parseFloat(e.target.value)
              }))}
              placeholder="Enter minimum spend"
              className={errors.minSpend ? 'border-red-500' : ''}
              min={0}
            />
            {errors.minSpend && <p className="text-sm text-red-500">{errors.minSpend}</p>}
          </div>

          {loyaltyProgram && loyaltyProgram.membershipTiers.length > 0 && (
            <div className="space-y-2">
              <Label>Applicable Tiers</Label>
              <div className="grid grid-cols-2 gap-2">
                {loyaltyProgram.membershipTiers.map((tier) => (
                  <div key={tier.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tier-${tier.name}`}
                      checked={formData.applicableTiers.includes(tier.name)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          applicableTiers: checked
                            ? [...prev.applicableTiers, tier.name]
                            : prev.applicableTiers.filter(t => t !== tier.name)
                        }));
                      }}
                    />
                    <Label htmlFor={`tier-${tier.name}`}>{tier.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => {
                setFormData(prev => ({
                  ...prev,
                  isActive: !!checked
                }));
              }}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Create'} Benefit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}