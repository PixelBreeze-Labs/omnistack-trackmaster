// components/staff/connect-store-modal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "sonner";
import { useStores } from "@/hooks/useStores";
import { Store } from "@/app/api/external/omnigateway/types/stores";

interface ConnectStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  originalstaffId: string;
  staffId: string;
  staffName: string;
  connectedStores: Store[];
}

export function ConnectStoreModal({ isOpen, onClose, onSuccess, originalstaffId, staffId, staffName, connectedStores }: ConnectStoreModalProps) {
  const [selectedStore, setSelectedStore] = useState('');
  const {  connectUser, isLoading } = useStores();


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) {
        toast.error('Please select a store');
        return;
    }

    try {
        await connectUser(selectedStore, staffId, originalstaffId);
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
                ...(connectedStores || []).map(store => ({
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