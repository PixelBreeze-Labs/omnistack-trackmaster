"use client";

import { useEffect, useState } from "react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Download,
  FileText,
  RefreshCcw,
  ShoppingCart,
  Tag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ChevronDown,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useSubscription } from "@/hooks/useSubscription";
import { StripeProduct } from "@/app/api/external/omnigateway/types/stripe-products";
import { SyncDialog } from "./SyncDialog";

export function StripeProducts() {
  const {
    isLoading,
    products,
    totalItems,
    totalPages,
    metrics,
    fetchProducts,
    syncProducts
  } = useSubscription();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<StripeProduct | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProducts({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      search: searchTerm
    });
  }, [fetchProducts, page, pageSize, status, searchTerm]);

  const handleRefresh = () => {
    fetchProducts({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      search: searchTerm
    });
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      // Implement product deletion logic
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      handleRefresh();
    }
  };
  
  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    const value = amount / 100; // Convert cents to dollars/euros/etc.
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value);
  };

  const formatInterval = (interval: string, count: number) => {
    if (count === 1) {
      return interval === 'month' ? 'Monthly' : 'Yearly';
    }
    return `Every ${count} ${interval}${count > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription Products</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your Stripe products and pricing plans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setSyncDialogOpen(true)}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Sync with Stripe
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.totalProducts ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">From Stripe</p>
              </div>
              <div className="flex items-center gap-1">
                {(metrics?.trends?.products?.percentage || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${(metrics?.trends?.products?.percentage || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.products?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.activeProducts ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently available</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {metrics?.totalProducts ? Math.round((metrics?.activeProducts / metrics?.totalProducts) * 100) : 0}% active
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prices</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.totalPrices ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Price plans available</p>
              </div>
              <div className="flex items-center gap-1">
                {(metrics?.trends?.prices?.percentage || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${(metrics?.trends?.prices?.percentage || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics?.trends?.prices?.percentage ?? 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold">{metrics?.activePrices ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Active price plans</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                {metrics?.totalPrices ? Math.round((metrics?.activePrices / metrics?.totalPrices) * 100) : 0}% active
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Products</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your subscription products
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or description..."
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
            <Button variant="outline" className="gap-2 mt-2">
              <FileText className="h-4 w-4" />
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Prices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !products || products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Products Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || status !== 'all' 
                          ? "No products match your search criteria. Try adjusting your filters." 
                          : "No subscription products have been synced from Stripe yet."}
                      </p>
                      {!searchTerm && status === 'all' && (
                        <Button 
                          className="mt-4"
                          onClick={() => setSyncDialogOpen(true)}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Sync with Stripe
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <>
                    <TableRow 
                      key={product._id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => toggleProductExpansion(product._id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {expandedProducts[product._id] ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="font-medium">
                            {product.name}
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                          {product.stripeProductId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {product.prices?.length || 0} Prices
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.isActive ? "success" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <InputSelect
                            name="actions"
                            label=""
                            value=""
                            onChange={(e) => {
                              const action = e.target.value;
                              if (action === "delete") {
                                setProductToDelete(product);
                                setDeleteDialogOpen(true);
                              }
                              // Add other actions as needed
                            }}
                            options={[
                              { value: "", label: "Actions" },
                              { value: "view", label: "View Details" },
                              { value: "delete", label: "Delete Product" }
                            ]}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded price details */}
                    {expandedProducts[product._id] && product.prices && product.prices.length > 0 && (
                      <TableRow className="bg-slate-50 border-t-0">
                        <TableCell colSpan={6} className="px-8 py-4">
                          <div className="text-sm font-medium mb-2">Price Plans</div>
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-slate-200">
                                <TableHead className="w-1/3">Price Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Interval</TableHead>
                                <TableHead>Trial</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {product.prices.map((price) => (
                                <TableRow key={price._id}>
                                  <TableCell>
                                    <div className="font-medium">
                                      {price.currency.toUpperCase()} - {formatInterval(price.interval, price.intervalCount)}
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground mt-1">
                                      {price.stripePriceId}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(price.amount, price.currency)}
                                  </TableCell>
                                  <TableCell>
                                    {formatInterval(price.interval, price.intervalCount)}
                                  </TableCell>
                                  <TableCell>
                                    {price.trialPeriodDays ? `${price.trialPeriodDays} days` : 'No trial'}
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={price.isActive ? "success" : "secondary"}
                                    >
                                      {price.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex justify-end">
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {products && products.length > 0 && (
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
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
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
                  Showing <span className="font-medium">{products?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> products
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <SyncDialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        onSync={syncProducts}
      />
    </div>
  );
}

export default StripeProducts;