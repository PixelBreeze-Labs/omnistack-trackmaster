// components/crm/customers/checkin-forms/submissions/index.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckinSubmissions } from "@/hooks/useCheckinSubmissions";
import { useCheckinForms } from "@/hooks/useCheckinForms";
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
  Search,
  RefreshCcw,
  Download,
  FileText,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function FormSubmissions({ shortCode }: { shortCode: string }) {
  const router = useRouter();
  const { getForm } = useCheckinForms();
  const {
    isLoading,
    submissions,
    totalItems,
    totalPages,
    fetchFormSubmissions,
    updateSubmissionStatus
  } = useCheckinSubmissions();

  const [formDetails, setFormDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch form details when component mounts
  useEffect(() => {
    const loadFormDetails = async () => {
      try {
        const details = await getForm(shortCode);
        setFormDetails(details);
      } catch (error) {
        console.error("Error loading form details:", error);
      }
    };

    loadFormDetails();
  }, [shortCode, getForm]);

  // Fetch submissions when parameters change or form details load
  useEffect(() => {
    if (formDetails && formDetails._id) {
      fetchFormSubmissions(formDetails._id, {
        page,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined
      });
    }
  }, [fetchFormSubmissions, page, pageSize, searchTerm, statusFilter, formDetails]);

  const handleRefresh = () => {
    if (formDetails && formDetails._id) {
      fetchFormSubmissions(formDetails._id, {
        page,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined
      });
    }
  };

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    try {
      await updateSubmissionStatus(submissionId, newStatus);
      handleRefresh();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleBackToForms = () => {
    router.push("/crm/platform/checkin-forms");
  };

  // Helper function to convert snake_case or kebab-case to Title Case
const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'verified':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date with time for display
  const formatDateTime = (dateString: string) => {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleBackToForms}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Forms
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2">
            {formDetails?.name ? `Submissions: ${formDetails.name}` : "Form Submissions"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage guest check-in form submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Form Details Card */}
      {formDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Form Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Form Name</h4>
                <p className="font-medium">{formDetails.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Short Code</h4>
                <Badge variant="outline">{formDetails.shortCode}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <Badge variant={formDetails.isActive ? "success" : "secondary"}>
                  {formDetails.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Property</h4>
                <p>{formDetails.propertyId ? 
                  (typeof formDetails.propertyId === 'object' ? formDetails.propertyId.name : 'Property') : 
                  'None'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Form Type</h4>
                <p>{formDetails.isPreArrival ? 'Pre-Arrival' : 'On-Arrival'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Created Date</h4>
                <p>{formatDate(formDetails.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Submissions</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter submitted forms
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-2 md:flex-row gap-2">
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "verified", label: "Verified" },
                  { value: "rejected", label: "Rejected" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parking Required</TableHead>
                <TableHead>Expected Arrival</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !submissions || submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Submissions Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all'
                          ? "No submissions match your search criteria. Try adjusting your filters."
                          : "This form has not received any submissions yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission._id}>
  <TableCell>
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-medium">{`${submission.firstName} ${submission.lastName}`}</div>
        {submission.guestId && (
          <div className="text-xs text-muted-foreground">
            Existing Guest
          </div>
        )}
        {/* Show ID information */}
        {submission.formData?.idType && (
          <div className="text-xs text-muted-foreground mt-1">
            ID: {toTitleCase(submission.formData.idType)}
          </div>
        )}
      </div>
    </div>
  </TableCell>
  <TableCell>
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{submission.email}</span>
      </div>
      {submission.phoneNumber && (
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{submission.phoneNumber}</span>
        </div>
      )}
      {/* Display Address */}
      {submission.formData?.addressLine1 && (
        <div className="text-xs text-muted-foreground mt-1">
          <div>{submission.formData.addressLine1}</div>
          {submission.formData.addressLine2 && <div>{submission.formData.addressLine2}</div>}
          <div>
            {[
              submission.formData.city,
              submission.formData.state,
              submission.formData.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>
      )}
    </div>
  </TableCell>
  <TableCell>
    {getStatusBadge(submission.status)}
    <div className="text-xs text-muted-foreground mt-2">
      {submission.verifiedAt && (
        <div className="mt-1">Verified: {formatDate(submission.verifiedAt)}</div>
      )}
    </div>
  </TableCell>
  <TableCell>
    {submission.needsParkingSpot ? (
      <div>
        <Badge variant="outline" className="text-green-600 bg-green-50">
          Yes
        </Badge>
        {/* Show Vehicle Info */}
        {submission.formData?.vehicleMakeModel && (
          <div className="mt-2 text-xs">
            <div className="text-muted-foreground">{submission.formData.vehicleMakeModel}</div>
            {submission.formData.vehicleColor && (
              <div className="text-muted-foreground">
                {submission.formData.vehicleColor}
              </div>
            )}
            {submission.formData.vehicleLicensePlate && (
              <div className="text-muted-foreground">
                Plate: {submission.formData.vehicleLicensePlate}
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <span className="text-muted-foreground">No</span>
    )}
  </TableCell>
  <TableCell>
    {submission.expectedArrivalTime ? (
      <div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{submission.expectedArrivalTime}</span>
        </div>
        {/* Special Requests */}
        {submission.specialRequests && submission.specialRequests.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <strong>Special Requests:</strong>
            <ul className="list-disc pl-4 mt-1">
              {submission.specialRequests.map((request, index) => (
                <li key={index}>{request}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ) : (
      <span className="text-muted-foreground">Not specified</span>
    )}
  </TableCell>
  <TableCell>
    <div className="flex items-center gap-1">
      <Calendar className="h-3 w-3 text-muted-foreground" />
      <span>{formatDateTime(submission.createdAt)}</span>
    </div>
    {/* Metadata */}
    {submission.metadata && (
      <div className="mt-1 text-xs text-muted-foreground">
        {submission.metadata.submittedFrom && (
          <div>Source: {submission.metadata.submittedFrom}</div>
        )}
        {submission.metadata.browserInfo && (
          <div>Browser: {submission.metadata.browserInfo}</div>
        )}
      </div>
    )}
  </TableCell>
  <TableCell>
    <div className="flex justify-end">
      <InputSelect
        name={`action-${submission._id}`}
        label=""
        value=""
        onChange={(e) => {
          const action = e.target.value;
          switch (action) {
            case "verify":
              handleStatusChange(submission._id, "verified");
              break;
            case "reject":
              handleStatusChange(submission._id, "rejected");
              break;
            case "reset":
              handleStatusChange(submission._id, "pending");
              break;
          }
        }}
        options={[
          { value: "", label: "Actions" },
          { value: "view", label: "View Details" },
          ...(submission.status !== "verified" ? [{ value: "verify", label: "Mark as Verified" }] : []),
          ...(submission.status !== "rejected" ? [{ value: "reject", label: "Mark as Rejected" }] : []),
          ...(submission.status !== "pending" ? [{ value: "reset", label: "Reset to Pending" }] : [])
        ]}
      />
    </div>
  </TableCell>
</TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {submissions && submissions.length > 0 && (
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
                  Showing <span className="font-medium">{submissions?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> submissions
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
         {/* Add empty space div at the bottom */}
  <div className="h-4"></div>
    </div>
  );
}

export default FormSubmissions;