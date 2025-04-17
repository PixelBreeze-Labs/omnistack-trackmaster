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
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useReports } from "@/hooks/useReports";
import { useClients } from "@/hooks/useClients";
import { Report, ReportStatus } from "@/app/api/external/omnigateway/types/reports";
import { cn } from "@/lib/utils";
import InputSelect from "@/components/Common/InputSelect";

interface ReportsListContentProps {
  clientId: string;
}

interface ReportDetailsModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

const DateDisplay = ({ dateString }: { dateString: string | undefined }) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateString;
  }
};

// Report Details Modal
const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, isOpen, onClose }) => {
  if (!report) {
    return null;
  }

  const senderName = (report: Report): string => {
    const otherKeys = Object.keys(report.content).filter(
      (key) => key !== 'sender' && key !== 'message' && key !== 'files'
    );
  
    if (otherKeys.length > 0) {
      const firstKey = otherKeys[0]; // Get the first key
      const firstValue = report.content[firstKey];
      if (typeof firstValue === 'string' || typeof firstValue === 'number') {
        return String(firstValue); // Return as string
      }
    }
  
    return report.content.sender?.name || 'Anonymous';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            Report Details
          </DialogTitle>
          <DialogDescription>
            Details of the report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-gray-700">ID</p>
              <p className="text-sm text-gray-500">{report._id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Sender Name</p>
            <p className="text-sm text-gray-500">{senderName(report)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Sender Email</p>
              <p className="text-sm text-gray-500">{report.content.sender?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              {getStatusBadge(report.status)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Priority</p>
              <p className="text-sm text-gray-500">
                {report.priority ? report.priority.charAt(0).toUpperCase() + report.priority.slice(1) : 'Normal'}
              </p>
            </div>
            {report.metadata?.timestamp && (
              <div>
                <p className="text-sm font-medium text-gray-700">Timestamp</p>
                <p className="text-sm text-gray-500"><DateDisplay dateString={report.metadata.timestamp} /></p>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Message</p>
            <div className="text-sm text-gray-500 max-h-40 overflow-y-auto border rounded-md p-2">
              {report.content.message}
            </div>
          </div>
          {report.content.files && report.content.files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700">Files</p>
              <ul className="list-disc pl-4">
                {report.content.files.map((file, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {file.name}
                    </a>
                    <Download className="h-4 w-4 text-blue-500" />
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {Object.keys(report.content)
            .filter(key => key !== 'sender' && key !== 'message' && key !== 'files' && key !== 'additionalInfo')
            .map(key => (
              <div key={key}>
                <p className="text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                <p className="text-sm text-gray-500">
                  {typeof report.content[key] === 'object'
                    ? JSON.stringify(report.content[key], null, 2)
                    : report.content[key]}
                </p>
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Confirm Delete Modal
const DeleteReportModal = ({
  report,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (report: Report) => Promise<void>;
  isDeleting: boolean;
}) => {
  const handleConfirm = async () => {
    if (report) {
      try {
        await onConfirm(report);
        onClose();
      } catch (error) {
        console.error("Error deleting report:", error);
      }
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
}: {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reportId: string, status: ReportStatus) => Promise<void>;
  isProcessing: boolean;
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
    if (report) {
      try {
        await onConfirm(report._id, selectedStatus);
        onClose();
      } catch (error) {
        console.error("Error updating report status:", error);
      }
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch client data on load
  useEffect(() => {
    const loadClient = async () => {
      if (clientId) {
        try {
          const client = await getClient(clientId);
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
    if (clientId && clientAppId) {
      const fetch = async () => {
        try {
          await fetchReports({
            page: 1,
            limit: pageSize,
            clientAppId: clientAppId,
            status: statusFilter !== 'all' ? statusFilter as ReportStatus : undefined,
            search: searchTerm,
            fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
            toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
          });
          await fetchReportsSummaryByClientId(clientId);
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      };

      fetch();
    }
  }, [clientId, fetchReports, fetchReportsSummaryByClientId, pageSize, clientAppId, statusFilter, searchTerm, fromDate, toDate]);

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

  const handleRefresh = async () => {
    try {
      await fetchReports(fetchParams());
      toast.success("Refreshed reports data");
    } catch (error) {
      console.error("Error refreshing reports:", error);
      toast.error("Failed to refresh reports");
    }
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

  const handleOpenDetailsModal = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const confirmStatusUpdate = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(reportId, status);
      toast.success(`Report status updated to ${getStatusLabel(status)}`);
      await fetchReports(fetchParams());
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error("Failed to update report status");
    }
  };

  const confirmDeleteReport = async (report: Report) => {
    try {
      await deleteReport(report._id);
      toast.success("Report deleted successfully");
      await fetchReports(fetchParams());
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const handleTabChange = (value: string) => {
    setFilterTab(value);

    let newStatusFilter: string | ReportStatus = "all";

    if (value !== "all") {
      if (value === "pending") newStatusFilter = ReportStatus.PENDING;
      if (value === "in-progress") newStatusFilter = ReportStatus.IN_PROGRESS;
      if (value === "resolved") newStatusFilter = ReportStatus.RESOLVED;
      if (value === "closed") newStatusFilter = ReportStatus.CLOSED;
      if (value === "archived") newStatusFilter = ReportStatus.ARCHIVED;
    }

    setStatusFilter(newStatusFilter);

    setPage(1); // Reset pagination on tab change

    //Refetch data
    if (clientId && clientAppId) {
      fetchReports({
        page: 1,
        limit: pageSize,
        clientAppId: clientAppId,
        status: newStatusFilter !== 'all' ? newStatusFilter as ReportStatus : undefined,
        search: searchTerm,
        fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
        toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
      });
    }
  };

  const senderName = (report: Report): string => {
    const otherKeys = Object.keys(report.content).filter(
      (key) => key !== 'sender' && key !== 'message' && key !== 'files'
    );
  
    if (otherKeys.length > 0) {
      const firstKey = otherKeys[0]; // Get the first key
      const firstValue = report.content[firstKey];
      if (typeof firstValue === 'string' || typeof firstValue === 'number') {
        return String(firstValue); // Return as string
      }
    }
  
    return report.content.sender?.name || 'Anonymous';
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
        // value={filterTab}
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
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setFromDate(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            <div className="w-40">
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setToDate(e.target.value ? new Date(e.target.value) : undefined)}
                min={fromDate ? format(fromDate, "yyyy-MM-dd") : undefined}
              />
            </div>
            
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
                            {senderName(report)}
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
                      <div className="max-w-[300px] truncate overflow-x-auto">
                        {report.content.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {report.metadata?.timestamp && (
                          <span className="text-sm">
                            <DateDisplay dateString={report.metadata.timestamp} />
                          </span>
                        )}
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDetailsModal(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
          isOpen={isDeleteModalOpen}onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteReport}
          isDeleting={isProcessing}
          />
          )}
          
            {/* Report Details Modal */}
            {selectedReport && (
              <ReportDetailsModal
                report={selectedReport}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
              />
            )}
          
            {/* Add empty space div at the bottom */}
            <div className="h-8"></div>
          </div>
          );
          }