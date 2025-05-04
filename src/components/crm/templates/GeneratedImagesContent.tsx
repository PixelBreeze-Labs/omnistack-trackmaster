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
  ExternalLink,
  PieChart,
  Grid,
  Info
} from "lucide-react";
import { useGeneratedImages } from "@/hooks/useGeneratedImages";

export default function GeneratedImagesContent() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Filter and pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const router = useRouter();
  
  // Initialize the generated images hook
  const { 
    isLoading,
    images,
    totalItems,
    totalPages,
    stats,
    fetchGeneratedImages,
    fetchImageStats,
    deleteGeneratedImage,
    recordImageDownload,
    isInitialized
  } = useGeneratedImages();

  // Fetch images and stats when component loads
  useEffect(() => {
    if (isInitialized) {
      fetchGeneratedImages({
        page,
        limit: pageSize,
        entity: entityFilter !== 'all' ? entityFilter : undefined,
        templateType: templateFilter !== 'all' ? templateFilter : undefined
      });
      
      fetchImageStats();
    }
  }, [isInitialized, fetchGeneratedImages, fetchImageStats, page, pageSize, entityFilter, templateFilter]);

  // Refresh data
  const handleRefresh = () => {
    if (isInitialized) {
      fetchGeneratedImages({
        page,
        limit: pageSize,
        entity: entityFilter !== 'all' ? entityFilter : undefined,
        templateType: templateFilter !== 'all' ? templateFilter : undefined
      });
      fetchImageStats();
    }
  };

  // Handle download tracking
  const handleDownload = async (image) => {
    try {
      // Record the download
      await recordImageDownload(image?._id);
      
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = image.path;
      link.download = `image-${image?._id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download tracked successfully");
      
      // Refresh stats after download
      fetchImageStats();
    } catch (error) {
      console.error("Error tracking download:", error);
      toast.error("Failed to track download");
    }
  };

  // Handle image deletion
  const handleDelete = async (imageId: string) => {
    try {
      await deleteGeneratedImage(imageId);
      toast.success("Image deleted successfully");
      // Refresh the images list and stats
      handleRefresh();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  // Navigate to template dashboard
  const navigateToTemplate = (templateId: number) => {
    router.push(`/admin/crm/platform/template-dashboard/${templateId}`);
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

  // Filter images with download time for status filter
  const downloadedImages = images.filter(img => img.downloadTime);
  const pendingImages = images.filter(img => !img.downloadTime);

  // Filter images by search term
  const filteredImages = (statusFilter === 'all' ? images : 
                         statusFilter === 'downloaded' ? downloadedImages : pendingImages)
    .filter(img => 
      searchTerm === "" || 
      (img.subtitle && img.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (img.articleUrl && img.articleUrl.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Group images by entity and template type for stats
  const entitiesMap = new Map();
  const templatesMap = new Map();
  
  images.forEach(img => {
    // Count by entity
    if (entitiesMap.has(img.entity)) {
      entitiesMap.set(img.entity, entitiesMap.get(img.entity) + 1);
    } else {
      entitiesMap.set(img.entity, 1);
    }
    
    // Count by template type
    if (templatesMap.has(img.templateType)) {
      templatesMap.set(img.templateType, templatesMap.get(img.templateType) + 1);
    } else {
      templatesMap.set(img.templateType, 1);
    }
  });

  // Prepare entity options for filter dropdown
  const entityOptions = [
    { value: "all", label: "All Entities" },
    ...Array.from(entitiesMap.keys()).map(entity => ({
      value: entity,
      label: entity.charAt(0).toUpperCase() + entity.slice(1)
    }))
  ];

  // Prepare template options for filter dropdown
  const templateOptions = [
    { value: "all", label: "All Templates" },
    ...Array.from(templatesMap.keys()).map(template => ({
      value: template,
      label: template.replace(/_/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }))
  ];

  // Get template ID from template type (for navigation)
  const getTemplateId = (templateType: string): number => {
    if (templateType === 'web_news_story') return 5;
    if (templateType === 'web_news_story_2') return 14;
    return 0; // Default if not found
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Generated Images</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Overview of all images generated across templates
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
            onClick={() => router.push('/crm/platform/templates')}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" onValueChange={setCurrentTab} value={currentTab}>
        <TabsList>
          <TabsTrigger value="dashboard">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Grid className="mr-2 h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="list">
            <FileText className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  All time generated images
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
                <div className="text-3xl font-bold">{stats?.downloadRate?.toFixed(1) || 0}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Of images were downloaded
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Templates Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{templatesMap.size}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Different template types
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Entities Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{entitiesMap.size}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Different entities used
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Entity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Entity Distribution</CardTitle>
                <CardDescription>
                  Generated images by entity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : stats?.byEntity?.length === 0 ? (
                  <div className="text-center py-8">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">No data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.byEntity?.map((entity) => (
                      <div key={entity._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm font-medium">
                            {entity._id || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{entity.count}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({((entity.count / (stats?.total || 1)) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Template Usage</CardTitle>
                <CardDescription>
                  Generated images by template type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : stats?.byTemplate?.length === 0 ? (
                  <div className="text-center py-8">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">No data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.byTemplate?.map((template) => (
                      <div key={template._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm font-medium">
                            {template._id?.replace(/_/g, ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ') || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{template.count}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({((template.count / (stats?.total || 1)) * 100).toFixed(1)}%)
                          </span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigateToTemplate(getTemplateId(template._id))}
                            className="ml-2"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Images */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Images</CardTitle>
              <CardDescription>
                Latest generated images across all templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No images generated yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Start by creating your first image using one of our templates.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => router.push('/crm/platform/templates')}
                  >
                    Browse Templates
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.slice(0, 6).map((image) => (
                    <Card key={image?._id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src={image.path}
                          alt={image.templateType}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">
                          Generated: {formatDateTime(image.generationTime)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline">
                            {image.templateType?.replace(/_/g, ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                          {image.downloadTime ? (
                            <Badge variant="success" className="flex items-center">
                              <Download className="mr-1 h-3 w-3" />
                              Downloaded
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDownload(image)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {images.length > 6 && (
                <div className="text-center mt-4">
                  <Button 
                    variant="link" 
                    onClick={() => setCurrentTab("gallery")}
                  >
                    View All Images On Gallery / List View
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab Content */}
        <TabsContent value="gallery">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="mb-0">
                <h3 className="font-medium">Filter Images</h3>
                <p className="text-sm text-muted-foreground">
                  Search and filter through all generated images
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
                    name="entity"
                    label=""
                    value={entityFilter}
                    onChange={(e) => setEntityFilter(e.target.value)}
                    options={entityOptions}
                  />
                </div>
                <div className="w-36 mt-1">
                  <InputSelect
                    name="template"
                    label=""
                    value={templateFilter}
                    onChange={(e) => setTemplateFilter(e.target.value)}
                    options={templateOptions}
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

          {/* Gallery Grid */}
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Images Found</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    {searchTerm || entityFilter !== 'all' || templateFilter !== 'all' || statusFilter !== 'all'
                      ? "No images match your search criteria. Try adjusting your filters."
                      : "Start by creating your first image using one of our templates."}
                  </p>
                  {!searchTerm && entityFilter === 'all' && templateFilter === 'all' && statusFilter === 'all' && (
                    <Button 
                      className="mt-4"
                      onClick={() => router.push('/crm/platform/templates')}
                    >
                      Browse Templates
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <Card key={image?._id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src={image.path}
                          alt={image.templateType}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">
                          Generated: {formatDateTime(image.generationTime)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline">
                            {image.templateType?.replace(/_/g, ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                          {image.downloadTime ? (
                            <Badge variant="success" className="flex items-center">
                              <Download className="mr-1 h-3 w-3" />
                              Downloaded
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDownload(image)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500"
                            onClick={() => handleDelete(image?._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredImages.length > 0 && (
                <div className="mt-6 px-4 py-3 border-t">
                  <div className="flex items-center justify-between gap-4">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={pageSize.toString()}
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
                      options={[
                        { value: "12", label: "12 items" },
                        { value: "24", label: "24 items" },
                        { value: "36", label: "36 items" }
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
                      Showing <span className="font-medium">{filteredImages.length}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> images
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View Tab Content */}
        <TabsContent value="list">
          {/* Search and Filters (Same as Gallery) */}
          <Card className="mb-6">
            <CardHeader>
              <div className="mb-0">
                <h3 className="font-medium">Filter Images</h3>
                <p className="text-sm text-muted-foreground">
                  Search and filter through all generated images
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
                    name="entity"
                    label=""
                    value={entityFilter}
                    onChange={(e) => setEntityFilter(e.target.value)}
                    options={entityOptions}
                  />
                </div>
                <div className="w-36 mt-1">
                  <InputSelect
                    name="template"
                    label=""
                    value={templateFilter}
                    onChange={(e) => setTemplateFilter(e.target.value)}
                    options={templateOptions}
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
                    <TableHead>Template</TableHead>
                    <TableHead>Article URL</TableHead>
                    <TableHead>Generated At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredImages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Images Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {searchTerm || entityFilter !== 'all' || templateFilter !== 'all' || statusFilter !== 'all'
                              ? "No images match your search criteria. Try adjusting your filters."
                              : "Start by creating your first image using one of our templates."}
                          </p>
                          {!searchTerm && entityFilter === 'all' && templateFilter === 'all' && statusFilter === 'all' && (
                            <Button 
                              className="mt-4"
                              onClick={() => router.push('/crm/platform/templates')}
                            >
                              Browse Templates
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredImages.map((image) => (
                      <TableRow key={image?._id}>
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
                            Entity: {image.entity}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm"
                            onClick={() => navigateToTemplate(getTemplateId(image.templateType))}
                          >
                            {image.templateType?.replace(/_/g, ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Button>
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
                              onClick={() => handleDelete(image?._id)}
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
              {filteredImages.length > 0 && (
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
                      Showing <span className="font-medium">{filteredImages.length}</span> of{" "}
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
