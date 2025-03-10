// src/components/guests/DeleteGuestComponents.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Trash, AlertTriangle } from "lucide-react";
import { Guest } from "@/app/api/external/omnigateway/types/guests";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface DeleteGuestModalProps {
  guest: Guest;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: { forceDelete: boolean; deleteUser: boolean }) => Promise<void>;
}

export const DeleteGuestModal: React.FC<DeleteGuestModalProps> = ({
  guest,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [forceDelete, setForceDelete] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm({ forceDelete, deleteUser });
      toast.success("Guest deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Failed to delete guest");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Guest
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {guest.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="forceDelete"
              checked={forceDelete}
              onCheckedChange={(checked) => setForceDelete(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="forceDelete"
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Force delete guest with associated bookings
              </Label>
              <p className="text-sm text-muted-foreground">
                This will also delete all bookings associated with this guest
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="deleteUser"
              checked={deleteUser}
              onCheckedChange={(checked) => setDeleteUser(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="deleteUser"
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Delete associated user account
              </Label>
              <p className="text-sm text-muted-foreground">
                If this guest has a user account, it will also be deleted
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Guest"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface GuestActionMenuProps {
  guest: Guest;
  onDeleteGuest: (guest: Guest, options: { forceDelete: boolean; deleteUser: boolean }) => Promise<void>;
}

export const GuestActionMenu: React.FC<GuestActionMenuProps> = ({
  guest,
  onDeleteGuest,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async (options: { forceDelete: boolean; deleteUser: boolean }) => {
    await onDeleteGuest(guest, options);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Guest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteGuestModal
        guest={guest}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};