import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ReportDateDialogProps {
  open: boolean;
  onClose: () => void;
  onDateChange: (date: Date) => Promise<boolean>;
  currentDate: string;
}

export function ReportDateDialog({ 
  open, 
  onClose, 
  onDateChange,
  currentDate
}: ReportDateDialogProps) {
  // Format date for the input field (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    formatDateForInput(new Date(currentDate))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [hour, setHour] = useState<string>(format(new Date(currentDate), "HH"));
  const [minute, setMinute] = useState<string>(format(new Date(currentDate), "mm"));

  const handleDateChange = async () => {
    try {
      // Parse the date string from the input
      const [year, month, day] = selectedDateStr.split("-").map(num => parseInt(num));
      // Create new date (months are 0-indexed in JS Date)
      const dateToSubmit = new Date(year, month - 1, day);
      
      // Add hours and minutes
      dateToSubmit.setHours(parseInt(hour), parseInt(minute));
      
      // Compare if dates are different
      const currentDateObj = new Date(currentDate);
      if (dateToSubmit.getTime() === currentDateObj.getTime()) {
        onClose();
        return;
      }
      
      setIsProcessing(true);
      const success = await onDateChange(dateToSubmit);
      setIsProcessing(false);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error processing date:", error);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Publication Date</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Date</Label>
            <div className="p-2 border rounded bg-muted/20">
              {format(new Date(currentDate), "PPP 'at' p")}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-input">New Date</Label>
            <Input
              id="date-input"
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hour</Label>
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                      {h.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Minute</Label>
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <SelectItem key={m} value={m.toString().padStart(2, "0")}>
                      {m.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDateChange}
            disabled={isProcessing || !selectedDateStr}
          >
            {isProcessing ? "Updating..." : "Update Date"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}