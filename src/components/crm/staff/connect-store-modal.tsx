// components/staff/connect-store-modal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "sonner";
import { useVenueBoost } from '@/hooks/useVenueBoost';

interface ConnectStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffId: string;
  staffName: string;
}

export function ConnectStoreModal({ isOpen, onClose, onSuccess, staffId, staffName }: ConnectStoreModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');
  const { listStores, isLoading: isLoadingStores, stores } = useVenueBoost();

  useEffect(() => {
    if (isOpen) {
      listStores().catch(console.error);
    }
  }, [isOpen, listStores]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) {
      toast.error('Please select a store');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/staff/connect-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          storeId: selectedStore
        })
      });

      if (!response.ok) throw new Error('Failed to connect store');

      toast.success('Store connected successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to connect store');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Store to {staffName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <InputSelect
              name="store"
              label="Select Store"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              options={[
                { value: "", label: "Select a store" },
                ...(stores || []).map(store => ({
                  value: store.id,
                  label: store.name
                }))
              ]}
              disabled={isLoadingStores}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedStore}>
              {isLoading ? "Connecting..." : "Connect Store"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}