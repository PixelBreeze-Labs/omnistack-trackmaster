"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Search,
  RefreshCcw,
  Download,
  CheckCircle,
  Clock,
  Calendar,
  Mail,
  Phone,
  MoreHorizontal,
  Filter,
  ChevronDown,
  ChevronRight,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Progress } from "@/components/ui/progress";
import InputSelect from "@/components/Common/InputSelect";
import { useBusiness } from "@/hooks/useBusiness";
import { 
  Business,
} from "@/app/api/external/omnigateway/types/business";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export default function TrialBusinessesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    isLoading,
    businesses,
    totalItems,
    totalPages,
    metrics,
    fetchTrialBusinesses
  } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedBusinesses, setExpandedBusinesses] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<string>("endDate"); // Options: "endDate", "name", "created"

  useEffect(() => {
    // Set initial filters from URL if present
    const search = searchParams?.get("search") || "";
    const page = parseInt(searchParams?.get("page") || "1");
    const limit = parseInt(searchParams?.get("limit") || "10");
    const sort = searchParams?.get("sort") || "endDate";
    
    setSearchTerm(search);
    setCurrentPage(page);
    setItemsPerPage(limit);
    setSortBy(sort);

    // Load businesses with these parameters
    fetchTrialBusinesses({
      search,
      page,
      limit,
      // The status is always 'trialing' for this page
    });
  }, [searchParams, fetchTrialBusinesses]);

  const handleSearch = () => {
    setCurrentPage(1);
    updateUrlAndFetch();
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateUrlAndFetch(searchTerm, 1, itemsPerPage, sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlAndFetch(searchTerm, page, itemsPerPage, sortBy);
  };

  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
    updateUrlAndFetch(searchTerm, 1, limit, sortBy);
  };

  const updateUrlAndFetch = (
    search = searchTerm, 
    page = currentPage,
    limit = itemsPerPage,
    sort = sortBy
  ) => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    if (sort !== "endDate") params.set("sort", sort);
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
    
    // Fetch businesses with the new filters
    fetchTrialBusinesses({
      search,
      page,
      limit
    });
  };

  const refreshData = () => {
    fetchTrialBusinesses({
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage
    });
  };

  const toggleBusinessExpansion = (businessId: string) => {
    setExpandedBusinesses(prev => ({
      ...prev,
      [businessId]: !prev[businessId]
    }));
  };

  // Helper for business type display
  const formatBusinessType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Calculate trial progress and days remaining
  const getTrialInfo = (business: Business) => {
    if (!business.subscriptionEndDate) return { daysLeft: 0, progress: 0 };
    
    const endDate = new Date(business.subscriptionEndDate);
    const today = new Date();
    const daysLeft = differenceInDays(endDate, today);
    
    // Assuming all trials are 14 days long
    const trialLength = 14;
    const elapsed = trialLength - daysLeft;
    const progress = Math.max(0, Math.min(100, (elapsed / trialLength) * 100));
    
    return {
      daysLeft: Math.max(0, daysLeft),
      progress
    };
  };

  // Format the trial badge color based on days remaining
  const getTrialBadge = (daysLeft: number) => {
    if (daysLeft <= 2) {
      return <Badge className="bg-red-500 hover:bg-red-600"><Clock className="w-3 h-3 mr-1" /> {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</Badge>;
    } else if (daysLeft <= 5) {
      return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="w-3 h-3 mr-1" /> {daysLeft} days left</Badge>;
    } else {
      return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> {daysLeft} days left</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trial Businesses</h1>
          <p className="text-muted-foreground">
            Manage businesses currently in their trial period
          </p>
        </div>
        <Button onClick={() => router.push("/crm/platform/businesses")}>
          View All Businesses
        </Button>
      </div>

      {/* Trial Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          {/* <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Trial Conversions Overview
          </CardTitle>
          <CardDescription>
            Monitor trial statuses and upcoming expirations
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{metrics?.businessesByStatus?.trialing || 0}</div>
              <div className="text-sm text-muted-foreground">Active trials</div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-green-600">
                {metrics?.totalBusinesses ? Math.round((metrics?.businessesByStatus?.active / metrics?.totalBusinesses) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Trial to paid conversion rate</div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                {businesses?.filter(b => b.subscriptionEndDate && differenceInDays(new Date(b.subscriptionEndDate), new Date()) <= 3).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Trials expiring within 3 days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div>
            <h3 className="text-lg font-medium">Filter Trial Users</h3>
            <p className="text-sm text-muted-foreground">
              Search and sort businesses in trial period
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
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> 
                    {sortBy === "endDate" ? "Sort by: Expiration Date" : 
                     sortBy === "name" ? "Sort by: Business Name" : 
                     "Sort by: Registration Date"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSortChange("endDate")}>
                    <Calendar className="mr-2 h-4 w-4" /> Expiration Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("name")}>
                    <Building2 className="mr-2 h-4 w-4" /> Business Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("created")}>
                    <CalendarClock className="mr-2 h-4 w-4" /> Registration Date
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      {/* Trial Businesses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Trial Status</TableHead>
                <TableHead>Registration Date</TableHead>
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
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !businesses || businesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Clock className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Trial Businesses Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm 
                          ? "No trial businesses match your search criteria. Try adjusting your filters." 
                          : "There are currently no businesses in their trial period."}
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => router.push("/crm/platform/businesses")}
                      >
                        View All Businesses
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                businesses.map((business) => {
                  const { daysLeft, progress } = getTrialInfo(business);
                  
                  return (
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
                              <div className="font-medium">{business.name}</div>
                              <div className="text-sm text-muted-foreground">{business.email}</div>
                            </div>
                          </div>
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
                          <div className="space-y-1">
                            {getTrialBadge(daysLeft)}
                            <Progress value={progress} className="h-2 mt-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{format(new Date(business.createdAt), 'MMM d, yyyy')}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(business.createdAt), { addSuffix: true })}
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
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/crm/platform/businesses/${business._id}`);
                                }}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/crm/platform/businesses/${business._id}/edit`);
                                }}>
                                  Edit Business
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/crm/platform/businesses/${business._id}/subscribe`);
                                }}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Upgrade to Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  // Implement logic to extend trial
                                }}>
                                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                  Extend Trial
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  // Implement reminder email logic
                                }}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Reminder
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded details */}
                      {expandedBusinesses[business._id] && (
                        <TableRow className="bg-slate-50 border-t-0">
                          <TableCell colSpan={5} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Business Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-2">
                                  <div className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">{formatBusinessType(business.type)}</span>
                                  </div>
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
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">
                                      Registered on {format(new Date(business.createdAt), 'MMMM d, yyyy')}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Trial Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-2">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                      {daysLeft} days remaining in trial
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">
                                      Expires on {business.subscriptionEndDate 
                                        ? format(new Date(business.subscriptionEndDate), 'MMMM d, yyyy')
                                        : 'Unknown'}
                                    </span>
                                  </div>
                                  <div className="pt-2">
                                    <Progress value={progress} className="h-2 mb-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>Started</span>
                                      <span>Ends</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <Button variant="default" size="sm" className="flex-1" onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/crm/platform/businesses/${business._id}/subscribe`);
                                    }}>
                                      <CheckCircle className="mr-2 h-4 w-4" /> Upgrade to Paid
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                                      e.stopPropagation();
                                      // Implement send reminder logic
                                    }}>
                                      <Mail className="mr-2 h-4 w-4" /> Send Reminder
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {businesses && businesses.length > 0 && (
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page</span>
                  <InputSelect
                    name="pageSize"
                    label=""
                    value={itemsPerPage.toString()}
                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                    options={[
                      { value: "10", label: "10" },
                      { value: "20", label: "20" },
                      { value: "50", label: "50" }
                    ]}
                  />
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
                        let displayPageNumber = pageNumber;
                        if (totalPages > 5 && currentPage > 3) {
                          displayPageNumber = currentPage - 3 + pageNumber;
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
                  <span className="font-medium">{totalItems}</span> trials
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