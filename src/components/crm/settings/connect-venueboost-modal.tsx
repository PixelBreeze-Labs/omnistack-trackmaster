// components/admin/settings/modals/connect-venueboost-modal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVenueBoost } from '@/hooks/useVenueBoost';
import { useSettings } from '@/hooks/useSettings';
import { toast } from "sonner";

interface ConnectVenueBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: any;
}

export function ConnectVenueBoostModal({ 
  isOpen, 
  onClose, 
  currentSettings 
}: ConnectVenueBoostModalProps) {
  const { connectVenueBoost } = useVenueBoost();
  const { updateSettings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [venueShortCode, setVenueShortCode] = useState(
    currentSettings?.venueShortCode || ''
  );

  const handleConnect = async () => {
    if (!venueShortCode) {
      toast.error('Please enter a venue short code');
      return;
    }

    setIsLoading(true);
    try {
      // First connect to VenueBoost
      await connectVenueBoost(venueShortCode);

      // Then update local settings
      await updateSettings({
        integrations: {
          venueBoost: {
            enabled: true,
            venueShortCode,
            connectedAt: new Date().toISOString()
          }
        }
      });

      toast.success('Connected to VenueBoost successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to connect to VenueBoost');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentSettings?.enabled ? 'Configure VenueBoost' : 'Connect to VenueBoost'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Venue Short Code</label>
            <Input
              value={venueShortCode}
              onChange={(e) => setVenueShortCode(e.target.value)}
              placeholder="Enter venue short code"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Enter your VenueBoost venue short code to connect
            </p>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConnect} 
                disabled={isLoading || !venueShortCode}
              >
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}