import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FlagStatus, FlagReason } from "@/app/api/external/omnigateway/types/admin-reports";
import { 
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UpdateFlagStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: FlagStatus) => Promise<boolean>;
  currentStatus: FlagStatus;
  flagReason: FlagReason;
  flagComment?: string;
}

export function UpdateFlagStatusDialog({
  open,
  onClose,
  onStatusChange,
  currentStatus,
  flagReason,
  flagComment,
}: UpdateFlagStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<FlagStatus>(currentStatus);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset selected status when the dialog opens with a new currentStatus
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus, open]);

  const handleStatusChange = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsProcessing(true);
    
    const success = await onStatusChange(selectedStatus);
    setIsProcessing(false);
    
    // Dialog will be closed by the parent component if successful
  };

  const getStatusIcon = (status: FlagStatus) => {
    switch (status) {
      case FlagStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case FlagStatus.REVIEWED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case FlagStatus.DISMISSED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusDescription = (status: FlagStatus) => {
    switch (status) {
      case FlagStatus.PENDING:
        return "Flag is awaiting review by an administrator";
      case FlagStatus.REVIEWED:
        return "Flag has been reviewed and action has been taken";
      case FlagStatus.DISMISSED:
        return "Flag has been dismissed as irrelevant or inappropriate";
      default:
        return "";
    }
  };

  const getReasonDisplay = (reason: FlagReason) => {
    // Convert enum values to user-friendly display names
    const displayMap = {
      [FlagReason.INAPPROPRIATE]: "Inappropriate Content",
      [FlagReason.SPAM]: "Spam",
      [FlagReason.MISINFORMATION]: "Misinformation",
      [FlagReason.DUPLICATE]: "Duplicate Content",
      [FlagReason.OTHER]: "Other Reason"
    };
    
    return displayMap[reason] || reason;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Flag Status</DialogTitle>
          <DialogDescription>
            Process this flag to mark it as reviewed or dismissed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-slate-50 p-4 text-sm mb-4">
            <div className="mb-2">
              <span className="font-medium">Reason:</span>{" "}
              <span className="text-slate-800">{getReasonDisplay(flagReason)}</span>
            </div>
            {flagComment && (
              <div>
                <span className="font-medium">Comment:</span>
                <p className="mt-1 text-slate-700">{flagComment}</p>
              </div>
            )}
          </div>

          <RadioGroup
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as FlagStatus)}
            className="space-y-4"
          >
            {Object.values(FlagStatus).map((status) => (
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
                      <span className="font-medium ml-2">
                        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
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

export default UpdateFlagStatusDialog;