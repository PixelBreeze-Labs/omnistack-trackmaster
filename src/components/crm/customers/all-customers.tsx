"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCustomers } from "@/hooks/useCustomers";
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
  UserPlus,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  RefreshCcw,
  ArrowUpRight,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import React from "react";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { DeactivateCustomerDialog } from "./DeactivateCustomerDialog";
import { CustomerForm } from "./CustomerForm";
import { Customer } from "@/app/api/external/omnigateway/types/customers";

export function AllCustomers() {
  const {
    isLoading,
    customers,
    metrics,
    totalItems,
    totalPages,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    deactivateCustomer
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [customerToDeactivate, setCustomerToDeactivate] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      type: type !== 'all' ? type.toUpperCase() : undefined,
      search: searchTerm
    });
  }, [fetchCustomers, page, pageSize, status, type, searchTerm]);

  const handleRefresh = () => {
    fetchCustomers({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      type: type !== 'all' ? type.toUpperCase() : undefined,
      search: searchTerm
    });
  };

  const handleCreateCustomer = async (data) => {
    await createCustomer(data);
    handleRefresh();
  };

  const handleUpdateCustomer = async (data) => {
    await updateCustomer(selectedCustomer._id, data);
    handleRefresh();
  };

  const handleDeleteCustomer = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete._id);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      handleRefresh();
    }
  };

  const handleDeactivateCustomer = async () => {
    if (customerToDeactivate) {
      await deactivateCustomer(customerToDeactivate._id);
      setDeactivateDialogOpen(false);
      setCustomerToDeactivate(null);
      handleRefresh();
    }
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
          <h2 className="text-2xl font-bold tracking-tight">All Customers</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage all your customers in one place
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{metrics?.totalCustomers ?? 0}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.trends.customers.percentage)}
                <span className={`text-sm ${getTrendClass(metrics?.trends.customers.percentage)}`}>
                  {metrics?.trends.customers.percentage ?? 0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{metrics?.activeCustomers ?? 0}</div>
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
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{metrics?.averageOrderValue.toLocaleString() ?? 0} ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.trends.orderValue.percentage)}
                <span className={`text-sm ${getTrendClass(metrics?.trends.orderValue.percentage)}`}>
                  {metrics?.trends.orderValue.percentage ?? 0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">+{metrics?.customerGrowth ?? 0}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.trends.growth.percentage)}
                <span className={`text-sm ${getTrendClass(metrics?.trends.growth.percentage)}`}>
                  {metrics?.trends.growth.percentage ?? 0}%
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
            <h3 className="font-medium">Filter Customers</h3>
            <p className="text-sm text-muted-foreground">
              Filter and search through your customer base
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative mt-2 flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or phone..."
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
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" }
                ]}
              />
              <InputSelect
                name="type"
                label=""
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "regular", label: "Regular" },
                  { value: "vip", label: "VIP" }
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button onClick={() => {
                setSelectedCustomer(null);
                setCustomerFormOpen(true);
              }}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
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
      <TableHead>Customer</TableHead>
      <TableHead>Contact</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Source</TableHead>
      <TableHead>Registration</TableHead>
      <TableHead>Last Activity</TableHead>
      <TableHead className="text-center">Points</TableHead>
      <TableHead className="text-center">Total Spend</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {isLoading ? (
      <TableRow>
        <TableCell colSpan={9} className="text-center py-8">
          <div className="flex items-center justify-center">
            <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </TableCell>
      </TableRow>
    ) : customers.length === 0 ? (
      <TableRow>
        <TableCell colSpan={9} className="text-center py-8">
          <div className="flex flex-col items-center gap-3">
            <UserPlus className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No Customers Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm text-center">
              Start building your customer base. Add your first customer to begin tracking relationships and orders.
            </p>
            <Button 
              className="mt-4"
              onClick={() => {
                setSelectedCustomer(null);
                setCustomerFormOpen(true);
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ) : (
      customers.map((customer) => (
        <TableRow key={customer._id}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} />
                <AvatarFallback className="uppercase">
                  {customer.firstName[0]}{customer.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                {customer.type === "VIP" && (
                  <Badge variant="default" className="mt-0.5">VIP</Badge>
                )}
              </div>
            </div>
          </TableCell>
          
          <TableCell>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {customer.phone || 'N/A'}
              </div>
            </div>
          </TableCell>

          <TableCell>
            <Badge variant={customer.status === "ACTIVE" ? "success" : "secondary"}>
              {customer.status}
            </Badge>
          </TableCell>

          <TableCell>
            <Badge variant={
              customer.source === "metroshop" ? "default" :
              customer.source === "metrosuites" ? "warning" :
              "secondary"
            }>
              {customer.source?.toUpperCase() || 'MANUAL'}
            </Badge>
          </TableCell>

          <TableCell>
            <div className="text-sm">
              {customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString() : 'N/A'}
            </div>
          </TableCell>

          <TableCell>
  <div className="space-y-0.5">
    <div className="text-sm font-medium">
      {customer.lastActive 
        ? new Date(customer.lastActive).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'N/A'}
    </div>
    <div className="text-xs text-muted-foreground">
      {customer.lastActive 
        ? new Date(customer.lastActive).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
          })
        : ''}
    </div>
  </div>
</TableCell>

          <TableCell className="text-center">
            <div className="font-medium">{customer.points?.toLocaleString() || 0}</div>
            <Badge variant="outline" className="mt-1">
              {customer.membershipTier || 'NONE'}
            </Badge>
          </TableCell>

          <TableCell className="text-center">
            <div className="font-medium">
              {customer.totalSpend?.toLocaleString() || 0} ALL
            </div>
          </TableCell>

          <TableCell className="text-right">
            <select
              className="w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm"
              onChange={(e) => {
                const action = e.target.value;
                if (!action) return;
                
                switch (action) {
                  case "edit":
                    setSelectedCustomer(customer);
                    setCustomerFormOpen(true);
                    break;
                  case "deactivate":
                    setCustomerToDeactivate(customer);
                    setDeactivateDialogOpen(true);
                    break;
                  case "delete":
                    setCustomerToDelete(customer);
                    setDeleteDialogOpen(true);
                    break;
                }
                e.target.value = ""; // Reset select after action
              }}
            >
              <option value="">Actions</option>
              <option value="edit">Edit</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
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
                    Showing <span className="font-medium">{customers.length}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> customers
                  </p>
                </div>
              </div>
</CardContent>
      </Card>
             

              <CustomerForm
                open={customerFormOpen}
                onClose={() => {
                  setCustomerFormOpen(false);
                  setSelectedCustomer(null);
                }}
                onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
                initialData={selectedCustomer ? {
                  firstName: selectedCustomer.firstName,
                  lastName: selectedCustomer.lastName,
                  email: selectedCustomer.email,
                  phone: selectedCustomer.phone,
                  type: selectedCustomer.type,
                  status: selectedCustomer.status,
                } : undefined}
                title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
              />

              <DeleteCustomerDialog
                open={deleteDialogOpen}
                onClose={() => {
                  setDeleteDialogOpen(false);
                  setCustomerToDelete(null);
                }}
                onConfirm={handleDeleteCustomer}
                customerName={customerToDelete ? `${customerToDelete.firstName} ${customerToDelete.lastName}` : ''}
              />

              <DeactivateCustomerDialog
                open={deactivateDialogOpen}
                onClose={() => {
                  setDeactivateDialogOpen(false);
                  setCustomerToDeactivate(null);
                }}
                onConfirm={handleDeactivateCustomer}
                customerName={customerToDeactivate ? `${customerToDeactivate.firstName} ${customerToDeactivate.lastName}` : ''}
              />
              <div className="h-8"></div>
    </div>
  );
}

export default AllCustomers;
            