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
  Receipt,
  Search,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCcw,
  CircleDollarSign,
  PackageX,
  AlertCircle,
  CalendarDays,
  ClipboardList
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";

// Dummy data for returns
const DUMMY_RETURNS = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  orderNumber: `ORD-2024-${String(index + 1).padStart(3, '0')}`,
  customer: {
    name: index % 2 === 0 ? "John Doe" : "Jane Smith",
    email: index % 2 === 0 ? "john@example.com" : "jane@example.com"
  },
  status: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'][Math.floor(Math.random() * 4)],
  reason: ['Damaged', 'Wrong Size', 'Not as Described', 'Changed Mind'][Math.floor(Math.random() * 4)],
  amount: Math.floor(Math.random() * 50000) + 5000,
  items: Math.floor(Math.random() * 3) + 1,
  date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
  type: ['RETURN', 'REFUND'][Math.floor(Math.random() * 2)]
}));

export function ReturnsAndRefunds() {
  const [returns] = useState(DUMMY_RETURNS);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-red-500" />
    }
    return <TrendingDown className="h-4 w-4 text-green-500" />
  }

  const getTrendClass = (percentage: number) => {
    return percentage > 0 ? "text-red-500" : "text-green-500"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "warning",
      APPROVED: "success",
      REJECTED: "destructive",
      COMPLETED: "default"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'RETURN' ? 'secondary' : 'destructive'}>
        {type === 'RETURN' ? (
          <PackageX className="mr-1 h-3 w-3" />
        ) : (
          <Receipt className="mr-1 h-3 w-3" />
        )}
        {type}
      </Badge>
    );
  };

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedReturns = returns.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Returns & Refunds</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Process and manage your returns and refunds
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
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">347</div>
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
            <CardTitle className="text-sm font-medium">Refund Amount</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">2.4M ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(8)}
                <span className={`text-sm ${getTrendClass(8)}`}>+8%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total refunded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">3.2%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(5)}
                <span className={`text-sm ${getTrendClass(5)}`}>+5%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Of total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(-2)}
                <span className={`text-sm ${getTrendClass(-2)}`}>-2%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="mb-1">
            <h3 className="font-medium">Returns Management</h3>
            <p className="text-sm text-muted-foreground">
              Process and manage return requests and refunds
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4 p-0">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative mt-2 flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or customer..."
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
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "completed", label: "Completed" }
                ]}
              />
              <InputSelect
                name="type"
                label=""
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "return", label: "Returns" },
                  { value: "refund", label: "Refunds" }
                ]}
              />
              <Button variant="outline" className={"mt-2"} size="icon">
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardContent className="mb-4 p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return Info</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedReturns.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium">{item.orderNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium">{item.customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(item.type)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.items} items</TableCell>
                  <TableCell>{item.amount.toLocaleString()} ALL</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Process Return</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Contact Customer</DropdownMenuItem>
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
                    {[...Array(Math.min(5, Math.ceil(returns.length / pageSize)))].map((_, i) => (
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
                        onClick={() => setPage(p => Math.min(Math.ceil(returns.length / pageSize), p + 1))}
                        disabled={page === Math.ceil(returns.length / pageSize)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                  Showing <span className="font-medium">{displayedReturns.length}</span> of{" "}
                  <span className="font-medium">{returns.length}</span> orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Add empty space div at the bottom */}
        <div className="h-4"></div>
</div>
)
}