// components/crm/social/operating-entities/AllOperatingEntities.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOperatingEntities } from "@/hooks/useOperatingEntities";
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
  Building,
  Search,
  Link,
  Download,
  RefreshCcw,
  Plus,
  ExternalLink,
  Newspaper,
  Megaphone,
  Share2,
  MoreHorizontal
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { OperatingEntityForm } from "./OperatingEntityForm";
import { OperatingEntity, OperatingEntityType } from "@/app/api/external/omnigateway/types/operating-entities";
import { DeleteConfirmDialog } from "@/components/Common/DeleteConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AllOperatingEntities() {
  const {
    isLoading,
    operatingEntities,
    totalItems,
    totalPages,
    fetchOperatingEntities,
    createOperatingEntity,
    updateOperatingEntity,
    deleteOperatingEntity
  } = useOperatingEntities();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [entityFormOpen, setEntityFormOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<OperatingEntity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<OperatingEntity | null>(null);

  useEffect(() => {
    fetchOperatingEntities({
      page,
      limit: pageSize,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchTerm
    });
  }, [fetchOperatingEntities, page, pageSize, typeFilter, searchTerm]);

  const handleRefresh = () => {
    fetchOperatingEntities({
      page,
      limit: pageSize,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchTerm
    });
  };

  const handleCreateEntity = async (data) => {
    await createOperatingEntity(data);
    handleRefresh();
  };

  const handleUpdateEntity = async (data) => {
    if (selectedEntity) {
      await updateOperatingEntity(selectedEntity._id, data);
      handleRefresh();
    }
  };

  const handleDeleteEntity = async () => {
    if (entityToDelete) {
      await deleteOperatingEntity(entityToDelete._id);
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
      handleRefresh();
    }
  };

  const getTypeIcon = (type: OperatingEntityType) => {
    switch (type) {
      case OperatingEntityType.SOCIAL_MEDIA_PLATFORM:
        return <Share2 className="h-4 w-4" />;
      case OperatingEntityType.MARKETING:
        return <Megaphone className="h-4 w-4" />;
      case OperatingEntityType.NEWS_PORTAL:
        return <Newspaper className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: OperatingEntityType) => {
    switch (type) {
      case OperatingEntityType.SOCIAL_MEDIA_PLATFORM:
        return "Social Media Platform";
      case OperatingEntityType.MARKETING:
        return "Marketing";
      case OperatingEntityType.NEWS_PORTAL:
        return "News Portal";
      default:
        return "Other";
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Operating Entities</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage entities that operate your social media profiles
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
            onClick={() => {
              setSelectedEntity(null);
              setEntityFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Entity
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Entities</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your operating entities
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or URL..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <InputSelect
                name="type"
                label=""
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: OperatingEntityType.SOCIAL_MEDIA_PLATFORM, label: "Social Media Platform" },
                  { value: OperatingEntityType.MARKETING, label: "Marketing" },
                  { value: OperatingEntityType.NEWS_PORTAL, label: "News Portal" },
                  { value: OperatingEntityType.OTHER, label: "Other" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entities Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !operatingEntities || operatingEntities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Building className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Operating Entities Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || typeFilter !== 'all'
                          ? "No entities match your search criteria. Try adjusting your filters."
                          : "Start by adding an operating entity for your social media profiles."}
                      </p>
                      {!searchTerm && typeFilter === 'all' && (
                        <Button
                          className="mt-4"
                          onClick={() => {
                            setSelectedEntity(null);
                            setEntityFormOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Entity
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                operatingEntities.map((entity) => (
                  <TableRow key={entity._id}>
                    <TableCell>
                      <div className="font-medium">{entity.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getTypeIcon(entity.type as OperatingEntityType)}
                        {getTypeLabel(entity.type as OperatingEntityType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entity.url ? (
                        <a 
                          href={entity.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Link className="h-3.5 w-3.5 mr-1" />
                          {entity.url}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No URL provided</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(entity.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedEntity(entity);
                                setEntityFormOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setEntityToDelete(entity);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {operatingEntities && operatingEntities.length > 0 && (
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
                  Showing <span className="font-medium">{operatingEntities.length}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> entities
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <OperatingEntityForm
        open={entityFormOpen}
        onClose={() => {
          setEntityFormOpen(false);
          setSelectedEntity(null);
        }}
        onSubmit={selectedEntity ? handleUpdateEntity : handleCreateEntity}
        initialData={selectedEntity ? {
          name: selectedEntity.name,
          type: selectedEntity.type as OperatingEntityType,
          url: selectedEntity.url
        } : undefined}
        title={selectedEntity ? 'Edit Operating Entity' : 'Add Operating Entity'}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setEntityToDelete(null);
        }}
        onConfirm={handleDeleteEntity}
        title="Delete Operating Entity"
        description={`Are you sure you want to delete "${entityToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default AllOperatingEntities;