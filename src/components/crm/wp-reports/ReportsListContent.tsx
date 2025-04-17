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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  Download, 
  RefreshCcw, 
  Eye, 
  File, 
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  FileBarChart2,
  Tag,
  User,
  Calendar,
  MessageSquare,
  Trash,
  Archive,
  Filter
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { DatePicker } from "@/components/ui/datepicker";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { useReports } from "@/hooks/useReports";
import { useClients } from "@/hooks/useClients";
import { Report, ReportStatus } from "@/app/api/external/omnigateway/types/reports";

interface ReportsListContentProps {
  clientId: string;
}

// Confirm Delete Modal
const DeleteReportModal = ({ 
  report, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting 
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(report);
      onClose();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash className="h-5 w-5 text-destructive" />
            Delete Report
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Status update modal
const UpdateStatusModal = ({
  report,
  isOpen,
  onClose,
  onConfirm,
  isProcessing
}) => {
  const [selectedStatus, setSelectedStatus] = useState(report?.status || ReportStatus.PENDING);

  const statusOptions = [
    { value: ReportStatus.PENDING, label: "Pending" },
    { value: ReportStatus.IN_PROGRESS, label: "In Progress" },
    { value: ReportStatus.RESOLVED, label: "Resolved" },
    { value: ReportStatus.CLOSED, label: "Closed" },
    { value: ReportStatus.ARCHIVED, label: "Archived" }
  ];

  const handleConfirm = async () => {
    try {
      await onConfirm(report._id, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Update Report Status
          </DialogTitle>
          <DialogDescription>
            Change the status of this report.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Current Status: {' '}
                <span className="font-normal">{getStatusLabel(report?.status)}</span>
              </label>
              <InputSelect
                name="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={statusOptions}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isProcessing || selectedStatus === report?.status}
          >
            {isProcessing ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get status badge
const getStatusBadge = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.PENDING:
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case ReportStatus.IN_PROGRESS:
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case ReportStatus.RESOLVED:
      return (
        <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Resolved
        </Badge>
      );
    case ReportStatus.CLOSED:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <Archive className="mr-1 h-3 w-3" />
          Closed
        </Badge>
      );
    case ReportStatus.ARCHIVED:
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
          <Archive className="mr-1 h-3 w-3" />
          Archived
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Helper function to get status label
const getStatusLabel = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.PENDING:
      return "Pending";
    case ReportStatus.IN_PROGRESS:
      return "In Progress";
    case ReportStatus.RESOLVED:
      return "Resolved";
    case ReportStatus.CLOSED:
      return "Closed";
    case ReportStatus.ARCHIVED:
      return "Archived";
    default:
      return "Unknown";
  }
};

// Format date helper function
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateString;
  }
};

export default function ReportsListContent({ clientId }: ReportsListContentProps) {
  const router = useRouter();
  const { 
    isLoading, 
    isProcessing, 
    reports, 
    totalItems, 
    totalPages, 
    summary,
    fetchReports, 
    fetchReportsSummaryByClientId,
    updateReportStatus,
    deleteReport
  } = useReports();
  
  const { getClient, isLoading: isClientLoading } = useClients();

  const [clientName, setClientName] = useState("Client");
  const [clientAppId, setClientAppId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);
  const [filterTab, setFilterTab] = useState("all");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Fetch client data on load
  useEffect(() => {
    const loadClient = async () => {
       
      if (clientId) {
        try {
          const client = await getClient(clientId);
          console.log('client', clientId);
          if (client) {
            setClientName(client.name);
            setClientAppId(client.client.clientAppIds[0]);
          }
        } catch (error) {
          console.error("Error loading client:", error);
        }
      }
    };

    loadClient();
  }, [clientId, getClient]);

  // Fetch reports data
  useEffect(() => {
    fetchReportsSummaryByClientId(clientId);
  }, [clientId, fetchReportsSummaryByClientId]);

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(() => ({
    page,
    limit: pageSize,
    clientAppId: clientAppId,
    status: statusFilter !== 'all' ? statusFilter as ReportStatus : undefined,
    search: searchTerm,
    fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
  }), [page, pageSize, clientAppId, statusFilter, searchTerm, fromDate, toDate]);

  useEffect(() => {
    console.log("Fetching reports with params:", fetchParams());
    fetchReports(fetchParams())
      .catch(error => {
        console.error("Error fetching reports data:", error);
      });
  }, [fetchReports, fetchParams]);

  const handleRefresh = () => {
    fetchReports(fetchParams());
    toast.success("Refreshed reports data");
  };

  const handleBackClick = () => {
    router.push(`/crm/platform/os-clients/${clientId}`);
  };

  const handleStatusUpdate = (report: Report) => {
    setSelectedReport(report);
    setIsStatusModalOpen(true);
  };

  const handleDeleteReport = (report: Report) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  const confirmStatusUpdate = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(reportId, status);
      toast.success(`Report status updated to ${getStatusLabel(status)}`);
      fetchReports(fetchParams());
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error("Failed to update report status");
    }
  };

  const confirmDeleteReport = async (report: Report) => {
    try {
      await deleteReport(report._id);
      toast.success("Report deleted successfully");
      fetchReports(fetchParams());
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const handleTabChange = (value: string) => {
    setFilterTab(value);
    
    // Update status filter based on tab
    if (value === "all") {
      setStatusFilter("all");
    } else if (value === "pending") {
      setStatusFilter(ReportStatus.PENDING);
    } else if (value === "in-progress") {
      setStatusFilter(ReportStatus.IN_PROGRESS);
    } else if (value === "resolved") {
      setStatusFilter(ReportStatus.RESOLVED);
    } else if (value === "closed") {
      setStatusFilter(ReportStatus.CLOSED);
    } else if (value === "archived") {
      setStatusFilter(ReportStatus.ARCHIVED);
    }
    
    // Reset pagination
    setPage(1);
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
            <h1 className="text-2xl font-bold tracking-tight">{clientName} Reports</h1>
            <p className="text-sm text-muted-foreground">
              View and manage reports for this client
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
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total submitted reports
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.byStatus?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Reports awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.byStatus?.in_progress || 0}</div>
            <p className="text-xs text-muted-foreground">
              Reports currently being addressed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.byStatus?.resolved || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs 
        defaultValue="all" 
        value={filterTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({summary?.byStatus?.pending || 0})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({summary?.byStatus?.in_progress || 0})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({summary?.byStatus?.resolved || 0})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({summary?.byStatus?.closed || 0})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({summary?.byStatus?.archived || 0})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Filter Reports</CardTitle>
          <CardDescription>Search and filter through report data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="w-40">
                <DatePicker
                  placeholderText="From Date"
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  selectsStart
                  startDate={fromDate}
                  endDate={toDate}
                />
              </div>
              <div className="w-40">
                <DatePicker
                  placeholderText="To Date"
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  selectsEnd
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={fromDate}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Loading reports...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !reports || reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <h3 className="font-medium mt-2">No Reports Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' || fromDate || toDate
                          ? "No reports match your search criteria. Try adjusting your filters."
                          : "There are no reports for this client yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <div className="font-mono text-xs">
                        {report._id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {report.content.sender?.name || 'Anonymous'}
                          </div>
                          {report.content.sender?.email && (
                            <div className="text-xs text-muted-foreground">
                              {report.content.sender.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {report.content.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {formatDate(report.createdAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {report.metadata?.timestamp ? 
                            format(new Date(report.metadata.timestamp), "h:mm a") : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell>
                      {report.priority ? (
                        <Badge variant={
                          report.priority === 'high' ? 'destructive' : 
                          report.priority === 'medium' ? 'outline' : 'secondary'
                        }>
                          {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Normal</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusUpdate(report)}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                       
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeleteReport(report)}
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
          {reports && reports.length > 0 && totalPages > 1 && (
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {reports.length} of {totalItems} reports
                  </p>
                  <InputSelect
                    name="pageSize"
                    label=""
                    value={pageSize.toString()}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setPage(1);
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
                            onClick={() => setPage(pageNum)}
                            isActive={page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
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
        </CardContent>
      </Card>
      
      {/* Status Update Modal */}
      {selectedReport && (
        <UpdateStatusModal
          report={selectedReport}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={confirmStatusUpdate}
          isProcessing={isProcessing}
        />
      )}
      
      {/* Delete Report Modal */}
      {selectedReport && (
        <DeleteReportModal
          report={selectedReport}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteReport}
          isDeleting={isProcessing}
        />
      )}

       {/* Add empty space div at the bottom */}
    <div className="h-8"></div>
    </div>
  );
}