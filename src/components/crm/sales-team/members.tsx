"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import InputSelect from "@/components/Common/InputSelect"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCcw,
  UserPlus,
  CircleDollarSign,
  BarChart2,
  UserCheck,
  ClipboardList,
  MessagesSquare,
  Award
} from "lucide-react"
import { toast } from 'sonner';
import { useClient } from '@/hooks/useClient';
import { AddStaffModal } from '@/components/crm/staff/add-staff-modal';
import React from "react"

interface SalesAssociate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
  performance: {
    monthlyTarget: number
    currentSales: number
    conversion: number
    customerSatisfaction: number
  }
  activeCustomers: number
  startDate: string
  avatar?: string
}

export function SalesTeam() {
  const { clientId } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState<SalesAssociate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);

  const [stats, setStats] = useState({
    totalSales: 0,
    salesGrowth: 0,
    conversion: 0,
    conversionGrowth: 0,
    activeMembers: 0,
    teamGrowth: 0,
    satisfaction: 0,
    satisfactionGrowth: 0
  });

  const fetchStaff = async () => {
    if (!clientId) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        clientId,
        search: searchTerm,
        position,
        status,
        page: page.toString(),
        limit: pageSize.toString()
      });

      const [staffResponse, statsResponse] = await Promise.all([
        fetch(`/api/sales-team?${queryParams}`),
        fetch(`/api/sales-team/stats?clientId=${clientId}`)
      ]);

      const [staffData, statsData] = await Promise.all([
        staffResponse.json(),
        statsResponse.json()
      ]);

      if (staffResponse.ok) {
        setStaff(staffData.items);
        setTotalItems(staffData.total);
      }

      if (statsResponse.ok) {
        setStats(statsData);
      }
    } catch (error) {
      toast.error('Failed to fetch sales team data');
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, [clientId, searchTerm, position, status, page, pageSize]);

  const fetchDepartments = async () => {
    if (!clientId) return;
    try {
      const response = await fetch(`/api/departments?clientId=${clientId}`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
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

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams({
        clientId,
        limit: '1000' // Get all for export
      });

      const response = await fetch(`/api/sales-team/export?${queryParams}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales_team_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendClass = (percentage: number) => {
    return percentage > 0 ? "text-green-500" : "text-red-500"
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales Team</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your sales associates and track their performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="soft" 
            size="sm"
            onClick={fetchStaff}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                 {stats.totalSales ? `${(stats.totalSales / 1_000_000).toFixed(1)}M` : '0'} ALL
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.salesGrowth)}
                <span className={`text-sm ${getTrendClass(stats.salesGrowth)}`}>
                {stats.salesGrowth ? (stats.salesGrowth > 0 ? '+' : '') + stats.salesGrowth : '0'}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Monthly sales volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{stats.conversion ? stats.conversion : 0}%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.conversionGrowth)}
                <span className={`text-sm ${getTrendClass(stats.conversionGrowth)}`}>
                {stats.conversionGrowth ? (stats.conversionGrowth > 0 ? '+' : '') + stats.conversionGrowth : '0'}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Associates</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{stats.activeMembers ? stats.activeMembers : 0}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.teamGrowth)}
                <span className={`text-sm ${getTrendClass(stats.teamGrowth)}`}>
                {stats.teamGrowth ? (stats.teamGrowth > 0 ? '+' : '') + stats.teamGrowth : '0'}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current team size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{stats.satisfaction?.toFixed(1) ?? 0}/5</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.satisfactionGrowth)}
                <span className={`text-sm ${getTrendClass(stats.satisfactionGrowth)}`}>
                {stats.satisfactionGrowth ? (stats.satisfactionGrowth > 0 ? '+' : '') + stats.satisfactionGrowth : '0'}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-0">
          <div className="mb-2">
            <h3 className="font-medium">Sales Staff</h3>
            <p className="text-sm text-muted-foreground">
              Manage team members and monitor their performance metrics
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative mt-2 flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff by name, email, or phone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
              <InputSelect
                name="position"
                label=""
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                options={[
                  { value: "all", label: "All Positions" },
                  { value: "lead", label: "Team Lead" },
                  { value: "senior", label: "Senior Associate" },
                  { value: "junior", label: "Junior Associate" }
                ]}
              />
              </div>
              <InputSelect
                name="status"
                label=""
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                  { value: "ON_LEAVE", label: "On Leave" }
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="mb-8">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : staff.length === 0 ? (
            <div className="py-32 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No staff members found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by adding your first staff member.
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </div>
          ) : (
            <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Staff Member</TableHead>
      <TableHead>Contact</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Performance</TableHead>
      <TableHead>Joined</TableHead>
      <TableHead>App Access</TableHead>
      <TableHead className="w-[50px]"></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {staff.map((member) => (
      <TableRow key={member.id}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.avatar || undefined} />
              <AvatarFallback>
                {member.firstName[0]}{member.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{member.firstName} {member.lastName}</div>
              <div className="text-sm text-muted-foreground">
                ID: {member.employeeId}
              </div>
              {member.notes && (
                <div className="text-xs text-muted-foreground">
                  {member.notes}
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
            {member.phone && (
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                {member.phone}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div>{member.role}</div>
            {member.subRole && (
              <div className="text-sm text-muted-foreground">{member.subRole}</div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={getStatusBadge(member.status)}>
            {member.status}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm">
              Score: {member.performanceScore?.toFixed(1) || '0.0'}/5
            </div>
          </div>
        </TableCell>
        <TableCell>
          {new Date(member.dateOfJoin).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </TableCell>
        <TableCell>
          <Badge variant={member.canAccessApp ? "success" : "secondary"}>
            {member.canAccessApp ? "Yes" : "No"}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BarChart2 className="mr-2 h-4 w-4" />
                View Performance
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ClipboardList className="mr-2 h-4 w-4" />
                Assign Tasks
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessagesSquare className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
          )}

  {/* Integrated Pagination */}
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
                     {[...Array(Math.min(5, Math.ceil(totalItems / pageSize)))].map((_, i) => (
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
                         onClick={() => setPage(p => Math.min(Math.ceil(totalItems / pageSize), p + 1))}
                         disabled={page === Math.ceil(totalItems / pageSize)}
                       />
                     </PaginationItem>
                   </PaginationContent>
                 </Pagination>
               </div>

               <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                 Showing <span className="font-medium">{Math.min(pageSize, staff.length)}</span> of{" "}
                 <span className="font-medium">{totalItems}</span> staff members
               </p>
             </div>
           </div>
         
       </CardContent>
     </Card>

     {/* Staff Modal */}
     {isModalOpen && (
       <AddStaffModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSuccess={() => {
            fetchStaff();
            setIsModalOpen(false);
            fetchDepartments();
          }}
          departments={departments}
          clientId={clientId}
       />
     )}
     <div className="h-8"></div>
   </div>
 );
}

export default SalesTeam;