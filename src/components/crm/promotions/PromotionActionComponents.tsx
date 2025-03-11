// src/components/crm/promotions/PromotionActionComponents.tsx
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
import { Promotion, Discount } from "@/app/api/external/omnigateway/types/promotions";

// Promotion Delete Modal
interface DeletePromotionModalProps {
  promotion: Promotion;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (promotion: Promotion) => Promise<void>;
  isDeleting?: boolean;
}

export const DeletePromotionModal: React.FC<DeletePromotionModalProps> = ({
  promotion,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(promotion);
      toast.success("Promotion deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Promotion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the promotion "{promotion.title}"? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete Promotion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Promotion Action Select
interface PromotionActionSelectProps {
  promotion: Promotion;
  onDeletePromotion: (promotion: Promotion) => Promise<void>;
  isDeleting?: boolean;
}

export const PromotionActionSelect: React.FC<PromotionActionSelectProps> = ({
  promotion,
  onDeletePromotion,
  isDeleting = false,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleDelete = async (promotion: Promotion) => {
    await onDeletePromotion(promotion);
  };

  // Watch for changes in the selected action
  useEffect(() => {
    if (selectedAction === "delete") {
      setIsDeleteModalOpen(true);
      // Reset the select after opening the modal
      setSelectedAction("");
    }
  }, [selectedAction]);

  return (
    <>
      <InputSelect
        name="promotionAction"
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "delete", label: "Delete Promotion" },
        ]}
      />

      <DeletePromotionModal
        promotion={promotion}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

// Discount Delete Modal
interface DeleteDiscountModalProps {
  discount: Discount;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discount: Discount) => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteDiscountModal: React.FC<DeleteDiscountModalProps> = ({
  discount,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(discount);
      toast.success("Discount deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting discount:", error);
      // Error is handled by the hook and displayed there
    }
  };

  // Get relevant discount information for the confirmation text
  const discountValue = discount.type === 'percentage' 
    ? `${discount.value}%` 
    : `$${discount.value.toFixed(2)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Discount
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {discount.type} discount of {discountValue}? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete Discount"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Discount Action Select
interface DiscountActionSelectProps {
  discount: Discount;
  onDeleteDiscount: (discount: Discount) => Promise<void>;
  isDeleting?: boolean;
}

export const DiscountActionSelect: React.FC<DiscountActionSelectProps> = ({
  discount,
  onDeleteDiscount,
  isDeleting = false,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleDelete = async (discount: Discount) => {
    await onDeleteDiscount(discount);
  };

  // Watch for changes in the selected action
  useEffect(() => {
    if (selectedAction === "delete") {
      setIsDeleteModalOpen(true);
      // Reset the select after opening the modal
      setSelectedAction("");
    }
  }, [selectedAction]);

  return (
    <>
      <InputSelect
        name="discountAction"
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "delete", label: "Delete Discount" },
        ]}
      />

      <DeleteDiscountModal
        discount={discount}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};