"use client"

import { useState } from "react"
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
  UserCog,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCcw,
  UserPlus,
  CircleDollarSign,
  BarChart2,
  Calendar,
  UserCheck,
  ClipboardList,
  MessagesSquare,
  Award
} from "lucide-react"

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

const DUMMY_STAFF: SalesAssociate[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+355691234567",
    position: "Senior Sales Associate",
    status: "ACTIVE",
    performance: {
      monthlyTarget: 500000,
      currentSales: 425000,
      conversion: 68,
      customerSatisfaction: 4.8
    },
    activeCustomers: 124,
    startDate: "2023-03-15"
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah.smith@company.com",
    phone: "+355697654321",
    position: "Sales Team Lead",
    status: "ACTIVE",
    performance: {
      monthlyTarget: 750000,
      currentSales: 680000,
      conversion: 72,
      customerSatisfaction: 4.9
    },
    activeCustomers: 156,
    startDate: "2022-08-01"
  }
];

export function SalesTeam() {
  const [staff] = useState<SalesAssociate[]>(DUMMY_STAFF)
  const [searchTerm, setSearchTerm] = useState("")
  const [position, setPosition] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales Team</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your sales associates and track their performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="soft" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
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
              <div className="text-2xl font-bold">4.2M ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(15)}
                <span className={`text-sm ${getTrendClass(15)}`}>+15%</span>
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
              <div className="text-2xl font-bold">68%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(5)}
                <span className={`text-sm ${getTrendClass(5)}`}>+5%</span>
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
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(8)}
                <span className={`text-sm ${getTrendClass(8)}`}>+8%</span>
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
              <div className="text-2xl font-bold">4.8/5</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(3)}
                <span className={`text-sm ${getTrendClass(3)}`}>+3%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="font-medium">Sales Staff</h3>
            <p className="text-sm text-muted-foreground">
              Manage team members and monitor their performance metrics
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff by name, email, or phone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              <InputSelect
                name="status"
                label=""
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "on_leave", label: "On Leave" }
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Active Customers</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={`${member.firstName} ${member.lastName}`} />
                        <AvatarFallback className="uppercase">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.firstName} {member.lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          Sales: {member.performance.currentSales.toLocaleString()} ALL
                        </div>
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
                        {member.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        member.status === "ACTIVE" ? "success" :
                        member.status === "ON_LEAVE" ? "warning" :
                        "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">Target: {Math.round((member.performance.currentSales / member.performance.monthlyTarget) * 100)}%</div>
                      <div className="text-sm">Conv: {member.performance.conversion}%</div>
                      <div className="text-sm">CSAT: {member.performance.customerSatisfaction}</div>
                    </div>
                  </TableCell>
                  <TableCell>{member.activeCustomers}</TableCell>
                  <TableCell>{new Date(member.startDate).toLocaleDateString()}</TableCell>
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
                    {[...Array(Math.min(5, Math.ceil(staff.length / pageSize)))].map((_, i) => (
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
                        onClick={() => setPage(p => Math.min(Math.ceil(staff.length / pageSize), p + 1))}
                        disabled={page === Math.ceil(staff.length / pageSize)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing <span className="font-medium">{Math.min(pageSize, staff.length)}</span> of{" "}
                <span className="font-medium">{staff.length}</span> staff members
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}