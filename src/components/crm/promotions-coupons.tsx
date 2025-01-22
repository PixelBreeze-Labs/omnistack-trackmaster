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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Coupons</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coupons..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default PromotionsCoupons;