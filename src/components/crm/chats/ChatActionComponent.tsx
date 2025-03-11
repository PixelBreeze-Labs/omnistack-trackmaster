// src/components/crm/chats/ChatActionComponent.tsx
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
import { Chat } from "@/app/api/external/omnigateway/types/chats";

interface DeleteChatModalProps {
  chat: Chat;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (chat: Chat) => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  chat,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(chat);
      toast.success("Chat deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting chat:", error);
      // Error is handled by the hook and displayed there
    }
  };

  // Get relevant chat data to display in confirmation
  const userName = chat.endUserName || "this user";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Chat
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the chat with {userName}? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ChatActionSelectProps {
  chat: Chat;
  onDeleteChat: (chat: Chat) => Promise<void>;
  isDeleting?: boolean;
}

export const ChatActionSelect: React.FC<ChatActionSelectProps> = ({
  chat,
  onDeleteChat,
  isDeleting = false,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleDelete = async (chat: Chat) => {
    await onDeleteChat(chat);
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
        name="chatAction"
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "manage", label: "Manage in VenueBoost" },
          { value: "delete", label: "Delete Chat" },
        ]}
      />

      <DeleteChatModal
        chat={chat}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};