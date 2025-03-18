// components/crm/reports/ReportStatusDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReportStatus } from "@/app/api/external/omnigateway/types/admin-reports";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  CheckCheck,
  FileLock,
  FileQuestion
} from "lucide-react";

interface ReportStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  currentStatus: string;
}

export function ReportStatusDialog({ 
  open, 
  onClose, 
  onStatusChange,
  currentStatus
}: ReportStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusChange = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }
    
    setIsProcessing(true);
    await onStatusChange(selectedStatus);
    setIsProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case ReportStatus.PENDING_REVIEW:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case ReportStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case ReportStatus.ACTIVE:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case ReportStatus.IN_PROGRESS:
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case ReportStatus.RESOLVED:
        return <CheckCheck className="h-4 w-4 text-green-600" />;
      case ReportStatus.CLOSED:
        return <FileLock className="h-4 w-4 text-gray-600" />;
      case ReportStatus.NO_RESOLUTION:
        return <FileQuestion className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch(status) {
      case ReportStatus.PENDING_REVIEW:
        return "Report is awaiting review by an administrator";
      case ReportStatus.REJECTED:
        return "Report has been rejected and will not be processed";
      case ReportStatus.ACTIVE:
        return "Report has been accepted and is now publicly visible";
      case ReportStatus.IN_PROGRESS:
        return "Report is currently being addressed";
      case ReportStatus.RESOLVED:
        return "Issue reported has been resolved";
      case ReportStatus.CLOSED:
        return "Report has been closed and cannot be modified";
      case ReportStatus.NO_RESOLUTION:
        return "Cannot be resolved but information is acknowledged";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Report Status</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={selectedStatus} 
            onValueChange={setSelectedStatus}
            className="space-y-4"
          >
            {Object.values(ReportStatus).map((status) => (
              <div
                key={status}
                className={`border rounded-md p-4 transition-colors
                ${selectedStatus === status ? 'border-primary bg-primary/5' : 'border-muted'}`}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={status} id={status} className="mt-1" />
                  <div className="ml-3 flex-1">
                    <Label htmlFor={status} className="flex items-center cursor-pointer">
                      {getStatusIcon(status)}
                      <span className="font-medium ml-2">{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2 ml-6">
                      {getStatusDescription(status)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
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
            onClick={handleStatusChange}
            disabled={isProcessing || selectedStatus === currentStatus}
          >
            {isProcessing ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}