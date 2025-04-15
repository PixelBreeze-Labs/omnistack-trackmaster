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
  Monitor,
  Search,
  Download,
  RefreshCcw,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Check,
  Clock,
  AlertTriangle,
  Globe,
  Code,
  Settings,
  FileText,
  Mail,
  Activity
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

// Sample client apps data
const sampleClientApps = [
  {
    id: "67feac94d5060f88345d0058",
    name: "Studio",
    type: "react",
    apiKey: "2562f6eef6e0b80bc314ac86462928fb0c2b22b7c25e03cb69eb724e10cb8e48",
    domain: ["https://studio.omnistackhub.xyz"],
    configuredAt: "2025-04-15T18:59:32.806Z",
    status: "active",
    client: {
      name: "Studio OmniStack",
      code: "STUDIOOS",
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@studio.omnistackhub.xyz"],
        fromName: "Studio",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67fea465d5060f88345d0052",
    name: "Iconstyle",
    type: "wordpress",
    apiKey: "42a54765eb5e5cf7fbe97d46c2e37723e2ad7559b9b95e2f8adf666128a5684e",
    domain: ["https://iconstyle.al"],
    configuredAt: "2025-04-15T18:24:37.533Z",
    status: "active",
    client: {
      name: null,
      code: null
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@iconstyle.al"],
        fromName: "Iconstyle",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67d6c93572adfbad69d0a421",
    name: "VisionTrack",
    type: "other",
    apiKey: "84d6798b1e189542da94a7232ea81cdf3badfbc326ea7c6d046f857df6df3123",
    domain: ["https://visiontrack.xyz"],
    configuredAt: "2025-03-16T12:51:01.721Z",
    status: "active",
    client: {
      name: "VisionTrack",
      code: "VISIONTRACK"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@visiontrack.xyz"],
        fromName: "VisionTrack",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67cc3c5baf1d976ffdf3e334",
    name: "PixelBreeze",
    type: "other",
    apiKey: "37a192cf44fbedf29ee871e63130487b8e891a1e4e34f2e6186940d740c5c6b2",
    domain: ["https://pixelbreeze.xyz"],
    configuredAt: "2025-03-08T12:47:23.531Z",
    status: "active",
    client: {
      name: "PixelBreeze",
      code: "PIXELBREEZE"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@pixelbreeze.xyz"],
        fromName: "PixelBreeze",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67cc35fbaf1d976ffdf3e312",
    name: "VenueBoost",
    type: "react",
    apiKey: "954b3c625b81786feb7524862782c583e1d4107f19ff3116958864db14dc9e70",
    domain: ["https://venueboost.io"],
    configuredAt: "2025-03-08T12:20:11.584Z",
    status: "active",
    client: {
      name: "VenueBoost",
      code: "VENUEBOOST"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@venueboost.io"],
        fromName: "VenueBoost",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67c98cf69ff7cc87063adf66",
    name: "Metrosuites",
    type: "other",
    apiKey: "3c4b678deb5028c2450ffb4376ac32dae7bebe00b80459b6d36daa64c6a3a9c1",
    domain: ["https://metrosuites.al"],
    configuredAt: "2025-03-06T11:54:30.534Z",
    status: "active",
    client: {
      name: "Metrosuites",
      code: "METROSUITES"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@metrosuites.al"],
        fromName: "Metrosuites",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67bc762a2e1b619f6a026891",
    name: "GazetaReforma",
    type: "wordpress",
    apiKey: "802632ae07558cda657741a641ba12b41c4d84bd2683f600084af49516b6c31f",
    domain: ["gazetareforma.com"],
    configuredAt: "2025-02-24T13:37:46.805Z",
    status: "active",
    client: {
      name: "GazetaReforma",
      code: "GAZETAREFORMA"
    },
    reportConfig: {
      form: {
        title: "Submit Confidential Report",
        subtitle: "Your report will be handled with strict confidentiality. Your identity is protected."
      },
      email: {
        recipients: ["gazetareformaweb@gmail.com"],
        fromName: "Report System",
        subject: "New Confidential Report"
      }
    }
  },
  {
    id: "67b7f5382f3f468744d19334",
    name: "Staffluent",
    type: "other",
    apiKey: "e05876b68804b23b680f932a6f5a7d5b6468f1cdeb66af8926fee157933e01ab",
    domain: ["https://staffluent.co", "https://app.staffluent.co"],
    configuredAt: "2025-02-21T03:38:32.523Z",
    status: "active",
    client: {
      name: "Staffluent",
      code: "STAFFLUENT"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["contact@staffluent.co"],
        fromName: "Staffluent",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67b4e0228a46d2a246b3ace6",
    name: "SnapFood New Admin",
    type: "react",
    apiKey: "9828ea888d3f4572b5e1c9ea12a23ba63eb36b0a70a0d5fafc9d87ebb3ba309d",
    domain: ["https://snapfood.omnistackhub.xyz/"],
    configuredAt: "2025-02-18T19:31:46.233Z",
    status: "active",
    client: {
      name: "SnapFood",
      code: "SNAPFOOD"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["info@snapfood.omnistackhub.xyz"],
        fromName: "SnapFood New Admin",
        subject: "New Issue Report"
      }
    }
  },
  {
    id: "67ab314f837a2adac2313ec6",
    name: "Snapwell",
    type: "react",
    apiKey: "5087b4db3d5b0b73290eb6194f523eed2e99090c42ebe6fb9887df3e392ce4fd",
    domain: ["snapwell.al"],
    configuredAt: "2025-02-11T11:15:27.508Z",
    status: "active",
    client: {
      name: "Snapwell",
      code: "SNAPWELL"
    },
    reportConfig: {
      form: {
        title: "Report Issue",
        subtitle: "Tell us what happened"
      },
      email: {
        recipients: ["info@snapwell.al"],
        fromName: "Snapwell",
        subject: "New Issue Report"
      }
    }
  }
];

// Mock hook for client apps data - in a real implementation, this would be a proper API hook
const useClientApps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientApps, setClientApps] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Memoize the fetchClientApps function to prevent infinite loops
  const fetchClientApps = useCallback(async (params) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        const filteredApps = sampleClientApps.filter(app => {
          if (params.search && !app.name.toLowerCase().includes(params.search.toLowerCase())) {
            return false;
          }
          if (params.type && params.type !== "all" && app.type !== params.type) {
            return false;
          }
          if (params.status && params.status !== "all" && app.status !== params.status) {
            return false;
          }
          
          if (params.fromDate) {
            const appDate = new Date(app.configuredAt);
            const fromDate = new Date(params.fromDate);
            if (appDate < fromDate) return false;
          }
          
          if (params.toDate) {
            const appDate = new Date(app.configuredAt);
            const toDate = new Date(params.toDate);
            if (appDate > toDate) return false;
          }
          
          return true;
        });
        
        const start = (params.page - 1) * params.limit;
        const end = start + params.limit;
        const paginatedApps = filteredApps.slice(start, end);
        
        setClientApps(paginatedApps);
        setTotalItems(filteredApps.length);
        setTotalPages(Math.ceil(filteredApps.length / params.limit));
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching client apps:", error);
      setIsLoading(false);
      toast.error("Failed to fetch client applications");
    }
  }, []); // Empty dependency array means this function never changes

  return {
    isLoading,
    clientApps,
    totalItems,
    totalPages,
    fetchClientApps
  };
};

export function ClientAppsContent() {
  const {
    isLoading,
    clientApps,
    totalItems,
    totalPages,
    fetchClientApps
  } = useClientApps();

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
    fetchClientApps(fetchParams());
  }, [fetchClientApps, fetchParams]);

  const handleRefresh = () => {
    fetchClientApps(fetchParams());
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
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Application
          </Button>
        </div>
      </div>

      {/* Key metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">10</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs text-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      All active
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Code className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">React Apps</p>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">5</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs text-blue-600">
                      <Activity className="h-3 w-3 mr-1" />
                      50% of total
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Code className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">WordPress Apps</p>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">2</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs text-indigo-600">
                      <Activity className="h-3 w-3 mr-1" />
                      20% of total
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Globe className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Other Apps</p>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">3</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs text-slate-600">
                      <Activity className="h-3 w-3 mr-1" />
                      30% of total
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-slate-500/10 rounded-lg">
                <Monitor className="h-5 w-5 text-slate-500" />
              </div>
            </div>
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
                  <TableRow key={app.id}>
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
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Edit Form Config
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Edit Email Config
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
    </div>
  );
}

export default ClientAppsContent;