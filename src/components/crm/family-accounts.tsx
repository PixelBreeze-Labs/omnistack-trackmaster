"use client"

import React, { useState } from 'react';
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
  Link,
  UserCircle,
  ChevronRight,
  Heart,
  Clock
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";

// Dummy data for family accounts
const DUMMY_FAMILIES = Array.from({ length: 10 }, (_, i) => ({
  id: `F${i + 1}`,
  mainAccount: {
    name: `Parent Account ${i + 1}`,
    email: `parent${i + 1}@example.com`,
    phone: `+355 69 ${Math.floor(1000000 + Math.random() * 9000000)}`,
    avatar: null,
    status: ['ACTIVE', 'INACTIVE'][Math.floor(Math.random() * 2)],
    joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
  },
  memberCount: Math.floor(Math.random() * 4) + 2,
  totalSpent: Math.floor(Math.random() * 900000) + 100000,
  lastActivity: new Date(2024, 0, Math.floor(Math.random() * 30)).toISOString(),
  sharedBenefits: ['Points Sharing', 'Family Discount', 'Birthday Rewards'][Math.floor(Math.random() * 3)],
  members: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
    id: `M${i}${j}`,
    name: `Member ${j + 1}`,
    relationship: ['Spouse', 'Child', 'Parent'][Math.floor(Math.random() * 3)],
    joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    status: ['ACTIVE', 'PENDING', 'INACTIVE'][Math.floor(Math.random() * 3)]
  }))
}));

export function FamilyAccounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedFamilies = DUMMY_FAMILIES.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "success",
      INACTIVE: "secondary",
      PENDING: "warning"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Family Accounts</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage linked accounts and family relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Link Accounts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground mt-1">Active family groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linked Members</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground mt-1">Total linked accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4</div>
            <p className="text-xs text-muted-foreground mt-1">Members per family</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Spending</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4x</div>
            <p className="text-xs text-muted-foreground mt-1">vs individual accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="mb-2">
            <h3 className="font-medium">Family Management</h3>
            <p className="text-sm text-muted-foreground">
              Search and manage family accounts
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-2">
            <div className="relative flex-1">
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Family Accounts Table */}
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
              {displayedFamilies.map((family) => (
                <React.Fragment key={family.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setExpandedFamily(expandedFamily === family.id ? null : family.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={family.mainAccount.avatar} />
                          <AvatarFallback>{family.mainAccount.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="font-medium">{family.mainAccount.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {family.mainAccount.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{family.memberCount} members</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(family.mainAccount.status)}</TableCell>
                    <TableCell>{family.totalSpent.toLocaleString()} ALL</TableCell>
                    <TableCell>
                      <Badge variant="outline">{family.sharedBenefits}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(family.lastActivity).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <InputSelect
                        name="actions"
                        label=""
                        value=""
                        onChange={(e) => {
                          switch(e.target.value) {
                            case "edit":
                              // Handle edit
                              break;
                            case "add":
                              // Handle add member
                              break;
                            case "manage":
                              // Handle manage benefits
                              break;
                          }
                        }}
                        options={[
                          { value: "", label: "Actions" },
                          { value: "edit", label: "Edit Family" },
                          { value: "add", label: "Add Member" },
                          { value: "manage", label: "Manage Benefits" },
                          { value: "deactivate", label: "Deactivate Family" }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                  {expandedFamily === family.id && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={7}>
                        <div className="p-4">
                          <h4 className="font-medium mb-3">Family Members</h4>
                          <div className="grid gap-3">
                            {family.members.map((member) => (
                              <div 
                                key={member.id} 
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {member.relationship}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline">
                                    Joined {new Date(member.joinDate).toLocaleDateString()}
                                  </Badge>
                                  {getStatusBadge(member.status)}
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
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
                    {[...Array(Math.min(5, Math.ceil(DUMMY_FAMILIES.length / pageSize)))].map((_, i) => (
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
                        onClick={() => setPage(p => Math.min(Math.ceil(DUMMY_FAMILIES.length / pageSize), p + 1))}
                        disabled={page === Math.ceil(DUMMY_FAMILIES.length / pageSize)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing <span className="font-medium">{displayedFamilies.length}</span> of{" "}
                <span className="font-medium">{DUMMY_FAMILIES.length}</span> families
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}