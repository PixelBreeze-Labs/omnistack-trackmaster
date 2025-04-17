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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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
  ClipboardCopy,
  Trash2,
  PowerOff,
  AlertCircle
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "react-hot-toast";
import { useClients } from "@/hooks/useClients";
import { ClientStatus } from "@/app/api/external/omnigateway/types/clients";
import { z } from "zod";
import { useClientApps } from "@/hooks/useClientApps";

// Define currencies
const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" }
];

// Zod validation schema
const clientSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  defaultCurrency: z.string().min(3, "Currency is required"),
  clientAppIds: z.array(z.string()).optional(),
});

const CreateClientModal = ({ open, onClose, onSubmit, isSubmitting }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [clientAppId, setClientAppId] = useState("");
  const [errors, setErrors] = useState({});

  // Load client apps
  const { clientApps, fetchClientApps, isInitialized } = useClientApps();

  useEffect(() => {
    if (isInitialized) {
      fetchClientApps();
    }
  }, [isInitialized]);

  const generateCode = () => {
    if (!name) return;
    const generatedCode = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 10);
    setCode(generatedCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validData = clientSchema.parse({
        name,
        code,
        defaultCurrency: currency,
        clientAppIds: clientAppId ? [clientAppId] : []
    });

      setErrors({});
      await onSubmit(validData);
      setName("");
      setCode("");
      setCurrency("USD");
      setClientAppId([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Add New Client
          </DialogTitle>
          <DialogDescription>
            Create a new client organization in the system. This will generate an API key and set up the client's account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Client Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="code" className="text-sm font-medium">
                Client Code <span className="text-red-500">*</span>
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={generateCode} className="text-xs h-6 px-2">
                Generate from name
              </Button>
            </div>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ACMECORP"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code ? (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                The client code will be used for internal references and should be unique.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm font-medium">
              Default Currency <span className="text-red-500">*</span>
            </label>
            <InputSelect
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={currencies}
            />
            {errors.defaultCurrency && <p className="text-red-500 text-xs mt-1">{errors.defaultCurrency}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="clientAppIds" className="text-sm font-medium">
              Client Applications
            </label>
            <InputSelect
  name="clientAppIds"
  value={clientAppId}
  onChange={(e) => setClientAppId(e.target.value)}
  options={clientApps.map(app => ({
    value: app._id,
    label: app.name || app.code
  }))}
/>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 flex items-start gap-3 mt-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Important information:</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>A unique API key will be generated automatically</li>
                <li>The client will be created with active status</li>
                <li>You can add client applications later</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary">
              {isSubmitting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Client
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


// Delete Client Modal Component
const DeleteClientModal = ({ 
  client, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(client);
      toast.success("Client deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting client:", error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Client
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete client {client?.name}? This action cannot be undone and will remove all associated data.
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
            {isDeleting ? "Deleting..." : "Delete Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Toggle Status Modal Component
const ToggleStatusModal = ({ 
  client, 
  isOpen, 
  onClose, 
  onConfirm, 
  isProcessing = false 
}) => {
  const action = client?.isActive ? "deactivate" : "activate";

  const handleConfirm = async () => {
    try {
      await onConfirm(client);
      onClose();
    } catch (error) {
      console.error(`Error ${action}ing client:`, error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PowerOff className="h-5 w-5 text-warning" />
            {client?.isActive ? "Deactivate" : "Activate"} Client
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {action} client {client?.name}? 
            {client?.isActive 
              ? " Deactivating will prevent access to the client's resources." 
              : " Activating will restore access to the client's resources."
            }
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            className={client?.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
            onClick={handleConfirm} 
            disabled={isProcessing}
          >
            {isProcessing 
              ? `${client?.isActive ? "Deactivating" : "Activating"}...` 
              : `${client?.isActive ? "Deactivate" : "Activate"} Client`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Client Action Select Component
const ClientActionSelect = ({ 
  client, 
  onDeleteClient, 
  onToggleStatus,
  onViewDetails,
  isProcessing = false 
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");


  const handleDelete = async (client) => {
    await onDeleteClient(client);
  };
  
  const handleToggleStatus = async (client) => {
    await onToggleStatus(client);
  };


  // Watch for changes in the selected action
  useEffect(() => {
    if (selectedAction === "view-details") {
      onViewDetails(client);
      setSelectedAction("");
    } else if (selectedAction === "delete") {
      setIsDeleteModalOpen(true);
      setSelectedAction("");
    } else if (selectedAction === "toggle-status") {
      setIsToggleStatusModalOpen(true);
      setSelectedAction("");
    } else if (selectedAction === "copy-api-key") {
      navigator.clipboard.writeText(client.apiKey);
      toast.success("API Key copied to clipboard");
      setSelectedAction("");
    } else if (selectedAction === "copy-id") {
      navigator.clipboard.writeText(client._id);
      toast.success("Client ID copied to clipboard");
      setSelectedAction("");
    }
  }, [selectedAction, client, onViewDetails]);

  return (
    <>
      <InputSelect
        name={`clientAction-${client._id}`}
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "view-details", label: "View Details" },
          { value: "copy-api-key", label: "Copy API Key" },
          { value: "copy-id", label: "Copy ID" },
          { value: "toggle-status", label: client.isActive ? "Deactivate" : "Activate" },
          { value: "delete", label: "Delete Client" },
        ]}
      />

      <DeleteClientModal
        client={client}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isProcessing}
      />

      <ToggleStatusModal
        client={client}
        isOpen={isToggleStatusModalOpen}
        onClose={() => setIsToggleStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        isProcessing={isProcessing}
      />
    </>
  );
};

export function ClientsContent() {
  const {
    isLoading,
    clients,
    totalItems,
    totalPages,
    clientMetrics,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    isProcessing
  } = useClients();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(() => ({
    page,
    limit: pageSize,
    status: statusFilter !== 'all' ? statusFilter as ClientStatus : undefined,
    search: searchTerm
  }), [page, pageSize, statusFilter, searchTerm]);

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

  const handleCreateClient = async (clientData) => {
    try {
      await createClient(clientData);
      toast.success(`Client ${clientData.name} created successfully`);
      setIsCreateModalOpen(false);
      // Refresh the list to include the new client
      fetchClients(fetchParams());
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    }
  };

  const handleViewDetails = (client) => {
    router.push(`/crm/platform/os-clients/${client._id}`);
  };

  const handleDeleteClient = async (client) => {
    try {
      await deleteClient(client._id);
      toast.success(`Client ${client.name} deleted successfully`);
      // Refresh the list
      fetchClients(fetchParams());
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  const handleToggleStatus = async (client) => {
    try {
      const updatedClient = { 
        ...client, 
        isActive: !client.isActive 
      };
      await updateClient(client._id, { isActive: !client.isActive });
      toast.success(`Client ${client.name} ${client.isActive ? "deactivated" : "activated"} successfully`);
      // Refresh the list
      fetchClients(fetchParams());
    } catch (error) {
      console.error("Error updating client status:", error);
      toast.error("Failed to update client status");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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
    clientMetrics,
    isProcessing
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
            onClick={() => setIsCreateModalOpen(true)}
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
                        {searchTerm || statusFilter !== 'all'
                          ? "No clients match your search criteria. Try adjusting your filters." 
                          : "Start by adding your first client."}
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button 
                          className="mt-4"
                          onClick={() => setIsCreateModalOpen(true)}
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
    <ClientActionSelect
      client={client}
      onDeleteClient={handleDeleteClient}
      onToggleStatus={handleToggleStatus}
      onViewDetails={handleViewDetails}
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
    
    {/* Create Client Modal */}
    <CreateClientModal
      open={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onSubmit={handleCreateClient}
      isSubmitting={isProcessing}
    />
    
    {/* Add empty space div at the bottom */}
    <div className="h-4"></div>
  </div>
);
}

export default ClientsContent;