// src/components/crm/myclub-list.tsx
"use client";
import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Users,
  Crown,
  Gift,
  Calendar,
  Download,
  Star,
  RefreshCw,
  ShoppingBag,
  CreditCard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import InputSelect from "../Common/InputSelect";



interface ClubMember {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  totalSpent: number;
  lastPurchase: string;
  status: "active" | "inactive";
  favoriteCategories: string[];
  purchaseCount: number;
  avatar?: string;
}

const DUMMY_MEMBERS: ClubMember[] = [
  {
    id: "1",
    name: "Alice Brown",
    email: "alice@example.com",
    joinDate: "2024-01-08",
    tier: "gold",
    points: 2500,
    totalSpent: 125000,
    lastPurchase: "2024-01-20",
    status: "active",
    favoriteCategories: ["Fashion", "Accessories"],
    purchaseCount: 24
  },
  {
    id: "2",
    name: "Bob White",
    email: "bob@example.com",
    joinDate: "2024-01-15",
    tier: "silver",
    points: 1200,
    totalSpent: 75000,
    lastPurchase: "2024-01-18",
    status: "active",
    favoriteCategories: ["Electronics"],
    purchaseCount: 12
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    joinDate: "2024-01-10",
    tier: "platinum",
    points: 5000,
    totalSpent: 250000,
    lastPurchase: "2024-01-21",
    status: "active",
    favoriteCategories: ["Fashion", "Beauty", "Home"],
    purchaseCount: 45
  }
];

export function MyClubList() {
  const [members] = useState<ClubMember[]>(DUMMY_MEMBERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getTierBadge = (tier: string) => {
    const variants = {
      bronze: "secondary",
      silver: "default",
      gold: "warning",
      platinum: "primary"
    };
    return <Badge variant={variants[tier]} className="uppercase">{tier}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Club Members</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage your club members and their benefits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground mt-1">+124 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Members</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground mt-1">Gold & Platinum tier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">458.2K</div>
            <p className="text-xs text-muted-foreground mt-1">Active rewards points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Spend</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85K ALL</div>
            <p className="text-xs text-muted-foreground mt-1">Per member</p>
          </CardContent>
        </Card>
      </div>

       {/* Filters Card */}
     <Card>
       <CardHeader>
         <div className="mb-1">
           <h3 className="font-medium">Filter Members</h3>
           <p className="text-sm text-muted-foreground">
             Search and filter through club members
           </p>
         </div>
       </CardHeader>
       <CardContent className="p-0">
         <div className="flex items-center justify-between gap-4">
           <div className="flex items-center flex-1 gap-2 max-w-3xl">
             <div className="relative mt-2 flex-1">
               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search members..."
                 className="pl-8"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <Select value={tierFilter} onValueChange={setTierFilter}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue placeholder="Tier" />
               </SelectTrigger>
               <SelectContent>
               <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
               </SelectContent>
             </Select>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
       </CardContent>
     </Card>

      {/* Filters and Table */}
      <Card>
     
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Favorites</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(member.tier)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      {member.points.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {member.totalSpent.toLocaleString()} ALL
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(member.lastPurchase).toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">
                        {member.purchaseCount} purchases
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.favoriteCategories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                  N/A
                  </TableCell>
                </TableRow>
              ))}
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
                   {[...Array(Math.min(5, Math.ceil(members.length / pageSize)))].map((_, i) => (
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
                       onClick={() => setPage(p => Math.min(Math.ceil(members.length / pageSize), p + 1))}
                       disabled={page === Math.ceil(members.length / pageSize)}
                     />
                   </PaginationItem>
                 </PaginationContent>
               </Pagination>
             </div>

             <p className="text-sm text-muted-foreground min-w-[180px] text-right">
               Showing <span className="font-medium">{pageSize}</span> of{" "}
               <span className="font-medium">{members.length}</span> members
             </p>
           </div>
         </div>
       </CardContent>
     </Card>
   </div>
 );
}

export default MyClubList;