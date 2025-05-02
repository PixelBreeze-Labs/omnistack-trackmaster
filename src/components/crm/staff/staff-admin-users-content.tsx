"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
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
  Shield
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
import { useStaffAdminUsers } from "@/hooks/useStaffAdminUsers";
import { format } from "date-fns";
import { BusinessStatus } from '@/app/api/external/omnigateway/types/business';
import UserActions from "./user-actions";

export default function StaffAdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    isLoading,
    staffAdminUsers,
    totalItems,
    totalPages,
    softDeleteUser,
    fetchStaffAdminUsers
  } = useStaffAdminUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Set initial filters from URL if present
    const search = searchParams?.get("search") || "";
    const page = parseInt(searchParams?.get("page") || "1");
    const limit = parseInt(searchParams?.get("limit") || "10");
    
    setSearchTerm(search);
    setCurrentPage(page);
    setItemsPerPage(limit);

    // Load staff admin users with these parameters
    fetchStaffAdminUsers({
      search,
      page,
      limit
    });
  }, [searchParams, fetchStaffAdminUsers]);

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
    
    // Fetch staff admin users with the new filters
    fetchStaffAdminUsers({
      search,
      page,
      limit
    });
  };

  const refreshData = () => {
    fetchStaffAdminUsers({
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage
    });
  };

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getBusinessStatusBadge = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case BusinessStatus.INACTIVE:
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatBusinessType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Admin Users</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage admin users registered via Staffluent and the businesses they administer
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div>
            <h2 className="text-lg font-medium">Filter Admin Users</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Search through staff admin users by name, email, or business
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

      {/* Staff Admin Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Businesses Administered</TableHead>
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
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !staffAdminUsers || staffAdminUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Shield className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Staff Admin Users Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm 
                          ? "No staff admin users match your search criteria. Try adjusting your filters." 
                          : "No staff admin users have been registered yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                staffAdminUsers.map((staffUser) => (
                  <>
                    <TableRow 
                      key={staffUser.user._id}
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
                                {staffUser.user.name.charAt(0)}{staffUser.user.surname.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {staffUser.user.name} {staffUser.user.surname}
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  <Shield className="h-3 w-3 mr-1" /> Admin
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{staffUser.user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(staffUser.user.createdAt), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {staffUser.businesses.length} business{staffUser.businesses.length !== 1 ? 'es' : ''}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end">
                          <UserActions 
                            user={staffUser.user}
                            onActionComplete={refreshData}
                            actions={{
                              softDeleteUser,
                              isLoading
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded details */}
                    {expandedUsers[staffUser.user._id] && (
                      <TableRow className="bg-slate-50 border-t-0">
                        <TableCell colSpan={5} className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Admin User Details</h3>
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
                                  <Shield className="h-4 w-4 text-muted-foreground" />
                                  <span>Staffluent Admin</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Administered Businesses</h3>
                              {staffUser.businesses.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  No businesses administered by this user.
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
                                            <div className="flex items-center gap-3 mt-2">
                                              <Badge>
                                                <Briefcase className="w-3 h-3 mr-1" />
                                                {formatBusinessType(business.type)}
                                              </Badge>
                                              {getBusinessStatusBadge(business.isActive ? BusinessStatus.ACTIVE : BusinessStatus.INACTIVE)}
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
                  </>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {staffAdminUsers && staffAdminUsers.length > 0 && (
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
                  Showing <span className="font-medium">{staffAdminUsers?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> admin users
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