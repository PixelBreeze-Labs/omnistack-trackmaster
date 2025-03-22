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
import { CommentStatus } from "@/app/api/external/omnigateway/types/admin-reports";
import { 
  Check,
  X,
  AlertCircle
} from "lucide-react";

interface UpdateCommentStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: CommentStatus) => Promise<boolean>;
  currentStatus: CommentStatus;
  commentContent: string;
}

export function UpdateCommentStatusDialog({
  open,
  onClose,
  onStatusChange,
  currentStatus,
  commentContent,
}: UpdateCommentStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<CommentStatus>(currentStatus);
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

  const getStatusIcon = (status: CommentStatus) => {
    switch (status) {
      case CommentStatus.PENDING_REVIEW:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case CommentStatus.APPROVED:
        return <Check className="h-4 w-4 text-green-600" />;
      case CommentStatus.REJECTED:
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusDescription = (status: CommentStatus) => {
    switch (status) {
      case CommentStatus.PENDING_REVIEW:
        return "Comment is awaiting review by an administrator";
      case CommentStatus.APPROVED:
        return "Comment has been approved and is publicly visible";
      case CommentStatus.REJECTED:
        return "Comment has been rejected and is not publicly visible";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Comment Status</DialogTitle>
          <DialogDescription>
            Change the status of this comment to control its visibility.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-slate-50 p-4 text-sm mb-4">
            <p className="line-clamp-3">{commentContent}</p>
          </div>

          <RadioGroup
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as CommentStatus)}
            className="space-y-4"
          >
            {Object.values(CommentStatus).map((status) => (
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

export default UpdateCommentStatusDialog;