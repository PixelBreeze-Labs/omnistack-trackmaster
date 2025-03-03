"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  RefreshCcw,
  Download,
  CheckCircle,
  XCircle,
  Building2,
  ChevronRight,
  ChevronDown,
  Mail,
  Calendar,
  Briefcase,
  Shield,
  UserCog,
  User
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import InputSelect from "@/components/Common/InputSelect";
import { useStaffUsers } from "@/hooks/useStaffUsers";
import { format } from "date-fns";
import { BusinessStatus } from '@/app/api/external/omnigateway/types/business';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define user types for clear differentiation
enum UserType {
  CLIENT_USER = "CLIENT_USER",
  BUSINESS_ADMIN = "BUSINESS_ADMIN",
  BUSINESS_STAFF = "BUSINESS_STAFF",
  UNKNOWN = "UNKNOWN"
}

export default function StaffUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    isLoading,
    staffUsers,
    totalItems,
    totalPages,
    fetchStaffUsers
  } = useStaffUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  useEffect(() => {
    // Set initial filters from URL if present
    const search = searchParams?.get("search") || "";
    const page = parseInt(searchParams?.get("page") || "1");
    const limit = parseInt(searchParams?.get("limit") || "10");
    const type = searchParams?.get("type") || "all";
    
    setSearchTerm(search);
    setCurrentPage(page);
    setItemsPerPage(limit);
    setUserTypeFilter(type);

    // Load staff users with these parameters
    fetchStaffUsers({
      search,
      page,
      limit,
      type
    });
  }, [searchParams, fetchStaffUsers]);

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

  const handleUserTypeChange = (value: string) => {
    setUserTypeFilter(value);
    setCurrentPage(1);
    updateUrlAndFetch(searchTerm, 1, itemsPerPage, value);
  };

  const updateUrlAndFetch = (
    search = searchTerm, 
    page = currentPage,
    limit = itemsPerPage,
    type = userTypeFilter
  ) => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    if (limit !== 10) params.set("limit", limit.toString());
    if (type !== "all") params.set("type", type);
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
    
    // Fetch staff users with the new filters
    fetchStaffUsers({
      search,
      page,
      limit,
      type
    });
  };

  const refreshData = () => {
    fetchStaffUsers({
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage,
      type: userTypeFilter
    });
  };

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Determine user type based on their relationship with businesses
  const determineUserType = (staffUser: any): UserType => {
    // Check if user has appClients, if yes, they're client users
    if (staffUser.appClients && staffUser.appClients.length > 0) {
      return UserType.CLIENT_USER;
    }
    
    // Check if we have metadata-based client info
    if (staffUser.user.metadata && 
        (staffUser.user.metadata.appClientCount || 
         Object.keys(staffUser.user.metadata).some(key => key.startsWith('appClient_')))) {
      return UserType.CLIENT_USER;
    }
    
    if (!staffUser.businesses || staffUser.businesses.length === 0) {
      return UserType.CLIENT_USER;
    }
    
    // Check if user is an admin of any business
    const isAdmin = staffUser.businesses.some(
      (business: any) => business.adminUserId === staffUser.user._id
    );
    
    if (isAdmin) {
      return UserType.BUSINESS_ADMIN;
    }
    
    return UserType.BUSINESS_STAFF;
  };

  // Get user type badge based on user type
  const getUserTypeBadge = (userType: UserType) => {
    switch (userType) {
      case UserType.BUSINESS_ADMIN:
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Shield className="w-3 h-3 mr-1" /> Business Admin
          </Badge>
        );
      case UserType.BUSINESS_STAFF:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <UserCog className="w-3 h-3 mr-1" /> Staff Member
          </Badge>
        );
      case UserType.CLIENT_USER:
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <User className="w-3 h-3 mr-1" /> Client User
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <User className="w-3 h-3 mr-1" /> User
          </Badge>
        );
    }
  };

  const getBusinessStatusBadge = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case BusinessStatus.INACTIVE:
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatBusinessType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Filter users if needed based on user type
  const filteredUsers = staffUsers?.map(staffUser => ({
    ...staffUser,
    userType: determineUserType(staffUser)
  })).filter(staffUser => 
    userTypeFilter === "all" || 
    staffUser.userType === userTypeFilter
  );

  // Get the total count of connections (businesses + app clients)
  const getTotalConnections = (staffUser: any) => {
    let count = staffUser.businesses?.length || 0;
    
    // Add app clients count if available
    if (staffUser.appClients && staffUser.appClients.length > 0) {
      count += staffUser.appClients.length;
    } else if (staffUser.user.metadata) {
      // Try to get it from metadata
      const appClientCount = parseInt(staffUser.user.metadata.appClientCount) || 0;
      count += appClientCount;
    }
    
    return count;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Users</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage users registered via Staffluent and their associated businesses
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div>
            <h2 className="text-lg font-medium">Filter Staff Users</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Search through staff users by name, email, or business
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="w-48">
              <Select value={userTypeFilter} onValueChange={handleUserTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value={UserType.BUSINESS_ADMIN}>Business Admins</SelectItem>
                  <SelectItem value={UserType.BUSINESS_STAFF}>Staff Members</SelectItem>
                  <SelectItem value={UserType.CLIENT_USER}>Client Users</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Staff Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Total Connections</TableHead>
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
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !filteredUsers || filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Staff Users Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || userTypeFilter !== "all" 
                          ? "No staff users match your search criteria. Try adjusting your filters." 
                          : "No staff users have been registered yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((staffUser) => (
                  <React.Fragment key={staffUser.user._id}>
                    <TableRow 
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleUserExpansion(staffUser.user._id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {expandedUsers[staffUser.user._id] ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {staffUser.user.name.charAt(0)}{staffUser.user.surname?.charAt(0) || ''}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{staffUser.user.name} {staffUser.user.surname || ''}</div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{staffUser.user.email}</div>
                      </TableCell>
                      <TableCell>
                        {getUserTypeBadge(staffUser.userType)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(staffUser.user.createdAt), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {getTotalConnections(staffUser)} connection{getTotalConnections(staffUser) !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/crm/platform/users/${staffUser.user._id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded details */}
                    {expandedUsers[staffUser.user._id] && (
                      <TableRow className="bg-slate-50 border-t-0">
                        <TableCell colSpan={6} className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-medium mb-2">User Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{staffUser.user.email}</span>
                                </div>
                                {staffUser.user.birthday && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {format(new Date(staffUser.user.birthday), 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  {staffUser.userType === UserType.BUSINESS_ADMIN ? (
                                    <Shield className="h-4 w-4 text-purple-600" />
                                  ) : staffUser.userType === UserType.BUSINESS_STAFF ? (
                                    <UserCog className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <User className="h-4 w-4 text-green-600" />
                                  )}
                                  <span>
                                    {staffUser.userType === UserType.BUSINESS_ADMIN ? 'Business Administrator' : 
                                     staffUser.userType === UserType.BUSINESS_STAFF ? 'Staff Member' : 'Client User'}
                                  </span>
                                </div>
                              </div>
                            </div>

                          {/* Direct AppClients */}
{staffUser.userType === UserType.CLIENT_USER && 
 staffUser.appClients && 
 staffUser.appClients.length > 0 && (
  <div>
    <h3 className="text-lg font-medium mb-2">Client Details</h3>
    <div className="grid grid-cols-1 gap-3">
      {staffUser.appClients.map((appClient) => (
        <Card key={appClient._id} className="border rounded-md">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Client Information - Left Side */}
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-md font-bold">Client:</span> {appClient.name}
                  </div>
                  {appClient.email && (
                    <div className="text-sm text-muted-foreground mt-1">
                      <Mail className="h-4 w-4 inline mr-1" />
                      {appClient.email}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge>
                      <Briefcase className="w-3 h-3 mr-1" />
                      {appClient.type}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Connected Business - Separate Section */}
              {appClient.businessId && (
                <div className="mt-4 pt-4 border-t">
                  <div className="font-medium flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4" />
                    <span className="text-md font-bold">Connected Business:</span> 
                    {typeof appClient.businessId === 'object' ? appClient.businessId.name : "Business"}
                  </div>
                  
                  {typeof appClient.businessId === 'object' && appClient.businessId.email && (
                    <div className="text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 inline mr-1" />
                      {appClient.businessId.email}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/crm/platform/businesses/${typeof appClient.businessId === 'object' ? appClient.businessId._id : appClient.businessId}`)}
                    >
                      View Business
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}

                            {/* AppClients from metadata */}
                            {staffUser.userType === UserType.CLIENT_USER && 
                             staffUser.user.metadata && 
                             staffUser.user.metadata.appClientCount && 
                             !staffUser.appClients && (
                              <div>
                                <h3 className="text-lg font-medium mb-2">Client Connections</h3>
                                <div className="grid grid-cols-1 gap-3">
                                  {Array.from({ length: parseInt(staffUser.user.metadata.appClientCount) }).map((_, index) => (
                                    <Card key={index} className="border rounded-md">
                                      <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                          <div>
                                            <div className="font-medium flex items-center gap-2">
                                              <Building2 className="h-4 w-4" />
                                              {staffUser.user.metadata[`appClient_${index}_name`] || "Client"}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                              <Badge>
                                                <Briefcase className="w-3 h-3 mr-1" />
                                                {staffUser.user.metadata[`appClient_${index}_type`] || "Unknown Type"}
                                              </Badge>
                                            </div>
                                          </div>
                                          {staffUser.user.metadata[`appClient_${index}_businessId`] && (
                                            <div className="flex items-center gap-2">
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => router.push(`/crm/platform/businesses/${staffUser.user.metadata[`appClient_${index}_businessId`]}`)}
                                              >
                                                View Business
                                              </Button>
                                              <div className="text-sm text-muted-foreground">
                                                {staffUser.user.metadata[`appClient_${index}_businessName`] || "Connected Business"}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Check for individual appClient entries in metadata */}
                            {staffUser.userType === UserType.CLIENT_USER && 
                             staffUser.user.metadata && 
                             !staffUser.user.metadata.appClientCount && 
                             !staffUser.appClients &&
                             Object.keys(staffUser.user.metadata).some(key => key.startsWith('appClient_')) && (
                              <div>
                                <h3 className="text-lg font-medium mb-2">Client Connections</h3>
                                <div className="grid grid-cols-1 gap-3">
                                  <Card className="border rounded-md">
                                    <CardContent className="p-4">
                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                          <div className="font-medium flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            {staffUser.user.metadata.appClient_0_name || 
                                             staffUser.user.metadata.connectedBusinessName || "Client"}
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <Badge>
                                              <Briefcase className="w-3 h-3 mr-1" />
                                              {staffUser.user.metadata.appClient_0_type || "Client"}
                                            </Badge>
                                          </div>
                                        </div>
                                        {(staffUser.user.metadata.appClient_0_businessId || 
                                          staffUser.user.metadata.connectedBusinessId) && (
                                          <div className="flex items-center gap-2">
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => router.push(`/crm/platform/businesses/${staffUser.user.metadata.appClient_0_businessId || staffUser.user.metadata.connectedBusinessId}`)}
                                            >
                                              View Business
                                            </Button>
                                            <div className="text-sm text-muted-foreground">
                                              {staffUser.user.metadata.appClient_0_businessName || 
                                               staffUser.user.metadata.connectedBusinessName || "Connected Business"}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            )}

                            <div>
                              <h3 className="text-lg font-medium mb-2">Associated Businesses</h3>
                              {staffUser.businesses.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  No businesses associated with this user.
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 gap-3">
                                  {staffUser.businesses.map((business) => (
                                    <Card key={business._id} className="border rounded-md">
                                      <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                          <div>
                                            <div className="font-medium flex items-center gap-2">
                                              <Building2 className="h-4 w-4" />
                                              {business.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                              {business.email}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                              <Badge>
                                                <Briefcase className="w-3 h-3 mr-1" />
                                                {formatBusinessType(business.type)}
                                              </Badge>
                                              {getBusinessStatusBadge(business.isActive ? BusinessStatus.ACTIVE : BusinessStatus.INACTIVE)}
                                              {business.adminUserId === staffUser.user._id && (
                                                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                                  <Shield className="w-3 h-3 mr-1" /> Admin
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => router.push(`/crm/platform/businesses/${business._id}`)}
                                            >
                                              View Business
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredUsers && filteredUsers.length > 0 && (
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
                  Showing <span className="font-medium">{filteredUsers?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> staff users
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}