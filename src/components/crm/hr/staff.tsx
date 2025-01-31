"use client"

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
  Plus,
  MapPin,
  BarChart,
  Users,
  Building2,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { Staff, StaffRole, StaffStatus } from '@/types/staff';
import { AddStaffModal } from '@/components/crm/staff/add-staff-modal';
import { useClient } from '@/hooks/useClient';
import InputSelect from '@/components/Common/InputSelect';
import { useRouter } from 'next/navigation';


export function StaffContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const { clientId } = useClient();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalStaff: 0,
    totalManagers: 0,
    totalDepartments: 0,
    avgPerformance: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    departmentId: '',
    role: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  // Fetch staff and departments
  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, [filters, pagination.page, pagination.limit, clientId]);

  const fetchStaff = async () => {
    if (!clientId) return;
    try {
      const queryParams = new URLSearchParams({
        clientId,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });
      const response = await fetch(`/api/staff?${queryParams}`);
      const data = await response.json();
      
      setStaff(data.items);
      setPagination(prev => ({ ...prev, total: data.total }));
      
      // Update stats
      setStats({
        totalStaff: data.total,
        totalManagers: data.items.filter(s => s.role === 'MANAGER').length,
        totalDepartments: new Set(data.items.map(s => s.departmentId)).size,
        avgPerformance: data.items.reduce((acc, s) => acc + (s.performanceScore || 0), 0) / data.items.length
      });
    } catch (error) {
      toast.error('Failed to fetch staff members');
    }
  };

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
    const variants: { [key: string]: string } = {
      "ACTIVE": "bg-green-100 text-green-800",
      "ON_LEAVE": "bg-yellow-100 text-yellow-800",
      "INACTIVE": "bg-gray-100 text-gray-800",
      "SUSPENDED": "bg-red-100 text-red-800"
    };
    return variants[status] || variants["INACTIVE"];
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your team members and their roles
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="soft" onClick={() => router.push('/crm/ecommerce/hr/department')}>
          <Building2 className="h-4 w-4 mr-2" />
          Manage Departments
        </Button>
        <Button variant="default" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
    </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
  {
    title: "Total Staff",
    value: stats.totalStaff,
    subtitle: `${stats.totalManagers} managers`,
    icon: Users
  },
  {
    title: "Departments",
    value: stats.totalDepartments,
    subtitle: "Active teams",
    icon: Building2
  },
  {
    title: "Avg. Performance",
    value: isNaN(stats.avgPerformance) ? "No data" : `${Math.round(stats.avgPerformance)}%`,
    subtitle: "Last 30 days",
    icon: BarChart
  },
  {
    title: "App Users",
    value: staff?.filter(s => s.canAccessApp).length || 0,
    subtitle: "Sales app access",
    icon: Smartphone
  }
].map((stat) => (
  <Card key={stat.title}>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <stat.icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Filter Staff</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your team members
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center flex-1 gap-2 w-full">
              <div className="relative mt-2 flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or ID..." 
                  className="pl-9 w-full"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <InputSelect
  name="departmentId"
  label=""
  value={filters.departmentId || "all"}
  onChange={(e) => setFilters(prev => ({ 
    ...prev, 
    departmentId: e.target.value === "all" ? "" : e.target.value 
  }))}
  options={[
    { value: "all", label: "All Departments" },
    ...(departments?.length > 0 
      ? departments.map(dept => ({ value: dept.id, label: dept.name }))
      : [{ value: "no-departments", label: "No departments available" }]
    )
  ]}
/>

<InputSelect
  name="role"
  label=""
  value={filters.role || "all"}
  onChange={(e) => setFilters(prev => ({
    ...prev,
    role: e.target.value === "all" ? "" : e.target.value
  }))}
  options={[
    { value: "all", label: "All Roles" },
    ...Object.values(StaffRole).map(role => ({
      value: role,
      label: role
    }))
  ]}
/>

<InputSelect
  name="status"
  label=""
  value={filters.status || "all"}
  onChange={(e) => setFilters(prev => ({
    ...prev,
    status: e.target.value === "all" ? "" : e.target.value
  }))}
  options={[
    { value: "all", label: "All Status" },
    ...Object.values(StaffStatus).map(status => ({
      value: status,
      label: status
    }))
  ]}
/>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Staff Members Found</h3>
                      <p className="text-sm text-muted-foreground max-w-[400px]">
                        Get started by adding your first staff member to manage your team effectively.
                      </p>
                      <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add First Staff Member
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                staff?.map((member) => (
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
                          <div className="font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {member.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{member.role}</div>
                          {member.subRole && (
                            <div className="text-sm text-muted-foreground">
                              {member.subRole}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {member.department.name}
                      </div>
                    </TableCell>
                    <TableCell>
  {member.performanceScore !== null && member.performanceScore !== undefined ? (
    <div className="flex items-center gap-2">
      <span className={`font-medium ${getPerformanceColor(member.performanceScore)}`}>
        {member.performanceScore}%
      </span>
      <div className="w-24 h-2 rounded-full bg-gray-100">
        <div 
          className={`h-full rounded-full ${
            member.performanceScore >= 90 ? "bg-green-500" :
            member.performanceScore >= 70 ? "bg-yellow-500" :
            "bg-red-500"
          }`}
          style={{ width: `${member.performanceScore}%` }}
        />
      </div>
    </div>
  ) : (
    <span className="text-muted-foreground text-sm">Not available</span>
  )}
</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast.info("Edit functionality coming soon");
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {staff?.length > 0 && (
            <div className="border-t px-4 py-3">
              <div className="flex items-center justify-between gap-4">
              <InputSelect
  name="pageSize"
  label=""
  value={pagination.limit.toString()}
  onChange={(e) => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      limit: parseInt(e.target.value)
    }));
  }}
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
                          onClick={() => setPagination(prev => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1)
                          }))}
                          disabled={pagination.page === 1} 
                        />
                      </PaginationItem>
                      {[...Array(Math.min(5, Math.ceil(pagination.total / pagination.limit)))].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            isActive={pagination.page === i + 1}
                            onClick={() => setPagination(prev => ({
                              ...prev,
                              page: i + 1
                            }))}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPagination(prev => ({
                            ...prev,
                            page: Math.min(Math.ceil(pagination.total / prev.limit), prev.page + 1)
                          }))}
                          disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                  Showing <span className="font-medium">{staff.length}</span> of{" "}
                  <span className="font-medium">{pagination.total}</span> staff members
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <AddStaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchStaff();
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

export default StaffContent;