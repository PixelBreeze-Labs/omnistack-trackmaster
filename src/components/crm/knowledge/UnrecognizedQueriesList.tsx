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
  MessageCircle,
  User,
  Hash,
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
    total, // Added total from API
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
    // Companies
    { value: "corporation", label: "Corporation" },
    { value: "private_company", label: "Private Company" },
    { value: "public_company", label: "Public Company" },
    { value: "llc", label: "LLC" },
    // Partnerships
    { value: "partnership", label: "Partnership" },
    { value: "limited_partnership", label: "Limited Partnership" },
    { value: "general_partnership", label: "General Partnership" },
    // Individual Ownership
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "solo_ownership", label: "Solo Ownership" },
    { value: "freelancer", label: "Freelancer" },
    // Special Types
    { value: "startup", label: "Startup" },
    { value: "nonprofit", label: "Nonprofit" },
    { value: "cooperative", label: "Cooperative" },
    // Regional Types
    { value: "plc", label: "PLC (Public Limited Company)" },
    { value: "ltd", label: "LTD (Limited Company)" },
    { value: "gmbh", label: "GmbH (German Company)" },
    { value: "sarl", label: "SARL (French Company)" },
    // Other Categories
    { value: "franchise", label: "Franchise" },
    { value: "family_business", label: "Family Business" },
    { value: "joint_venture", label: "Joint Venture" },
    { value: "other", label: "Other" }
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

  // Get total count from API response
  const getTotalItems = () => {
    return total || totalItems || 0;
  };

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
    setPage(1);
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
    setDocumentTitle(query.message || query.query);
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[300px]">Query</TableHead>
                    <TableHead className="min-w-[150px]">Business Type</TableHead>
                    <TableHead className="min-w-[120px]">User ID</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[80px]">Frequency</TableHead>
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
                  ) : unrecognizedQueries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
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
                        <TableCell className="min-w-[300px]">
                          <div className="space-y-1">
                            <div className="font-medium">{query.message || query.query}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Messages: {query.context?.sessionData?.messageCount || 'N/A'}
                            </div>
                            {query.context?.currentView && (
                              <div className="text-xs text-muted-foreground">
                                Current view: {query.context.currentView}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <Badge variant="outline">
                            {query.businessType || "Not specified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            <span className="truncate" title={query.userId}>
                              {query.userId ? query.userId.slice(-8) : "Anonymous"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {query.clientId ? `Client: ${query.clientId.slice(-6)}` : "No client"}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Badge variant={query.status === "pending" ? "destructive" : "success"}>
                            {query.status}
                          </Badge>
                          {query.resolved !== undefined && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {query.resolved ? "Resolved" : "Unresolved"}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(query.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(query.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          <Badge variant="secondary">
                            {query.frequency || 1} {query.frequency === 1 ? "time" : "times"}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
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
            </div>

            {/* Pagination */}
            {unrecognizedQueries.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <strong>{unrecognizedQueries.length}</strong> of{" "}
                  <strong>{getTotalItems()}</strong> unrecognized queries
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

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Respond to Query</DialogTitle>
            <DialogDescription>
              Provide a response to the user's query and optionally create a knowledge document
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-1">Original Query:</h4>
              <p className="break-words">{selectedQuery?.message || selectedQuery?.query}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedQuery?.createdAt && formatDate(selectedQuery.createdAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedQuery?.createdAt && formatTime(selectedQuery.createdAt)}
                </div>
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  User: {selectedQuery?.userId ? selectedQuery.userId.slice(-8) : "Anonymous"}
                </div>
              </div>
              {selectedQuery?.context?.currentView && (
                <div className="text-sm text-muted-foreground mt-1">
                  Current view: {selectedQuery.context.currentView}
                </div>
              )}
            </div>

            {/* Show conversation history if available */}
            {selectedQuery?.context?.conversationHistory && selectedQuery.context.conversationHistory.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-md">
                <h4 className="font-medium mb-2">Recent Conversation:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedQuery.context.conversationHistory.map((msg, index) => (
                    <div key={index} className={`text-sm p-2 rounded ${
                      msg.sender === 'bot' ? 'bg-blue-50 border-l-2 border-blue-200' : 'bg-gray-50 border-l-2 border-gray-200'
                    }`}>
                      <div className="font-medium text-xs text-muted-foreground mb-1">
                        {msg.sender === 'bot' ? 'Bot' : 'User'}:
                      </div>
                      <div className="break-words">{msg.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              <div className="space-y-4 bg-slate-50 p-4 rounded-md">
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

          <DialogFooter className="shrink-0 border-t pt-4 mt-4">
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