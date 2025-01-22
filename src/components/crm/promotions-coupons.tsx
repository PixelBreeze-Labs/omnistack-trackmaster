"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  PlusCircle, 
  Search, 
  Ticket, 
  Users, 
  CircleDollarSign,
  ArrowUpRight,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Ban
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import InputSelect from "@/components/Common/InputSelect";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  status: "active" | "expired" | "scheduled";
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
  customerType: "all" | "new" | "returning" | "vip";
}

const DUMMY_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "SUMMER2024",
    type: "percentage",
    value: 20,
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageLimit: 1000,
    usedCount: 234,
    minPurchase: 5000,
    maxDiscount: 20000,
    description: "Summer sale discount",
    customerType: "all"
  },
  {
    id: "2",
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 500,
    usedCount: 123,
    minPurchase: 10000,
    description: "Free shipping on orders",
    customerType: "all"
  },
  {
    id: "3",
    code: "NEWCUST25",
    type: "percentage",
    value: 25,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 0,
    usedCount: 892,
    description: "New customer discount",
    customerType: "new"
  }
];

export function PromotionsCoupons() {
  const [coupons] = useState<Coupon[]>(DUMMY_COUPONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "success",
      expired: "destructive",
      scheduled: "warning"
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const formatCouponValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case "percentage":
        return `${coupon.value}% OFF`;
      case "fixed":
        return `${coupon.value} ALL OFF`;
      case "shipping":
        return "FREE SHIPPING";
      default:
        return `${coupon.value}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Create and manage promotional coupons for your customers
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,892</div>
            <p className="text-xs text-muted-foreground mt-1">Times used this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245,000 ALL</div>
            <p className="text-xs text-muted-foreground mt-1">Customer savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground mt-1">Coupon usage rate</p>
          </CardContent>
        </Card>
      </div>

{/* Filter Card */}
<Card>
  <CardHeader>
    <div className="mb-1">
      <h3 className="font-medium">Filter Coupons</h3>
      <p className="text-sm text-muted-foreground">
        Search and filter through your coupon campaigns
      </p>
    </div>
  </CardHeader>
  <CardContent className="p-0">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center flex-1 gap-2 max-w-3xl">
        <div className="relative mt-2 flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <InputSelect
          name="status"
          label=""
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "scheduled", label: "Scheduled" },
            { value: "expired", label: "Expired" }
          ]}
        />
        <InputSelect
          name="type"
          label=""
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "all", label: "All Types" },
            { value: "percentage", label: "Percentage" },
            { value: "fixed", label: "Fixed Amount" },
            { value: "shipping", label: "Free Shipping" }
          ]}
        />
      </div>
    </div>
  </CardContent>
</Card>
      {/* Filters and Table */}
      <Card>
     
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Min. Purchase</TableHead>
                <TableHead>Customer Type</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1">{coupon.code}</code>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatCouponValue(coupon)}</div>
                      <div className="text-sm text-muted-foreground">{coupon.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(coupon.startDate).toLocaleDateString()} -
                      <br />
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {coupon.usedCount} / {coupon.usageLimit || "∞"}
                      <div className="text-xs text-muted-foreground">
                        {((coupon.usedCount / (coupon.usageLimit || coupon.usedCount + 1)) * 100).toFixed(1)}% used
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.minPurchase ? (
                      <div className="text-sm">{coupon.minPurchase.toLocaleString()} ALL</div>
                    ) : (
                      <span className="text-sm text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {coupon.customerType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          Disable
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {/* Pagination */}
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
              {[...Array(Math.min(5, Math.ceil(coupons.length / pageSize)))].map((_, i) => (
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
                  onClick={() => setPage(p => Math.min(Math.ceil(coupons.length / pageSize), p + 1))}
                  disabled={page === Math.ceil(coupons.length / pageSize)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <p className="text-sm text-muted-foreground min-w-[180px] text-right">
          Showing <span className="font-medium">{pageSize}</span> of{" "}
          <span className="font-medium">{coupons.length}</span> coupons
        </p>
      </div>
    </div>
        </CardContent>
      </Card>
       {/* Add bottom spacing */}
       <div className="h-8"></div>
    </div>
  );
}

export default PromotionsCoupons;