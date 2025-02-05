"use client";
import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Users,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  UserCheck,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MapPin,
  Check,
  X
} from "lucide-react";
import { useExternalMembers } from "@/hooks/useExternalMembers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InputSelect from "../Common/InputSelect";

export function LandingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { 
    members, 
    loading, 
    error, 
    totalCount,
    page, 
    setPage,
    pageSize, 
    fetchMembers,
    metrics,
    approveMember,
    rejectMember,
    exportMembers
  } = useExternalMembers({ source: 'landing_page' });

  // Trigger a new fetch when the search query or status filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembers({ 
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined 
      });
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, fetchMembers]);

  // Also re-fetch if the page or pageSize changes
  useEffect(() => {
    fetchMembers({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery
    });
  }, [page, pageSize, fetchMembers, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "warning" | "success" | "destructive"> = {
      pending: "warning",
      approved: "success",
      rejected: "destructive"
    };
    return <Badge variant={variants[status]}>{status?.toUpperCase()}</Badge>;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchMembers({
      search: searchQuery,
      status: statusFilter !== 'all' ? statusFilter : undefined
    });
  };

  const handleExport = () => {
    exportMembers();
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Landing Page Registrations</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage registrations from landing pages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
<div className="grid gap-4 md:grid-cols-4">
  {/* Total Registrations Card */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold">{metrics?.totalRegistrations}</div>
          <p className="text-xs text-muted-foreground mt-1">From landing pages</p>
        </div>
        <div className="flex items-center gap-1">
          {metrics?.trends.monthly > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${metrics?.trends.monthly > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics?.trends.monthly}%
          </span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Conversion Rate Card */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
      <BarChart3 className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-start">
        <div>
          {/* toFixed(2) ensures two decimal places */}
          <div className="text-2xl font-bold">{metrics?.conversionRate?.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground mt-1">Approved / Total</p>
        </div>
        <div className="flex items-center gap-1">
          {metrics?.trends.conversion > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${metrics?.trends.conversion > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics?.trends.conversion}%
          </span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Active Users Card */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
      <UserCheck className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold">{metrics?.activeUsers}</div>
          <p className="text-xs text-muted-foreground mt-1">Approved Users</p>
        </div>
        <div className="flex items-center gap-1">
          {metrics?.trends.active > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${metrics?.trends.active > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics?.trends.active}%
          </span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Recent Signups Card */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
      <UserPlus className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold">{metrics?.recentSignups}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
        </div>
        <div className="flex items-center gap-1">
          {metrics?.trends.recent > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${metrics?.trends.recent > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {metrics?.trends.recent}%
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</div>


      {/* Filter Section */}
      <Card>
        <CardHeader>
          <div className="">
            <h3 className="font-medium">Filter Registrations</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through registrations
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Member Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage alt={`${member.first_name} ${member.last_name}`} />
                          <AvatarFallback>
                            {`${member.first_name[0]}${member.last_name[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {`${member.first_name} ${member.last_name}`}
                          </div>
                          {member.birthday && (
                            <div className="text-sm text-muted-foreground">
                              {new Date(member.birthday).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{member.phone_number}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.city || member.address || '-'}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="w-fit">
                        {member.preferred_brand || 'No brand'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-mono">
                        {member.old_platform_member_code || '-'}
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(member.approval_status)}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(member.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.registration_source}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {member.approval_status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="x-sm"
                            onClick={() => approveMember(member.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="x-sm"
                            onClick={() => rejectMember(member.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {member.approval_status === "approved" && (
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="x-sm"
                            onClick={() => rejectMember(member.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {member.approval_status === "rejected" && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="x-sm"
                            onClick={() => approveMember(member.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <InputSelect
                name="pageSize"
                label=""
                value={pageSize.toString()}
                onChange={(e) => setPage(parseInt(e.target.value))}
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
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1} 
                      />
                    </PaginationItem>
                    {[...Array(5)].map((_, i) => {
                      const pageNumber = page <= 3
                        ? i + 1
                        : page >= totalCount - 2
                        ? totalCount - 4 + i
                        : page - 2 + i;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={page === pageNumber}
                            onClick={() => setPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(Math.min(totalCount, page + 1))}
                        disabled={page === totalCount}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing {members.length} of {totalCount} registrations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="h-8"></div>
    </div>
  );
}
