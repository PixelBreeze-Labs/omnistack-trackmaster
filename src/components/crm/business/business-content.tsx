"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Search,
  Plus,
  RefreshCcw,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  DollarSign,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ChevronRight,
  Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import InputSelect from "@/components/Common/InputSelect";
import { useBusiness } from "@/hooks/useBusiness";
import {
  SubscriptionStatus 
} from "@/app/api/external/omnigateway/types/business";
import { format } from "date-fns";
import BusinessActions from "@/components/crm/business/business-actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function BusinessesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    isLoading,
    businesses,
    totalItems,
    totalPages,
    metrics,
    fetchBusinesses
  } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedBusinesses, setExpandedBusinesses] = useState<Record<string, boolean>>({});
  const [showTestAccounts, setShowTestAccounts] = useState(true);

// Update useEffect to handle the testAccounts parameter
useEffect(() => {
  // Set initial filters from URL if present
  const status = searchParams?.get("status") || "all";
  const search = searchParams?.get("search") || "";
  const page = parseInt(searchParams?.get("page") || "1");
  const limit = parseInt(searchParams?.get("limit") || "10");
  const testAccounts = searchParams?.get("testAccounts") !== "false";
  
  setStatusFilter(status);
  setSearchTerm(search);
  setCurrentPage(page);
  setItemsPerPage(limit);
  setShowTestAccounts(testAccounts);

  // Load businesses with these parameters
  fetchBusinesses({
    status: status !== "all" ? status : undefined,
    search,
    page,
    limit,
    isTestAccount: testAccounts ? undefined : false
  });
}, [searchParams, fetchBusinesses]);

  const handleSearch = () => {
    setCurrentPage(1);
    updateUrlAndFetch();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    setCurrentPage(1);
    updateUrlAndFetch(searchTerm, status, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlAndFetch(searchTerm, statusFilter, page);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value);
    setItemsPerPage(limit);
    setCurrentPage(1);
    updateUrlAndFetch(searchTerm, statusFilter, 1, limit);
  };


  // Update this function to include the includeTestAccounts parameter
const updateUrlAndFetch = (
  search = searchTerm, 
  status = statusFilter, 
  page = currentPage,
  limit = itemsPerPage,
  includeTestAccounts = showTestAccounts
) => {
  // Update URL with search parameters
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", page.toString());
  if (limit !== 10) params.set("limit", limit.toString());
  if (!includeTestAccounts) params.set("testAccounts", "false");
  
  const queryString = params.toString();
  router.push(queryString ? `?${queryString}` : "");
  
  // Fetch businesses with the new filters
  fetchBusinesses({
    search,
    status: status !== "all" ? status : undefined,
    page,
    limit,
    isTestAccount: includeTestAccounts ? undefined : false
  });
};

const refreshData = () => {
  fetchBusinesses({
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page: currentPage,
    limit: itemsPerPage,
    isTestAccount: showTestAccounts ? undefined : false
  });
};

  const toggleBusinessExpansion = (businessId: string) => {
    setExpandedBusinesses(prev => ({
      ...prev,
      [businessId]: !prev[businessId]
    }));
  };

  // Utility function to get status badge color
  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case SubscriptionStatus.TRIALING:
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Trial</Badge>;
      case SubscriptionStatus.PAST_DUE:
        return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertCircle className="w-3 h-3 mr-1" /> Past Due</Badge>;
      case SubscriptionStatus.CANCELED:
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Canceled</Badge>;
      case SubscriptionStatus.INCOMPLETE:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Incomplete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper for business type display
  const formatBusinessType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>

        <h2 className="text-2xl font-bold tracking-tight">Businesses</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage all businesses and their subscription statuses
          </p>
        </div>
        <Button onClick={() => router.push("/crm/platform/businesses/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Business
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Total Businesses</h2>
            </div>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.totalBusinesses ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered businesses</p>
              </div>
              <div className="flex items-center gap-1">
                {(metrics?.trends?.newBusinesses?.percentage || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${(metrics?.trends?.newBusinesses?.percentage || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.newBusinesses?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Active Subscriptions</h2>
            </div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.businessesByStatus?.active ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Paying customers</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {metrics?.totalBusinesses ? Math.round((metrics?.businessesByStatus?.active / metrics?.totalBusinesses) * 100) : 0}% active
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Trial Users</h2>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.businessesByStatus?.trialing ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">In trial period</p>
              </div>
              <div className="flex items-center gap-1">
                <a href="/crm/platform/businesses/trials" className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200">
                  View Trials
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Churn Rate</h2>
            </div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.trends?.churnRate?.value ?? 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">Subscription cancellations</p>
              </div>
              <div className="flex items-center gap-1">
                {(metrics?.trends?.churnRate?.percentage || 0) < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${(metrics?.trends?.churnRate?.percentage || 0) < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(metrics?.trends?.churnRate?.percentage ?? 0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div>
            <h2 className="text-lg font-medium">Filter Businesses</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Search and filter through your businesses and subscriptions
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, admin..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
  <Switch
    id="test-accounts"
    checked={showTestAccounts}
    onCheckedChange={(checked) => {
      setShowTestAccounts(checked);
      setCurrentPage(1);
      updateUrlAndFetch(searchTerm, statusFilter, 1, itemsPerPage, checked);
    }}
  />
  <Label htmlFor="test-accounts">Include test accounts</Label>
</div>
            <div className="flex gap-2">
              <div className="w-48">
                <InputSelect
                  name="status-filter"
                  label=""
                  value={statusFilter}
                  onChange={handleStatusChange}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "trialing", label: "Trial" },
                    { value: "past_due", label: "Past Due" },
                    { value: "canceled", label: "Canceled" },
                    { value: "incomplete", label: "Incomplete" }
                  ]}
                />
              </div>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !businesses || businesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Businesses Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' 
                          ? "No businesses match your search criteria. Try adjusting your filters." 
                          : "No businesses have been registered yet."}
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Button 
                          className="mt-4"
                          onClick={() => router.push("/crm/platform/businesses/new")}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Business
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                businesses.map((business) => (
                  <>
                    <TableRow 
                      key={business._id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleBusinessExpansion(business._id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {expandedBusinesses[business._id] ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                          <div className="font-medium flex items-center gap-2">
  {business.name}
  {business.metadata?.isTestAccount === 'true' && (
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
      <Beaker className="h-3 w-3 mr-1" />
      Test
    </Badge>
  )}
</div>
                            <div className="text-sm text-muted-foreground">{business.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatBusinessType(business.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={business.adminUser?.avatar} alt={business.adminUser?.name} />
                            <AvatarFallback>{business.adminUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{business.adminUser?.name}</div>
                            <div className="text-xs text-muted-foreground">{business.adminUser?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(business.subscriptionStatus)}
                      </TableCell>
                      <TableCell>
                        {business.subscriptionDetails ? (
                          <div>
                            <div className="font-medium">
                              {formatCurrency(business.subscriptionDetails.amount, business.subscriptionDetails.currency)}
                              <span className="text-muted-foreground text-xs">
                                {" "}/ {business.subscriptionDetails.interval}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {business.subscriptionEndDate ? `Renews ${format(new Date(business.subscriptionEndDate), 'MMM d, yyyy')}` : 'Not active'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No subscription</span>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      <BusinessActions 
                        business={business} 
                        onActionComplete={refreshData} 
                      />
                    </div>
                  </TableCell>
                    </TableRow>

                    {/* Expanded details */}
                    {expandedBusinesses[business._id] && (
                      <TableRow className="bg-slate-50 border-t-0">
                        <TableCell colSpan={6} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                            <Card>
                              <CardHeader className="pb-2">
                                <div>
                                  <h2 className="text-lg font-bold tracking-tight">Contact Information</h2>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    User contact details
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-2">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{business.email}</span>
                                </div>
                                {business.phone && (
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">{business.phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{business.adminUser?.name}</span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div>
                                  <h2 className="text-lg font-bold tracking-tight">Subscription Details</h2>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Current subscription information
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-2">
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">
                                    {business.subscriptionStatus === 'active' || business.subscriptionStatus === 'trialing' 
                                      ? 'Active Subscription' 
                                      : 'Inactive Subscription'}
                                  </span>
                                </div>
                                {business.subscriptionDetails && (
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">
                                      {formatCurrency(business.subscriptionDetails.amount, business.subscriptionDetails.currency)} / {business.subscriptionDetails.interval}
                                    </span>
                                  </div>
                                )}
                                {business.subscriptionEndDate && (
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">
                                      {business.subscriptionStatus === 'trialing' ? 'Trial ends' : 'Renews'} {format(new Date(business.subscriptionEndDate), 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div>
                                  <h2 className="text-lg font-bold tracking-tight">Additional Information</h2>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Business details and history
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-2">
                                <div className="flex items-center">
                                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{formatBusinessType(business.type)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">Created {format(new Date(business.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/crm/platform/businesses/${business._id}`);
                                  }}>
                                    View Full Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {businesses && businesses.length > 0 && (
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page</span>
                  <div className="w-20">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={itemsPerPage.toString()}
                      onChange={handleLimitChange}
                      options={[
                        { value: "10", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" }
                      ]}
                    />
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1} 
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        // Logic to show correct page numbers when current page is > 3
                        let displayPageNumber = pageNumber;
                        if (totalPages > 5 && currentPage > 3) {
                          // Adjust display page numbers to show current page in the middle
                          displayPageNumber = currentPage - 3 + pageNumber;
                          // Make sure we don't exceed total pages
                          if (displayPageNumber > totalPages) {
                            displayPageNumber = totalPages - (5 - pageNumber);
                          }
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === displayPageNumber}
                              onClick={() => handlePageChange(displayPageNumber)}
                            >
                              {displayPageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages || totalPages === 0}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                  Showing <span className="font-medium">{businesses?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> businesses
                </p>
              </div>
            </div>
            )}
            </CardContent>
          </Card>
          
          {/* Add bottom spacing */}
          <div className="h-4"></div>
        </div>
      );
    }