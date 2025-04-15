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
  Briefcase,
  Search,
  Download,
  RefreshCcw,
  Plus,
  Check,
  Clock,
  AlertTriangle,
  Building,
  TrendingUp,
  Copy,
  
  Gift,
  ClipboardCopy
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useClients } from "@/hooks/useClients";
import { ClientStatus } from "@/app/api/external/omnigateway/types/clients";

export function ClientsContent() {
  const {
    isLoading,
    clients,
    totalItems,
    totalPages,
    clientMetrics,
    fetchClients
  } = useClients();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientAction, setClientAction] = useState("");

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(() => ({
    page,
    limit: pageSize,
    status: statusFilter !== 'all' ? statusFilter as ClientStatus : undefined,
    search: searchTerm,
    fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
  }), [page, pageSize, statusFilter, searchTerm, fromDate, toDate]);

  useEffect(() => {
    console.log("Fetching clients with params:", fetchParams());
    fetchClients(fetchParams())
      .then(response => {
        console.log("Client data fetched:", response);
      })
      .catch(error => {
        console.error("Error fetching client data:", error);
      });
  }, [fetchClients, fetchParams]);

  const handleRefresh = () => {
    fetchClients(fetchParams());
    toast.success("Refreshed client data");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleActionChange = (e, client) => {
    const action = e.target.value;
    setSelectedClientId(client._id);
    setClientAction(action);

    // Execute the selected action
    switch (action) {
      case "copy-api-key":
        copyToClipboard(client.apiKey);
        break;
      case "copy-id":
        copyToClipboard(client._id);
        break;
      case "toggle-status":
        // Here you would implement the toggle status logic
        toast.success(`${client.isActive ? "Deactivated" : "Activated"} ${client.name}`);
        break;
      default:
        // Reset after selection
        setTimeout(() => {
          setClientAction("");
          setSelectedClientId("");
        }, 500);
        break;
    }

    // Reset the select after action
    setTimeout(() => {
      setClientAction("");
      setSelectedClientId("");
    }, 500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
      case true:
        return (
          <Badge variant="success" className="bg-green-500">
            <Check className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "inactive":
      case false:
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

  const truncateApiKey = (apiKey) => {
    if (!apiKey) return "N/A";
    return `${apiKey.substring(0, 5)}...`;
  };

  // Debug output to help troubleshoot
  console.log("Current state:", {
    isLoading,
    clientsCount: clients?.length || 0,
    totalItems,
    totalPages,
    clientMetrics
  });

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your client organizations and their applications
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
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientMetrics?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total registered client organizations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientMetrics?.activeClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active client accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Clients</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientMetrics?.inactiveClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently inactive client accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Clients</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientMetrics?.recentClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              New clients in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Clients</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your client data
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or code..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  { value: ClientStatus.ACTIVE, label: "Active" },
                  { value: ClientStatus.INACTIVE, label: "Inactive" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>VenueBoost</TableHead>
                <TableHead>Loyalty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !clients || clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Briefcase className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Clients Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' || fromDate || toDate
                          ? "No clients match your search criteria. Try adjusting your filters." 
                          : "Start by adding your first client."}
                      </p>
                      {!searchTerm && statusFilter === 'all' && !fromDate && !toDate && (
                        <Button 
                          className="mt-4"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Client
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients?.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Building className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="font-medium">{client.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{client.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                          {truncateApiKey(client.apiKey)}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(client.apiKey)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{client._id.substring(0, 6)}...</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(client._id)}
                        >
                          <ClipboardCopy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.defaultCurrency}
                    </TableCell>
                    <TableCell>
                      {client.venueBoostConnection ? (
                        <Badge variant="success" className="bg-green-500">
                          <Check className="mr-1 h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Not Connected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.loyaltyProgram && client.loyaltyProgram.programName ? (
                        <Badge variant="success" className="bg-purple-500">
                          <Gift className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Gift className="mr-1 h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(client.isActive ? "active" : "inactive")}
                    </TableCell>
                    <TableCell>
                      {formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="w-36">
                        <InputSelect
                          name={`action-${client._id}`}
                          label=""
                          value={selectedClientId === client._id ? clientAction : ""}
                          onChange={(e) => handleActionChange(e, client)}
                          options={[
                            { value: "", label: "Actions" },
                            { value: "copy-api-key", label: "Copy API Key" },
                            { value: "copy-id", label: "Copy ID" },
                            { value: "toggle-status", label: client.isActive ? "Deactivate" : "Activate" }
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
          {clients && clients.length > 0 && (
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
                  Showing <span className="font-medium">{clients?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> clients
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

export default ClientsContent;