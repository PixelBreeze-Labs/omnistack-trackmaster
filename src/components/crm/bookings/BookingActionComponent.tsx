// src/components/crm/bookings/BookingActionComponent.tsx
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
import { Booking } from "@/app/api/external/omnigateway/types/bookings";

interface DeleteBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: Booking) => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteBookingModal: React.FC<DeleteBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(booking);
      toast.success("Booking deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting booking:", error);
      // Error is handled by the hook and displayed there
    }
  };

  // Get relevant booking data to display in confirmation
  const propertyName = booking.metadata?.propertyName || "this property";
  const guestName = booking.metadata?.guestName || "this guest";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete booking {booking.confirmationCode} for {guestName} at {propertyName}? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface BookingActionSelectProps {
  booking: Booking;
  onDeleteBooking: (booking: Booking) => Promise<void>;
  isDeleting?: boolean;
}

export const BookingActionSelect: React.FC<BookingActionSelectProps> = ({
  booking,
  onDeleteBooking,
  isDeleting = false,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleDelete = async (booking: Booking) => {
    await onDeleteBooking(booking);
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
        name="bookingAction"
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "manage", label: "Manage in VenueBoost" },
          { value: "delete", label: "Delete Booking" },
        ]}
      />

      <DeleteBookingModal
        booking={booking}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};