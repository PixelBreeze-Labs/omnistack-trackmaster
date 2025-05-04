"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/new-card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import InputSelect from "@/components/Common/InputSelect";
import { 
  Image as ImageIcon, 
  Download, 
  RefreshCcw, 
  Clock, 
  Calendar, 
  Search,
  BarChart3,
  ChevronRight,
  FileText,
  Trash2,
  ExternalLink
} from "lucide-react";
import { useGeneratedImages } from "@/hooks/useGeneratedImages";

type TemplateData = {
  id: number;
  name: string;
  template_type: string;
  image: string;
  description?: string;
  entity: string;
};

export default function TemplateDashboard({ templateId }: { templateId: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [currentTab, setCurrentTab] = useState("overview");
  const [templateStats, setTemplateStats] = useState({
    total: 0,
    downloadRate: 0,
    entity: 0
  });
  
  // Images table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const router = useRouter();
  
  // Initialize the generated images hook
  const { 
    isLoading: isLoadingImages,
    images,
    totalItems,
    totalPages,
    currentPage,
    stats,
    fetchGeneratedImages,
    fetchImageStats,
    deleteGeneratedImage,
    recordImageDownload,
    isInitialized,
    // Add this to your hook if not already there
    getTemplateStats
  } = useGeneratedImages();

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        // This would normally come from your API
        // For now, we'll use static data based on the templateId
        const templates: Record<number, TemplateData> = {
          5: {
            id: 5,
            name: "Web News Story 1",
            template_type: "web_news_story",
            image: "/images/templates/web_news_story.png",
            description: "Template for news articles with headline and category",
            entity: "iconstyle"
          },
          14: {
            id: 14,
            name: "Web News Story 2",
            template_type: "web_news_story_2",
            image: "/images/templates/web_news_story_2.png",
            description: "Alternative layout for news articles",
            entity: "iconstyle"
          },
          // Add more templates as needed
        };
    
        // Check if template exists
        if (!templates[templateId]) {
          toast.error("Template not found");
          router.push("/crm/platform/templates");
          return;
        }
    
        setTemplateData(templates[templateId]);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch template data:", error);
        toast.error("Failed to load template");
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [templateId, router]);

  // Fetch images and stats when template data is loaded
  useEffect(() => {
    if (templateData && isInitialized) {
      // Fetch images for this template
      fetchGeneratedImages({
        templateType: templateData.template_type,
        page,
        limit: pageSize,
      });
      
      // Fetch global stats
      fetchImageStats();
      
      // Fetch template-specific stats
      if (typeof getTemplateStats === 'function') {
        getTemplateStats(templateData.template_type)
          .then(templateStatsData => {
            if (templateStatsData) {
              setTemplateStats({
                total: templateStatsData.total || 0,
                downloadRate: templateStatsData.downloadRate || 0,
                entity: templateStatsData.byEntity?.find(e => e._id === templateData.entity)?.count || 0
              });
            }
          })
          .catch(error => {
            console.error("Failed to fetch template stats:", error);
          });
      }
    }
  }, [templateData, isInitialized, fetchGeneratedImages, fetchImageStats, getTemplateStats, page, pageSize]);

  // Refresh data
  const handleRefresh = () => {
    if (templateData && isInitialized) {
      fetchGeneratedImages({
        templateType: templateData.template_type,
        page,
        limit: pageSize,
      });
      fetchImageStats();

      // Refresh template stats
      if (typeof getTemplateStats === 'function') {
        getTemplateStats(templateData.template_type)
          .then(templateStatsData => {
            if (templateStatsData) {
              setTemplateStats({
                total: templateStatsData.total || 0,
                downloadRate: templateStatsData.downloadRate || 0,
                entity: templateStatsData.byEntity?.find(e => e._id === templateData.entity)?.count || 0
              });
            }
          });
      }
    }
  };

  // Create new image
  const handleCreateNew = () => {
    router.push(`/crm/platform/template-form/${templateId}`);
  };

  // Handle download tracking - FIXED to use _id instead of id
  const handleDownload = async (image) => {
    try {
      // Record the download using _id
      await recordImageDownload(image._id);
      
      // Open the image in a new tab
      window.open(image.path, '_blank');
      
      toast.success("Download tracked successfully");
      
      // Refresh stats after download
      handleRefresh(); // Use our refresh function to update all stats
    } catch (error) {
      console.error("Error tracking download:", error);
      toast.error("Failed to track download");
    }
  };

  // Handle image deletion - Make sure you're using the correct ID field here too
  const handleDelete = async (imageId: string) => {
    try {
      await deleteGeneratedImage(imageId);
      // Refresh the images list
      handleRefresh();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date with time
  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!templateData) {
    return <div>Template not found</div>;
  }

  // Filter images with download time
  const downloadedImages = images.filter(img => img.downloadTime);
  const pendingImages = images.filter(img => !img.downloadTime);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{templateData.name} Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track and manage generated images from this template
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleCreateNew}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setCurrentTab} value={currentTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="mr-2 h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{templateStats.total}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Generated from this template
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Download Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{templateStats.downloadRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Of images were downloaded
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Entity Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{templateStats.entity}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total images for {templateData.entity}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest image generations and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingImages ? (
                  <div className="flex justify-center py-8">
                    <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No images generated yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      Start by creating your first image using this template.
                    </p>
                    <Button className="mt-4" onClick={handleCreateNew}>
                      Create First Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {images.slice(0, 5).map((image) => (
                      <div key={image.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-12 w-12 rounded overflow-hidden border">
                            <Image
                              src={image.path}
                              alt={image.templateType}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Generated: {formatDateTime(image.generationTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {image.downloadTime ? (
                            <>
                            <Badge variant="success" className="flex items-center">
                              <Download className="mr-1 h-3 w-3" />
                              Downloaded At Least Once
                            </Badge>
                             <Button size="sm" variant="ghost" onClick={() => handleDownload(image)}>
                             <Download className="h-4 w-4" />
                           </Button>
                           </>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => handleDownload(image)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button variant="link" onClick={() => setCurrentTab("images")}>
                        View All Images <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab Content */}
        <TabsContent value="images">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="mb-0">
                <h3 className="font-medium">Filter Images</h3>
                <p className="text-sm text-muted-foreground">
                  Search and filter through generated images for this template
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-0 flex flex-col md:flex-row items-center gap-4">
                <div className="relative mt-2 flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by article URL if you have one..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-36 mt-1">
                  <InputSelect
                    name="status"
                    label=""
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "downloaded", label: "Downloaded" },
                      { value: "pending", label: "Not Downloaded" }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Article URL</TableHead>
                    <TableHead>Generated At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingImages ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : images.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Images Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {searchTerm || statusFilter !== 'all'
                              ? "No images match your search criteria. Try adjusting your filters."
                              : "Start by creating your first image using this template."}
                          </p>
                          {!searchTerm && statusFilter === 'all' && (
                            <Button
                              className="mt-4"
                              onClick={handleCreateNew}
                            >
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Create First Image
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Filter images based on status filter
                    (statusFilter === 'all' ? images : 
                     statusFilter === 'downloaded' ? downloadedImages : pendingImages)
                    .filter(img => 
                      searchTerm === "" || 
                      (img.subtitle && img.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (img.articleUrl && img.articleUrl.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((image) => (
                      <TableRow key={image.id}>
                        <TableCell>
                          <div className="relative h-12 w-20 rounded overflow-hidden border">
                            <Image
                              src={image.path}
                              alt={image.templateType}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          
                          <div className="text-xs text-muted-foreground">
                            Template: {image.templateType}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Entity: {image.entity}
                          </div>
                        </TableCell>
                        <TableCell>
                          {image.articleUrl ? (
                            <a 
                              href={image.articleUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-xs">
                                {image.articleUrl.length > 30
                                  ? image.articleUrl.substring(0, 30) + '...'
                                  : image.articleUrl}
                              </span>
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">No URL provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(image.generationTime)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(image.generationTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {image.downloadTime ? (
                            <div>
                              <Badge variant="success" className="flex items-center">
                                <Download className="mr-1 h-3 w-3" />
                                Downloaded
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(image.downloadTime)}
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline" className="flex items-center">
                              Pending Download
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDownload(image)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-500"
                              onClick={() => handleDelete(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {images.length > 0 && (
                <div className="border-t px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={pageSize.toString()}
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
                      options={[
                        { value: "10", label: "10 rows" },
                        { value: "20", label: "20 rows" },
                        { value: "50", label: "50 rows" }
                      ]}
                    />
                    
                    <div className="flex-1 flex items-center justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setPage(p => Math.max(1, p - 1))}
                              disabled={page === 1} 
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                isActive={page === i + 1}
                                onClick={() => setPage(i + 1)}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                              disabled={page === totalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                      Showing <span className="font-medium">{images.length}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> images
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}