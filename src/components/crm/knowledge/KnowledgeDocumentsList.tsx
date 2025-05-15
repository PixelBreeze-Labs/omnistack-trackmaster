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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import InputSelect from "@/components/Common/InputSelect";
import {
  Search,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FilterX,
  RefreshCcw,
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
    deleteDocument,
    isInitialized,
  } = useKnowledge();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Categories and document types (these could be fetched from an API)
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "pricing", label: "Pricing" },
    { value: "features", label: "Features" },
    { value: "technical", label: "Technical" },
    { value: "support", label: "Support" },
  ];

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "article", label: "Article" },
    { value: "faq", label: "FAQ" },
    { value: "tutorial", label: "Tutorial" },
    { value: "guide", label: "Guide" },
  ];

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
  };

  // Handle document selection
  const toggleDocumentSelection = (documentId) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Select all documents
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

  // View document details
  const handleViewDocument = (documentId) => {
    router.push(`/crm/platform/knowledge/documents/${documentId}`);
  };

  // Edit document
  const handleEditDocument = (documentId) => {
    router.push(`/crm/platform/knowledge/documents/${documentId}/edit`);
  };

  // Delete document
  const handleDeleteDocument = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  // Bulk delete selected documents
  const handleBulkDelete = async () => {
    if (
      selectedDocuments.length === 0 ||
      !window.confirm(
        `Are you sure you want to delete ${selectedDocuments.length} documents?`
      )
    ) {
      return;
    }

    try {
      // Delete each selected document
      for (const documentId of selectedDocuments) {
        await deleteDocument(documentId);
      }
      setSelectedDocuments([]);
      toast.success("Selected documents deleted successfully");
    } catch (error) {
      console.error("Error during bulk delete:", error);
      toast.error("Failed to delete some documents");
    }
  };

  return (
    <div className="space-y-2">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Knowledge Documents</CardTitle>
          <CardDescription>
            Create and manage knowledge base documents
          </CardDescription>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>
                        <div className="font-medium">{document.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {document.description || "No description provided"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                      <TableCell>
                        {document.updatedAt
                          ? formatDate(document.updatedAt)
                          : formatDate(document.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleViewDocument(document._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditDocument(document._id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDocument(document._id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {documents.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <strong>{documents.length}</strong> of{" "}
                  <strong>{totalItems}</strong> documents
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={pageSize.toString()}
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
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
                          disabled={page === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = page <= 3 
                          ? i + 1 
                          : page - 2 + i;
                          
                        if (pageNumber <= totalPages) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={page === pageNumber}
                                onClick={() => setPage(pageNumber)}
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
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
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
    </div>
  );
}