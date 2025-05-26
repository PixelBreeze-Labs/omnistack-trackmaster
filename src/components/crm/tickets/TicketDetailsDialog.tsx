// components/support/tickets/TicketDetailsDialog.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Separator
} from "@/components/ui/separator";
import {
  User,
  Building2,
  Calendar,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Tag
} from "lucide-react";
import { Ticket, TicketMessage, AddMessageDto } from "@/app/api/external/omnigateway/types/tickets";
import { format } from "date-fns";

interface TicketDetailsDialog {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  onAddMessage?: (ticketId: string, message: AddMessageDto) => Promise<void>;
  isUpdating?: boolean;
}

export function TicketDetailsDialog({
  ticket,
  open,
  onClose,
  onAddMessage,
  isUpdating = false
}: TicketDetailsDialog) {
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("Staffluent Support Team");
  const [senderEmail, setSenderEmail] = useState("support@staffluent.co");

  if (!ticket) return null;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !senderName.trim() || !senderEmail.trim()) return;
    
    if (onAddMessage) {
      await onAddMessage(ticket._id, {
        message: newMessage.trim(),
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
      });
      
      setNewMessage("");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ticket Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {ticket.category.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {ticket.description}
                </p>
                
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Tag className="h-3 w-3" />
                      <span className="text-xs font-medium">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.resolutionNotes && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-1">Resolution Notes</h4>
                    <p className="text-sm text-green-700 whitespace-pre-wrap">
                      {ticket.resolutionNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages ({ticket.messages?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((message, index) => (
                    <div key={index} className="space-y-2">
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'support' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-gray-50 border-l-4 border-gray-500'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              message.sender === 'support' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}>
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-medium">{message.senderName}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {message.sender === 'support' ? 'Support' : 'Customer'}
                              </Badge>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">
                              Attachments: {message.attachments.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      {index < ticket.messages.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No messages yet
                  </p>
                )}

                {/* Add Message Form */}
                {onAddMessage && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-sm font-medium">Add Support Message</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="senderName" className="text-xs">Your Name</Label>
                        <Input
                          id="senderName"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Support Agent Name"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="senderEmail" className="text-xs">Your Email</Label>
                        <Input
                          id="senderEmail"
                          type="email"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="agent@company.com"
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-xs">Message</Label>
                      <Textarea
                        id="message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your support response..."
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !senderName.trim() || !senderEmail.trim() || isUpdating}
                      size="sm"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Send Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Name</span>
                  <p className="text-sm font-medium">{ticket.createdByName}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="text-sm">{ticket.createdByEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Name</span>
                  <p className="text-sm font-medium">{ticket.business?.name || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="text-sm">{ticket.business?.email || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Assigned To</span>
                  <p className="text-sm font-medium">
                    {ticket.assignedTo || 'Unassigned'}
                  </p>
                </div>
                {ticket.assignedToEmail && (
                  <div>
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="text-sm">{ticket.assignedToEmail}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Created</span>
                  <p className="text-sm">{formatDate(ticket.createdAt)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Updated</span>
                  <p className="text-sm">{formatDate(ticket.updatedAt)}</p>
                </div>
                {ticket.resolvedAt && (
                  <div>
                    <span className="text-xs text-muted-foreground">Resolved</span>
                    <p className="text-sm">{formatDate(ticket.resolvedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}