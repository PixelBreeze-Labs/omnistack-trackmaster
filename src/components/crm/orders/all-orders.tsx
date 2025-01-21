"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { 
  Package,
  Search,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCcw,
  Truck,
  Store,
  Clock,
  CalendarDays,
  Receipt,
  CircleDollarSign
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";

// Extended dummy data
const DUMMY_ORDERS = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  orderNumber: `ORD-2024-${String(index + 1).padStart(3, '0')}`,
  customer: {
    name: index % 2 === 0 ? "John Doe" : "Jane Smith",
    email: index % 2 === 0 ? "john@example.com" : "jane@example.com"
  },
  status: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'][Math.floor(Math.random() * 5)],
  channel: ['ONLINE', 'IN_STORE', 'MARKETPLACE'][Math.floor(Math.random() * 3)],
  total: Math.floor(Math.random() * 100000) + 5000,
  items: Math.floor(Math.random() * 10) + 1,
  date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
  paymentStatus: ['PAID', 'PENDING', 'FAILED'][Math.floor(Math.random() * 3)]
}));

export function AllOrders() {
  const [orders] = useState(DUMMY_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendClass = (percentage: number) => {
    return percentage > 0 ? "text-green-500" : "text-red-500"
  }

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      PROCESSING: "default",
      SHIPPED: "primary",
      DELIVERED: "success",
      CANCELLED: "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      PAID: "success",
      PENDING: "warning",
      FAILED: "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedOrders = orders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(orders.length / pageSize);

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Orders</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage and track all your orders in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="soft" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">2,874</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(12)}
                <span className={`text-sm ${getTrendClass(12)}`}>+12%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">15.4M ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(8)}
                <span className={`text-sm ${getTrendClass(8)}`}>+8%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">156</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(-5)}
                <span className={`text-sm ${getTrendClass(-5)}`}>-5%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(-2)}
                <span className={`text-sm ${getTrendClass(-2)}`}>-2%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="mb-2">
              <h3 className="font-medium">Filter Orders</h3>
              <p className="text-sm text-muted-foreground">
              Filter, search, and manage orders across all your sales channels
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-4 p-0">
              <div className="flex items-center flex-1 gap-2 max-w-3xl">
                <div className="relative flex-1 mt-3">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by ID, customer name or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <InputSelect
                  name="status"
                  label=""
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "delivered", label: "Delivered" },
                    { value: "cancelled", label: "Cancelled" }
                  ]}
                />
                <InputSelect
                  name="channel"
                  label=""
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  options={[
                    { value: "all", label: "All Channels" },
                    { value: "online", label: "Online" },
                    { value: "in_store", label: "In Store" },
                    { value: "marketplace", label: "Marketplace" }
                  ]}
                />
                <Button  className="mt-2" variant="outline" size="icon">
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Truck className="mr-2 h-4 w-4" />
                  Omni-channel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Info</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.channel === 'ONLINE' && <Package className="mr-1 h-3 w-3" />}
                        {order.channel === 'IN_STORE' && <Store className="mr-1 h-3 w-3" />}
                        {order.channel === 'MARKETPLACE' && <Truck className="mr-1 h-3 w-3" />}
                        {order.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>{order.total.toLocaleString()} ALL</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Integrated Pagination */}
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
                      {[...Array(Math.min(5, Math.ceil(orders.length / pageSize)))].map((_, i) => (
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
                          onClick={() => setPage(p => Math.min(Math.ceil(orders.length / pageSize), p + 1))}
                          disabled={page === Math.ceil(orders.length / pageSize)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                  Showing <span className="font-medium">{displayedOrders.length}</span> of{" "}
                  <span className="font-medium">{orders.length}</span> orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
</div>
</div>
)
}