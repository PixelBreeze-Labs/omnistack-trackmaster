import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Poll } from "@/app/api/external/omnigateway/types/polls";

interface DeletePollModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (poll: Poll) => Promise<void>;
  isDeleting: boolean;
}

const DeletePollModal: React.FC<DeletePollModalProps> = ({
  poll,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}) => {
  if (!poll) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      await onConfirm(poll);
      onClose();
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash className="h-5 w-5 text-destructive" />
            Delete Poll
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this poll? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-md">
              <h3 className="font-medium">{poll.title}</h3>
              {poll.description && (
                <p className="text-sm text-muted-foreground mt-1">{poll.description}</p>
              )}
              <div className="text-sm mt-2">
                <span className="font-medium">{poll.options.length}</span> options · 
                <span className="font-medium ml-1">{totalVotes}</span> votes
              </div>
            </div>
            
            {poll.wordpressId && (
              <div className="text-sm text-amber-600">
                <p className="font-medium">Warning:</p>
                <p>This poll is connected to WordPress (ID: {poll.wordpressId}). Deleting it may affect your website content.</p>
              </div>
            )}
            
            {totalVotes > 0 && (
              <div className="text-sm text-amber-600">
                <p className="font-medium">Warning:</p>
                <p>This poll has {totalVotes} votes. All voting data will be permanently lost.</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Poll"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePollModal;