"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Calendar,
  Code,
  Globe,
  ExternalLink,
  MoreHorizontal,
  Check,
  Clock,
  AlertTriangle,
  Building
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/datepicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample client data
const sampleClients = [
  {
    id: "67feacd0d5060f88345d005a",
    name: "Studio OmniStack",
    code: "STUDIOOS",
    appIds: ["67feac94d5060f88345d0058"],
    app: { name: "Studio", type: "react", domain: "https://studio.omnistackhub.xyz" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-04-15T19:00:32.094Z"
  },
  {
    id: "67feac2cd5060f88345d0056",
    name: "GazetaReforma",
    code: "GAZETAREFORMA",
    appIds: ["67bc762a2e1b619f6a026891"],
    app: { name: "GazetaReforma", type: "wordpress", domain: "gazetareforma.com" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-04-15T18:57:48.799Z"
  },
  {
    id: "67d6c95a72adfbad69d0a423",
    name: "VisionTrack",
    code: "VISIONTRACK",
    appIds: ["67d6c93572adfbad69d0a421"],
    app: { name: "VisionTrack", type: "other", domain: "https://visiontrack.xyz" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-03-16T12:51:38.859Z"
  },
  {
    id: "67d1490fda40caa565077c90",
    name: "Qytetaret",
    code: "QYTETARET",
    appIds: ["678d2de1abfabb117fbf5860"],
    app: { name: "Qytetaret", type: "other", domain: "qytetaret.al" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-03-12T08:42:55.556Z"
  },
  {
    id: "67cc3e32af1d976ffdf3e336",
    name: "PixelBreeze",
    code: "PIXELBREEZE",
    appIds: ["67cc3c5baf1d976ffdf3e334"],
    app: { name: "PixelBreeze", type: "other", domain: "https://pixelbreeze.xyz" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-03-08T12:55:14.288Z"
  },
  {
    id: "67cc3620af1d976ffdf3e314",
    name: "VenueBoost",
    code: "VENUEBOOST",
    appIds: ["67cc35fbaf1d976ffdf3e312"],
    app: { name: "VenueBoost", type: "react", domain: "https://venueboost.io" },
    currency: "USD",
    status: "active",
    createdAt: "2025-03-08T12:20:48.856Z"
  },
  {
    id: "67c98d0d9ff7cc87063adf68",
    name: "Metrosuites",
    code: "METROSUITES",
    appIds: ["67c98cf69ff7cc87063adf66"],
    app: { name: "Metrosuites", type: "other", domain: "https://metrosuites.al" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-03-06T11:54:53.907Z"
  },
  {
    id: "67b7f5562f3f468744d19336",
    name: "Staffluent",
    code: "STAFFLUENT",
    appIds: ["67b7f5382f3f468744d19334"],
    app: { 
      name: "Staffluent", 
      type: "other", 
      domain: ["https://staffluent.co", "https://app.staffluent.co"]
    },
    currency: "USD",
    status: "active",
    createdAt: "2025-02-21T03:39:02.132Z"
  },
  {
    id: "67b4e04b8a46d2a246b3ace8",
    name: "SnapFood",
    code: "SNAPFOOD",
    appIds: ["67b4e0228a46d2a246b3ace6"],
    app: { name: "SnapFood New Admin", type: "react", domain: "https://snapfood.omnistackhub.xyz/" },
    currency: "EUR",
    status: "active", 
    createdAt: "2025-02-18T19:32:27.917Z"
  },
  {
    id: "67ab31ee837a2adac2313ec8",
    name: "Snapwell",
    code: "SNAPWELL",
    appIds: ["67ab314f837a2adac2313ec6"],
    app: { name: "Snapwell", type: "react", domain: "snapwell.al" },
    currency: "EUR",
    status: "active",
    createdAt: "2025-02-11T11:18:06.636Z"
  }
];

// Mock hook for clients data - in a real implementation, this would be a proper API hook
const useClients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Memoized fetchClients function to prevent infinite render loops
  const fetchClients = useCallback(async (params) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        const filteredClients = sampleClients.filter(client => {
          if (params.search && !client.name.toLowerCase().includes(params.search.toLowerCase()) && 
              !client.code.toLowerCase().includes(params.search.toLowerCase())) {
            return false;
          }
          if (params.type && params.type !== "all" && client.app.type !== params.type) {
            return false;
          }
          if (params.status && params.status !== "all" && client.status !== params.status) {
            return false;
          }
          
          if (params.fromDate) {
            const clientDate = new Date(client.createdAt);
            const fromDate = new Date(params.fromDate);
            if (clientDate < fromDate) return false;
          }
          
          if (params.toDate) {
            const clientDate = new Date(client.createdAt);
            const toDate = new Date(params.toDate);
            if (clientDate > toDate) return false;
          }
          
          return true;
        });
        
        const start = (params.page - 1) * params.limit;
        const end = start + params.limit;
        const paginatedClients = filteredClients.slice(start, end);
        
        setClients(paginatedClients);
        setTotalItems(filteredClients.length);
        setTotalPages(Math.ceil(filteredClients.length / params.limit));
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsLoading(false);
      toast.error("Failed to fetch clients");
    }
  }, []); // Empty dependency array means this function never changes

  return {
    isLoading,
    clients,
    totalItems,
    totalPages,
    fetchClients
  };
};

export function ClientsContent() {
  const {
    isLoading,
    clients,
    totalItems,
    totalPages,
    fetchClients
  } = useClients();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);

  // Memoize the fetch parameters to prevent unnecessary re-renders
  const fetchParams = useCallback(() => ({
    page,
    limit: pageSize,
    type: typeFilter,
    status: statusFilter,
    search: searchTerm,
    fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
  }), [page, pageSize, typeFilter, statusFilter, searchTerm, fromDate, toDate]);

  useEffect(() => {
    fetchClients(fetchParams());
  }, [fetchClients, fetchParams]);

  const handleRefresh = () => {
    fetchClients(fetchParams());
  };

  const getAppTypeBadge = (type) => {
    switch (type) {
      case "react":
        return <Badge className="bg-blue-500">React</Badge>;
      case "wordpress":
        return <Badge className="bg-indigo-500">WordPress</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
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
                name="type"
                label=""
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "react", label: "React" },
                  { value: "wordpress", label: "WordPress" },
                  { value: "other", label: "Other" }
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
                  { value: "active", label: "Active" },
                  { value: "pending", label: "Pending" },
                  { value: "inactive", label: "Inactive" }
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

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
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
              ) : !clients || clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Briefcase className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Clients Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || fromDate || toDate
                          ? "No clients match your search criteria. Try adjusting your filters." 
                          : "Start by adding your first client."}
                      </p>
                      {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && !fromDate && !toDate && (
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
                  <TableRow key={client.id}>
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
                      {client.app.name}
                    </TableCell>
                    <TableCell>
                      {getAppTypeBadge(client.app.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm truncate max-w-[150px]">
                          {Array.isArray(client.app.domain) ? client.app.domain[0] : client.app.domain}
                        </span>
                        <a 
                          href={Array.isArray(client.app.domain) ? client.app.domain[0] : client.app.domain} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.currency}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(client.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Code className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Globe className="h-4 w-4 mr-2" />
                              Manage Application
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              View Usage
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Deactivate
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
    </div>
  );
}

export default ClientsContent;