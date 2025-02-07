// components/staff/connect-store-modal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "sonner";
import { useStores } from "@/hooks/useStores";

interface ConnectStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffId: string;
  staffName: string;
}

export function ConnectStoreModal({ isOpen, onClose, onSuccess, staffId, staffName }: ConnectStoreModalProps) {
  const [selectedStore, setSelectedStore] = useState('');
  const { listConnectedStores, connectUser, isLoading, stores } = useStores();

  useEffect(() => {
    if (isOpen) {
        listConnectedStores().catch(console.error);
    }
}, [isOpen, listConnectedStores]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) {
        toast.error('Please select a store');
        return;
    }

    try {
        await connectUser(selectedStore, staffId);
        onSuccess();
        onClose();
    } catch (error) {
        console.error(error);
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
              disabled={isLoading}
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