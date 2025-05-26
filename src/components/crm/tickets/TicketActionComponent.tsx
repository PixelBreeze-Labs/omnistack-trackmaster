// components/support/tickets/TicketActionComponent.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  MessageSquare,
  User,
  Trash2,
  RefreshCcw
} from "lucide-react";
import { Ticket, TicketStatus, TicketPriority } from "@/app/api/external/omnigateway/types/tickets";

// InputSelect Component
const arrowIcon = (
  <svg
    width="26"
    height="26"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.95339 5.67461C3.1331 5.46495 3.44875 5.44067 3.65841 5.62038L7.99968 9.34147L12.341 5.62038C12.5506 5.44067 12.8663 5.46495 13.046 5.67461C13.2257 5.88428 13.2014 6.19993 12.9917 6.37964L8.32508 10.3796C8.13783 10.5401 7.86153 10.5401 7.67429 10.3796L3.00762 6.37964C2.79796 6.19993 2.77368 5.88428 2.95339 5.67461Z"
      fill="currentColor"
    />
  </svg>
)

interface OptionType {
  value: string
  label: string
}

function InputSelectComponent({ name, label, options, onChange, value, required }: {
  name: string
  label: string
  options: OptionType[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string
  required?: boolean
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-2.5 block font-satoshi text-base font-medium text-dark dark:text-white"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="
            flex h-8 w-full items-center justify-between
            rounded-md border border-input
            bg-background
            px-2 py-1
            text-xs
            ring-offset-background
            placeholder:text-muted-foreground
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            focus:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-50
            appearance-none
            [&>span]:line-clamp-1
            dark:text-white dark:bg-dark dark:focus:border-transparent
          "
        >
          <option value="" className="dark:bg-dark">
            Actions
          </option>
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="dark:bg-dark"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-50">
          {arrowIcon}
        </span>
      </div>
    </div>
  )
}

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
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");
  const [assignedToEmail, setAssignedToEmail] = useState(ticket.assignedToEmail || "");
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const [selectedPriority, setSelectedPriority] = useState(ticket.priority);
  const [actionValue, setActionValue] = useState("");

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

  const handleStatusUpdate = async () => {
    await onStatusUpdate(ticket._id, selectedStatus);
    setShowStatusDialog(false);
  };

  const handlePriorityUpdate = async () => {
    await onPriorityUpdate(ticket._id, selectedPriority);
    setShowPriorityDialog(false);
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    setActionValue("");
    
    switch (action) {
      case 'view':
        onViewDetails?.(ticket);
        break;
      case 'message':
        onAddMessage?.(ticket);
        break;
      case 'status':
        setShowStatusDialog(true);
        break;
      case 'priority':
        setShowPriorityDialog(true);
        break;
      case 'assign':
        setShowAssignDialog(true);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as TicketStatus);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriority(e.target.value as TicketPriority);
  };

  const actionOptions = [
    { value: 'view', label: 'View Details' },
    { value: 'message', label: 'Add Message' },
    { value: 'status', label: 'Update Status' },
    { value: 'priority', label: 'Update Priority' },
    { value: 'assign', label: ticket.assignedTo ? 'Reassign' : 'Assign' },
    { value: 'delete', label: 'Delete Ticket' }
  ];

  const statusOptions = [
    { value: TicketStatus.OPEN, label: 'Open' },
    { value: TicketStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TicketStatus.RESOLVED, label: 'Resolved' },
    { value: TicketStatus.CLOSED, label: 'Closed' }
  ];

  const priorityOptions = [
    { value: TicketPriority.LOW, label: 'Low Priority' },
    { value: TicketPriority.MEDIUM, label: 'Medium Priority' },
    { value: TicketPriority.HIGH, label: 'High Priority' },
    { value: TicketPriority.URGENT, label: 'Urgent Priority' }
  ];

  if (isUpdating || isDeleting) {
    return (
      <Button variant="ghost" className="h-8 w-8 p-0" disabled>
        <RefreshCcw className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <>
      <div className="min-w-[120px]">
        <InputSelectComponent
          name="ticketActions"
          label=""
          value={actionValue}
          onChange={handleActionChange}
          options={actionOptions}
        />
      </div>

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

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Status: <span className="font-semibold">{ticket.status}</span></Label>
            </div>
            <div>
              <InputSelectComponent
                name="status"
                label="New Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                options={statusOptions}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowStatusDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={selectedStatus === ticket.status}
              >
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Priority Update Dialog */}
      <Dialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket Priority</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Priority: <span className="font-semibold">{ticket.priority}</span></Label>
            </div>
            <div>
              <InputSelectComponent
                name="priority"
                label="New Priority"
                value={selectedPriority}
                onChange={handlePriorityChange}
                options={priorityOptions}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPriorityDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePriorityUpdate}
                disabled={selectedPriority === ticket.priority}
              >
                Update Priority
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}