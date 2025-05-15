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
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import InputSelect from "@/components/Common/InputSelect";
import {
  AlertCircle,
  FilterX,
  RefreshCcw,
  Reply,
  FileText,
  Clock,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useKnowledge } from "@/hooks/useKnowledge";
import { toast } from "react-hot-toast";

export default function UnrecognizedQueriesList() {
  const router = useRouter();
  const {
    isLoading,
    unrecognizedQueries,
    totalItems,
    totalPages,
    fetchUnrecognizedQueries,
    respondToQuery,
    isInitialized,
  } = useKnowledge();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  
  // State for response dialog
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [createDocument, setCreateDocument] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("article");
  const [documentCategories, setDocumentCategories] = useState(["general"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Business types (these could be fetched from an API)
  const businessTypes = [
    { value: "all", label: "All Business Types" },
    { value: "restaurant", label: "Restaurant" },
    { value: "retail", label: "Retail" },
    { value: "healthcare", label: "Healthcare" },
    { value: "professional", label: "Professional Services" },
    { value: "manufacturing", label: "Manufacturing" },
  ];

  // Document types
  const documentTypes = [
    { value: "article", label: "Article" },
    { value: "faq", label: "FAQ" },
    { value: "tutorial", label: "Tutorial" },
    { value: "guide", label: "Guide" },
  ];

  // Categories
  const categories = [
    { value: "general", label: "General" },
    { value: "pricing", label: "Pricing" },
    { value: "features", label: "Features" },
    { value: "technical", label: "Technical" },
    { value: "support", label: "Support" },
  ];

  // Load unrecognized queries when component mounts
  useEffect(() => {
    if (isInitialized) {
      fetchUnrecognizedQueries({
        page,
        limit: pageSize,
        businessType: businessTypeFilter !== "all" ? businessTypeFilter : undefined,
      });
    }
  }, [isInitialized, fetchUnrecognizedQueries, page, pageSize, businessTypeFilter]);

  // Reset filters
  const handleResetFilters = () => {
    setBusinessTypeFilter("all");
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Format time
  const formatTime = (dateString) => {
    return format(new Date(dateString), "h:mm a");
  };

  // Open response dialog
  const handleRespond = (query) => {
    setSelectedQuery(query);
    setResponseText("");
    setCreateDocument(false);
    setDocumentTitle(query.query);
    setDocumentType("article");
    setDocumentCategories(["general"]);
    setIsResponseDialogOpen(true);
  };

  // Submit response
  const handleSubmitResponse = async () => {
    if (!responseText) {
      toast.error("Please enter a response");
      return;
    }

    setIsSubmitting(true);

    try {
      const responseData = {
        response: responseText,
        createKnowledgeDoc: createDocument,
      };

      if (createDocument) {
        if (!documentTitle) {
          toast.error("Please enter a document title");
          setIsSubmitting(false);
          return;
        }

        responseData.knowledgeDocData = {
          title: documentTitle,
          content: responseText,
          type: documentType,
          categories: documentCategories,
        };
      }

      await respondToQuery(selectedQuery._id, responseData);
      toast.success("Response submitted successfully");
      setIsResponseDialogOpen(false);
      
      // Refresh the list
      fetchUnrecognizedQueries({
        page,
        limit: pageSize,
        businessType: businessTypeFilter !== "all" ? businessTypeFilter : undefined,
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle category selection
  const toggleCategory = (category) => {
    setDocumentCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Unrecognized Queries</CardTitle>
          <CardDescription>
            Respond to queries that were not recognized by the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-end gap-4 mb-4">
            <div className="w-full md:w-64">
              <InputSelect
                name="businessType"
                label="Business Type"
                value={businessTypeFilter}
                onChange={(e) => setBusinessTypeFilter(e.target.value)}
                options={businessTypes}
              />
            </div>
            <Button variant="outline" onClick={handleResetFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>

          {/* Unrecognized Queries Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <RefreshCcw className="h-8 w-8 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : unrecognizedQueries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          No unrecognized queries found
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                          All user queries are being handled by the knowledge base.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  unrecognizedQueries.map((query) => (
                    <TableRow key={query._id}>
                      <TableCell>
                        <div className="font-medium">{query.query}</div>
                        <div className="text-sm text-muted-foreground">
                          From user: {query.userId || "Anonymous"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {query.businessType || "Not specified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(query.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(query.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {query.frequency || 1} {query.frequency === 1 ? "time" : "times"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleRespond(query)}
                          >
                            <Reply className="mr-2 h-4 w-4" />
                            Respond
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {unrecognizedQueries.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <strong>{unrecognizedQueries.length}</strong> of{" "}
                  <strong>{totalItems}</strong> unrecognized queries
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

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Respond to Query</DialogTitle>
            <DialogDescription>
              Provide a response to the user's query and optionally create a knowledge document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-1">Original Query:</h4>
              <p>{selectedQuery?.query}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                {selectedQuery?.createdAt && formatDate(selectedQuery.createdAt)}
                <Clock className="h-3 w-3 mx-1 ml-3" />
                {selectedQuery?.createdAt && formatTime(selectedQuery.createdAt)}
              </div>
            </div>

            <div>
              <Label htmlFor="response">Response</Label>
              <Textarea
                id="response"
                placeholder="Enter your response..."
                className="mt-1 h-32"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="createDocument"
                checked={createDocument}
                onCheckedChange={setCreateDocument}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="createDocument"
                  className="text-sm font-medium leading-none"
                >
                  Create Knowledge Document
                </Label>
                <p className="text-xs text-muted-foreground">
                  Create a knowledge document based on this response
                </p>
              </div>
            </div>

            {createDocument && (
              <div className="space-y-4 bg-slate-50 p-4 rounded-md mt-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  <h4 className="font-medium">Knowledge Document Details</h4>
                </div>

                <div>
                  <Label htmlFor="documentTitle">Document Title</Label>
                  <Input
                    id="documentTitle"
                    placeholder="Enter document title..."
                    className="mt-1"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <InputSelect
                    id="documentType"
                    name="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    options={documentTypes}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <div
                        key={category.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.value}`}
                          checked={documentCategories.includes(category.value)}
                          onCheckedChange={() => toggleCategory(category.value)}
                        />
                        <Label
                          htmlFor={`category-${category.value}`}
                          className="text-sm"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitResponse}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Reply className="mr-2 h-4 w-4" />
                  Submit Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}