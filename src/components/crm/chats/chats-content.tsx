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
  MessageCircle,
  Users,
  Search,
  Download,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Calendar,
  MessageSquare
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useChats } from "@/hooks/useChats";
import { ChatStatus, ChatType } from "@/app/api/external/omnigateway/types/chats";
import { SyncChatsDialog } from "./SyncChatsDialog";
import { toast } from "react-hot-toast";
import { ChatActionSelect } from "@/components/crm/chats/ChatActionComponent";
import { format } from "date-fns";

export function ChatsContent() {
  const {
    isLoading,
    isDeletingChat,
    chats,
    totalItems,
    totalPages,
    fetchChats,
    syncChats,
    deleteChat
  } = useChats();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchChats({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as ChatStatus : undefined,
      type: typeFilter !== 'all' ? typeFilter as ChatType : undefined,
      search: searchTerm
    });
  }, [fetchChats, page, pageSize, statusFilter, typeFilter, searchTerm]);

  const handleRefresh = () => {
    fetchChats({
      page,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter as ChatStatus : undefined,
      type: typeFilter !== 'all' ? typeFilter as ChatType : undefined,
      search: searchTerm
    });
  };

  const handleSyncConfirm = async () => {
    try {
      setIsSyncing(true);
      const result = await syncChats();
      toast.success(`Sync completed: ${result.created} created, ${result.updated} updated, ${result.unchanged} unchanged, ${result.errors} errors`);
      setSyncDialogOpen(false);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to sync chats");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteChat = async (chat) => {
    await deleteChat(chat);
    // Note: no need to refresh as the hook updates the local state
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case ChatStatus.ACTIVE:
        return "success";
      case ChatStatus.ARCHIVED:
        return "secondary";
      case ChatStatus.DELETED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ChatStatus.ACTIVE:
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case ChatStatus.ARCHIVED:
        return <Clock className="mr-1 h-3 w-3" />;
      case ChatStatus.DELETED:
        return <XCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case ChatType.BOOKING:
        return "default";
      case ChatType.ORDER:
        return "secondary";
      case ChatType.STAFF:
        return "outline";
      case ChatType.CLIENT:
        return "primary";
      default:
        return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case ChatType.BOOKING:
        return <Calendar className="mr-1 h-3 w-3" />;
      case ChatType.ORDER:
        return <ExternalLink className="mr-1 h-3 w-3" />;
      case ChatType.STAFF:
        return <Users className="mr-1 h-3 w-3" />;
      case ChatType.CLIENT:
        return <MessageCircle className="mr-1 h-3 w-3" />;
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

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chats</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage conversations with your clients and staff
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
            <MessageCircle className="mr-2 h-4 w-4" />
            Sync with VenueBoost
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Chats</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your conversation data
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex flex-col md:flex-row items-center gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats by name, email or message..."
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
                  { value: ChatStatus.ACTIVE, label: "Active" },
                  { value: ChatStatus.ARCHIVED, label: "Archived" },
                  { value: ChatStatus.DELETED, label: "Deleted" }
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
                  { value: ChatType.CLIENT, label: "Client" },
                  { value: ChatType.BOOKING, label: "Booking" },
                  { value: ChatType.ORDER, label: "Order" },
                  { value: ChatType.STAFF, label: "Staff" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chats Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !chats || chats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <MessageSquare className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Chats Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                          ? "No chats match your search criteria. Try adjusting your filters." 
                          : "Start by synchronizing your chats from VenueBoost."}
                      </p>
                      {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                        <Button 
                          className="mt-4"
                          onClick={() => setSyncDialogOpen(true)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Sync Chats
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                chats.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">{chat.endUserName || "Unknown User"}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {chat.endUserEmail || "No email"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {chat.lastMessage ? (
                        <div>
                          <div className="max-w-xs truncate">{chat.lastMessage.content}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {formatTime(chat.lastMessage.createdAt)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No messages</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{chat.messageCount}</div>
                        {chat.unreadCount > 0 && (
                          <div className="text-xs text-blue-600 mt-0.5">
                            {chat.unreadCount} unread
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(chat.type)}>
                        {getTypeIcon(chat.type)}
                        {chat.type.charAt(0).toUpperCase() + chat.type.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(chat.status)}>
                        {getStatusIcon(chat.status)}
                        {chat.status.charAt(0).toUpperCase() + chat.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(chat.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <div style={{ minWidth: "120px" }}>
                          <ChatActionSelect
                            chat={chat}
                            onDeleteChat={handleDeleteChat}
                            isDeleting={isDeletingChat}
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
{chats && chats.length > 0 && (
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
        Showing <span className="font-medium">{chats?.length}</span> of{" "}
        <span className="font-medium">{totalItems}</span> chats
      </p>
    </div>
  </div>
)}

</CardContent>
      </Card>

      {/* Sync Confirmation Dialog */}
      <SyncChatsDialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        onConfirm={handleSyncConfirm}
        isSyncing={isSyncing}
      />
         {/* Add empty space div at the bottom */}
  <div className="h-4"></div>
    </div>
  );
}

