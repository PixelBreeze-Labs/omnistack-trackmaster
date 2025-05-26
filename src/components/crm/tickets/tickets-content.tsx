// components/support/tickets/EnhancedTicketsContent.tsx

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
  TicketIcon,
  Users,
  Search,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Building2,
  Calendar,
  MessageSquare,
  BarChart3,
  Filter,
  Download,
  SortAsc,
  SortDesc
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useTickets } from "@/hooks/useTickets";
import { TicketStatus, TicketPriority, TicketCategory, Ticket } from "@/app/api/external/omnigateway/types/tickets";
import { toast } from "react-hot-toast";
import { DatePicker } from "@/components/ui/datepicker";
import { format } from "date-fns";
import { TicketActionSelect } from "@/components/crm/tickets/TicketActionComponent";
import { TicketDetailsDialog } from "@/components/crm/tickets/TicketDetailsDialog";
import { QuickMessageDialog } from "@/components/crm/tickets/QuickMessageDialog";
import { TicketStatsComponent } from "@/components/crm/tickets/TicketStatsComponent";
import { formatTicketId, getTimeSinceCreated, sortTicketsByPriority } from "@/lib/tickets/utils";

export function EnhancedTicketsContent() {
  const {
    isLoading,
    isDeletingTicket,
    isUpdating,
    tickets,
    totalItems,
    totalPages,
    stats,
    fetchTickets,
    fetchTicketStats,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    deleteTicket,
    addMessage
  } = useTickets();

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [assignedToFilter, setAssignedToFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  
  // Dialog State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showQuickMessageDialog, setShowQuickMessageDialog] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState("list");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTickets({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as TicketStatus : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter as TicketPriority : undefined,
      category: categoryFilter !== 'all' ? categoryFilter as TicketCategory : undefined,
      assignedTo: assignedToFilter !== 'all' ? assignedToFilter : undefined,
      search: searchTerm,
      fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
    });
  }, [fetchTickets, page, pageSize, statusFilter, priorityFilter, categoryFilter, assignedToFilter, searchTerm, fromDate, toDate]);

  useEffect(() => {
    fetchTicketStats();
  }, [fetchTicketStats]);

  const handleRefresh = () => {
    fetchTickets({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as TicketStatus : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter as TicketPriority : undefined,
      category: categoryFilter !== 'all' ? categoryFilter as TicketCategory : undefined,
      assignedTo: assignedToFilter !== 'all' ? assignedToFilter : undefined,
      search: searchTerm,
      fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined
    });
    fetchTicketStats();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setAssignedToFilter("all");
    setFromDate(undefined);
    setToDate(undefined);
    setPage(1);
  };

  const handleDeleteTicket = async (ticket: Ticket) => {
    await deleteTicket(ticket);
  };

  const handleStatusUpdate = async (ticketId: string, status: TicketStatus) => {
    await updateTicketStatus(ticketId, status);
  };

  const handlePriorityUpdate = async (ticketId: string, priority: TicketPriority) => {
    await updateTicketPriority(ticketId, priority);
  };

  const handleAssignTicket = async (ticketId: string, assignedTo: string, assignedToEmail?: string) => {
    await assignTicket(ticketId, assignedTo, assignedToEmail);
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsDialog(true);
  };

  const handleQuickMessage = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowQuickMessageDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setSelectedTicket(null);
  };

  const handleCloseQuickMessageDialog = () => {
    setShowQuickMessageDialog(false);
    setSelectedTicket(null);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "default";
      case TicketStatus.IN_PROGRESS:
        return "warning";
      case TicketStatus.RESOLVED:
        return "success";
      case TicketStatus.CLOSED:
        return "secondary";
      case TicketStatus.DUPLICATE:
        return "outline";
      default:
        return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "secondary";
      case TicketPriority.MEDIUM:
        return "default";
      case TicketPriority.HIGH:
        return "warning";
      case TicketPriority.URGENT:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertCircle className="mr-1 h-3 w-3" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="mr-1 h-3 w-3" />;
      case TicketStatus.RESOLVED:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case TicketStatus.CLOSED:
        return <XCircle className="mr-1 h-3 w-3" />;
      case TicketStatus.DUPLICATE:
        return <XCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryDisplayName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />;
  };

  const sortedTickets = tickets ? [...tickets].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }) : [];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage customer support tickets and requests
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
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Ticket List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <TicketStatsComponent stats={stats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TicketIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Open</p>
                    <p className="text-2xl font-bold">{stats.open}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">In Progress</p>
                    <p className="text-2xl font-bold">{stats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Resolved</p>
                    <p className="text-2xl font-bold">{stats.resolved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Closed</p>
                    <p className="text-2xl font-bold">{stats.closed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          {showFilters && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Filter Tickets</h3>
                    <p className="text-sm text-muted-foreground">
                      Search and filter through support tickets
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-0 flex flex-col lg:flex-row items-center gap-4">
                  <div className="relative mt-2 flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets by title, description, or customer..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-40 mt-2">
                    <InputSelect
                      name="status"
                      label=""
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      options={[
                        { value: "all", label: "All Status" },
                        { value: TicketStatus.OPEN, label: "Open" },
                        { value: TicketStatus.IN_PROGRESS, label: "In Progress" },
                        { value: TicketStatus.RESOLVED, label: "Resolved" },
                        { value: TicketStatus.CLOSED, label: "Closed" },
                        { value: TicketStatus.DUPLICATE, label: "Duplicate" }
                      ]}
                    />
                  </div>
                  <div className="w-40 mt-2">
                    <InputSelect
                      name="priority"
                      label=""
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      options={[
                        { value: "all", label: "All Priority" },
                        { value: TicketPriority.LOW, label: "Low" },
                        { value: TicketPriority.MEDIUM, label: "Medium" },
                        { value: TicketPriority.HIGH, label: "High" },
                        { value: TicketPriority.URGENT, label: "Urgent" }
                      ]}
                    />
                  </div>
                  <div className="w-40 mt-2">
                    <InputSelect
                      name="category"
                      label=""
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      options={[
                        { value: "all", label: "All Categories" },
                        { value: TicketCategory.TECHNICAL, label: "Technical" },
                        { value: TicketCategory.BILLING, label: "Billing" },
                        { value: TicketCategory.BUG, label: "Bug" },
                        { value: TicketCategory.FEATURE_REQUEST, label: "Feature Request" },
                        { value: TicketCategory.ACCOUNT, label: "Account" },
                        { value: TicketCategory.TRAINING, label: "Training" },
                        { value: TicketCategory.OTHER, label: "Other" }
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
          )}

          {/* Tickets Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1">
                        Ticket
                        {getSortIcon('title')}
                      </div>
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center gap-1">
                        Priority
                        {getSortIcon('priority')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-1">
                        Created
                        {getSortIcon('createdAt')}
                      </div>
                    </TableHead>
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
                  ) : !sortedTickets || sortedTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <TicketIcon className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Tickets Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || fromDate || toDate
                              ? "No tickets match your search criteria. Try adjusting your filters." 
                              : "No support tickets available at the moment."}
                          </p>
                          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || fromDate || toDate) && (
                            <Button variant="outline" onClick={clearFilters}>
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTickets?.map((ticket) => (
                      <TableRow key={ticket._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{ticket.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatTicketId(ticket._id)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                              {ticket.description}
                            </div>
                            {ticket.messages && ticket.messages.length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <User className="h-3 w-3 text-slate-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{ticket.createdByName}</div>
                              <div className="text-xs text-muted-foreground">{ticket.createdByEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <div className="text-sm">{ticket.business?.name || 'Unknown'}</div>
                              <div className="text-xs text-muted-foreground">{ticket.business?.email || ''}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryDisplayName(ticket.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTo ? (
                            <div>
                              <div className="text-sm font-medium">{ticket.assignedTo}</div>
                              {ticket.assignedToEmail && (
                                <div className="text-xs text-muted-foreground">{ticket.assignedToEmail}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <div>{formatDate(ticket.createdAt)}</div>
                              <div className="text-xs text-muted-foreground">
                                {getTimeSinceCreated(ticket.createdAt)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <div style={{ minWidth: "120px" }}>
                              <TicketActionSelect
                                ticket={ticket}
                                onStatusUpdate={handleStatusUpdate}
                                onPriorityUpdate={handlePriorityUpdate}
                                onAssignTicket={handleAssignTicket}
                                onDeleteTicket={handleDeleteTicket}
                                onViewDetails={handleViewDetails}
                                onAddMessage={handleQuickMessage}
                                isUpdating={isUpdating}
                                isDeleting={isDeletingTicket}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {sortedTickets && sortedTickets.length > 0 && (
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
                      Showing <span className="font-medium">{sortedTickets?.length}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> tickets
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <TicketDetailsDialog
        ticket={selectedTicket}
        open={showDetailsDialog}
        onClose={handleCloseDetailsDialog}
        onAddMessage={addMessage}
        isUpdating={isUpdating}
      />

      <QuickMessageDialog
        ticket={selectedTicket}
        open={showQuickMessageDialog}
        onClose={handleCloseQuickMessageDialog}
        onSendMessage={addMessage}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default EnhancedTicketsContent;