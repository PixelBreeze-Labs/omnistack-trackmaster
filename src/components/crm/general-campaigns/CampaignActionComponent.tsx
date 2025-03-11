// src/components/crm/campaigns/CampaignActionComponent.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import InputSelect from "@/components/Common/InputSelect";
import { Campaign } from "@/app/api/external/omnigateway/types/campaigns";

interface DeleteCampaignModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (campaign: Campaign) => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteCampaignModal: React.FC<DeleteCampaignModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(campaign);
      toast.success("Campaign deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Campaign
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the campaign "{campaign.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CampaignActionSelectProps {
  campaign: Campaign;
  onDeleteCampaign: (campaign: Campaign) => Promise<void>;
  isDeleting?: boolean;
}

export const CampaignActionSelect: React.FC<CampaignActionSelectProps> = ({
  campaign,
  onDeleteCampaign,
  isDeleting = false,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleDelete = async (campaign: Campaign) => {
    await onDeleteCampaign(campaign);
  };

  const handleManageInVenueBoost = () => {
    window.open('https://admin.venueboost.io', '_blank');
  };

  // Watch for changes in the selected action
  useEffect(() => {
    if (selectedAction === "delete") {
      setIsDeleteModalOpen(true);
      setSelectedAction("");
    } else if (selectedAction === "manage") {
      handleManageInVenueBoost();
      setSelectedAction("");
    }
  }, [selectedAction]);

  return (
    <>
      <InputSelect
        name="campaignAction"
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "manage", label: "Manage in VenueBoost" },
          { value: "delete", label: "Delete Campaign" },
        ]}
      />

      <DeleteCampaignModal
        campaign={campaign}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};