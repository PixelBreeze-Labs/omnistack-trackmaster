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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import InputSelect from "@/components/Common/InputSelect";
import {
  Search,
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  FilterX,
  RefreshCcw,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { useKnowledge } from "@/hooks/useKnowledge";
import { toast } from "react-hot-toast";

export default function QueryResponsesList() {
  const router = useRouter();
  const {
    isLoading,
    queryResponses,
    totalItems,
    total,
    totalPages,
    fetchQueryResponses,
    deleteQueryResponse,
    updateQueryResponse,
    createQueryResponse,
    getQueryResponseById,
    isInitialized,
  } = useKnowledge();

  // State for filters, sorting and pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQueryResponse, setSelectedQueryResponse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [queryResponseToDelete, setQueryResponseToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    query: "",
    response: "",
    category: "general",
    keywords: "",
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories (these could be fetched from an API)
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

  // Sort options
  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "successRate", label: "Success Rate" },
    { value: "useCount", label: "Use Count" },
    { value: "category", label: "Category" },
  ];

  // Get total count from API response
  const getTotalItems = () => {
    return total || totalItems || 0;
  };

  // Load query responses when component mounts
  useEffect(() => {
    if (isInitialized) {
      fetchQueryResponses({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sortBy: sortField,
        sortDirection,
      });
    }
  }, [
    isInitialized,
    fetchQueryResponses,
    page,
    pageSize,
    searchTerm,
    categoryFilter,
    sortField,
    sortDirection,
  ]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setSortField("createdAt");
    setSortDirection("desc");
    setPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Modal handlers
  const handleCreateQueryResponse = () => {
    setFormData({
      query: "",
      response: "",
      category: "general",
      keywords: "",
      active: true,
    });
    setIsCreateDialogOpen(true);
  };

  const handleViewQueryResponse = async (queryResponseId) => {
    try {
      const queryResponse = await getQueryResponseById(queryResponseId);
      setSelectedQueryResponse(queryResponse);
      setIsViewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load query response");
    }
  };

  const handleEditQueryResponse = async (queryResponseId) => {
    try {
      const queryResponse = await getQueryResponseById(queryResponseId);
      setSelectedQueryResponse(queryResponse);
      setFormData({
        query: queryResponse.query,
        response: queryResponse.response,
        category: queryResponse.category || "general",
        keywords: queryResponse.keywords?.join(", ") || "",
        active: queryResponse.active !== undefined ? queryResponse.active : true,
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load query response");
    }
  };

  const handleDeleteQueryResponse = async (queryResponseId) => {
    setQueryResponseToDelete(queryResponseId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteQueryResponse = async () => {
    if (!queryResponseToDelete) return;
    
    try {
      await deleteQueryResponse(queryResponseToDelete);
      toast.success("Query response deleted successfully");
      setShowDeleteConfirm(false);
      setQueryResponseToDelete(null);
      
      // Refresh the list
      fetchQueryResponses({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sortBy: sortField,
        sortDirection,
      });
    } catch (error) {
      console.error("Error deleting query response:", error);
      toast.error("Failed to delete query response");
    }
  };

  // Submit handlers
  const handleCreateSubmit = async () => {
    if (!formData.query.trim() || !formData.response.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const queryResponseData = {
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k),
      };
      
      await createQueryResponse(queryResponseData);
      toast.success("Query response created successfully");
      setIsCreateDialogOpen(false);
      
      // Refresh the list
      fetchQueryResponses({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sortBy: sortField,
        sortDirection,
      });
    } catch (error) {
      console.error("Error creating query response:", error);
      toast.error("Failed to create query response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.query.trim() || !formData.response.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const queryResponseData = {
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k),
      };
      
      await updateQueryResponse(selectedQueryResponse._id, queryResponseData);
      toast.success("Query response updated successfully");
      setIsEditDialogOpen(false);
      
      // Refresh the list
      fetchQueryResponses({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sortBy: sortField,
        sortDirection,
      });
    } catch (error) {
      console.error("Error updating query response:", error);
      toast.error("Failed to update query response");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (queryResponse) => {
    try {
      await updateQueryResponse(queryResponse._id, {
        active: !queryResponse.active,
      });
      
      // Refresh the list
      fetchQueryResponses({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sortBy: sortField,
        sortDirection,
      });
      
      toast.success(`Query response ${queryResponse.active ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update status");
    }
  };

  // Truncate text
  const truncateText = (text, maxLength = 60) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Query response form modal
  const renderQueryResponseModal = (isEdit = false) => (
    <Dialog open={isEdit ? isEditDialogOpen : isCreateDialogOpen} onOpenChange={isEdit ? setIsEditDialogOpen : setIsCreateDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{isEdit ? "Edit Query Response" : "Create New Query Response"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the query response details below" : "Fill in the details to create a new query-response pair"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="space-y-2">
            <Label htmlFor="query">Query *</Label>
            <Input
              id="query"
              placeholder="Enter the common query..."
              value={formData.query}
              onChange={(e) => handleFormChange("query", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Response *</Label>
            <Textarea
              id="response"
              placeholder="Enter the response..."
              className="h-40"
              value={formData.response}
              onChange={(e) => handleFormChange("response", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <InputSelect
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => handleFormChange("category", e.target.value)}
                options={categories.filter(c => c.value !== "all")}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleFormChange("active", checked)}
            />
            <Label htmlFor="active" className="text-sm">
              Active (will be used for matching queries)
            </Label>
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
                {isEdit ? "Update" : "Create"} Query Response
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Query-Response Pairs</CardTitle>
              <CardDescription>
                Manage pairs of common queries and their responses
              </CardDescription>
            </div>
            <Button onClick={handleCreateQueryResponse}>
              <Plus className="mr-2 h-4 w-4" />
              Create Query Response
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-end gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search queries or responses..."
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
                name="sortField"
                label="Sort By"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                options={sortOptions}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="mb-0.5"
            >
              <ArrowUpDown
                className={`h-4 w-4 transform ${
                  sortDirection === "asc" ? "rotate-0" : "rotate-180"
                }`}
              />
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>

          {/* Query-Response Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Query</TableHead>
                    <TableHead className="min-w-[200px]">Response</TableHead>
                    <TableHead className="min-w-[100px]" onClick={() => toggleSort("category")} style={{cursor: 'pointer'}}>
                      <div className="flex items-center">
                        Category
                        {sortField === "category" && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px]">Success Rate</TableHead>
                    <TableHead className="min-w-[80px]">Use Count</TableHead>
                    <TableHead className="min-w-[80px]">Active</TableHead>
                    <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <RefreshCcw className="h-8 w-8 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : queryResponses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <MessageSquare className="h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">
                            No query responses found
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                            {(searchTerm || categoryFilter !== "all") &&
                              "Try adjusting your filters to find what you're looking for."}
                            {!searchTerm && categoryFilter === "all" &&
                              "Start creating query-response pairs to help users find information faster."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    queryResponses.map((queryResponse) => (
                      <TableRow key={queryResponse._id}>
                        <TableCell className="min-w-[200px]">
                          <div className="font-medium">
                            {truncateText(queryResponse.query, 80)}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="text-sm">
                            {truncateText(queryResponse.response, 100)}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline">
                            {queryResponse.category || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="text-sm">
                            {queryResponse.successRate !== undefined 
                              ? `${queryResponse.successRate.toFixed(1)}%`
                              : 'N/A'
                            }
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          <Badge variant="secondary">
                            {queryResponse.useCount || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          <Switch
                            checked={queryResponse.active !== false}
                            onCheckedChange={() => handleToggleActive(queryResponse)}
                          />
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex justify-end gap-2">
                            <InputSelect
                              name={`actions-${queryResponse._id}`}
                              label=""
                              value=""
                              onChange={(e) => {
                                const action = e.target.value;
                                if (action === "view") {
                                  handleViewQueryResponse(queryResponse._id);
                                } else if (action === "edit") {
                                  handleEditQueryResponse(queryResponse._id);
                                } else if (action === "delete") {
                                  handleDeleteQueryResponse(queryResponse._id);
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
            {queryResponses.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <strong>{queryResponses.length}</strong> of{" "}
                  <strong>{getTotalItems()}</strong> query responses
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

      {/* View Query Response Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Query Response Details</DialogTitle>
            <DialogDescription>
              View the query response pair details
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {selectedQueryResponse && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <Badge variant="outline" className="mt-1">
                      {selectedQueryResponse.category || "Uncategorized"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge variant={selectedQueryResponse.active !== false ? "default" : "secondary"} className="mt-1">
                      {selectedQueryResponse.active !== false ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Query</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md border">
                    <div className="text-sm font-medium">{selectedQueryResponse.query}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Response</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md border">
                    <div className="whitespace-pre-wrap text-sm">{selectedQueryResponse.response}</div>
                  </div>
                </div>

                {selectedQueryResponse.keywords && selectedQueryResponse.keywords.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Keywords</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedQueryResponse.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Success Rate</Label>
                    <p className="text-sm mt-1">
                      {selectedQueryResponse.successRate !== undefined 
                        ? `${selectedQueryResponse.successRate.toFixed(1)}%`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Use Count</Label>
                    <p className="text-sm mt-1">{selectedQueryResponse.useCount || 0}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="text-sm mt-1">
                      {selectedQueryResponse.updatedAt
                        ? formatDate(selectedQueryResponse.updatedAt)
                        : formatDate(selectedQueryResponse.createdAt)}
                    </p>
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
              handleEditQueryResponse(selectedQueryResponse._id);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Query Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Query Response Modal */}
      {renderQueryResponseModal(false)}

      {/* Edit Query Response Modal */}
      {renderQueryResponseModal(true)}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Query Response</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this query response? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQueryResponse}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}