// components/crm/reports/ReportDetailsDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { AdminReport, ReportStatus } from "@/app/api/external/omnigateway/types/admin-reports";
  import { 
    MailIcon, 
    MapPinIcon, 
    CalendarIcon, 
    TagIcon, 
    ImageIcon, 
    MicIcon,
    EyeIcon,
    StarIcon,
    ClockIcon,
    UserIcon
  } from "lucide-react";
  
  interface ReportDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    report: AdminReport;
  }
  
  export function ReportDetailsDialog({ open, onClose, report }: ReportDetailsDialogProps) {
    const getStatusBadge = (status: string) => {
      switch(status) {
        case ReportStatus.PENDING_REVIEW:
          return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending Review</Badge>;
        case ReportStatus.REJECTED:
          return <Badge variant="outline" className="bg-red-500/10 text-red-600">Rejected</Badge>;
        case ReportStatus.ACTIVE:
          return <Badge variant="outline" className="bg-blue-500/10 text-blue-600">Active</Badge>;
        case ReportStatus.IN_PROGRESS:
          return <Badge variant="outline" className="bg-purple-500/10 text-purple-600">In Progress</Badge>;
        case ReportStatus.RESOLVED:
          return <Badge variant="outline" className="bg-green-500/10 text-green-600">Resolved</Badge>;
        case ReportStatus.CLOSED:
          return <Badge variant="outline" className="bg-gray-500/10 text-gray-600">Closed</Badge>;
        case ReportStatus.NO_RESOLUTION:
          return <Badge variant="outline" className="bg-orange-500/10 text-orange-600">No Resolution</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    };
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString();
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>{report.title}</span>
              {getStatusBadge(report.status)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Left column - Report details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Report Content</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{report.content.message}</p>
                </div>
              </div>
              
              {report.media && report.media.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Media Attachments
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {report.media.map((url, index) => (
                      <a 
                        key={index} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={url} 
                          alt={`Attachment ${index + 1}`} 
                          className="rounded-md object-cover w-full h-32"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {report.audio && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <MicIcon className="w-4 h-4 mr-2" />
                    Audio Recording
                  </h3>
                  <audio controls className="w-full">
                    <source src={report.audio} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              {report.location && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Location
                  </h3>
                  <p className="text-sm">
                    Latitude: {report.location.lat.toFixed(6)}, 
                    Longitude: {report.location.lng.toFixed(6)}
                  </p>
                  {/* Here you could embed a map if needed */}
                </div>
              )}
            </div>
            
            {/* Right column - Metadata */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Report Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <Badge variant="secondary">{report.category}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Visibility:</span>
                    {report.visibleOnWeb ? 
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 flex items-center">
                        <EyeIcon className="w-3 h-3 mr-1" />Public
                      </Badge> : 
                      <Badge variant="outline" className="bg-red-500/10 text-red-600">Hidden</Badge>
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Featured:</span>
                    {report.isFeatured ? 
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 flex items-center">
                        <StarIcon className="w-3 h-3 mr-1" />Featured
                      </Badge> : 
                      <span className="text-sm">No</span>
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm">{formatDate(report.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <span className="text-sm">{formatDate(report.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Author
                </h3>
                <div className="text-sm">
                  {report.isAnonymous ? (
                    <Badge variant="outline">Anonymous</Badge>
                  ) : (
                    <div className="space-y-1">
                      <p><span className="text-muted-foreground">Name:</span> {report.customAuthorName || 'Unknown'}</p>
                      {report.authorId && (
                        <p><span className="text-muted-foreground">ID:</span> {report.authorId}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {report.tags && report.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <TagIcon className="w-4 h-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {report.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {report.reportTags && report.reportTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <TagIcon className="w-4 h-4 mr-2" />
                    Report Tags
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {report.reportTags.map((tagId, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                        {tagId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Status History
                </h3>
                <div className="text-sm">
                  <p className="text-muted-foreground">Current status: {getStatusBadge(report.status)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }