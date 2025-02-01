"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Users,
  UserPlus,
  Download,
  Filter,
  RefreshCcw,
  Link as LinkIcon,
  UserCircle,
  ChevronRight,
  Heart,
  Clock,
  MoreVertical,
  Settings,
  UserMinus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import InputSelect from "@/components/Common/InputSelect";
import { useFamilyAccounts } from '@/hooks/useFamilyAccounts';
import { LinkFamilyModal } from './family/link-modal';
import { FamilyDetailsModal } from './family/family-details-modal';
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import toast from 'react-hot-toast';

export function FamilyAccounts() {
  const {
    isLoading,
    familyAccounts,
    metrics,
    totalItems,
    totalPages,
    fetchFamilyAccounts,
    unlinkMember
  } = useFamilyAccounts();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);
  const [selectedActionFamily, setSelectedActionFamily] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchFamilyAccounts({
      page,
      limit: pageSize,
      status: status !== 'all' ? status.toUpperCase() : undefined,
      search: searchTerm
    });
  }, [fetchFamilyAccounts, page, pageSize, status, searchTerm]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchFamilyAccounts({
        page,
        limit: pageSize,
        status: status !== 'all' ? status.toUpperCase() : undefined,
        search: searchTerm
      });
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    toast.error('Export feature coming soon');
  };

  const handleActionSelect = (family: any, action: string) => {
    setSelectedActionFamily(family);
    
    switch(action) {
      case "view":
        setSelectedFamilyId(family._id);
        setShowDetailsModal(true);
        break;
      case "edit":
        toast.error('Edit feature coming soon');
        break;
      case "add":
        setShowLinkModal(true);
        break;
      case "manage":
        toast.error('Benefit management coming soon');
        break;
      case "deactivate":
        setShowConfirmDeactivate(true);
        break;
    }
  };

  const handleDeactivateFamily = async () => {
    if (!selectedActionFamily) return;
    
    try {
      await updateFamily(selectedActionFamily._id, { status: 'INACTIVE' });
      toast.success('Family account deactivated');
      handleRefresh();
    } catch (error) {
      toast.error('Failed to deactivate family');
    } finally {
      setShowConfirmDeactivate(false);
      setSelectedActionFamily(null);
    }
  };

  const handleUnlinkMember = async (familyId: string, memberId: string) => {
    try {
      await unlinkMember(familyId, memberId);
      toast.success('Member unlinked successfully');
      handleRefresh();
    } catch (error) {
      toast.error('Failed to unlink member');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "success",
      INACTIVE: "secondary",
      PENDING: "warning"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const renderMetricsCard = (title: string, value: number | string, icon: React.ReactNode, subtitle: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Family Accounts</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage linked accounts and family relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setShowLinkModal(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Link Accounts
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {renderMetricsCard(
          "Total Families",
          metrics?.totalFamilies ?? 0,
          <Users className="h-4 w-4 text-muted-foreground" />,
          "Active family groups"
        )}
        {renderMetricsCard(
          "Linked Members",
          metrics?.linkedMembers ?? 0,
          <UserCircle className="h-4 w-4 text-muted-foreground" />,
          "Total linked accounts"
        )}
        {renderMetricsCard(
          "Average Size",
          (metrics?.averageSize ?? 0).toFixed(1),
          <LinkIcon className="h-4 w-4 text-muted-foreground" />,
          "Members per family"
        )}
        {renderMetricsCard(
          "Family Spending",
          `${(metrics?.familySpendingMultiplier ?? 0).toFixed(1)}x`,
          <Heart className="h-4 w-4 text-muted-foreground" />,
          "vs individual accounts"
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Family Management</h3>
            <p className="text-sm text-muted-foreground">
              Search and manage family accounts
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-0 flex items-center gap-2">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by account name, email or phone..."
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
            <Button className="mt-2" variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
            className="mt-2"
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Main Account</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Shared Benefits</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
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
              ) : familyAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <UserPlus className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Family Accounts Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Get started by linking your first family account. Create meaningful connections and share benefits.
                      </p>
                      <Button 
                        onClick={() => setShowLinkModal(true)} 
                        className="mt-4"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Link New Family
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                familyAccounts.map((family) => (
                  <React.Fragment key={family._id}>
                    <TableRow 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setExpandedFamily(expandedFamily === family._id ? null : family._id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={family.mainCustomerId?.avatar} />
                            <AvatarFallback>
                              {family.mainCustomerId?.firstName[0]}{family.mainCustomerId?.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <div className="font-medium">
                              {family.mainCustomerId?.firstName} {family.mainCustomerId?.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {family.mainCustomerId?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{family.members.length ?? 0} members</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(family.status)}</TableCell>
                      <TableCell>{formatCurrency(family.totalSpent)}</TableCell>
                      <TableCell>
                        {family.sharedBenefits.map(benefit => (
                          <Badge key={benefit.id} variant="outline" className="mr-1">
                            {benefit.name}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatRelativeTime(new Date(family.lastActivity))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleActionSelect(family, 'view')}>
                              <Users className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionSelect(family, 'edit')}>
                              <Settings className="h-4 w-4 mr-2" />
                              Edit Family
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionSelect(family, 'add')}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionSelect(family, 'manage')}>
                              <Heart className="h-4 w-4 mr-2" />
                              Manage Benefits
                            </DropdownMenuItem>
                            {family.status === 'ACTIVE' && (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleActionSelect(family, 'deactivate')}
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Deactivate Family
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedFamily === family._id && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={7}>
                          <div className="p-4">
                            <h4 className="font-medium mb-3">Family Members</h4>
                            <div className="grid gap-3">
                              {family.members.map((member) => (
                                <div 
                                  key={member._id} 
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={member.customerId.avatar} />
                                      <AvatarFallback>
                                        {member.customerId.firstName[0]}{member.customerId.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">
                                        {member.customerId.firstName} {member.customerId.lastName}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {member.relationship}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <Badge variant="outline">
                                      Joined {formatRelativeTime(new Date(member.joinDate))}
                                    </Badge>
                                    {getStatusBadge(member.status)}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnlinkMember(family._id, member._id);
                                      }}
                                    >
                                      <UserMinus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>

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
                    {[...Array(Math.min(5, totalPages))].map((_, i) => (
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
                Showing <span className="font-medium">{familyAccounts.length}</span> of{" "}
                <span className="font-medium">{totalItems}</span> families
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showLinkModal && (
        <LinkFamilyModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          onSuccess={() => {
            handleRefresh();
            setShowLinkModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedFamilyId && (
        <FamilyDetailsModal
          familyId={selectedFamilyId}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedFamilyId(null);
          }}
          onUnlinkMember={(memberId) => handleUnlinkMember(selectedFamilyId, memberId)}
        />
      )}

      <AlertDialog open={showConfirmDeactivate} onOpenChange={setShowConfirmDeactivate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Family Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this family account? 
              All members will lose access to shared benefits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateFamily}
              className="bg-red-600 hover:bg-red-700"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="h-8"></div>
    </div>
  );
}

export default FamilyAccounts;