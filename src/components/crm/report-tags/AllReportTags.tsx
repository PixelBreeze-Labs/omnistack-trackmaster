// components/report-tags/AllReportTags.tsx
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
  RefreshCcw,
  Download,
  Tag,
  Plus,
  PencilIcon,
  Trash2Icon
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { ReportTagForm } from "./ReportTagForm";
import { DeleteReportTagDialog } from "./DeleteReportTagDialog";
import { useReportTags } from "@/hooks/useReportTags";
import { ReportTag } from "@/app/api/external/omnigateway/types/report-tags";

export function AllReportTags() {
  const {
    isLoading,
    reportTags,
    totalItems,
    currentPage,
    hasMore,
    fetchReportTags,
    createReportTag,
    updateReportTag,
    deleteReportTag
  } = useReportTags();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const [tagFormOpen, setTagFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ReportTag | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<ReportTag | null>(null);

  useEffect(() => {
    fetchReportTags({
      page,
      limit: pageSize,
      search: searchTerm,
      sortBy,
      sortOrder
    });
  }, [fetchReportTags, page, pageSize, searchTerm, sortBy, sortOrder]);

  const handleRefresh = () => {
    fetchReportTags({
      page,
      limit: pageSize,
      search: searchTerm,
      sortBy,
      sortOrder
    });
  };

  const handleCreateTag = async (data) => {
    await createReportTag(data);
    handleRefresh();
  };

  const handleUpdateTag = async (data) => {
    if (selectedTag) {
      await updateReportTag(selectedTag._id, data);
      handleRefresh();
    }
  };

  const handleDeleteTag = async () => {
    if (tagToDelete) {
      await deleteReportTag(tagToDelete._id);
      setDeleteDialogOpen(false);
      setTagToDelete(null);
      handleRefresh();
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Report Tags</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage tags for categorizing and organizing reports
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
              setSelectedTag(null);
              setTagFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Search Tags</h3>
            <p className="text-sm text-muted-foreground">
              Search through all report tags
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags by name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-2">
            <InputSelect
              name="sortBy"
              label=""
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "name", label: "Sort by Name" },
                { value: "createdAt", label: "Sort by Date Created" }
              ]}
            />
            </div>
            <div className="mt-2">
            <InputSelect
              name="sortOrder"
              label=""
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" }
              ]}
            />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
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
              ) : !reportTags || reportTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Tag className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Tags Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm 
                          ? "No tags match your search criteria. Try adjusting your search." 
                          : "Start organizing your reports. Add your first tag to categorize reports."}
                      </p>
                      {!searchTerm && (
                        <Button 
                          className="mt-4"
                          onClick={() => {
                            setSelectedTag(null);
                            setTagFormOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Tag
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reportTags?.map((tag) => (
                  <TableRow key={tag._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10">
                          <Tag className="h-3.5 w-3.5 text-primary mr-1" />
                          {tag.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {tag.description || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(tag.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(tag.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedTag(tag);
                            setTagFormOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setTagToDelete(tag);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2Icon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
                        disabled={page === totalPages || !hasMore}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing <span className="font-medium">{reportTags?.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> tags
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ReportTagForm
        open={tagFormOpen}
        onClose={() => {
          setTagFormOpen(false);
          setSelectedTag(null);
        }}
        onSubmit={selectedTag ? handleUpdateTag : handleCreateTag}
        initialData={selectedTag ? {
          name: selectedTag.name,
          description: selectedTag.description
        } : undefined}
        title={selectedTag ? 'Edit Tag' : 'Add New Tag'}
      />

      <DeleteReportTagDialog 
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTagToDelete(null);
        }}
        onConfirm={handleDeleteTag}
        tagName={tagToDelete ? tagToDelete.name : ''}
      />
        {/* Add bottom spacing */}
        <div className="h-4"></div>
    </div>
  );
}

export default AllReportTags;