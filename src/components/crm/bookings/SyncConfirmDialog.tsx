import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCcw } from "lucide-react";

interface SyncConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSyncing: boolean;
}

export function SyncConfirmDialog({ open, onClose, onConfirm, isSyncing }: SyncConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sync Bookings from VenueBoost</DialogTitle>
          <DialogDescription>
            This will synchronize all your bookings from VenueBoost.
            New bookings will be added and existing ones will be updated.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 flex items-start gap-3">
            <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Sync will:</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Import new bookings from VenueBoost</li>
                <li>Update booking status and details for existing reservations</li>
                <li>Link bookings to the corresponding properties and guests</li>
                <li>Keep all your existing booking data</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSyncing}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={onConfirm}
            disabled={isSyncing}
            className="bg-primary"
          >
            {isSyncing ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Sync Bookings
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}