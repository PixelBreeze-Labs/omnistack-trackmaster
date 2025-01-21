"use client"

import React from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Store,
  MapPin,
  BarChart,
  Users,
  Building2,
  ChevronRight,
  Mail,
  Phone,
  Calendar
} from "lucide-react";

const STAFF_MEMBERS = [
  {
    id: "EMP-001",
    name: "Sarah Johnson",
    role: "Store Manager",
    location: "Main Street Store",
    email: "sarah.j@example.com",
    phone: "+1 234-567-8901",
    status: "ACTIVE",
    performance: 95,
    avatar: null
  },
  {
    id: "EMP-002",
    name: "Michael Chen",
    role: "Sales Associate",
    location: "Downtown Branch",
    email: "michael.c@example.com",
    phone: "+1 234-567-8902",
    status: "ACTIVE",
    performance: 88,
    avatar: null
  },
  // Add more staff data...
];

const DEPARTMENT_STATS = [
  {
    title: "Total Staff",
    value: "24",
    subtitle: "4 managers",
    icon: Users
  },
  {
    title: "Locations",
    value: "3",
    subtitle: "2 cities",
    icon: Store
  },
  {
    title: "Avg. Performance",
    value: "92%",
    subtitle: "Last 30 days",
    icon: BarChart
  },
  {
    title: "Departments",
    value: "5",
    subtitle: "Active teams",
    icon: Building2
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    "ACTIVE": "bg-green-100 text-green-800",
    "ON_LEAVE": "bg-yellow-100 text-yellow-800",
    "INACTIVE": "bg-gray-100 text-gray-800"
  };
  return variants[status] || variants["INACTIVE"];
};

const getPerformanceColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
};

export function StaffContent() {
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
        <Button variant="default" style={{ backgroundColor: "#5FC4D0" }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEPARTMENT_STATS.map((stat) => (
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
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search staff members..." 
                className="pl-9 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="sm:w-auto">
                <Store className="h-4 w-4 mr-2" />
                Location
              </Button>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
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
                <TableHead>Location</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STAFF_MEMBERS.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar || undefined} />
                        <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {staff.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {staff.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                        {staff.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        {staff.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {staff.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getPerformanceColor(staff.performance)}`}>
                        {staff.performance}%
                      </span>
                      <div className="w-24 h-2 rounded-full bg-gray-100">
                        <div 
                          className={`h-full rounded-full ${
                            staff.performance >= 90 ? "bg-green-500" :
                            staff.performance >= 70 ? "bg-yellow-500" :
                            "bg-red-500"
                          }`}
                          style={{ width: `${staff.performance}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(staff.status)}>
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default StaffContent;