// components/points/BonusDayForm.tsx
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BonusDayDto } from '@/app/api/external/omnigateway/types/points-system';

interface BonusDayFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BonusDayDto) => Promise<void>;
  initialData?: {
    name: string;
    date: Date;
    multiplier: number;
  };
  title?: string;
}

export function BonusDayForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Add Bonus Day"
}: BonusDayFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date: initialData?.date || new Date(),
    multiplier: initialData?.multiplier || 2
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        name: formData.name,
        date: formData.date.toISOString(),
        multiplier: formData.multiplier
      });
      onClose();
    } catch (error) {
      console.error('Error submitting bonus day:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="e.g., Black Friday"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="multiplier">Points Multiplier</Label>
            <Input
              id="multiplier"
              type="number"
              step="0.1"
              min="1.1"
              value={formData.multiplier}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                multiplier: parseFloat(e.target.value)
              }))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Bonus Day
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}