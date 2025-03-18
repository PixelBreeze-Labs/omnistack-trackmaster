// components/crm/contacts/AllContacts.tsx
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
  Users,
  EyeIcon,
  MailIcon,
  PhoneIcon,
  MessageSquareIcon,
  CheckIcon,
  ArchiveIcon
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Submission } from "@/app/api/external/omnigateway/types/submissions";
import { ViewContactDialog } from "./ViewContactDialog";

export function AllContacts() {
  const {
    isLoading,
    submissions,
    totalItems,
    currentPage,
    totalPages,
    fetchSubmissions,
    updateSubmissionStatus,
    isInitialized
  } = useSubmissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Submission | null>(null);

  useEffect(() => {
    if (isInitialized) {
      fetchSubmissions({
        page,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
        type: 'contact',
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
    }
  }, [fetchSubmissions, page, pageSize, searchTerm, sortBy, sortOrder, statusFilter, isInitialized]);

  const handleRefresh = () => {
    fetchSubmissions({
      page,
      limit: pageSize,
      search: searchTerm,
      sortBy,
      sortOrder,
      type: 'contact',
      status: statusFilter !== 'all' ? statusFilter : undefined
    });
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateSubmissionStatus(id, status);
    handleRefresh();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600">Reviewed</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-slate-500/10 text-slate-600">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage inquiries and contact form submissions
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
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Search Contacts</h3>
            <p className="text-sm text-muted-foreground">
              Filter and search through contact form submissions
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or content..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "pending", label: "Pending" },
                  { value: "reviewed", label: "Reviewed" },
                  { value: "archived", label: "Archived" }
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
                  { value: "desc", label: "Newest First" },
                  { value: "asc", label: "Oldest First" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
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
              ) : !submissions || submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Contacts Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all'
                          ? "No contacts match your search criteria. Try adjusting your filters." 
                          : "There are no contact form submissions yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                submissions?.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm">
                          <MailIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate flex items-center gap-1">
                        <MessageSquareIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{contact.content}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contact.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
                            setViewDialogOpen(true);
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        {contact.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(contact._id, 'reviewed')}
                          >
                            <CheckIcon className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {contact.status !== 'archived' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(contact._id, 'archived')}
                          >
                            <ArchiveIcon className="h-4 w-4 text-slate-600" />
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
                Showing <span className="font-medium">{submissions?.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> contacts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Contact Dialog */}
      {selectedContact && (
        <ViewContactDialog
          open={viewDialogOpen}
          onClose={() => {
            setViewDialogOpen(false);
            setSelectedContact(null);
          }}
          contact={selectedContact}
          onStatusChange={(status) => {
            handleStatusChange(selectedContact._id, status);
            setViewDialogOpen(false);
            setSelectedContact(null);
          }}
        />
      )}
      
      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}

export default AllContacts;