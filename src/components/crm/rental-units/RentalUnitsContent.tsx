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
  Home,
  Search,
  MapPin,
  Download,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  Bed,
  Building,
  ExternalLink
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useRentalUnits } from "@/hooks/useRentalUnits";
import { PropertyStatus, PropertyType } from "@/app/api/external/omnigateway/types/properties";
import { SyncConfirmDialog } from "./SyncConfirmDialog";
import { toast } from "react-hot-toast";

export function RentalUnitsContent() {
  const {
    isLoading,
    rentalUnits,
    totalItems,
    totalPages,
    fetchRentalUnits,
    syncRentalUnits
  } = useRentalUnits();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchRentalUnits({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as PropertyStatus : undefined,
      type: typeFilter !== 'all' ? typeFilter as PropertyType : undefined,
      search: searchTerm
    });
  }, [fetchRentalUnits, page, pageSize, statusFilter, typeFilter, searchTerm]);

  const handleRefresh = () => {
    fetchRentalUnits({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as PropertyStatus : undefined,
      type: typeFilter !== 'all' ? typeFilter as PropertyType : undefined,
      search: searchTerm
    });
  };

  const handleSyncConfirm = async () => {
    try {
      setIsSyncing(true);
      const result = await syncRentalUnits();
      toast.success(`Sync completed: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged`);
      setSyncDialogOpen(false);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to sync rental units");
    } finally {
      setIsSyncing(false);
    }
  };

  const formatPropertyType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rental Units</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage all your rental properties in one place
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
            <Building className="mr-2 h-4 w-4" />
            Sync with VenueBoost
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Properties</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your rental units
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties by name, address..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48 mt-2">
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: PropertyStatus.ACTIVE, label: "Active" },
                  { value: PropertyStatus.MAINTENANCE, label: "Maintenance" },
                  { value: PropertyStatus.INACTIVE, label: "Inactive" }
                ]}
              />
            </div>
            <div className="w-48 mt-2">
              <InputSelect
                name="type"
                label=""
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: PropertyType.APARTMENT, label: "Apartment" },
                  { value: PropertyType.HOUSE, label: "House" },
                  { value: PropertyType.VILLA, label: "Villa" },
                  { value: PropertyType.STUDIO, label: "Studio" },
                  { value: PropertyType.CABIN, label: "Cabin" },
                  { value: PropertyType.OTHER, label: "Other" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental Units Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Code</TableHead>
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
              ) : !rentalUnits || rentalUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Home className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Rental Units Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                          ? "No rental units match your search criteria. Try adjusting your filters." 
                          : "Start by synchronizing your properties from VenueBoost."}
                      </p>
                      {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                        <Button 
                          className="mt-4"
                          onClick={() => setSyncDialogOpen(true)}
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Sync Properties
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rentalUnits?.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center">
                          <Bed className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {new Date(property?.metadata?.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatPropertyType(property.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    {property.address || property.metadata?.address ? (
  <div className="flex items-center gap-1">
    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
    <span>{property.address || property.metadata?.address}</span>
  </div>
) : (
  "-"
)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          property.status === PropertyStatus.ACTIVE ? "success" : 
                          property.status === PropertyStatus.MAINTENANCE ? "warning" : 
                          "secondary"
                        }
                      >
                        {property.status === PropertyStatus.ACTIVE ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : property.status === PropertyStatus.MAINTENANCE ? (
                          <Clock className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    {property.unit_code || property.metadata?.unitCode ? (
  <Badge variant="outline">
    {property.unit_code || property.metadata?.unitCode}
  </Badge>
) : (
  "-"
)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                      {(property.url || property.metadata?.url) && (
  <Button 
    variant="outline" 
    size="sm"
    onClick={() => window.open(property.url || property.metadata?.url, '_blank')}
  >
    <ExternalLink className="h-3.5 w-3.5 mr-1" />
    View
  </Button>
)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {rentalUnits && rentalUnits.length > 0 && (
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
                  Showing <span className="font-medium">{rentalUnits?.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> properties
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

export default RentalUnitsContent;