// components/support/tickets/TicketActionComponent.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
  Trash2,
  RefreshCcw
} from "lucide-react";
import { Ticket, TicketStatus, TicketPriority } from "@/app/api/external/omnigateway/types/tickets";

interface TicketActionSelectProps {
  ticket: Ticket;
  onStatusUpdate: (ticketId: string, status: TicketStatus) => Promise<void>;
  onPriorityUpdate: (ticketId: string, priority: TicketPriority) => Promise<void>;
  onAssignTicket: (ticketId: string, assignedTo: string, assignedToEmail?: string) => Promise<void>;
  onDeleteTicket: (ticket: Ticket) => Promise<void>;
  onViewDetails?: (ticket: Ticket) => void;
  onAddMessage?: (ticket: Ticket) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function TicketActionSelect({
  ticket,
  onStatusUpdate,
  onPriorityUpdate,
  onAssignTicket,
  onDeleteTicket,
  onViewDetails,
  onAddMessage,
  isUpdating,
  isDeleting
}: TicketActionSelectProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");
  const [assignedToEmail, setAssignedToEmail] = useState(ticket.assignedToEmail || "");

  const handleDelete = async () => {
    await onDeleteTicket(ticket);
    setShowDeleteDialog(false);
  };

  const handleAssign = async () => {
    if (assignedTo.trim()) {
      await onAssignTicket(ticket._id, assignedTo.trim(), assignedToEmail.trim() || undefined);
      setShowAssignDialog(false);
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertCircle className="mr-2 h-4 w-4" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="mr-2 h-4 w-4" />;
      case TicketStatus.RESOLVED:
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case TicketStatus.CLOSED:
        return <XCircle className="mr-2 h-4 w-4" />;
      default:
        return <AlertCircle className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating || isDeleting}>
            {isUpdating || isDeleting ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onViewDetails?.(ticket)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onAddMessage?.(ticket)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Message
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Status Updates */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Edit className="mr-2 h-4 w-4" />
              Update Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(ticket._id, TicketStatus.OPEN)}
                disabled={ticket.status === TicketStatus.OPEN}
              >
                {getStatusIcon(TicketStatus.OPEN)}
                Open
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(ticket._id, TicketStatus.IN_PROGRESS)}
                disabled={ticket.status === TicketStatus.IN_PROGRESS}
              >
                {getStatusIcon(TicketStatus.IN_PROGRESS)}
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(ticket._id, TicketStatus.RESOLVED)}
                disabled={ticket.status === TicketStatus.RESOLVED}
              >
                {getStatusIcon(TicketStatus.RESOLVED)}
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(ticket._id, TicketStatus.CLOSED)}
                disabled={ticket.status === TicketStatus.CLOSED}
              >
                {getStatusIcon(TicketStatus.CLOSED)}
                Closed
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Priority Updates */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <AlertCircle className="mr-2 h-4 w-4" />
              Update Priority
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => onPriorityUpdate(ticket._id, TicketPriority.LOW)}
                disabled={ticket.priority === TicketPriority.LOW}
              >
                Low Priority
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPriorityUpdate(ticket._id, TicketPriority.MEDIUM)}
                disabled={ticket.priority === TicketPriority.MEDIUM}
              >
                Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPriorityUpdate(ticket._id, TicketPriority.HIGH)}
                disabled={ticket.priority === TicketPriority.HIGH}
              >
                High Priority
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPriorityUpdate(ticket._id, TicketPriority.URGENT)}
                disabled={ticket.priority === TicketPriority.URGENT}
              >
                Urgent Priority
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            {ticket.assignedTo ? 'Reassign' : 'Assign'} Ticket
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Ticket
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ticket "{ticket.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Ticket Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {ticket.assignedTo ? 'Reassign' : 'Assign'} Ticket
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Enter support agent name"
              />
            </div>
            <div>
              <Label htmlFor="assignedToEmail">Email (Optional)</Label>
              <Input
                id="assignedToEmail"
                type="email"
                value={assignedToEmail}
                onChange={(e) => setAssignedToEmail(e.target.value)}
                placeholder="Enter support agent email"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAssignDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!assignedTo.trim()}
              >
                {ticket.assignedTo ? 'Reassign' : 'Assign'} Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}