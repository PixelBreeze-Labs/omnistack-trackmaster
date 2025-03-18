// components/crm/reports/AdminReportsList.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  RefreshCcw,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  FileText,
  MapPin,
  Tag
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useAdminReports } from "@/hooks/useAdminReports";
import { Badge } from "@/components/ui/badge";
import { AdminReport, ReportStatus } from "@/app/api/external/omnigateway/types/admin-reports";
import { ReportDetailsDialog } from "./ReportDetailsDialog";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { ReportStatusDialog } from "./ReportStatusDialog";
import { ReportTagsDialog } from "./ReportTagsDialog";

export function AdminReportsList() {
  const {
    isLoading,
    reports,
    totalItems,
    currentPage,
    totalPages,
    fetchReports,
    updateVisibility,
    updateFeatured,
    updateStatus,
    deleteReport,
    isInitialized
  } = useAdminReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<AdminReport | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [reportToUpdateStatus, setReportToUpdateStatus] = useState<AdminReport | null>(null);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [reportToUpdateTags, setReportToUpdateTags] = useState<AdminReport | null>(null);

  useEffect(() => {
    if (isInitialized) {
      fetchReports({
        page,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy,
        sortOrder
      });
    }
  }, [fetchReports, page, pageSize, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, isInitialized]);

  const handleRefresh = () => {
    if (isInitialized) {
      fetchReports({
        page,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy,
        sortOrder
      });
    }
  };

  const handleVisibilityChange = async (report: AdminReport) => {
    await updateVisibility(report._id, !report.visibleOnWeb);
  };

  const handleFeaturedChange = async (report: AdminReport) => {
    await updateFeatured(report._id, !report.isFeatured);
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    const success = await updateStatus(reportId, newStatus);
    if (success) {
      setStatusDialogOpen(false);
      setReportToUpdateStatus(null);
    }
  };

  const handleDelete = async (reportId: string) => {
    const success = await deleteReport(reportId);
    if (success) {
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case ReportStatus.PENDING_REVIEW:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending Review</Badge>;
      case ReportStatus.REJECTED:
        return <Badge variant="outline" className="bg-red-500/10 text-red-600">Rejected</Badge>;
      case ReportStatus.ACTIVE:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600">Active</Badge>;
      case ReportStatus.IN_PROGRESS:
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600">In Progress</Badge>;
      case ReportStatus.RESOLVED:
        return <Badge variant="outline" className="bg-green-500/10 text-green-600">Resolved</Badge>;
      case ReportStatus.CLOSED:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600">Closed</Badge>;
      case ReportStatus.NO_RESOLUTION:
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600">No Resolution</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community Reports</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage citizen reports submitted through your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Search & Filter</h3>
            <p className="text-sm text-muted-foreground">
              Filter through community reports
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: ReportStatus.PENDING_REVIEW, label: "Pending Review" },
                  { value: ReportStatus.REJECTED, label: "Rejected" },
                  { value: ReportStatus.ACTIVE, label: "Active" },
                  { value: ReportStatus.IN_PROGRESS, label: "In Progress" },
                  { value: ReportStatus.RESOLVED, label: "Resolved" },
                  { value: ReportStatus.CLOSED, label: "Closed" },
                  { value: ReportStatus.NO_RESOLUTION, label: "No Resolution" }
                ]}
              />
            </div>
            <div className="mt-2">
              <InputSelect
                name="category"
                label=""
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "infrastructure", label: "Infrastructure" },
                  { value: "safety", label: "Safety" },
                  { value: "environment", label: "Environment" },
                  { value: "public_services", label: "Public Services" },
                  { value: "health_services", label: "Health Services" },
                  { value: "transportation", label: "Transportation" }
                ]}
              />
            </div>
            <div className="mt-2">
              <InputSelect
                name="sortBy"
                label=""
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: "createdAt", label: "Sort by Date" },
                  { value: "title", label: "Sort by Title" },
                  { value: "status", label: "Sort by Status" }
                ]}
              />
            </div>
            <div className="mt-2">
              <InputSelect
                name="sortOrder"
                label=""
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                options={[
                  { value: "desc", label: "Newest First" },
                  { value: "asc", label: "Oldest First" }
                ]}
              />
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
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !reports || reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Reports Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                          ? "No reports match your search criteria. Try adjusting your filters."
                          : "There are no community reports yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <div className="font-medium max-w-xs truncate hover:cursor-pointer hover:text-primary"
                        onClick={() => {
                          setSelectedReport(report);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {report.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {report.isAnonymous 
                        ? <span className="text-muted-foreground">Anonymous</span>
                        : report.customAuthorName || '—'}
                    </TableCell>
                    <TableCell>
                      {report.visibleOnWeb 
                        ? <Badge variant="outline" className="bg-green-500/10 text-green-600">Public</Badge> 
                        : <Badge variant="outline" className="bg-red-500/10 text-red-600">Hidden</Badge>}
                    </TableCell>
                    <TableCell>
                      {report.isFeatured 
                        ? <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Featured</Badge> 
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground text-sm">
                        {formatDate(report.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report);
                                setDetailsDialogOpen(true);
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleVisibilityChange(report)}
                            >
                              {report.visibleOnWeb 
                                ? <><EyeOff className="mr-2 h-4 w-4" />Hide from Public</>
                                : <><Eye className="mr-2 h-4 w-4" />Make Public</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleFeaturedChange(report)}
                            >
                              {report.isFeatured
                                ? <><Star className="mr-2 h-4 w-4" />Remove Featured</>
                                : <><Star className="mr-2 h-4 w-4" />Mark as Featured</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setReportToUpdateStatus(report);
                                setStatusDialogOpen(true);
                              }}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setReportToUpdateTags(report);
                                setTagsDialogOpen(true);
                              }}
                            >
                              <Tag className="mr-2 h-4 w-4" />
                              Manage Tags
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setReportToDelete(report);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Report
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
                Showing <span className="font-medium">{reports?.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> reports
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      {selectedReport && (
        <ReportDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
        />
      )}

      {reportToDelete && (
        <DeleteReportDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setReportToDelete(null);
          }}
          onConfirm={() => handleDelete(reportToDelete._id)}
          reportTitle={reportToDelete.title}
        />
      )}

      {reportToUpdateStatus && (
        <ReportStatusDialog
          open={statusDialogOpen}
          onClose={() => {
            setStatusDialogOpen(false);
            setReportToUpdateStatus(null);
          }}
          onStatusChange={(status) => handleStatusChange(reportToUpdateStatus._id, status)}
          currentStatus={reportToUpdateStatus.status}
        />
      )}

      {reportToUpdateTags && (
        <ReportTagsDialog
          open={tagsDialogOpen}
          onClose={() => {
            setTagsDialogOpen(false);
            setReportToUpdateTags(null);
          }}
          report={reportToUpdateTags}
        />
      )}
    </div>
  );
}

export default AdminReportsList;