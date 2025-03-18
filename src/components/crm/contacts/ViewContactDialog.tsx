// components/crm/contacts/ViewContactDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/app/api/external/omnigateway/types/submissions";
import { MailIcon, PhoneIcon, ClockIcon, MousePointerIcon, CheckIcon, ArchiveIcon } from "lucide-react";

// Helper function to format user agent string in a more readable way
const formatUserAgent = (userAgent: string) => {
  // Extract browser and OS info
  let browser = "Unknown";
  let os = "Unknown";
  
  if (userAgent.includes("Chrome")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Edge")) {
    browser = "Edge";
  }
  
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "macOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  }
  
  return `${browser} on ${os}`;
};

interface ViewContactDialogProps {
  open: boolean;
  onClose: () => void;
  contact: Submission;
  onStatusChange: (status: string) => void;
}

export function ViewContactDialog({ open, onClose, contact, onStatusChange }: ViewContactDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600">Reviewed</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-slate-500/10 text-slate-600">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      setIsProcessing(true);
      await onStatusChange(status);
      onClose();
    } catch (error) {
      console.error('Status change error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Contact Details</span>
            {getStatusBadge(contact.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {/* Contact basic info */}
          <div>
            <h3 className="text-lg font-medium">
              {contact.firstName} {contact.lastName}
            </h3>
          </div>

          {/* Contact details */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                {contact.email}
              </a>
            </div>
            
            {contact.phone && (
              <div className="flex items-center text-sm">
                <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}

            <div className="flex items-center text-sm">
              <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {new Date(contact.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Message content */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Message</h4>
            <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
              {contact.content}
            </div>
          </div>

          {/* Metadata */}
          {contact.metadata && (
            <div className="border-t pt-3 mt-4">
              <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Metadata</h4>
              <div className="space-y-1 text-xs">
                {contact.metadata.userAgent && (
                  <div>
                    <div className="flex items-center">
                      <MousePointerIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Browser</span>
                    </div>
                    <div className="ml-5 mt-1 text-muted-foreground break-words">
                      {contact.metadata.userAgent.length > 50
                        ? formatUserAgent(contact.metadata.userAgent)
                        : contact.metadata.userAgent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Close
          </Button>
          
          {contact.status === 'pending' && (
            <Button 
              onClick={() => handleStatusChange('reviewed')}
              disabled={isProcessing}
              className="flex items-center gap-1"
            >
              <CheckIcon className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Mark as Reviewed'}
            </Button>
          )}
          
          {contact.status !== 'archived' && (
            <Button 
              variant="secondary"
              onClick={() => handleStatusChange('archived')}
              disabled={isProcessing}
              className="flex items-center gap-1"
            >
              <ArchiveIcon className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Archive'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}