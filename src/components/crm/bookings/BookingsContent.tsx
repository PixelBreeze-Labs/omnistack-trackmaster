"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Calendar,
  CalendarDays,
  Users,
  Search,
  Download,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  CalendarIcon
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useBookings } from "@/hooks/useBookings";
import { BookingStatus, PaymentMethod } from "@/app/api/external/omnigateway/types/bookings";
import { SyncConfirmDialog } from "./SyncConfirmDialog";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { DatePicker } from "@/components/ui/datepicker";
import { format } from "date-fns";

export function BookingsContent() {
  const {
    isLoading,
    bookings,
    totalItems,
    totalPages,
    fetchBookings,
    syncBookings
  } = useBookings();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchBookings({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as BookingStatus : undefined,
      search: searchTerm,
      fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
    });
  }, [fetchBookings, page, pageSize, statusFilter, searchTerm, fromDate, toDate]);

  const handleRefresh = () => {
    fetchBookings({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as BookingStatus : undefined,
      search: searchTerm,
      fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
    });
  };

  const handleSyncConfirm = async () => {
    try {
      setIsSyncing(true);
      const result = await syncBookings();
      toast.success(`Sync completed: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.errors} errors`);
      setSyncDialogOpen(false);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to sync bookings");
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "success";
      case BookingStatus.PENDING:
        return "warning";
      case BookingStatus.PROCESSING:
        return "default";
      case BookingStatus.CANCELLED:
        return "destructive";
      case BookingStatus.COMPLETED:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case BookingStatus.PENDING:
        return <Clock className="mr-1 h-3 w-3" />;
      case BookingStatus.PROCESSING:
        return <RefreshCcw className="mr-1 h-3 w-3" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="mr-1 h-3 w-3" />;
      case BookingStatus.COMPLETED:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case PaymentMethod.CARD:
        return <CreditCard className="mr-1 h-3 w-3" />;
      case PaymentMethod.CASH:
        return <DollarSign className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage reservations for all your properties
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
            <Calendar className="mr-2 h-4 w-4" />
            Sync with VenueBoost
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Bookings</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your reservation data
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings by confirmation code..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48 mt-3">
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: BookingStatus.CONFIRMED, label: "Confirmed" },
                  { value: BookingStatus.PENDING, label: "Pending" },
                  { value: BookingStatus.PROCESSING, label: "Processing" },
                  { value: BookingStatus.CANCELLED, label: "Cancelled" },
                  { value: BookingStatus.COMPLETED, label: "Completed" }
                ]}
              />
            </div>
            <div className="w-40 mt-3">
              <DatePicker 
                date={fromDate} 
                setDate={setFromDate} 
                placeholder="From Date"
              />
            </div>
            <div className="w-40 mt-3">
              <DatePicker 
                date={toDate} 
                setDate={setToDate} 
                placeholder="To Date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Confirmation</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !bookings || bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <CalendarDays className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Bookings Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' || fromDate || toDate
                          ? "No bookings match your search criteria. Try adjusting your filters." 
                          : "Start by synchronizing your bookings from VenueBoost."}
                      </p>
                      {!searchTerm && statusFilter === 'all' && !fromDate && !toDate && (
                        <Button 
                          className="mt-4"
                          onClick={() => setSyncDialogOpen(true)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Sync Bookings
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.confirmationCode}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <div>{booking.metadata?.guestName || "Unknown Guest"}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.metadata?.propertyName || "Unknown Property"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm">
                          <CalendarIcon className="h-3 w-3 text-green-600" />
                          <span>{formatDate(booking.checkInDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <CalendarIcon className="h-3 w-3 text-red-600" />
                          <span>{formatDate(booking.checkOutDate)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(booking.totalAmount, 'EUR')}
                      </div>
                      {booking.discountAmount > 0 && (
                        <div className="text-xs text-green-600 mt-0.5">
                          -{formatCurrency(booking.discountAmount)} discount
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(booking.status)}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPaymentIcon(booking.paymentMethod)}
                        {booking.paymentMethod.charAt(0).toUpperCase() + booking.paymentMethod.slice(1).toLowerCase()}
                      </Badge>
                      {booking.prepaymentAmount > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(booking.prepaymentAmount)} prepaid
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/crm/platform/bookings/${booking.id}`, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {bookings && bookings.length > 0 && (
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
                  Showing <span className="font-medium">{bookings?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> bookings
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Confirmation Dialog */}
      <SyncConfirmDialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        onConfirm={handleSyncConfirm}
        isSyncing={isSyncing}
      />
    </div>
  );
}

export default BookingsContent;