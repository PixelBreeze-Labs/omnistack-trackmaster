// components/crm/customers/checkin-forms/index.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Eye,
  Calendar,
  Link as LinkIcon,
  BarChart2,
  Activity,
  TrendingUp,
  TrendingDown,
  Copy
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { CheckinFormForm } from "./CheckinFormForm";
import { DeleteFormDialog } from "./DeleteFormDialog";
import { CheckinFormConfig } from "@/app/api/external/omnigateway/types/checkin-forms";
import { useRouter } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/utils";

export function AllCheckinForms() {
  const router = useRouter();
  const {
    isLoading,
    forms,
    metrics,
    totalItems,
    totalPages,
    fetchForms,
    createForm,
    updateForm,
    deleteForm
  } = useCheckinForms();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [formType, setFormType] = useState("all");
  const [propertyId, setPropertyId] = useState("");
  
  const [formFormOpen, setFormFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<CheckinFormConfig | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<CheckinFormConfig | null>(null);

  useEffect(() => {
    fetchForms({
      page,
      limit: pageSize,
      isActive: isActive,
      isPreArrival: formType === 'pre-arrival' ? true : formType === 'on-arrival' ? false : undefined,
      propertyId: propertyId || undefined,
      search: searchTerm
    });
  }, [fetchForms, page, pageSize, isActive, formType, propertyId, searchTerm]);

  const handleRefresh = () => {
    fetchForms({
      page,
      limit: pageSize,
      isActive: isActive,
      isPreArrival: formType === 'pre-arrival' ? true : formType === 'on-arrival' ? false : undefined,
      propertyId: propertyId || undefined,
      search: searchTerm
    });
  };

  const handleCreateForm = async (data) => {
    await createForm(data);
    handleRefresh();
  };

  const handleUpdateForm = async (data) => {
    if (selectedForm) {
      await updateForm(selectedForm.shortCode, data);
      handleRefresh();
    }
  };

  const handleDeleteForm = async () => {
    if (formToDelete) {
      await deleteForm(formToDelete.shortCode);
      setDeleteDialogOpen(false);
      setFormToDelete(null);
      handleRefresh();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const viewSubmissions = (shortCode: string) => {
    router.push(`/crm/platform/checkin-forms/${shortCode}/submissions`);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Check-in Forms</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Create and manage guest check-in forms for your properties
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
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              setSelectedForm(null);
              setFormFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.totalForms ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">From last month</p>
              </div>
              <div className="flex items-center gap-1">
                {metrics?.trends?.forms?.percentage > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${metrics?.trends?.forms?.percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.forms?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.activeForms ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">From total forms</p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm text-muted-foreground`}>
                  {metrics?.totalForms ? Math.round((metrics.activeForms / metrics.totalForms) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.views?.toLocaleString() ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Views this month</p>
              </div>
              <div className="flex items-center gap-1">
                {metrics?.trends?.views?.percentage > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${metrics?.trends?.views?.percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.views?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submission Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.submissionRate?.toFixed(1) ?? 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">Submissions / Views</p>
              </div>
              <div className="flex items-center gap-1">
                {metrics?.trends?.submissions?.percentage > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${metrics?.trends?.submissions?.percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.submissions?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Forms</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter your check-in forms
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms by name or property..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <InputSelect
                name="isActive"
                label=""
                value={isActive === undefined ? "all" : isActive ? "active" : "inactive"}
                onChange={(e) => {
                  const value = e.target.value;
                  setIsActive(value === "all" ? undefined : value === "active");
                }}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" }
                ]}
              />
              <InputSelect
                name="formType"
                label=""
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "pre-arrival", label: "Pre-Arrival" },
                  { value: "on-arrival", label: "On-Arrival" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Short Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : !forms || forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Forms Found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm text-center">
                      {searchTerm || isActive !== undefined || formType !== 'all' || propertyId
                        ? "No forms match your search criteria. Try adjusting your filters." 
                        : "Start collecting guest information efficiently. Create your first check-in form."}
                    </p>
                    {!searchTerm && isActive === undefined && formType === 'all' && !propertyId && (
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          setSelectedForm(null);
                          setFormFormOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Form
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              ) : (
                forms?.map((form) => (
                  <TableRow key={form._id}>
                    <TableCell>
                      <div className="font-medium">{form.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {form.isPreArrival ? (
                          <>
                            <Calendar className="h-3 w-3" />
                            <span>Pre-arrival</span>
                          </>
                        ) : (
                          <>
                            <Activity className="h-3 w-3" />
                            <span>On-arrival</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{form.shortCode}</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(form.shortCode)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={form.isActive ? "success" : "secondary"}
                      >
                        {form.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {form.propertyId ? (
                        <div className="flex items-center gap-1">
                          <div className="font-medium">
                            {typeof form.propertyId === 'object' ? form.propertyId.name : 'Property'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{form.views}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {form.metadata?.submissionCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(form.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {form.expiresAt ? (
                        <div className="text-sm">
                          {formatDate(form.expiresAt)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <InputSelect
                          name="actions"
                          label=""
                          value=""
                          onChange={(e) => {
                            const action = e.target.value;
                            switch (action) {
                              case "edit":
                                setSelectedForm(form);
                                setFormFormOpen(true);
                                break;
                              case "delete":
                                setFormToDelete(form);
                                setDeleteDialogOpen(true);
                                break;
                              case "view-submissions":
                                viewSubmissions(form.shortCode);
                                break;
                              case "toggle-active":
                                updateForm(form.shortCode, {
                                  isActive: !form.isActive
                                });
                                break;
                              case "copy-link":
                                const formUrl = `${window.location.origin}/checkin/${form.shortCode}`;
                                copyToClipboard(formUrl);
                                break;
                            }
                          }}
                          options={[
                            { value: "", label: "Actions" },
                            { value: "edit", label: "Edit Form" },
                            { value: "view-submissions", label: "View Submissions" },
                            { value: "copy-link", label: "Copy Link" },
                            { value: "toggle-active", label: form.isActive ? "Deactivate" : "Activate" },
                            { value: "delete", label: "Delete Form" }
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
          {forms && forms.length > 0 && (
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
                  Showing <span className="font-medium">{forms?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> forms
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CheckinFormForm
        open={formFormOpen}
        onClose={() => {
          setFormFormOpen(false);
          setSelectedForm(null);
        }}
        onSubmit={selectedForm ? handleUpdateForm : handleCreateForm}
        initialData={selectedForm || undefined}
        title={selectedForm ? 'Edit Check-in Form' : 'Create New Check-in Form'}
      />

      <DeleteFormDialog 
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFormToDelete(null);
        }}
        onConfirm={handleDeleteForm}
        formName={formToDelete?.name || ''}
      />
    </div>
  );
}

export default AllCheckinForms;