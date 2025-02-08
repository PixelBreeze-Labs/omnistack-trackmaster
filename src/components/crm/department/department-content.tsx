"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Building2,
  Users,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useClient } from '@/hooks/useClient';
import { AddDepartmentModal } from '@/components/crm/department/add-department-modal';
import InputSelect from '@/components/Common/InputSelect';
import { StaffRole, StaffStatus } from '@/types/staff';

export function DepartmentsContent() {
  const router = useRouter();
  const { clientId } = useClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, department: null });
  const [stats, setStats] = useState({
    totalDepartments: 0,
    activeDepartments: 0,
    totalStaff: 0,
  });

  const fetchDepartments = async () => {
    if (!clientId) return;
    try {
      const response = await fetch(`/api/departments?clientId=${clientId}&search=${searchTerm}`);
      const data = await response.json();
      setDepartments(data);
      setStats({
        totalDepartments: data.length,
        activeDepartments: data.filter(d => d.isActive).length,
        totalStaff: data.reduce((acc, dept) => acc + (dept._count?.staff || 0), 0),
      });
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [clientId, searchTerm]);

  const handleDelete = async (departmentId) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete department');
      
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
    setDeleteDialog({ open: false, department: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
    <p className="text-sm text-muted-foreground mt-2">
      Manage your organization's departments and teams
    </p>
  </div>
  <div className="flex items-center gap-2">
    <Button 
      variant="soft" 
      onClick={() => router.push('/crm/ecommerce/hr/staff')}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Staff
    </Button>
    <Button 
      variant="default"
      className="bg-primary" 
      onClick={() => setIsModalOpen(true)}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Department
    </Button>
  </div>
</div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Departments</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">{stats.totalDepartments}</h3>
            <p className="text-xs text-muted-foreground">{stats.activeDepartments} active</p>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">{stats.totalStaff}</h3>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Avg Team Size</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">
              {stats.totalDepartments > 0 
                ? Math.round(stats.totalStaff / stats.totalDepartments)
                : 0}
            </h3>
            <p className="text-xs text-muted-foreground">Staff per department</p>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Inactive Depts</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">
              {stats.totalDepartments - stats.activeDepartments}
            </h3>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <AlertCircle className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
</div>

       {/* Filters */}
      <Card>
        <CardHeader>
          <div className="mb-0">
            <h3 className="font-medium">Search Departments</h3>
            <p className="text-sm text-muted-foreground">
            Search by department name or code
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
                  // value={filters.search}
                  // onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Departments Found</h3>
                      <p className="text-sm text-muted-foreground max-w-[400px]">
                        Get started by adding your first department to organize your teams.
                      </p>
                      <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Department
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.code}</TableCell>
                    <TableCell>{department._count?.staff || 0} members</TableCell>
                    <TableCell>
                      <Badge variant={department.isActive ? "success" : "secondary"}>
                        {department.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {department.description || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteDialog({ 
                            open: true, 
                            department 
                          })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Department Modal */}
      {isModalOpen && (
        <AddDepartmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDepartment(null);
          }}
          onSuccess={() => {
            fetchDepartments();
          }}
          clientId={clientId}
          department={selectedDepartment}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ open, department: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department &quot;{deleteDialog.department?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(deleteDialog.department?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="h-8"></div>
    </div>
  );
}

export default DepartmentsContent;