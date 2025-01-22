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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus, Search, Tag, Percent, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import InputSelect from "../Common/InputSelect";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

interface Discount {
  id: string;
  name: string;
  code: string;
  type: "percentage" | "fixed" | "bogo";
  value: number;
  status: "active" | "scheduled" | "expired";
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usageCount: number;
  minOrderValue?: number;
  customerType: "all" | "new" | "returning" | "vip";
}

const DUMMY_DISCOUNTS: Discount[] = [
  {
    id: "1",
    name: "Summer Sale",
    code: "SUMMER23",
    type: "percentage",
    value: 20,
    status: "active",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 7, 31),
    usageLimit: 1000,
    usageCount: 450,
    minOrderValue: 5000,
    customerType: "all"
  },
  {
    id: "2",
    name: "VIP Special",
    code: "VIPONLY",
    type: "fixed",
    value: 5000,
    status: "active",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    usageLimit: 500,
    usageCount: 123,
    customerType: "vip"
  },
  {
    id: "3",
    name: "Welcome Bonus",
    code: "WELCOME",
    type: "percentage",
    value: 15,
    status: "active",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    usageLimit: 0,
    usageCount: 892,
    customerType: "new"
  }
];

export function PromotionsDiscounts() {
  const [discounts] = useState<Discount[]>(DUMMY_DISCOUNTS);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "success",
      scheduled: "warning",
      expired: "destructive"
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promotions & Discounts</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Create and manage your promotional campaigns and discount strategies
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Running campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245,000 ALL</div>
            <p className="text-xs text-muted-foreground mt-1">Customer savings this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Count</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,892</div>
            <p className="text-xs text-muted-foreground mt-1">Discounts applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Discount */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Discount Name</Label>
                <Input placeholder="e.g. Summer Sale 2024" />
              </div>
              <div>
                <Label>Discount Code</Label>
                <Input placeholder="e.g. SUMMER24" className="uppercase" />
              </div>
              <div>
                <Label>Discount Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discount Value</Label>
                <Input type="number" placeholder="Enter value" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Valid Period</Label>
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label>Usage Limit</Label>
                <Input type="number" placeholder="0 for unlimited" />
              </div>
              <div>
                <Label>Minimum Order Value</Label>
                <Input type="number" placeholder="Optional" />
              </div>
              <div>
                <Label>Customer Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers</SelectItem>
                    <SelectItem value="returning">Returning Customers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Discount
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Filter Card */}
<Card>
  <CardHeader>
    <div className="mb-1">
      <h3 className="font-medium">Filter Discounts</h3>
      <p className="text-sm text-muted-foreground">
        Search and filter through your discount campaigns
      </p>
    </div>
  </CardHeader>
  <CardContent className="p-0">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center flex-1 gap-2 max-w-3xl">
        <div className="relative mt-2 flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discounts..."
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
      </div>
    </div>
  </CardContent>
</Card>

      {/* Active Discounts Table */}
      <Card>
       
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Customer Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1">{discount.code}</code>
                  </TableCell>
                  <TableCell className="capitalize">{discount.type}</TableCell>
                  <TableCell>
                    {discount.type === "percentage" ? `${discount.value}%` : `${discount.value} ALL`}
                  </TableCell>
                  <TableCell>{getStatusBadge(discount.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(discount.startDate, "MMM d, yyyy")} -
                      <br />
                      {format(discount.endDate, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {discount.usageCount} / {discount.usageLimit || "∞"}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{discount.customerType}</TableCell>
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
              {[...Array(Math.min(5, Math.ceil(discounts.length / pageSize)))].map((_, i) => (
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
                  onClick={() => setPage(p => Math.min(Math.ceil(discounts.length / pageSize), p + 1))}
                  disabled={page === Math.ceil(discounts.length / pageSize)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <p className="text-sm text-muted-foreground min-w-[180px] text-right">
          Showing <span className="font-medium">{pageSize}</span> of{" "}
          <span className="font-medium">{discounts.length}</span> discounts
        </p>
      </div>
      </div>
        </CardContent>
      </Card>
       {/* Add empty space div at the bottom */}
  <div className="h-8"></div>
    </div>
  );
}

export default PromotionsDiscounts;