import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { 
    AdminReport, 
    ReportStatus 
  } from "@/app/api/external/omnigateway/types/admin-reports";
  import { useEffect, useState } from "react";
  import { 
    MapPin as MapPinIcon,
    Calendar as CalendarIcon, 
    Tag as TagIcon, 
    Image as ImageIcon, 
    FileAudio2 as AudioIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    Star as StarIcon,
    User as UserIcon,
    MessageSquare,
    ExternalLink,
    Info as InfoIcon,
    FileText as FileTextIcon,
    Clock as ClockIcon
  } from "lucide-react";
  import { createReportTagsApi } from "@/app/api/external/omnigateway/report-tags";
  import { useGatewayClientApiKey } from "@/hooks/useGatewayClientApiKey";
  import { format } from "date-fns";
  
  interface ReportDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    report: AdminReport;
  }
  
  interface ReportTag {
    _id: string;
    name: string;
    color: string;
  }
  
  export function ReportDetailsDialog({ open, onClose, report }: ReportDetailsDialogProps) {
    const [reportTags, setReportTags] = useState<Record<string, ReportTag>>({});
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const { apiKey } = useGatewayClientApiKey();
  
    // Safely get content
    const content = report?.content?.message || "No content available";
  
    // Safely get media
    const media = Array.isArray(report?.media) ? report.media : [];
    
    // Fetch tags if needed
    useEffect(() => {
      const fetchReportTags = async () => {
        if (!apiKey || !open || !report?.reportTags?.length) return;
        
        setIsLoadingTags(true);
        try {
          const tagsApi = createReportTagsApi(apiKey);
          const response = await tagsApi.getReportTags();
          
          if (response.data) {
            const tagsMap = response.data.reduce((acc: Record<string, ReportTag>, tag: ReportTag) => {
              acc[tag._id] = tag;
              return acc;
            }, {});
            setReportTags(tagsMap);
          }
        } catch (error) {
          console.error('Error fetching report tags:', error);
        } finally {
          setIsLoadingTags(false);
        }
      };
  
      fetchReportTags();
    }, [apiKey, open, report?.reportTags]);
  
    const getStatusBadge = (status?: string) => {
      if (!status) return null;
      
      switch(status) {
        case ReportStatus.PENDING_REVIEW:
          return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
        case ReportStatus.REJECTED:
          return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
        case ReportStatus.ACTIVE:
          return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
        case ReportStatus.IN_PROGRESS:
          return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
        case ReportStatus.RESOLVED:
          return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>;
        case ReportStatus.CLOSED:
          return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
        case ReportStatus.NO_RESOLUTION:
          return <Badge className="bg-orange-100 text-orange-800">No Resolution</Badge>;
        case "pending":
          return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        default:
          return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
      }
    };
  
    const getCategoryBadge = (category?: string) => {
      if (!category) return null;
      
      const colorMap: Record<string, string> = {
        'infrastructure': 'bg-slate-100 text-slate-800',
        'safety': 'bg-red-100 text-red-800',
        'environment': 'bg-green-100 text-green-800',
        'public_services': 'bg-blue-100 text-blue-800',
        'health_services': 'bg-pink-100 text-pink-800',
        'transportation': 'bg-orange-100 text-orange-800',
        'community': 'bg-purple-100 text-purple-800'
      };
      
      const colorClass = colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
      return (
        <Badge variant="outline" className={colorClass}>
          {category.replace(/_/g, ' ')}
        </Badge>
      );
    };
  
    const formatDate = (dateString?: string) => {
      if (!dateString) return 'Unknown';
      try {
        return format(new Date(dateString), 'MMMM do, yyyy h:mm a');
      } catch (e) {
        return 'Invalid date';
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          {/* Improved header with title and status in one row */}
          <DialogHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileTextIcon className="h-5 w-5 text-gray-500" />
                <DialogTitle className="text-xl font-semibold">
                  {report?.title || 'Untitled Report'}
                </DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                {getCategoryBadge(report?.category)}
                {getStatusBadge(report?.status)}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-7 max-w-2xl">
              {report?.description || "No description provided."}
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
            {/* Left column - Report content (wider) */}
            <div className="md:col-span-2 space-y-5">
              {/* Report Content Card */}
              <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>Report Content</span>
                  </h3>
                  <div className="text-xs text-gray-500">
                    {formatDate(report?.createdAt)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-gray-50 p-4 rounded-md border min-h-[120px] whitespace-pre-wrap">
                    {content}
                  </div>
                </div>
              </div>
              
              {/* Media Content Card */}
              {media.length > 0 && (
                <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span>Media Attachments ({media.length})</span>
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2">
                      {media.slice(0, 6).map((url, index) => (
                        <a 
                          key={index} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block relative aspect-square rounded-md overflow-hidden border group"
                        >
                          <img 
                            src={url} 
                            alt={`Attachment ${index + 1}`} 
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <ExternalLink className="text-white h-6 w-6" />
                          </div>
                        </a>
                      ))}
                      {media.length > 6 && (
                        <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-md border">
                          <div className="text-center">
                            <span className="text-lg font-semibold">+{media.length - 6}</span>
                            <p className="text-xs text-gray-500">more</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Report metadata */}
            <div className="space-y-4">
              {/* Report Information Card */}
              <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                    <span>Report Information</span>
                  </h3>
                </div>
                <div className="p-4">
                  <dl className="space-y-2 text-sm">
                    {/* Visibility */}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Visibility</dt>
                      <dd>
                        {report?.visibleOnWeb ? 
                          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" /> Public
                          </Badge> : 
                          <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                            <EyeOffIcon className="h-3 w-3" /> Hidden
                          </Badge>
                        }
                      </dd>
                    </div>
                    
                    {/* Featured */}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Featured</dt>
                      <dd>
                        {report?.isFeatured ? 
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
                            <StarIcon className="h-3 w-3" /> Featured
                          </Badge> : 
                          <span>No</span>
                        }
                      </dd>
                    </div>
                    
                    {/* Timestamps */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>Timeline</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <dt className="text-gray-500">Created</dt>
                        <dd>{formatDate(report?.createdAt)}</dd>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <dt className="text-gray-500">Updated</dt>
                        <dd>{formatDate(report?.updatedAt)}</dd>
                      </div>
                    </div>
                    
                    {/* Source */}
                    {report?.isFromChatbot !== undefined && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Source</dt>
                          <dd>
                            {report.isFromChatbot ? 
                              <Badge className="bg-blue-100 text-blue-800">Chatbot</Badge> : 
                              <Badge className="bg-purple-100 text-purple-800">Web Form</Badge>
                            }
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              
              {/* Author Information Card */}
              <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span>Author Information</span>
                  </h3>
                </div>
                <div className="p-4">
                  <dl className="space-y-2 text-sm">
                    {/* Anonymous */}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Anonymous</dt>
                      <dd>
                        <Badge variant={report?.isAnonymous ? "default" : "outline"}>
                          {report?.isAnonymous ? "Yes" : "No"}
                        </Badge>
                      </dd>
                    </div>
                    
                   {/* Display Name */}
{report?.customAuthorName || (report?.authorId && typeof report.authorId === 'object' && report.authorId.name) ? (
  <div className="flex justify-between">
    <dt className="text-gray-500">Display Name</dt>
    <dd className="font-medium">
      {report.customAuthorName || 
       (typeof report.authorId === 'object' ? 
         `${report.authorId.name || ''} ${report.authorId.surname || ''}`.trim() : 
         '')
      }
    </dd>
  </div>
) : null}
                    
                   {/* Author ID */}
{report?.authorId && (
  <div className="flex justify-between">
    <dt className="text-gray-500">Author ID</dt>
    <dd className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
      {typeof report.authorId === 'object' && report.authorId._id 
        ? report.authorId._id.substring(0, 12) + '...'
        : typeof report.authorId === 'string' && report.authorId.length > 12
          ? report.authorId.substring(0, 12) + '...'
          : report.authorId._id || report.authorId}
    </dd>
  </div>
)}    
                  </dl>
                </div>
              </div>
              {/* Tags Card */}
            {((report?.reportTags && report.reportTags.length > 0) || (report?.tags && report.tags.length > 0)) && (
              <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-sm font-medium flex items-center gap-1.5">
                    <TagIcon className="h-4 w-4 text-gray-500" />
                    <span>Tags</span>
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {report?.reportTags?.map((tagId) => {
                      // Check if tagId is a string or an object
                      const tagIdStr = typeof tagId === 'string' ? tagId : (tagId._id || '');
                      const tag = reportTags[tagIdStr];
                      return (
                        <Badge 
                          key={tagIdStr} 
                          variant="outline"
                          className="mb-1"
                          style={tag ? {
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            borderColor: tag.color
                          } : undefined}
                        >
                          {tag ? tag.name : (typeof tagIdStr === 'string' ? tagIdStr.substring(0, 8) : 'Unknown')}
                        </Badge>
                      );
                    })}
                    
                    {report?.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="mb-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
              {/* Location Card */}
              {report?.location && (typeof report.location.lat === 'number' || typeof report.location.lng === 'number') && (
                <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <span>Location</span>
                    </h3>
                  </div>
                  <div className="p-4">
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Latitude</dt>
                        <dd className="font-mono">{report.location.lat?.toFixed(6) || 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Longitude</dt>
                        <dd className="font-mono">{report.location.lng?.toFixed(6) || 'N/A'}</dd>
                      </div>
                      {report.location.accuracy && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Accuracy</dt>
                          <dd>{report.location.accuracy} meters</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => {
                          if (report.location?.lat && report.location?.lng) {
                            const url = `https://maps.google.com/?q=${report.location.lat},${report.location.lng}`;
                            window.open(url, '_blank');
                          }
                        }}
                      >
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        View on Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="border-t pt-4 mt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {/* Additional actions could be added here */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }