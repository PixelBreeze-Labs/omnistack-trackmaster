"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/new-card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InputSelect from "@/components/Common/InputSelect";
import {
  Search,
  FileText,
  Edit,
  Trash2,
  Eye,
  FilterX,
  RefreshCcw,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { useKnowledge } from "@/hooks/useKnowledge";
import { toast } from "react-hot-toast";

export default function KnowledgeDocumentsList() {
  const router = useRouter();
  const {
    isLoading,
    documents,
    totalItems,
    totalPages,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    isInitialized,
  } = useKnowledge();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "article",
    categories: [],
    keywords: "",
    applicableBusinessTypes: [],
    applicableFeatures: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories and document types
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "pricing", label: "Pricing" },
    { value: "features", label: "Features" },
    { value: "technical", label: "Technical" },
    { value: "support", label: "Support" },
    { value: "project_management", label: "Project Management" },
    { value: "task_management", label: "Task Management" },
    { value: "team_management", label: "Team Management" },
    { value: "time_tracking", label: "Time Tracking" },
    { value: "client_management", label: "Client Management" },
    { value: "reporting", label: "Reporting" },
  ];

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "article", label: "Article" },
    { value: "faq", label: "FAQ" },
    { value: "tutorial", label: "Tutorial" },
    { value: "guide", label: "Guide" },
  ];

  const businessTypes = [
    { value: "all", label: "All Business Types" },
    { value: "corporation", label: "Corporation" },
    { value: "llc", label: "LLC" },
    { value: "startup", label: "Startup" },
    { value: "nonprofit", label: "Nonprofit" },
    { value: "freelancer", label: "Freelancer" },
  ];

  const features = [
    { value: "project_management", label: "Project Management" },
    { value: "time_tracking", label: "Time Tracking" },
    { value: "team_management", label: "Team Management" },
    { value: "client_management", label: "Client Management" },
    { value: "reporting", label: "Reporting" },
    { value: "task_management", label: "Task Management" },
  ];

  // Get total count from API response
  const getTotalItems = () => {
    return totalItems || 0;
  };

  // Load documents when component mounts
  useEffect(() => {
    if (isInitialized) {
      fetchDocuments({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        categories: categoryFilter !== "all" ? [categoryFilter] : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
    }
  }, [isInitialized, fetchDocuments, page, pageSize, searchTerm, categoryFilter, typeFilter]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  // Document selection
  const toggleDocumentSelection = (documentId) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc._id));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (categoryValue) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryValue)
        ? prev.categories.filter(c => c !== categoryValue)
        : [...prev.categories, categoryValue]
    }));
  };

  const handleBusinessTypeToggle = (businessType) => {
    setFormData(prev => ({
      ...prev,
      applicableBusinessTypes: prev.applicableBusinessTypes.includes(businessType)
        ? prev.applicableBusinessTypes.filter(bt => bt !== businessType)
        : [...prev.applicableBusinessTypes, businessType]
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      applicableFeatures: prev.applicableFeatures.includes(feature)
        ? prev.applicableFeatures.filter(f => f !== feature)
        : [...prev.applicableFeatures, feature]
    }));
  };

  // Modal handlers
  const handleCreateDocument = () => {
    setFormData({
      title: "",
      content: "",
      type: "article",
      categories: [],
      keywords: "",
      applicableBusinessTypes: [],
      applicableFeatures: [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleViewDocument = async (documentId) => {
    try {
      const document = await getDocumentById(documentId);
      setSelectedDocument(document);
      setIsViewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load document");
    }
  };

  const handleEditDocument = async (documentId) => {
    try {
      const document = await getDocumentById(documentId);
      setSelectedDocument(document);
      setFormData({
        title: document.title,
        content: document.content,
        type: document.type,
        categories: document.categories || [],
        keywords: document.keywords?.join(", ") || "",
        applicableBusinessTypes: document.applicableBusinessTypes || [],
        applicableFeatures: document.applicableFeatures || [],
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load document");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    setDocumentToDelete(documentId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(documentToDelete);
      toast.success("Document deleted successfully");
      setShowDeleteConfirm(false);
      setDocumentToDelete(null);
      
      // Refresh the list
      fetchDocuments({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        categories: categoryFilter !== "all" ? [categoryFilter] : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  // Bulk delete selected documents
  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      for (const documentId of selectedDocuments) {
        await deleteDocument(documentId);
      }
      setSelectedDocuments([]);
      toast.success("Selected documents deleted successfully");
      setShowBulkDeleteConfirm(false);
      
      // Refresh the list
      fetchDocuments({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        categories: categoryFilter !== "all" ? [categoryFilter] : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast.error("Failed to delete some documents");
    }
  };

  // Submit handlers
  const handleCreateSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const documentData = {
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k),
      };
      
      await createDocument(documentData);
      toast.success("Document created successfully");
      setIsCreateDialogOpen(false);
      
      // Refresh the list
      fetchDocuments({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        categories: categoryFilter !== "all" ? [categoryFilter] : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const documentData = {
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k),
      };
      
      await updateDocument(selectedDocument._id, documentData);
      toast.success("Document updated successfully");
      setIsEditDialogOpen(false);
      
      // Refresh the list
      fetchDocuments({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        categories: categoryFilter !== "all" ? [categoryFilter] : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsSubmitting(false);
    }
  };

 

  // Document form modal
  const renderDocumentModal = (isEdit = false) => (
    <Dialog open={isEdit ? isEditDialogOpen : isCreateDialogOpen} onOpenChange={isEdit ? setIsEditDialogOpen : setIsCreateDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{isEdit ? "Edit Document" : "Create New Document"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the document details below" : "Fill in the details to create a new knowledge document"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter document title..."
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter document content..."
              className="h-40"
              value={formData.content}
              onChange={(e) => handleFormChange("content", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Document Type</Label>
              <InputSelect
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                options={documentTypes.filter(t => t.value !== "all")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                placeholder="keyword1, keyword2, keyword3..."
                value={formData.keywords}
                onChange={(e) => handleFormChange("keywords", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.filter(c => c.value !== "all").map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={formData.categories.includes(category.value)}
                    onCheckedChange={() => handleCategoryToggle(category.value)}
                  />
                  <Label htmlFor={`category-${category.value}`} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Applicable Business Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {businessTypes.filter(bt => bt.value !== "all").map((businessType) => (
                <div key={businessType.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`business-${businessType.value}`}
                    checked={formData.applicableBusinessTypes.includes(businessType.value)}
                    onCheckedChange={() => handleBusinessTypeToggle(businessType.value)}
                  />
                  <Label htmlFor={`business-${businessType.value}`} className="text-sm">
                    {businessType.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Applicable Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature.value}`}
                    checked={formData.applicableFeatures.includes(feature.value)}
                    onCheckedChange={() => handleFeatureToggle(feature.value)}
                  />
                  <Label htmlFor={`feature-${feature.value}`} className="text-sm">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => isEdit ? setIsEditDialogOpen(false) : setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={isEdit ? handleEditSubmit : handleCreateSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? "Update" : "Create"} Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-2">
      

      {/* Filters */}
      <Card>
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Knowledge Documents</CardTitle>
              <CardDescription>
                Create and manage knowledge base documents
              </CardDescription>
            </div>
            <Button onClick={handleCreateDocument}>
              <Plus className="mr-2 h-4 w-4" />
              Create Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-end gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <InputSelect
                name="category"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categories}
              />
            </div>
            <div className="w-full md:w-48">
              <InputSelect
                name="type"
                label="Document Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={documentTypes}
              />
            </div>
            <Button variant="outline" onClick={handleResetFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>

          

{/* Actions for selected documents */}
{selectedDocuments.length > 0 && (
            <div className="bg-muted p-2 rounded-md flex items-center justify-between mb-4">
              <span className="text-sm">
                {selectedDocuments.length} documents selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Documents Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          documents.length > 0 &&
                          selectedDocuments.length === documents.length
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[200px]">Categories</TableHead>
                    <TableHead className="min-w-[100px]">Last Updated</TableHead>
                    <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <RefreshCcw className="h-8 w-8 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">
                            No documents found
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                            {(searchTerm ||
                              categoryFilter !== "all" ||
                              typeFilter !== "all") &&
                              "Try adjusting your filters to find what you're looking for."}
                            {!searchTerm &&
                              categoryFilter === "all" &&
                              typeFilter === "all" &&
                              "Start creating knowledge documents to help users find information."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((document) => (
                      <TableRow key={document._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedDocuments.includes(document._id)}
                            onCheckedChange={() =>
                              toggleDocumentSelection(document._id)
                            }
                            aria-label={`Select ${document.title}`}
                          />
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="font-medium">{document.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {document.description || "No description provided"}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline">
                            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {document.categories?.map((category) => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                            {(!document.categories || document.categories.length === 0) && 
                              <span className="text-sm text-muted-foreground">None</span>
                            }
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {document.updatedAt
                            ? formatDate(document.updatedAt)
                            : formatDate(document.createdAt)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex justify-end gap-2">
                            <InputSelect
                              name={`actions-${document._id}`}
                              label=""
                              value=""
                              onChange={(e) => {
                                const action = e.target.value;
                                if (action === "view") {
                                  handleViewDocument(document._id);
                                } else if (action === "edit") {
                                  handleEditDocument(document._id);
                                } else if (action === "delete") {
                                  handleDeleteDocument(document._id);
                                }
                                // Reset the select value
                                e.target.value = "";
                              }}
                              options={[
                                { value: "", label: "Actions" },
                                { value: "view", label: "View" },
                                { value: "edit", label: "Edit" },
                                { value: "delete", label: "Delete" },
                              ]}
                              className="min-w-[100px]"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {documents.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <strong>{documents.length}</strong> of{" "}
                  <strong>{getTotalItems()}</strong> documents
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={pageSize.toString()}
                      onChange={(e) => {
                        setPageSize(parseInt(e.target.value));
                        setPage(1); // Reset to first page when changing page size
                      }}
                      options={[
                        { value: "10", label: "10 per page" },
                        { value: "20", label: "20 per page" },
                        { value: "50", label: "50 per page" },
                      ]}
                    />
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(Math.max(1, page - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, Math.ceil(getTotalItems() / pageSize)) }, (_, i) => {
                        const totalPagesCount = Math.ceil(getTotalItems() / pageSize);
                        const pageNumber = page <= 3 
                          ? i + 1 
                          : page - 2 + i;
                          
                        if (pageNumber <= totalPagesCount && pageNumber > 0) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={page === pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className="cursor-pointer"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(Math.min(Math.ceil(getTotalItems() / pageSize), page + 1))}
                          className={page >= Math.ceil(getTotalItems() / pageSize) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Document Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>
              Document details and content
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {selectedDocument && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <Badge variant="outline" className="mt-1">
                      {selectedDocument.type.charAt(0).toUpperCase() + selectedDocument.type.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="text-sm mt-1">
                      {selectedDocument.updatedAt
                        ? formatDate(selectedDocument.updatedAt)
                        : formatDate(selectedDocument.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Categories</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDocument.categories?.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                    {(!selectedDocument.categories || selectedDocument.categories.length === 0) && 
                      <span className="text-sm text-muted-foreground">None</span>
                    }
                  </div>
                </div>

                {selectedDocument.keywords && selectedDocument.keywords.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Keywords</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDocument.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Content</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md border">
                    <div className="whitespace-pre-wrap text-sm">{selectedDocument.content}</div>
                  </div>
                </div>

                {selectedDocument.applicableBusinessTypes && selectedDocument.applicableBusinessTypes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Applicable Business Types</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDocument.applicableBusinessTypes.map((type) => (
                        <Badge key={type} variant="outline">
                          {businessTypes.find(bt => bt.value === type)?.label || type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDocument.applicableFeatures && selectedDocument.applicableFeatures.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Applicable Features</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDocument.applicableFeatures.map((feature) => (
                        <Badge key={feature} variant="outline">
                          {features.find(f => f.value === feature)?.label || feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Use Count</Label>
                    <p className="text-sm mt-1">{selectedDocument.useCount || 0}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                    <p className="text-sm mt-1">{selectedDocument.createdBy || "System"}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleEditDocument(selectedDocument._id);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Document Modal */}
      {renderDocumentModal(false)}

      {/* Edit Document Modal */}
      {renderDocumentModal(true)}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDocument}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Modal */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Documents</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedDocuments.length} Document{selectedDocuments.length > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}