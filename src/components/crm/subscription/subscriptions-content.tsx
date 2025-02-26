"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCcw,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  Building2,
  User,
  CreditCard,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronDown
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
import { Skeleton } from "@/components/ui/skeleton";
import InputSelect from "@/components/Common/InputSelect";
import { useBusinessSubscription } from "@/hooks/useBusinessSubscription";
import { format } from "date-fns";


const productNameMapping = {
  [process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_MONTHLY_ID as string]: "Basic Plan - Monthly",
  [process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_YEARLY_ID as string]: "Basic Plan - Yearly",
  [process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PLAN_MONTHLY_ID as string]: "Professional Plan - Monthly",
  [process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PLAN_YEARLY_ID as string]: "Professional Plan - Yearly",
};


export interface SubscriptionsContentProps {
  status?: string;
}

export default function SubscriptionsContent({ status }: SubscriptionsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    isLoading,
    subscriptions,
    totalItems,
    totalPages,
    metrics,
    fetchSubscriptions,
    fetchActiveSubscriptions,
    fetchPastDueSubscriptions,
    fetchCanceledSubscriptions
  } = useBusinessSubscription();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Set initial filters from URL if present
    const search = searchParams?.get("search") || "";
    const page = parseInt(searchParams?.get("page") || "1");
    const limit = parseInt(searchParams?.get("limit") || "10");
    
    setSearchTerm(search);
    setCurrentPage(page);
    setItemsPerPage(limit);

    // Load subscriptions with these parameters
    const params = {
      search,
      page,
      limit
    };

    // Use the appropriate fetch method based on the status
    if (status === 'active') {
      fetchActiveSubscriptions(params);
    } else if (status === 'past_due') {
      fetchPastDueSubscriptions(params);
    } else if (status === 'canceled') {
      fetchCanceledSubscriptions(params);
    } else {
      fetchSubscriptions({
        ...params,
        status
      });
    }
  }, [searchParams, fetchSubscriptions, fetchActiveSubscriptions, fetchPastDueSubscriptions, fetchCanceledSubscriptions, status]);

  const handleSearch = () => {
    setCurrentPage(1);
    updateUrlAndFetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlAndFetch(searchTerm, page);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value);
    setItemsPerPage(limit);
    setCurrentPage(1);
    updateUrlAndFetch(searchTerm, 1, limit);
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>, subscriptionId: string) => {
    const action = e.target.value;
    if (!action) return;
    
    e.stopPropagation();
    
    switch(action) {
      case "view":
        router.push(`/crm/platform/subscriptions/${subscriptionId}`);
        break;
      case "business":
        const business = subscriptions.find(s => s._id === subscriptionId)?.business;
        if (business) {
          router.push(`/crm/platform/businesses/${business._id}`);
        }
        break;
      case "update":
        router.push(`/crm/platform/subscriptions/${subscriptionId}/update`);
        break;
      case "cancel":
        router.push(`/crm/platform/subscriptions/${subscriptionId}/cancel`);
        break;
      default:
        break;
    }
    
    // Reset the select
    setTimeout(() => {
      const selectElement = document.getElementById(`actions-${subscriptionId}`) as HTMLSelectElement;
      if (selectElement) selectElement.value = "";
    }, 100);
  };

  const updateUrlAndFetch = (
    search = searchTerm, 
    page = currentPage,
    limit = itemsPerPage
  ) => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
    
    // Fetch subscriptions with the new filters
    const fetchParams = {
      search,
      page,
      limit
    };

    // Use the appropriate fetch method based on the status
    if (status === 'active') {
      fetchActiveSubscriptions(fetchParams);
    } else if (status === 'past_due') {
      fetchPastDueSubscriptions(fetchParams);
    } else if (status === 'canceled') {
      fetchCanceledSubscriptions(fetchParams);
    } else {
      fetchSubscriptions({
        ...fetchParams,
        status
      });
    }
  };

  const refreshData = () => {
    const params = {
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage
    };

    if (status === 'active') {
      fetchActiveSubscriptions(params);
    } else if (status === 'past_due') {
      fetchPastDueSubscriptions(params);
    } else if (status === 'canceled') {
      fetchCanceledSubscriptions(params);
    } else {
      fetchSubscriptions({
        ...params,
        status
      });
    }
  };

  const toggleSubscriptionExpansion = (subscriptionId: string) => {
    setExpandedSubscriptions(prev => ({
      ...prev,
      [subscriptionId]: !prev[subscriptionId]
    }));
  };

  // Utility function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertCircle className="w-3 h-3 mr-1" /> Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Canceled</Badge>;
      case 'incomplete':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Incomplete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  // Get title based on status
  const getTitle = () => {
    switch (status) {
      case 'active':
        return "Active Subscriptions";
      case 'past_due':
        return "Past Due Subscriptions";
      case 'canceled':
        return "Canceled Subscriptions";
      default:
        return "All Subscriptions";
    }
  };
  
  // Get subtitle based on status
  const getSubtitle = () => {
    switch (status) {
      case 'active':
        return "View and manage active subscription plans";
      case 'past_due':
        return "Manage subscriptions with payment issues";
      case 'canceled':
        return "View previously canceled subscriptions";
      default:
        return "View and manage all subscription plans";
    }
  };

  // Generate action options based on subscription status
  const getActionOptions = (subscription: any) => {
    const baseOptions = [
      { value: "", label: "Actions" },
      { value: "view", label: "View Details" },
      { value: "business", label: "View Business" },
    ];
    
    let statusSpecificOptions = [];
    
    switch(subscription.status) {
      case 'active':
      case 'trialing':
        statusSpecificOptions = [
          { value: "update", label: "Update Subscription" },
          { value: "cancel", label: "Cancel Subscription" }
        ];
        break;
      case 'past_due':
        statusSpecificOptions = [
          { value: "update", label: "Update Payment" },
          { value: "cancel", label: "Cancel Subscription" }
        ];
        break;
      default:
        statusSpecificOptions = [];
    }
    
    return [...baseOptions, ...statusSpecificOptions];
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{getTitle()}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Total Subscriptions</h2>
            </div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.totalSubscriptions ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
              </div>
              <div className="flex items-center gap-1">
                {(metrics?.trends?.subscriptions?.percentage || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${(metrics?.trends?.subscriptions?.percentage || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.subscriptions?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Monthly Recurring Revenue</h2>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">
                  {metrics?.totalMRR ? formatCurrency(metrics.totalMRR, 'USD') : '$0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Monthly revenue</p>
              </div>
              <div className="flex items-center gap-1">
                {(metrics?.trends?.mrr?.percentage || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${(metrics?.trends?.mrr?.percentage || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.mrr?.percentage ?? 0}%
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
                <div className="text-2xl font-bold">{metrics?.activeSubscriptions ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Paying customers</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {metrics?.totalSubscriptions ? Math.round((metrics?.activeSubscriptions / metrics?.totalSubscriptions) * 100) : 0}% active
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="text-sm font-medium">Churn Rate</h2>
            </div>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.trends?.churnRate?.value ?? 0}%</div>
                <p className="text-xs text-muted-foreground mt-1">Monthly cancellations</p>
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
            <h2 className="text-lg font-medium">Filter Subscriptions</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Search and filter through subscription data
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by business name, email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
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

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
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
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !subscriptions || subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Subscriptions Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm 
                          ? "No subscriptions match your search criteria. Try adjusting your filters." 
                          : `No ${status || ''} subscriptions are currently available.`}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((subscription) => (
                  <>
                    <TableRow 
                      key={subscription._id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleSubscriptionExpansion(subscription._id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {expandedSubscriptions[subscription._id] ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium">{subscription.business?.name || 'Unknown Business'}</div>
                            <div className="text-sm text-muted-foreground">{subscription.business?.email || 'No email'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {subscription.product?.name || productNameMapping[subscription.priceId] || 'Unknown Product'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(subscription.amount, subscription.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            / {subscription.interval || 'month'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {format(new Date(subscription.currentPeriodStart), 'MMM d')} - {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                          </div>
                          {subscription.trialEnd && (
                            <div className="text-xs text-muted-foreground">
                              Trial ends {format(new Date(subscription.trialEnd), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <div className="w-[140px]" onClick={(e) => e.stopPropagation()}>
                            <InputSelect
                              name={`actions-${subscription._id}`}
                              label=""
                              value=""
                              onChange={(e) => handleActionChange(e, subscription._id)}
                              options={getActionOptions(subscription)}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded details */}
                    {expandedSubscriptions[subscription._id] && (
                      <TableRow className="bg-slate-50 border-t-0">
                        <TableCell colSpan={6} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                            <Card>
                              <CardHeader className="pb-2">
                                <div>
                                  <h2 className="text-lg font-bold tracking-tight">Business Details</h2>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Customer information
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-2">
                                <div className="flex items-center">
                                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{subscription.business?.name || 'Unknown Business'}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{subscription.business?.adminUser?.name || 'Unknown Admin'}</span>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                                    e.stopPropagation();
                                    if (subscription.business?._id) {
                                      router.push(`/crm/platform/businesses/${subscription.business._id}`);
                                    }
                                  }}>
                                    View Business
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div>
                                  <h2 className="text-lg font-bold tracking-tight">Subscription Details</h2>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Product and pricing information
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-2">
                                <div className="flex items-center">
                                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm"> {subscription.product?.name || productNameMapping[subscription.priceId] || 'Unknown Product'}</span>
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">
                                    {formatCurrency(subscription.amount, subscription.currency)} / {subscription.interval}
                                  </span>
                                </div>
                                {subscription.quantity > 1 && (
                                  <div className="flex items-center">
                                    <span className="text-sm ml-6">
                                      Quantity: {subscription.quantity}
                                    </span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <div>
                                  <h2 className="text-lg font-bold tracking-tight">Billing Information</h2>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Period and renewal details
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-2">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">
                                    Current period: {format(new Date(subscription.currentPeriodStart), 'MMM d')} - {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                {subscription.cancelAtPeriodEnd && (
                                  <div className="flex items-center">
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    <span className="text-sm text-red-500">
                                      Cancels at period end
                                    </span>
                                  </div>
                                )}
                                {subscription.trialEnd && (
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-sm text-blue-500">
                                      Trial ends: {format(new Date(subscription.trialEnd), 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/crm/platform/subscriptions/${subscription._id}`);
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
          {subscriptions && subscriptions.length > 0 && (
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
                  Showing <span className="font-medium">{subscriptions?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> subscriptions
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