// components/support/tickets/QuickMessageDialog.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  User,
  Building2
} from "lucide-react";
import { Ticket, AddMessageDto } from "@/app/api/external/omnigateway/types/tickets";

interface QuickMessageDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  onSendMessage: (ticketId: string, message: AddMessageDto) => Promise<void>;
  isLoading?: boolean;
}

export function QuickMessageDialog({
  ticket,
  open,
  onClose,
  onSendMessage,
  isLoading = false
}: QuickMessageDialogProps) {
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!ticket || !message.trim() || !senderName.trim() || !senderEmail.trim()) return;
    
    try {
      setIsSending(true);
      await onSendMessage(ticket._id, {
        message: message.trim(),
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
      });
      
      // Clear form and close dialog
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setMessage("");
      onClose();
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quick Reply to Ticket
          </DialogTitle>
        </DialogHeader>

        {/* Ticket Summary */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{ticket.title}</h4>
            <Badge variant="outline">
              {ticket.status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ).join(' ')}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {ticket.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{ticket.createdByName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              <span>{ticket.business?.name || 'Unknown Business'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{ticket.messages?.length || 0} messages</span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="senderName">Your Name *</Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Support Agent Name"
                disabled={isSending}
              />
            </div>
            <div>
              <Label htmlFor="senderEmail">Your Email *</Label>
              <Input
                id="senderEmail"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="agent@company.com"
                disabled={isSending}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Support Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your support response here..."
              rows={6}
              disabled={isSending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will be sent to the customer and added to the ticket history.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || !senderName.trim() || !senderEmail.trim() || isSending}
          >
            {isSending ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-3 w-3 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}