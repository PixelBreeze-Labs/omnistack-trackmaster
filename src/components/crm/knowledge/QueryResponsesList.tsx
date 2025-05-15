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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InputSelect from "@/components/Common/InputSelect";
import {
  Search,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  FilterX,
  RefreshCcw,
  ArrowUpDown,
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
    totalPages,
    fetchQueryResponses,
    deleteQueryResponse,
    updateQueryResponse,
    isInitialized,
  } = useKnowledge();

  // State for filters, sorting and pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Categories (these could be fetched from an API)
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "pricing", label: "Pricing" },
    { value: "features", label: "Features" },
    { value: "technical", label: "Technical" },
    { value: "support", label: "Support" },
  ];

  // Sort options
  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "helpfulCount", label: "Helpful Count" },
    { value: "category", label: "Category" },
  ];

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

  // View query response details
  const handleViewQueryResponse = (queryResponseId) => {
    router.push(`/crm/platform/knowledge/query-responses/${queryResponseId}`);
  };

  // Edit query response
  const handleEditQueryResponse = (queryResponseId) => {
    router.push(`/crm/platform/knowledge/query-responses/${queryResponseId}/edit`);
  };

  // Delete query response
  const handleDeleteQueryResponse = async (queryResponseId) => {
    if (window.confirm("Are you sure you want to delete this query response?")) {
      try {
        await deleteQueryResponse(queryResponseId);
      } catch (error) {
        console.error("Error deleting query response:", error);
      }
    }
  };

  // Toggle active status
  const handleToggleActive = async (queryResponse) => {
    try {
      await updateQueryResponse(queryResponse._id, {
        ...queryResponse,
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Query-Response Pairs</CardTitle>
          <CardDescription>
            Manage pairs of common queries and their responses
          </CardDescription>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Query</TableHead>
                  <TableHead className="w-1/3">Response</TableHead>
                  <TableHead onClick={() => toggleSort("category")} className="cursor-pointer">
                    <div className="flex items-center">
                      Category
                      {sortField === "category" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => toggleSort("helpfulCount")} className="cursor-pointer">
                    <div className="flex items-center">
                      Feedback
                      {sortField === "helpfulCount" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Active</TableHead>
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
                ) : queryResponses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
                      <TableCell>
                        <div className="font-medium">
                          {truncateText(queryResponse.query)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm truncate max-w-xs">
                          {truncateText(queryResponse.response)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {queryResponse.category || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center text-sm text-green-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{queryResponse.helpfulCount || 0}</span>
                          </div>
                          <div className="flex items-center text-sm text-red-600">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span>{queryResponse.unhelpfulCount || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={queryResponse.active}
                          onCheckedChange={() => handleToggleActive(queryResponse)}
                        />
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
                                onClick={() => handleViewQueryResponse(queryResponse._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditQueryResponse(queryResponse._id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteQueryResponse(queryResponse._id)}
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
            {queryResponses.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <strong>{queryResponses.length}</strong> of{" "}
                  <strong>{totalItems}</strong> query responses
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