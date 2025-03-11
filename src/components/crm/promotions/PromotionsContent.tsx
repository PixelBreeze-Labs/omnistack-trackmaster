"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TagIcon,
  Percent,
  Search,
  Download,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  ShoppingBag,
  Home,
  Menu
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { usePromotions } from "@/hooks/usePromotions";
import { DiscountType } from "@/app/api/external/omnigateway/types/promotions";
import { SyncPromotionsDialog } from "./SyncPromotionsDialog";
import { toast } from "react-hot-toast";
import { PromotionActionSelect, DiscountActionSelect } from "@/components/crm/promotions/PromotionActionComponents";
import { format } from "date-fns";

export function PromotionsContent() {
  // Promotions tab state
  const [promotionsCurrentTab, setPromotionsCurrentTab] = useState("promotions");
  
  // Promotions pagination and filters
  const [promotionsPage, setPromotionsPage] = useState(1);
  const [promotionsPageSize, setPromotionsPageSize] = useState(10);
  const [promotionsSearchTerm, setPromotionsSearchTerm] = useState("");
  const [promotionsStatusFilter, setPromotionsStatusFilter] = useState<string>("all");
  const [promotionsTypeFilter, setPromotionsTypeFilter] = useState<string>("all");
  
  // Discounts pagination and filters
  const [discountsPage, setDiscountsPage] = useState(1);
  const [discountsPageSize, setDiscountsPageSize] = useState(10);
  const [discountsSearchTerm, setDiscountsSearchTerm] = useState("");
  const [discountsStatusFilter, setDiscountsStatusFilter] = useState<string>("all");
  const [discountsTypeFilter, setDiscountsTypeFilter] = useState<string>("all");
  
  // Sync state
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  
  const {
    // Promotions
    isLoadingPromotions,
    isDeletingPromotion,
    promotions,
    promotionsTotalItems,
    promotionsTotalPages,
    fetchPromotions,
    deletePromotion,
    
    // Discounts
    isLoadingDiscounts,
    isDeletingDiscount,
    discounts,
    discountsTotalItems,
    discountsTotalPages,
    fetchDiscounts,
    deleteDiscount,
    
    // Combined operations
    syncAllPromotionsAndDiscounts,
    isSyncingPromotions,
    isSyncingDiscounts
  } = usePromotions();

  // Load promotions on tab change or filter change
  useEffect(() => {
    if (promotionsCurrentTab === "promotions") {
      fetchPromotions({
        page: promotionsPage,
        limit: promotionsPageSize,
        search: promotionsSearchTerm,
        status: promotionsStatusFilter !== 'all' ? promotionsStatusFilter === 'true' : undefined,
        type: promotionsTypeFilter !== 'all' ? promotionsTypeFilter : undefined
      });
    } else if (promotionsCurrentTab === "discounts") {
      fetchDiscounts({
        page: discountsPage,
        limit: discountsPageSize,
        search: discountsSearchTerm,
        status: discountsStatusFilter !== 'all' ? discountsStatusFilter === 'true' : undefined,
        type: discountsTypeFilter !== 'all' ? discountsTypeFilter as DiscountType : undefined
      });
    }
  }, [
    fetchPromotions, 
    fetchDiscounts, 
    promotionsCurrentTab, 
    promotionsPage, 
    promotionsPageSize, 
    promotionsSearchTerm, 
    promotionsStatusFilter, 
    promotionsTypeFilter, 
    discountsPage, 
    discountsPageSize, 
    discountsSearchTerm, 
    discountsStatusFilter, 
    discountsTypeFilter
  ]);

  const handleRefresh = () => {
    if (promotionsCurrentTab === "promotions") {
      fetchPromotions({
        page: promotionsPage,
        limit: promotionsPageSize,
        search: promotionsSearchTerm,
        status: promotionsStatusFilter !== 'all' ? promotionsStatusFilter === 'true' : undefined,
        type: promotionsTypeFilter !== 'all' ? promotionsTypeFilter : undefined
      });
    } else if (promotionsCurrentTab === "discounts") {
      fetchDiscounts({
        page: discountsPage,
        limit: discountsPageSize,
        search: discountsSearchTerm,
        status: discountsStatusFilter !== 'all' ? discountsStatusFilter === 'true' : undefined,
        type: discountsTypeFilter !== 'all' ? discountsTypeFilter as DiscountType : undefined
      });
    }
  };

  const handleSyncConfirm = async () => {
    try {
      const result = await syncAllPromotionsAndDiscounts();
      
      const promotionsResult = result.promotions;
      const discountsResult = result.discounts;
      
      toast.success(
        `Sync completed successfully:\n` +
        `Promotions: ${promotionsResult.created} created, ${promotionsResult.updated} updated\n` +
        `Discounts: ${discountsResult.created} created, ${discountsResult.updated} updated`
      );
      
      setSyncDialogOpen(false);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to sync promotions and discounts");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateWithTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDiscountValue = (discount) => {
    return discount.type === DiscountType.PERCENTAGE
      ? `${discount.value}%`
      : `$${discount.value.toFixed(2)}`;
  };

  const getStatusBadgeVariant = (status: boolean) => {
    return status ? "success" : "destructive";
  };

  const getStatusIcon = (status: boolean) => {
    return status 
      ? <CheckCircle className="mr-1 h-3 w-3" />
      : <XCircle className="mr-1 h-3 w-3" />;
  };

  const getProductTypeIcon = (metadata: any) => {
    if (metadata?.product) {
      return <ShoppingBag className="h-3 w-3 mr-1" />;
    } else if (metadata?.category) {
      return <Menu className="h-3 w-3 mr-1" />;
    } else if (metadata?.rentalUnit) {
      return <Home className="h-3 w-3 mr-1" />;
    }
    return null;
  };

  const getDiscountAppliesTo = (discount) => {
    if (discount.metadata?.product) {
      return (
        <div className="flex items-center gap-1">
          <ShoppingBag className="h-3 w-3" />
          <span className="truncate">{discount.metadata.product.title}</span>
        </div>
      );
    } else if (discount.metadata?.category) {
      return (
        <div className="flex items-center gap-1">
          <Menu className="h-3 w-3" />
          <span className="truncate">{discount.metadata.category.name} (Category)</span>
        </div>
      );
    } else if (discount.metadata?.rentalUnit) {
      return (
        <div className="flex items-center gap-1">
          <Home className="h-3 w-3" />
          <span className="truncate">{discount.metadata.rentalUnit.name}</span>
        </div>
      );
    } else if (discount.metadata?.productIds) {
      return "Multiple Products";
    }
    return "All Items";
  };

  const isSyncing = isSyncingPromotions || isSyncingDiscounts;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promotions & Discounts</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage special offers and discounts for your properties and services
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
            <Percent className="mr-2 h-4 w-4" />
            Sync with VenueBoost
          </Button>
        </div>
      </div>

      <Tabs defaultValue="promotions" onValueChange={setPromotionsCurrentTab} value={promotionsCurrentTab}>
        <TabsList>
          <TabsTrigger value="promotions">
            <TagIcon className="mr-2 h-4 w-4" />
            Promotions
          </TabsTrigger>
          <TabsTrigger value="discounts">
            <Percent className="mr-2 h-4 w-4" />
            Discounts
          </TabsTrigger>
        </TabsList>

        {/* Promotions Tab Content */}
        <TabsContent value="promotions">
          {/* Search and Filters for Promotions */}
          <Card className="mb-6">
            <CardHeader>
              <div className="mb-0">
                <h3 className="font-medium">Filter Promotions</h3>
                <p className="text-sm text-muted-foreground">
                  Search and filter through your promotional campaigns
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-0 flex flex-col md:flex-row items-center gap-4">
                <div className="relative mt-2 flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search promotions by title or description..."
                    className="pl-8"
                    value={promotionsSearchTerm}
                    onChange={(e) => setPromotionsSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-36 mt-3">
                  <InputSelect
                    name="status"
                    label=""
                    value={promotionsStatusFilter}
                    onChange={(e) => setPromotionsStatusFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" }
                    ]}
                  />
                </div>
                <div className="w-36 mt-3">
                  <InputSelect
                    name="type"
                    label=""
                    value={promotionsTypeFilter}
                    onChange={(e) => setPromotionsTypeFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "discount", label: "Discount" },
                      { value: "coupon", label: "Coupon" }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPromotions ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !promotions || promotions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <TagIcon className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Promotions Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {promotionsSearchTerm || promotionsStatusFilter !== 'all' || promotionsTypeFilter !== 'all'
                              ? "No promotions match your search criteria. Try adjusting your filters."
                              : "Start by synchronizing your promotions from VenueBoost."}
                          </p>
                          {!promotionsSearchTerm && promotionsStatusFilter === 'all' && promotionsTypeFilter === 'all' && (
                            <Button
                              className="mt-4"
                              onClick={() => setSyncDialogOpen(true)}
                            >
                              <TagIcon className="mr-2 h-4 w-4" />
                              Sync Promotions
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    promotions.map((promotion) => (
                      <TableRow key={promotion.id}>
                        <TableCell>
                          <div className="font-medium">{promotion.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{promotion.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {promotion.type.charAt(0).toUpperCase() + promotion.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {promotion.startTime && promotion.endTime ? (
                            <div>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-green-600" />
                                <span>{formatDate(promotion.startTime)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <Calendar className="h-3 w-3 text-red-600" />
                                <span>{formatDate(promotion.endTime)}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No date range</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(promotion.status)}>
                            {getStatusIcon(promotion.status)}
                            {promotion.status ? "Active" : "Inactive"}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Created: {formatDate(promotion.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <div style={{ minWidth: "120px" }}>
                              <PromotionActionSelect
                                promotion={promotion}
                                onDeletePromotion={deletePromotion}
                                isDeleting={isDeletingPromotion}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination for Promotions */}
              {promotions && promotions.length > 0 && (
                <div className="border-t px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={promotionsPageSize.toString()}
                      onChange={(e) => setPromotionsPageSize(parseInt(e.target.value))}
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
                              onClick={() => setPromotionsPage(p => Math.max(1, p - 1))}
                              disabled={promotionsPage === 1} 
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, promotionsTotalPages) }, (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                isActive={promotionsPage === i + 1}
                                onClick={() => setPromotionsPage(i + 1)}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setPromotionsPage(p => Math.min(promotionsTotalPages, p + 1))}
                              disabled={promotionsPage === promotionsTotalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                      Showing <span className="font-medium">{promotions?.length}</span> of{" "}
                      <span className="font-medium">{promotionsTotalItems}</span> promotions
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discounts Tab Content */}
        <TabsContent value="discounts">
          {/* Search and Filters for Discounts */}
          <Card className="mb-6">
            <CardHeader>
              <div className="mb-0">
                <h3 className="font-medium">Filter Discounts</h3>
                <p className="text-sm text-muted-foreground">
                  Search and filter through your discount offers
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-0 flex flex-col md:flex-row items-center gap-4">
                <div className="relative mt-2 flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discounts..."
                    className="pl-8"
                    value={discountsSearchTerm}
                    onChange={(e) => setDiscountsSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-36 mt-3">
                  <InputSelect
                    name="status"
                    label=""
                    value={discountsStatusFilter}
                    onChange={(e) => setDiscountsStatusFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" }
                    ]}
                  />
                </div>
                <div className="w-36 mt-3">
                  <InputSelect
                    name="type"
                    label=""
                    value={discountsTypeFilter}
                    onChange={(e) => setDiscountsTypeFilter(e.target.value)}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: DiscountType.FIXED, label: "Fixed" },
                      { value: DiscountType.PERCENTAGE, label: "Percentage" }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discounts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Applies To</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingDiscounts ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !discounts || discounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <Percent className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Discounts Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {discountsSearchTerm || discountsStatusFilter !== 'all' || discountsTypeFilter !== 'all'
                              ? "No discounts match your search criteria. Try adjusting your filters."
                              : "Start by synchronizing your discounts from VenueBoost."}
                          </p>
                          {!discountsSearchTerm && discountsStatusFilter === 'all' && discountsTypeFilter === 'all' && (
                            <Button
                              className="mt-4"
                              onClick={() => setSyncDialogOpen(true)}
                            >
                              <Percent className="mr-2 h-4 w-4" />
                              Sync Discounts
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell>
                          <div className="font-medium flex items-center">
                            {discount.type === DiscountType.FIXED && <DollarSign className="h-4 w-4 mr-1" />}
                            {discount.type === DiscountType.PERCENTAGE && <Percent className="h-4 w-4 mr-1" />}
                            {formatDiscountValue(discount)}
                          </div>
                          {discount.metadata?.promotion && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Part of: {discount.metadata.promotion.title}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {discount.type === DiscountType.FIXED ? "Fixed Amount" : "Percentage"}
                          </Badge>
                          {discount.metadata?.reservationCount > 0 && (
                            <div className="text-xs text-blue-600 mt-1">
                              Min {discount.metadata.reservationCount} reservations
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {getDiscountAppliesTo(discount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-green-600" />
                              <span>{formatDate(discount.startTime)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm mt-1">
                              <Calendar className="h-3 w-3 text-red-600" />
                              <span>{formatDate(discount.endTime)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(discount.status)}>
                            {getStatusIcon(discount.status)}
                            {discount.status ? "Active" : "Inactive"}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Created: {formatDate(discount.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <div style={{ minWidth: "120px" }}>
                              <DiscountActionSelect
                                discount={discount}
                                onDeleteDiscount={deleteDiscount}
                                isDeleting={isDeletingDiscount}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination for Discounts */}
              {discounts && discounts.length > 0 && (
                <div className="border-t px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <InputSelect
                      name="pageSize"
                      label=""
                      value={discountsPageSize.toString()}
                      onChange={(e) => setDiscountsPageSize(parseInt(e.target.value))}
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
                              onClick={() => setDiscountsPage(p => Math.max(1, p - 1))}
                              disabled={discountsPage === 1} 
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, discountsTotalPages) }, (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                isActive={discountsPage === i + 1}
                                onClick={() => setDiscountsPage(i + 1)}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setDiscountsPage(p => Math.min(discountsTotalPages, p + 1))}
                              disabled={discountsPage === discountsTotalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                      Showing <span className="font-medium">{discounts?.length}</span> of{" "}
                      <span className="font-medium">{discountsTotalItems}</span> discounts
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sync Confirmation Dialog */}
      <SyncPromotionsDialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        onConfirm={handleSyncConfirm}
        isSyncing={isSyncing}
      />
    </div>
  );
}

export default PromotionsContent;