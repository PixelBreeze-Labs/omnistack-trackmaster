import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(currentDate));
  const [isProcessing, setIsProcessing] = useState(false);
  const [hour, setHour] = useState<string>(format(new Date(currentDate), "HH"));
  const [minute, setMinute] = useState<string>(format(new Date(currentDate), "mm"));

  const handleDateChange = async () => {
    // Compare if dates are different before submitting
    const formattedCurrentDate = format(new Date(currentDate), "yyyy-MM-dd HH:mm");
    const formattedSelectedDate = format(
      new Date(
        selectedDate.setHours(parseInt(hour), parseInt(minute))
      ), 
      "yyyy-MM-dd HH:mm"
    );
    
    if (formattedCurrentDate === formattedSelectedDate) {
      onClose();
      return;
    }
    
    setIsProcessing(true);
    
    // Create date with selected hour and minute
    const dateToSubmit = new Date(selectedDate);
    dateToSubmit.setHours(parseInt(hour), parseInt(minute));
    
    const success = await onDateChange(dateToSubmit);
    setIsProcessing(false);
    if (success) {
      onClose();
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
            <Label>New Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            disabled={isProcessing}
          >
            {isProcessing ? "Updating..." : "Update Date"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}