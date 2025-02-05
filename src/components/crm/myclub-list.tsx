"use client";

import React, { useEffect, useState } from "react";
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
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { 
 Search, 
 Users,
 Download,
 RefreshCw,
 Calendar,
 Mail,
 Phone 
} from "lucide-react";
import {
 Pagination,
 PaginationContent,
 PaginationItem,
 PaginationLink,
 PaginationNext,
 PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import InputSelect from "../Common/InputSelect";
import { useExternalMembers } from "@/hooks/useExternalMembers";

export function MyClubList() {
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");

 const { 
   members, 
   loading, 
   error, 
   totalCount,
   page, 
   setPage,
   pageSize, 
   setPageSize,
   fetchMembers,
   metrics
 } = useExternalMembers({ source: 'from_my_club' });

 useEffect(() => {
   const timeoutId = setTimeout(() => {
     fetchMembers({ 
       search: searchQuery,
       status: statusFilter !== 'all' ? statusFilter : undefined 
     });
   }, 300);

   return () => clearTimeout(timeoutId);
 }, [fetchMembers, searchQuery, statusFilter, page, pageSize]);

 const getStatusBadge = (status: string) => {
   const variants = {
     pending: "warning",
     approved: "success",
     rejected: "destructive"
   };
   return <Badge variant={variants[status]}>{status?.toUpperCase()}</Badge>;
 };

 const handleRefresh = () => {
   fetchMembers({
     search: searchQuery,
     status: statusFilter !== 'all' ? statusFilter : undefined
   });
 };

 if (error) {
   return <div className="text-red-500">Error: {error}</div>;
 }

 return (
   <div className="space-y-6">
     <div className="flex justify-between items-center">
       <div>
         <h2 className="text-2xl font-bold tracking-tight">Club Members</h2>
         <p className="text-sm text-muted-foreground mt-2">
           View and manage your club members
         </p>
       </div>
       <div className="flex items-center gap-2">
         <Button variant="outline" size="sm">
           <Download className="mr-2 h-4 w-4" />
           Export
         </Button>
         <Button 
           variant="outline" 
           size="sm" 
           onClick={handleRefresh}
           disabled={loading}
         >
           <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
           Refresh
         </Button>
       </div>
     </div>

     <Card>
       <CardHeader>
         <div className="">
           <h3 className="font-medium">Filter Members</h3>
           <p className="text-sm text-muted-foreground">
             Search and filter through club members
           </p>
         </div>
       </CardHeader>
       <CardContent>
         <div className="flex items-center gap-4">
           <div className="relative mt-2 flex-1">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search by name or email..."
               className="pl-8"
               value={searchQuery}
               onChange={(e) => {
                 setSearchQuery(e.target.value);
                 setPage(1);
               }}
             />
           </div>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-[140px]">
               <SelectValue placeholder="Status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="approved">Approved</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="rejected">Rejected</SelectItem>
             </SelectContent>
           </Select>
         </div>
       </CardContent>
     </Card>

     <Card>
       <CardContent>
         {loading ? (
           <div className="text-center py-4">Loading...</div>
         ) : (
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Member</TableHead>
                 <TableHead>Contact</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Applied at</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {members.map((member) => (
                 <TableRow key={member.id}>
                   <TableCell>
                     <div className="flex items-center gap-3">
                       <Avatar>
                         <AvatarFallback>
                           {member.first_name[0]}{member.last_name[0]}
                         </AvatarFallback>
                       </Avatar>
                       <div>
                         <div className="font-medium">
                           {member.first_name} {member.last_name}
                         </div>
                         <div className="text-sm text-muted-foreground">
                           Code: {member.old_platform_member_code || '-'}
                         </div>
                       </div>
                     </div>
                   </TableCell>
                   <TableCell>
                     <div className="space-y-1">
                       <div className="flex items-center text-sm">
                         <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                         {member.email}
                       </div>
                       <div className="flex items-center text-sm">
                         <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                         {member.phone_number}
                       </div>
                     </div>
                   </TableCell>
                   <TableCell>{getStatusBadge(member.approval_status)}</TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-muted-foreground" />
                       {new Date(member.applied_at).toLocaleDateString()}
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         )}

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
             
             <Pagination>
               <PaginationContent>
                 <PaginationItem>
                   <PaginationPrevious 
                     onClick={() => setPage(Math.max(1, page - 1))}
                     disabled={page === 1 || loading} 
                   />
                 </PaginationItem>
                 {[...Array(Math.min(5, Math.ceil(totalCount / pageSize)))].map((_, i) => (
                   <PaginationItem key={i + 1}>
                     <PaginationLink
                       isActive={page === i + 1}
                       onClick={() => setPage(i + 1)}
                       disabled={loading}
                     >
                       {i + 1}
                     </PaginationLink>
                   </PaginationItem>
                 ))}
                 <PaginationItem>
                   <PaginationNext 
                     onClick={() => setPage(Math.min(Math.ceil(totalCount / pageSize), page + 1))}
                     disabled={page === Math.ceil(totalCount / pageSize) || loading}
                   />
                 </PaginationItem>
               </PaginationContent>
             </Pagination>

             <p className="text-sm text-muted-foreground min-w-[180px] text-right">
               Showing {members.length} of {totalCount} members
             </p>
           </div>
         </div>
       </CardContent>
     </Card>
     <div className="h-8"></div>
   </div>
 );
}