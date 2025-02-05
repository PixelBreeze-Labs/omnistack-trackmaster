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
  Crown,
  Gift,
  Calendar,
  Download,
  Star,
  RefreshCw,
  ShoppingBag,
  CreditCard
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import InputSelect from "../Common/InputSelect";
import { useExternalMembers } from "@/hooks/useExternalMembers";

export function MyClubList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { 
    members, 
    loading, 
    error, 
    totalCount,
    page, 
    setPage,
    pageSize, 
    setPageSize,
    fetchMembers,
    metrics
  } = useExternalMembers({ source: 'from_my_club' });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembers({ 
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        tier: tierFilter !== 'all' ? tierFilter : undefined 
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchMembers, searchQuery, statusFilter, tierFilter, page, pageSize]);

  const getTierBadge = (tier: string) => {
    const variants = {
      bronze: "secondary",
      silver: "default",
      gold: "warning",
      platinum: "primary"
    };
    return <Badge variant={variants[tier]} className="uppercase">{tier}</Badge>;
  };

  const handleRefresh = () => {
    fetchMembers({
      search: searchQuery,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      tier: tierFilter !== 'all' ? tierFilter : undefined
    });
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Club Members</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage your club members and their benefits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active club members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Members</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.vipMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Gold & Platinum tier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalPoints?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Active rewards points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Spend</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.averageSpend?.toLocaleString()} ALL</div>
            <p className="text-xs text-muted-foreground mt-1">Per member</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="mb-1">
            <h3 className="font-medium">Filter Members</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through club members
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.full_name?.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTierBadge(member.tier)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        {member.points?.toLocaleString() ?? 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(member.join_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        {member.total_spent?.toLocaleString() ?? 0} ALL
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(member.last_activity).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

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
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1 || loading} 
                    />
                  </PaginationItem>
                  {[...Array(Math.min(5, Math.ceil(totalCount / pageSize)))].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                        disabled={loading}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(Math.min(Math.ceil(totalCount / pageSize), page + 1))}
                      disabled={page === Math.ceil(totalCount / pageSize) || loading}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing {members.length} of {totalCount} members
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}