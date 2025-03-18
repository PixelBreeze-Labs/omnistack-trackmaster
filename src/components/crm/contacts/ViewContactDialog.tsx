// components/crm/contacts/ViewContactDialog.tsx
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
  
  interface ViewContactDialogProps {
    open: boolean;
    onClose: () => void;
    contact: Submission;
    onStatusChange: (status: string) => void;
  }
  
  export function ViewContactDialog({ open, onClose, contact, onStatusChange }: ViewContactDialogProps) {
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
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
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
                    <div className="flex items-center">
                      <MousePointerIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {contact.metadata.userAgent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
  
          <DialogFooter className="flex space-x-2 justify-end mt-4">
            {contact.status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange('reviewed')}
                className="flex items-center gap-1"
              >
                <CheckIcon className="h-4 w-4" />
                Mark as Reviewed
              </Button>
            )}
            
            {contact.status !== 'archived' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange('archived')}
                className="flex items-center gap-1"
              >
                <ArchiveIcon className="h-4 w-4" />
                Archive
              </Button>
            )}
            
            <Button 
              onClick={onClose}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }