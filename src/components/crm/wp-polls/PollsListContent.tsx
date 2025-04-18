    "use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/new-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Download,
  RefreshCcw,
  Eye,
  BarChart2,
  Edit,
  Calendar,
  Filter,
  Trash,
  CheckCircle2,
  PenTool,
  Vote,
  Palette,
  ToggleLeft
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { usePolls } from "@/hooks/usePolls";
import { useClients } from "@/hooks/useClients";
import { Poll } from "@/app/api/external/omnigateway/types/polls";
import { cn } from "@/lib/utils";
import InputSelect from "@/components/Common/InputSelect";
import PollPreview from "./PollPreview";
import PollDetailsModal from "./PollDetailsModal";
import DeletePollModal from "./DeletePollModal";

interface PollsListContentProps {
  clientId: string;
}

// Date display helper
const DateDisplay = ({ dateString }: { dateString: string | undefined }) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateString;
  }
};

export default function PollsListContent({ clientId }: PollsListContentProps) {
  const router = useRouter();
  const {
    isLoading,
    isProcessing,
    polls,
    totalItems,
    totalPages,
    currentPage,
    fetchPolls,
    fetchPollStats,
    deletePoll,
    stats
  } = usePolls();

  const { getClient, isLoading: isClientLoading } = useClients();

  const [clientName, setClientName] = useState("Client");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Sort options
  const sortOptions = [
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
    { value: "title:asc", label: "Title (A-Z)" },
    { value: "title:desc", label: "Title (Z-A)" }
  ];

  // Fetch client data on load
  useEffect(() => {
    const loadClient = async () => {
      if (clientId) {
        try {
          const response = await getClient(clientId);
          
          // Handle both the old and new response format
          const client = response.client || response;
          
          if (client) {
            setClientName(client.name);
          }
        } catch (error) {
          console.error("Error loading client:", error);
        }
      }
    };

    loadClient();
  }, [clientId, getClient]);

  // Fetch poll stats on load
  useEffect(() => {
    fetchPollStats(clientId).catch(error => {
      console.error("Error fetching poll stats:", error);
    });
  }, [fetchPollStats, clientId]);

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(() => {
    const params: any = {
      page,
      limit: pageSize,
      search: searchTerm,
      sortBy,
      sortOrder
    };
    
    // Date filtering
    if (fromDate) {
      params.fromDate = format(fromDate, 'yyyy-MM-dd');
    }
    
    if (toDate) {
      params.toDate = format(toDate, 'yyyy-MM-dd');
    }
    
    return params;
  }, [page, pageSize, searchTerm, sortBy, sortOrder, fromDate, toDate]);

  // Fetch polls when fetch parameters change
  useEffect(() => {
    fetchPolls(clientId, fetchParams())
      .catch(error => {
        console.error("Error fetching polls data:", error);
      });
  }, [fetchPolls, fetchParams, clientId]);

  const handleRefresh = async () => {
    try {
      await fetchPolls(clientId, fetchParams());
      await fetchPollStats(clientId);
      toast.success("Refreshed polls data");
    } catch (error) {
      console.error("Error refreshing polls:", error);
      toast.error("Failed to refresh polls");
    }
  };

  const handleBackClick = () => {
    router.push(`/crm/platform/os-clients/${clientId}`);
  };

  const handleEditPoll = (pollId: string) => {
    router.push(`/crm/platform/os-clients/${clientId}/wp-polls/${pollId}/edit`);
  };

  const handleDeletePoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsDetailsModalOpen(true);
  };

  const handlePreviewPoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsPreviewModalOpen(true);
  };

  const confirmDeletePoll = async (poll: Poll) => {
    try {
      await deletePoll(poll._id);
      toast.success("Poll deleted successfully");
      
      // Refresh data after deletion
      await fetchPolls(clientId, fetchParams());
      await fetchPollStats(clientId);
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll");
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchPolls(clientId, fetchParams());
  };

  const handleDateFilter = () => {
    setPage(1); // Reset to first page when applying date filter
    fetchPolls(clientId, fetchParams());
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split(":");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
    setPage(1); // Reset to first page when sorting
    
    // Apply the filter
    fetchPolls(clientId, {
      ...fetchParams(),
      sortBy: newSortBy,
      sortOrder: newSortOrder as "asc" | "desc",
      page: 1
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="h-8 w-8 p-0 mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{clientName} Polls</h1>
            <p className="text-sm text-muted-foreground">
              View and manage interactive polls for this client
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPolls || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total created polls
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVotes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Votes across all polls
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <BarChart2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium truncate">
              {stats?.mostPopularPoll ? stats.mostPopularPoll.title : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.mostPopularPoll ? `${stats.mostPopularPoll.votes} votes` : "No votes yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.latestPolls && stats.latestPolls.length > 0 ? stats.latestPolls.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent poll activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Filter Polls</CardTitle>
          <CardDescription>Search and filter through poll data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search polls..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="w-48">
                <InputSelect
                  name="sort"
                  label=""
                  value={`${sortBy}:${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  options={sortOptions}
                />
              </div>
              
              <div className="w-40">
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setFromDate(e.target.value ? new Date(e.target.value) : undefined)}
                  placeholder="From Date"
                />
              </div>
              <div className="w-40">
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setToDate(e.target.value ? new Date(e.target.value) : undefined)}
                  min={fromDate ? format(fromDate, "yyyy-MM-dd") : undefined}
                  placeholder="To Date"
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleDateFilter}
              >
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Polls Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>WordPress ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Loading polls...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !polls || polls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Vote className="h-12 w-12 text-muted-foreground" />
                      <h3 className="font-medium mt-2">No Polls Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || fromDate || toDate
                          ? "No polls match your search criteria. Try adjusting your filters."
                          : "There are no polls for this client yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                polls.map((poll) => (
                  <TableRow key={poll._id}>
                    <TableCell>
                      <div className="font-medium">{poll.title}</div>
                      {poll.description && (
                        <div className="text-xs text-muted-foreground max-w-xs truncate">
                          {poll.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {poll.options.length} options
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {poll.options.reduce((sum, option) => sum + option.votes, 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {poll.wordpressId ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          ID: {poll.wordpressId}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          Not Connected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <DateDisplay dateString={poll.createdAt} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {poll.autoEmbed && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Auto-embed
                          </Badge>
                        )}
                        {poll.showResults && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            Show Results
                          </Badge>
                        )}
                        {poll.darkMode && (
                          <Badge variant="outline" className="bg-slate-700 text-slate-100 border-slate-600">
                            Dark Mode
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewPoll(poll)}
                          title="Preview Poll"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(poll)}
                          title="View Details"
                        >
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPoll(poll._id)}
                          title="Edit Poll"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeletePoll(poll)}
                          title="Delete Poll"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {polls && polls.length > 0 && totalPages > 1 && (
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {polls.length} of {totalItems} polls
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            const newPage = Math.max(1, page - 1);
                            setPage(newPage);
                            fetchPolls(clientId, {
                              ...fetchParams(),
                              page: newPage
                            });
                          }}
                          disabled={page === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => {
                                setPage(pageNum);
                                fetchPolls(clientId, {
                                  ...fetchParams(),
                                  page: pageNum
                                });
                              }}
                              isActive={page === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            const newPage = Math.min(totalPages, page + 1);
                            setPage(newPage);
                            fetchPolls(clientId, {
                              ...fetchParams(),
                              page: newPage
                            });
                          }}
                          disabled={page === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                <div className="flex items-center space-x-4">
                  <InputSelect
                    name="pageSize"
                    label=""
                    value={pageSize.toString()}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      setPageSize(newSize);
                      setPage(1); // Reset to first page when changing page size
                      
                      // Refetch with new page size
                      const newParams = {
                        ...fetchParams(),
                        limit: newSize,
                        page: 1
                      };
                      fetchPolls(clientId, newParams);
                    }}
                    options={[
                      { value: "10", label: "10 per page" },
                      { value: "20", label: "20 per page" },
                      { value: "50", label: "50 per page" },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Poll Details Modal */}
      {selectedPoll && (
        <PollDetailsModal
          poll={selectedPoll}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Delete Poll Modal */}
      {selectedPoll && (
        <DeletePollModal
          poll={selectedPoll}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeletePoll}
          isDeleting={isProcessing}
        />
      )}
      
      {/* Poll Preview Modal */}
      {selectedPoll && (
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Poll Preview
              </DialogTitle>
              <DialogDescription>
                Preview how the poll will appear to users
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <PollPreview poll={selectedPoll} />
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsPreviewModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
          
      {/* Add empty space div at the bottom */}
      <div className="h-8"></div>
    </div>
  );
}