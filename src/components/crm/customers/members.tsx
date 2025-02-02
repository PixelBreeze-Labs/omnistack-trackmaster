// components/members/AllMembers.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMembers } from "@/hooks/useMembers";
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
  Calendar,
  MapPin,
  Download,
  FileText,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { MemberForm } from "../members/MemberForm";
import { Member } from "@/app/api/external/omnigateway/types/members";
import { DeleteMemberDialog } from "../members/DeleteMemberDialog";

export function AllMembers() {
  const {
    isLoading,
    members,
    metrics,
    totalItems,
    totalPages,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember
  } = useMembers();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      search: searchTerm
    });
  }, [fetchMembers, page, pageSize, status, searchTerm]);

  const handleRefresh = () => {
    fetchMembers({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      search: searchTerm
    });
  };

  const handleCreateMember = async (data) => {
    await createMember(data);
    handleRefresh();
  };

  const handleUpdateMember = async (data) => {
    if (selectedMember) {
      await updateMember(selectedMember._id, data);
      handleRefresh();
    }
  };

  const handleDeleteMember = async () => {
    if (memberToDelete) {
      await deleteMember(memberToDelete._id);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      handleRefresh();
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Members</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage all your members in one place
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
              setSelectedMember(null);
              setMemberFormOpen(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalMembers ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total registered members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeMembers ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Members</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pendingMembers ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Members</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.rejectedMembers ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Members rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="mb-1">
            <h3 className="font-medium">Filter Members</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your member base
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name, email, or code..."
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
                { value: "pending", label: "Pending" },
                { value: "rejected", label: "Rejected" }
              ]}
            />
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Registration</TableHead>
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
  ) : !members || members.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8">
        <div className="flex flex-col items-center gap-3">
          <UserPlus className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Members Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            {searchTerm || status !== 'all' 
              ? "No members match your search criteria. Try adjusting your filters." 
              : "Start building your member base. Add your first member to begin tracking relationships."}
          </p>
          {!searchTerm && status === 'all' && (
            <Button 
              className="mt-4"
              onClick={() => {
                setSelectedMember(null);
                setMemberFormOpen(true);
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
              ) : (
                members?.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="uppercase">
                            {member.firstName[0]}{member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.firstName} {member.lastName}</div>
                          {member.birthday && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(member.birthday).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          {member.phoneNumber || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          member.isRejected ? "destructive" : 
                          member.acceptedAt ? "success" : 
                          "secondary"
                        }
                      >
                        {member.isRejected ? "Rejected" : 
                         member.acceptedAt ? "Active" : 
                         "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(member.city || member.address) ? (
                        <div className="space-y-1">
                          {member.city && (
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                              {member.city}
                            </div>
                          )}
                          {member.address && (
                            <div className="text-xs text-muted-foreground">
                              {member.address}
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </div>
                        {member.acceptedAt && (
                          <div className="text-xs text-muted-foreground">
                            Accepted: {new Date(member.acceptedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <InputSelect
                          name="actions"
                          label=""
                          value=""
                          onChange={(e) => {
                            const action = e.target.value;
                            switch (action) {
                              case "edit":
                                setSelectedMember(member);
                                setMemberFormOpen(true);
                                break;
                              case "delete":
                                setMemberToDelete(member);
                                setDeleteDialogOpen(true);
                                break;
                              case "accept":
                                updateMember(member._id, {
                                  acceptedAt: new Date().toISOString(),
                                  isRejected: false
                                });
                                break;
                              case "reject":
                                updateMember(member._id, {
                                  isRejected: true,
                                  rejectedAt: new Date().toISOString()
                                });
                                break;
                            }
                          }}
                          options={[
                            { value: "", label: "Actions" },
                            { value: "edit", label: "Edit Member" },
                            ...(!member.acceptedAt && !member.isRejected ? [
                              { value: "accept", label: "Accept Member" }
                            ] : []),
                            ...(!member.isRejected ? [
                              { value: "reject", label: "Reject Member" }
                            ] : []),
                            { value: "delete", label: "Delete Member" }
                          ]}
                        />
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
                Showing <span className="font-medium">{members?.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> members
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <MemberForm
        open={memberFormOpen}
        onClose={() => {
          setMemberFormOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={selectedMember ? handleUpdateMember : handleCreateMember}
        initialData={selectedMember ? {
          firstName: selectedMember.firstName,
          lastName: selectedMember.lastName,
          email: selectedMember.email,
          phoneNumber: selectedMember.phoneNumber,
          code: selectedMember.code,
          city: selectedMember.city,
          address: selectedMember.address,
          birthday: selectedMember.birthday,
        } : undefined}
        title={selectedMember ? 'Edit Member' : 'Add New Member'}
      />

      <DeleteMemberDialog 
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteMember}
        memberName={memberToDelete ? `${memberToDelete.firstName} ${memberToDelete.lastName}` : ''}
      />
      <div className="h-8"></div>
    </div>
  );
}

export default AllMembers;