"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Monitor,
  Search,
  Download,
  RefreshCcw,
  Plus,
  ExternalLink,
  Check,
  Clock,
  AlertTriangle,
  Code,
  Activity,
  Globe,
  FileText,
  Mail,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "react-hot-toast";
import { DatePicker } from "@/components/ui/datepicker";
import { format } from "date-fns";
import { ClientAppStatus, ClientAppType } from "@/app/api/external/omnigateway/types/client-apps";
import { useClientApps } from "@/hooks/useClientApps";
import { CreateClientAppModal } from "./ClientAppModals";
import ClientAppActionSelect from "./ClientAppActionSelect";

export function ClientAppsContent() {
  const {
    isLoading,
    isProcessing,
    clientApps,
    totalItems,
    totalPages,
    clientAppMetrics,
    fetchClientApps,
    createClientApp,
    updateClientApp,
    deleteClientApp,
  } = useClientApps();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(() => ({
    page,
    limit: pageSize,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm,
    fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
  }), [page, pageSize, typeFilter, statusFilter, searchTerm, fromDate, toDate]);

  useEffect(() => {
    console.log("Fetching client apps with params:", fetchParams());
    fetchClientApps(fetchParams())
      .then(response => {
        console.log("Client apps data fetched:", response);
      })
      .catch(error => {
        console.error("Error fetching client apps data:", error);
      });
  }, [fetchClientApps, fetchParams]);

  const handleRefresh = () => {
    fetchClientApps(fetchParams());
    toast.success("Refreshed client applications data");
  };

  const handleCreateClientApp = async (clientAppData) => {
    try {
      await createClientApp(clientAppData);
      toast.success(`Application ${clientAppData.name} created successfully`);
      setIsCreateModalOpen(false);
      // Refresh the list to include the new client app
      fetchClientApps(fetchParams());
    } catch (error) {
      console.error("Error creating client app:", error);
      toast.error("Failed to create client application");
    }
  };

  const handleDeleteClientApp = async (clientApp) => {
    try {
      await deleteClientApp(clientApp._id);
      toast.success(`Application ${clientApp.name} deleted successfully`);
      // Refresh the list
      fetchClientApps(fetchParams());
    } catch (error) {
      console.error("Error deleting client app:", error);
      toast.error("Failed to delete client application");
    }
  };

  const handleToggleStatus = async (clientApp) => {
    try {
      const newStatus = clientApp.status === 'active' ? 'inactive' : 'active';
      const updatedClientApp = { 
        ...clientApp, 
        status: newStatus
      };
      await updateClientApp(clientApp._id, { status: newStatus });
      toast.success(`Application ${clientApp.name} ${clientApp.status === 'active' ? "deactivated" : "activated"} successfully`);
      // Refresh the list
      fetchClientApps(fetchParams());
    } catch (error) {
      console.error("Error updating client app status:", error);
      toast.error("Failed to update client application status");
    }
  };

  const getAppTypeBadge = (type) => {
    switch (type) {
      case ClientAppType.REACT:
        return <Badge className="bg-blue-500">React</Badge>;
      case ClientAppType.WORDPRESS:
        return <Badge className="bg-indigo-500">WordPress</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case ClientAppStatus.ACTIVE:
        return (
          <Badge variant="success" className="bg-green-500">
            <Check className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case ClientAppStatus.PENDING:
        return (
          <Badge variant="warning" className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case ClientAppStatus.INACTIVE:
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Debug output to help troubleshoot
  console.log("Current state:", {
    isLoading,
    clientAppsCount: clientApps?.length || 0,
    totalItems,
    totalPages,
    clientAppMetrics,
    isProcessing
  });

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Applications</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage applications connected to your client organizations
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
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Application
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientAppMetrics?.totalApps || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total registered client applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientAppMetrics?.activeApps || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active client applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Applications</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientAppMetrics?.inactiveApps || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently inactive client applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Applications</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientAppMetrics?.recentApps || 0}</div>
            <p className="text-xs text-muted-foreground">
              New applications in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Applications</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your application data
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications by name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-40 mt-2">
              <InputSelect
                name="type"
                label=""
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: ClientAppType.REACT, label: "React" },
                  { value: ClientAppType.WORDPRESS, label: "WordPress" },
                  { value: ClientAppType.OTHER, label: "Other" }
                ]}
              />
            </div>
            <div className="w-40 mt-2">
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: ClientAppStatus.ACTIVE, label: "Active" },
                  { value: ClientAppStatus.PENDING, label: "Pending" },
                  { value: ClientAppStatus.INACTIVE, label: "Inactive" }
                ]}
              />
            </div>
            <div className="w-40 mt-3">
              <DatePicker 
                date={fromDate} 
                setDate={setFromDate} 
                placeholder="From Date"
              />
            </div>
            <div className="w-40 mt-3">
              <DatePicker 
                date={toDate} 
                setDate={setToDate} 
                placeholder="To Date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Apps Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Configured Date</TableHead>
                <TableHead>Report Config</TableHead>
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
              ) : !clientApps || clientApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Monitor className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Applications Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || fromDate || toDate
                          ? "No applications match your search criteria. Try adjusting your filters." 
                          : "Start by adding your first application."}
                      </p>
                      {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && !fromDate && !toDate && (
                        <Button 
                          className="mt-4"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Application
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clientApps?.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Monitor className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono truncate max-w-[100px]">
                              {app.apiKey.substring(0, 10)}...
                            </code>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAppTypeBadge(app.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm truncate max-w-[150px]">
                          {Array.isArray(app.domain) ? app.domain[0] : app.domain}
                        </span>
                        <a 
                          href={Array.isArray(app.domain) ? app.domain[0] : app.domain} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      {Array.isArray(app.domain) && app.domain.length > 1 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          +{app.domain.length - 1} more
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {app.client?.name ? (
                        <div>
                          <div className="font-medium">{app.client.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {app.client.code}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline">No Client</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(app.configuredAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Form
                        </Badge>
                        <Badge variant="outline" className="ml-1 mb-1">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-36">
                        <ClientAppActionSelect
                          clientApp={app}
                          onDeleteClientApp={handleDeleteClientApp}
                          onToggleStatus={handleToggleStatus}
                          isProcessing={isProcessing}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {clientApps && clientApps.length > 0 && (
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
                  Showing <span className="font-medium">{clientApps?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> applications
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create Client App Modal */}
      <CreateClientAppModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClientApp}
        isSubmitting={isProcessing}
      />
    </div>
  );
}

export default ClientAppsContent;