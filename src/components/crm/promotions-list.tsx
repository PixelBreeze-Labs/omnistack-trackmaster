"use client"

import React, { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  Search, 
  Tag, 
  CircleDollarSign, 
  Users, 
  Ticket,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Ban,
  BarChart3,
  Eye
} from "lucide-react";
import InputSelect from "../Common/InputSelect";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

interface Promotion {
  id: string;
  name: string;
  type: "discount" | "coupon" | "bogo" | "bundle" | "flash_sale";
  value: string;
  description: string;
  status: "active" | "scheduled" | "ended" | "draft";
  startDate: string;
  endDate: string;
  usageCount: number;
  targetAudience: string;
  conditions?: string;
  redemptionRate?: number;
  totalRevenue?: number;
  code?: string;
}

const DUMMY_PROMOTIONS: Promotion[] = [
  {
    id: "1",
    name: "Summer Collection Sale",
    type: "discount",
    value: "25% OFF",
    description: "Seasonal discount on all summer collection items",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageCount: 1245,
    targetAudience: "All Customers",
    conditions: "Min. purchase 5000 ALL",
    redemptionRate: 45.2,
    totalRevenue: 450000
  },
  {
    id: "2",
    name: "New Customer Welcome",
    type: "coupon",
    value: "2000 ALL OFF",
    description: "Welcome discount for first-time customers",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageCount: 892,
    targetAudience: "New Customers",
    code: "WELCOME2024",
    redemptionRate: 68.5,
    totalRevenue: 178400
  },
  {
    id: "3",
    name: "Buy 2 Get 1 Free - Accessories",
    type: "bogo",
    value: "Buy 2 Get 1",
    description: "Special offer on accessories",
    status: "scheduled",
    startDate: "2024-07-01",
    endDate: "2024-07-15",
    usageCount: 0,
    targetAudience: "All Customers",
    conditions: "Valid on selected accessories only"
  },
  {
    id: "4",
    name: "Flash Sale - Premium Items",
    type: "flash_sale",
    value: "40% OFF",
    description: "24-hour flash sale on premium items",
    status: "ended",
    startDate: "2024-05-15",
    endDate: "2024-05-16",
    usageCount: 567,
    targetAudience: "VIP Customers",
    redemptionRate: 82.3,
    totalRevenue: 890000
  }
];

export function PromotionsList() {
  const [promotions] = useState<Promotion[]>(DUMMY_PROMOTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "success",
      scheduled: "warning",
      ended: "destructive",
      draft: "secondary"
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      discount: "default",
      coupon: "outline",
      bogo: "secondary",
      bundle: "warning",
      flash_sale: "destructive"
    };
    return (
      <Badge variant={variants[type]} className="capitalize">
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Promotions</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage and track all your promotional campaigns in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M ALL</div>
            <p className="text-xs text-muted-foreground mt-1">From promotions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,892</div>
            <p className="text-xs text-muted-foreground mt-1">Total uses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Redemption Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.8%</div>
            <p className="text-xs text-muted-foreground mt-1">Promotion usage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
  <CardHeader>
    <div className="mb-1">
      <h3 className="font-medium">Filter Promotions</h3>
      <p className="text-sm text-muted-foreground">
        Search and filter through your promotional campaigns
      </p>
    </div>
  </CardHeader>
  <CardContent className="p-0">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center flex-1 gap-2 max-w-3xl">
        <div className="relative mt-2 flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search promotions..."
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
            { value: "ended", label: "Ended" },
            { value: "draft", label: "Draft" }
          ]}
        />
        <InputSelect
          name="type"
          label=""
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "all", label: "All Types" },
            { value: "discount", label: "Discount" },
            { value: "coupon", label: "Coupon" },
            { value: "bogo", label: "BOGO" },
            { value: "bundle", label: "Bundle" },
            { value: "flash_sale", label: "Flash Sale" }
          ]}
        />
      </div>
    </div>
  </CardContent>
</Card>

{/* Table Card */}
<Card>
  <CardContent>
  <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Promotion</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{promo.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {promo.description}
                      </div>
                      {promo.code && (
                        <code className="text-xs bg-muted px-2 py-1 rounded mt-1">
                          {promo.code}
                        </code>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getTypeBadge(promo.type)}
                      <div className="text-sm font-medium">{promo.value}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(promo.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(promo.startDate).toLocaleDateString()} -
                      <br />
                      {new Date(promo.endDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{promo.usageCount.toLocaleString()}</div>
                    {promo.conditions && (
                      <div className="text-xs text-muted-foreground">
                        {promo.conditions}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{promo.targetAudience}</Badge>
                  </TableCell>
                  <TableCell>
                    {promo.redemptionRate ? (
                      <div className="text-sm">
                        <div className="font-medium">{promo.redemptionRate}% redemption</div>
                        <div className="text-xs text-muted-foreground">
                          {promo.totalRevenue?.toLocaleString()} ALL revenue
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not started</span>
                    )}
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
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
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
              {[...Array(Math.min(5, Math.ceil(promotions.length / pageSize)))].map((_, i) => (
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
                  onClick={() => setPage(p => Math.min(Math.ceil(promotions.length / pageSize), p + 1))}
                  disabled={page === Math.ceil(promotions.length / pageSize)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <p className="text-sm text-muted-foreground min-w-[180px] text-right">
          Showing <span className="font-medium">{pageSize}</span> of{" "}
          <span className="font-medium">{promotions.length}</span> promotions
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

export default PromotionsList;