"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGuests } from "@/hooks/useGuests";
import { useDeleteGuest } from "@/hooks/useDeleteGuest";
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
  Users,
  Search,
  Mail,
  Phone,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  RefreshCcw,
  ArrowUpRight,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { FilterSource, FilterStatus, Guest } from "@/app/api/external/omnigateway/types/guests";
import { GuestActionMenu } from "@/components/crm/guests/DeleteGuestComponents";

const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'Bronze Tier':
      return <Badge variant="secondary" className="mt-1">Bronze</Badge>;
    case 'Silver Tier':
      return <Badge variant="warning" className="mt-1">Silver</Badge>;
    case 'Gold Tier':
      return <Badge variant="success" className="mt-1">Gold</Badge>;
    case 'Platinum Tier':
      return <Badge variant="destructive" className="mt-1">Platinum</Badge>;
    case 'Default Tier':
      return <Badge variant="outline" className="mt-1">Default</Badge>;
    default:
      return <Badge variant="outline" className="mt-1">None</Badge>;
  }
};

export function AllGuests() {
  const {
    isLoading,
    guests,
    metrics,
    totalItems,
    totalPages,
    fetchGuests
  } = useGuests();

  const { deleteGuest } = useDeleteGuest(() => {
    // Refresh the guest list after successful deletion
    fetchGuests({
      page,
      limit: pageSize,
      status: status !== 'ALL' ? status : undefined,
      source: source !== 'ALL' ? source : undefined,
      search: searchTerm
    });
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<FilterStatus>("ALL");
  const [source, setSource] = useState<FilterSource>("ALL");

  useEffect(() => {
    fetchGuests({
      page,
      limit: pageSize,
      status: status !== 'ALL' ? status : undefined,
      source: source !== 'ALL' ? source : undefined,
      search: searchTerm
    });
  }, [fetchGuests, page, pageSize, status, source, searchTerm]);

  const handleRefresh = () => {
    fetchGuests({
      page,
      limit: pageSize,
      status: status !== 'ALL' ? status : undefined,
      source: source !== 'ALL' ? source : undefined,
      search: searchTerm
    });
  };

  const handleDeleteGuest = async (
    guest: Guest, 
    options: { forceDelete: boolean; deleteUser: boolean }
  ) => {
    await deleteGuest(guest, options);
  };

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendClass = (percentage: number) => {
    return percentage > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Guests</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage all your guests in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="soft" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{metrics?.totalGuests ?? 0}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.trends.guests.percentage)}
                <span className={`text-sm ${getTrendClass(metrics?.trends.guests.percentage)}`}>
                  {metrics?.trends.guests.percentage ?? 0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{metrics?.activeGuests ?? 0}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.trends.active.percentage)}
                <span className={`text-sm ${getTrendClass(metrics?.trends.active.percentage)}`}>
                  {metrics?.trends.active.percentage ??0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Growth</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">+{metrics?.guestGrowth ?? 0}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.trends.guests.percentage)}
                <span className={`text-sm ${getTrendClass(metrics?.trends.guests.percentage)}`}>
                  {metrics?.trends.guests.percentage ?? 0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">New this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="mb-1">
            <h3 className="font-medium">Filter Guests</h3>
            <p className="text-sm text-muted-foreground">
              Filter and search through your guest database
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative mt-1 flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests by name, email, or phone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <InputSelect
                name="status"
                label=""
                value={status}
                onChange={(e) => setStatus(e.target.value as FilterStatus)}
                options={[
                  { value: "ALL", label: "All Status" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" }
                ]}
              />
              <InputSelect
                name="source"
                label=""
                value={source}
                onChange={(e) => setSource(e.target.value as FilterSource)}
                options={[
                  { value: "ALL", label: "All Sources" },
                  { value: "metrosuites", label: "Metrosuites" },
                  { value: "metroshop", label: "Metroshop" },
                  { value: "bookmaster", label: "Bookmaster" },
                  { value: "trackmaster", label: "Trackmaster" },
                  { value: "manual", label: "Manual" },
                  { value: "other", label: "Other" }
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Total Spend</TableHead>
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
              ) : guests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Guests Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        No guests match your current filters. Try changing your search criteria.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                guests.map((guest) => (
                  <TableRow key={guest._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" alt={guest.name} />
                          <AvatarFallback className="uppercase">
                            {guest.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">
                          {guest.name}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          {guest.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          {guest.phone || 'N/A'}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={guest.isActive ? "success" : "secondary"}>
                        {guest.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={
                        guest.source === "metroshop" ? "default" :
                        guest.source === "metrosuites" ? "warning" :
                        guest.source === "bookmaster" ? "success" :
                        guest.source === "trackmaster" ? "destructive" :
                        "secondary"
                      }>
                        {guest.source?.toUpperCase() || 'MANUAL'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {new Date(guest.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="font-medium">{guest.points?.toLocaleString() || 0}</div>
                      {getTierBadge(guest.membershipTier || 'NONE')}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="font-medium">
                        {guest.totalSpend?.toLocaleString() || 0} EUR
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <GuestActionMenu 
                        guest={guest} 
                        onDeleteGuest={handleDeleteGuest} 
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
                    {[...Array(Math.min(5, totalPages))].map((_, i) => (
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
                Showing <span className="font-medium">{guests.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> guests
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AllGuests;