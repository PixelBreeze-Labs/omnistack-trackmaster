import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Separator } from "@/components/ui/separator";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { 
    AdminReport, 
    ReportStatus 
  } from "@/app/api/external/omnigateway/types/admin-reports";
  import { useEffect, useState } from "react";
  import { 
    MailIcon, 
    MapPinIcon, 
    CalendarIcon, 
    Tag as TagIcon, 
    Image as ImageIcon, 
    FileAudio2 as AudioIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    Star as StarIcon,
    Clock as ClockIcon,
    User as UserIcon,
    MapPin as MapPinDetailIcon,
    ExternalLink,
    AlertCircle,
    Info,
    Download,
    Check,
    X,
    Paperclip,
    MessageSquare
  } from "lucide-react";
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
  import { format } from "date-fns";
  import Image from "next/image";
  import { createReportTagsApi } from "@/app/api/external/omnigateway/report-tags";
  import { useGatewayClientApiKey } from "@/hooks/useGatewayClientApiKey";
  
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
    const [activeTab, setActiveTab] = useState("details");
    const [reportTags, setReportTags] = useState<Record<string, ReportTag>>({});
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const { apiKey } = useGatewayClientApiKey();
  
    useEffect(() => {
      const fetchReportTags = async () => {
        if (!apiKey || !open || !report.reportTags?.length) return;
        
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
    }, [apiKey, open, report.reportTags]);
  
    const getStatusBadge = (status: string) => {
      const statusConfig = {
        [ReportStatus.PENDING_REVIEW]: { 
          bg: "bg-yellow-500/10", 
          text: "text-yellow-600",
          label: "Pending Review",
          icon: <ClockIcon className="w-3 h-3 mr-1" />
        },
        [ReportStatus.REJECTED]: { 
          bg: "bg-red-500/10", 
          text: "text-red-600",
          label: "Rejected", 
          icon: <X className="w-3 h-3 mr-1" />
        },
        [ReportStatus.ACTIVE]: { 
          bg: "bg-blue-500/10", 
          text: "text-blue-600",
          label: "Active", 
          icon: <AlertCircle className="w-3 h-3 mr-1" />
        },
        [ReportStatus.IN_PROGRESS]: { 
          bg: "bg-purple-500/10", 
          text: "text-purple-600",
          label: "In Progress",
          icon: <ClockIcon className="w-3 h-3 mr-1" />
        },
        [ReportStatus.RESOLVED]: { 
          bg: "bg-green-500/10", 
          text: "text-green-600",
          label: "Resolved",
          icon: <Check className="w-3 h-3 mr-1" />
        },
        [ReportStatus.CLOSED]: { 
          bg: "bg-gray-500/10", 
          text: "text-gray-600",
          label: "Closed",
          icon: <Check className="w-3 h-3 mr-1" />
        },
        [ReportStatus.NO_RESOLUTION]: { 
          bg: "bg-orange-500/10", 
          text: "text-orange-600",
          label: "No Resolution",
          icon: <AlertCircle className="w-3 h-3 mr-1" />
        }
      };
  
      const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status || "Unknown", icon: <Info className="w-3 h-3 mr-1" /> };
  
      return (
        <Badge variant="outline" className={`${config.bg} ${config.text} flex items-center`}>
          {config.icon}
          <span>{config.label}</span>
        </Badge>
      );
    };
  
    const getCategoryBadge = (category: string) => {
      const categoryConfig: Record<string, { bg: string, text: string, icon: JSX.Element }> = {
        'infrastructure': { 
          bg: 'bg-slate-100', 
          text: 'text-slate-700', 
          icon: <TagIcon className="w-3 h-3 mr-1" />
        },
        'safety': { 
          bg: 'bg-red-100', 
          text: 'text-red-700', 
          icon: <AlertCircle className="w-3 h-3 mr-1" />
        },
        'environment': { 
          bg: 'bg-green-100', 
          text: 'text-green-700', 
          icon: <TagIcon className="w-3 h-3 mr-1" />
        },
        'public_services': { 
          bg: 'bg-blue-100', 
          text: 'text-blue-700', 
          icon: <TagIcon className="w-3 h-3 mr-1" />
        },
        'health_services': { 
          bg: 'bg-pink-100', 
          text: 'text-pink-700', 
          icon: <TagIcon className="w-3 h-3 mr-1" />
        },
        'transportation': { 
          bg: 'bg-orange-100', 
          text: 'text-orange-700', 
          icon: <TagIcon className="w-3 h-3 mr-1" />
        },
        'community': { 
          bg: 'bg-purple-100', 
          text: 'text-purple-700', 
          icon: <TagIcon className="w-3 h-3 mr-1" />
        }
      };
  
      const config = categoryConfig[category?.toLowerCase()] || 
                     { bg: 'bg-gray-100', text: 'text-gray-700', icon: <TagIcon className="w-3 h-3 mr-1" /> };
  
      return (
        <Badge 
          variant="outline" 
          className={`${config.bg} ${config.text} flex items-center`}
        >
          {config.icon}
          <span className="capitalize">{category?.replace(/_/g, ' ') || 'Unknown'}</span>
        </Badge>
      );
    };
  
    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return 'Unknown';
      try {
        return format(new Date(dateString), 'PPP p'); // e.g., "Apr 29, 2023, 5:45 PM"
      } catch (e) {
        return 'Invalid date';
      }
    };
  
    const renderMetadataItem = (label: string, value: JSX.Element | string) => (
      <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="text-sm">{value}</div>
      </div>
    );
  
    const getTagBadge = (tagId: string) => {
      const tag = reportTags[tagId];
      
      if (!tag) {
        return (
          <Badge 
            key={tagId} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <TagIcon className="h-3 w-3" />
            {isLoadingTags ? "Loading..." : tagId.substring(0, 8)}
          </Badge>
        );
      }
      
      return (
        <Badge 
          key={tagId} 
          variant="outline"
          className="flex items-center gap-1 px-3 py-1"
          style={{ 
            backgroundColor: `${tag.color}20`, // Add transparency
            color: tag.color,
            borderColor: tag.color
          }}
        >
          <TagIcon className="h-3 w-3" />
          {tag.name}
        </Badge>
      );
    };
  
    const hasMedia = report.media && report.media.length > 0;
    const hasAudio = !!report.audio;
    const hasTags = (report.reportTags && report.reportTags.length > 0) || (report.tags && report.tags.length > 0);
    const hasValidLocation = report.location && typeof report.location.lat === 'number' && typeof report.location.lng === 'number';
    
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-background px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold mr-2 line-clamp-1">
                {report.title || 'Untitled Report'}
              </DialogTitle>
              {getStatusBadge(report.status)}
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 border-b">
              <TabsList className="w-full justify-start h-12 p-0 bg-transparent">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Details
                </TabsTrigger>
                
                {hasMedia && (
                  <TabsTrigger 
                    value="media"
                    className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Media ({report.media?.length || 0})
                  </TabsTrigger>
                )}
                
                {hasAudio && (
                  <TabsTrigger 
                    value="audio"
                    className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
                  >
                    <AudioIcon className="w-4 h-4 mr-2" />
                    Audio
                  </TabsTrigger>
                )}
                
                {hasValidLocation && (
                  <TabsTrigger 
                    value="location"
                    className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
                  >
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Location
                  </TabsTrigger>
                )}
                
                {hasTags && (
                  <TabsTrigger 
                    value="tags"
                    className="data-[state=active]:border-b-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
                  >
                    <TagIcon className="w-4 h-4 mr-2" />
                    Tags
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <ScrollArea className="h-[calc(90vh-13rem)]">
              <TabsContent value="details" className="m-0 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left column - Report content */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold">Report Content</h3>
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <p className="whitespace-pre-wrap text-sm">
                          {report.content?.message || 'No content available'}
                        </p>
                      </div>
                    </div>
                    
                    {hasMedia && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Media Preview
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {report.media?.slice(0, 3).map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden border group">
                              <img 
                                src={url} 
                                alt={`Attachment ${index + 1}`} 
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  onClick={() => setActiveTab("media")}
                                  className="gap-1"
                                >
                                  <ImageIcon className="h-3 w-3" />
                                  View All
                                </Button>
                              </div>
                            </div>
                          ))}
                          {report.media && report.media.length > 3 && (
                            <div 
                              className="aspect-square rounded-md overflow-hidden border bg-muted/50 flex items-center justify-center cursor-pointer" 
                              onClick={() => setActiveTab("media")}
                            >
                              <div className="text-center">
                                <p className="text-2xl font-bold">+{report.media.length - 3}</p>
                                <p className="text-xs text-muted-foreground">More images</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right column - Metadata */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Report Information</h3>
                      <div className="space-y-1 rounded-md border bg-background overflow-hidden">
                        {report.category && renderMetadataItem("Category", getCategoryBadge(report.category))}
                        
                        {renderMetadataItem("Visibility", report.visibleOnWeb ? 
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 flex items-center">
                            <EyeIcon className="w-3 h-3 mr-1" />Public
                          </Badge> : 
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 flex items-center">
                            <EyeOffIcon className="w-3 h-3 mr-1" />Hidden
                          </Badge>
                        )}
                        
                        {renderMetadataItem("Featured", report.isFeatured ? 
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 flex items-center">
                            <StarIcon className="w-3 h-3 mr-1" />Featured
                          </Badge> : 
                          <span>No</span>
                        )}
                        
                        {renderMetadataItem("Created At", formatDate(report.createdAt))}
                        {renderMetadataItem("Updated At", formatDate(report.updatedAt))}
                        
                        {report.isFromChatbot !== undefined && renderMetadataItem(
                          "Source", 
                          report.isFromChatbot ? 
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Chatbot</Badge> : 
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">Web Form</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Author Information
                      </h3>
                      <div className="rounded-md border bg-background overflow-hidden">
                        {renderMetadataItem("Anonymous", 
                          <Badge variant={report.isAnonymous ? "default" : "outline"}>
                            {report.isAnonymous ? "Yes" : "No"}
                          </Badge>
                        )}
                        
                        {report.customAuthorName && renderMetadataItem(
                          "Display Name", 
                          <span className="font-medium">{report.customAuthorName}</span>
                        )}
                        
                        {report.authorId && renderMetadataItem(
                          "Author ID", 
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                  {report.authorId.substring(0, 10)}...
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Full ID: {report.authorId}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {hasMedia && (
                <TabsContent value="media" className="m-0 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Media Attachments</h3>
                      <span className="text-sm text-muted-foreground">
                        {report.media?.length || 0} items
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {report.media?.map((url, index) => (
                        <div key={index} className="group relative border rounded-md overflow-hidden">
                          <div className="aspect-square bg-muted/30">
                            <img 
                              src={url} 
                              alt={`Attachment ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white text-black p-2 rounded-full"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Open in new tab</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a 
                                    href={url} 
                                    download={`report-image-${index + 1}`}
                                    className="bg-white text-black p-2 rounded-full"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download image</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {hasAudio && (
                <TabsContent value="audio" className="m-0 p-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center">
                      <AudioIcon className="w-4 h-4 mr-2" />
                      Audio Recording
                    </h3>
                    
                    <div className="border rounded-md p-4 bg-muted/20">
                      <div className="space-y-4">
                        <audio controls className="w-full">
                          <source src={report.audio || undefined} />
                          Your browser does not support the audio element.
                        </audio>
                        
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a 
                                  href={report.audio || "#"} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Open in new tab</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a 
                                  href={report.audio || "#"} 
                                  download="audio-recording"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download audio</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {hasValidLocation && (
                <TabsContent value="location" className="m-0 p-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center">
                      <MapPinDetailIcon className="w-4 h-4 mr-2" />
                      Report Location
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-1">
                        <div className="border rounded-md p-4 bg-muted/20 space-y-3">
                          <div>
                            <span className="text-sm text-muted-foreground block">Latitude</span>
                            <span className="text-sm font-mono font-medium">
                              {report.location?.lat.toFixed(6)}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground block">Longitude</span>
                            <span className="text-sm font-mono font-medium">
                              {report.location?.lng.toFixed(6)}
                            </span>
                          </div>
                          {report.location?.accuracy && (
                            <div>
                              <span className="text-sm text-muted-foreground block">Accuracy</span>
                              <span className="text-sm font-mono font-medium">
                                {report.location.accuracy} meters
                              </span>
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                const url = `https://maps.google.com/?q=${report.location?.lat},${report.location?.lng}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <MapPinDetailIcon className="h-4 w-4 mr-2" />
                              View on Google Maps
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 aspect-video border rounded-md overflow-hidden bg-muted/30 flex items-center justify-center">
                        <div className="text-center p-4">
                          <MapPinDetailIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Map embedding could be shown here
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            (requires integration with a mapping service like Google Maps)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {hasTags && (
                <TabsContent value="tags" className="m-0 p-6">
                  <div className="space-y-5">
                    {report.reportTags && report.reportTags.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <TagIcon className="w-4 h-4 mr-2" />
                          Report Tags ({report.reportTags.length})
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {report.reportTags.map((tagId) => getTagBadge(tagId))}
                        </div>
                        
                        {isLoadingTags && (
                          <p className="text-sm text-muted-foreground">Loading tag details...</p>
                        )}
                      </div>
                    )}
                    
                    {report.tags && report.tags.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <TagIcon className="w-4 h-4 mr-2" />
                          Legacy Tags ({report.tags.length})
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {report.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center">
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </ScrollArea>
            
            <DialogFooter className="p-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </DialogFooter>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }