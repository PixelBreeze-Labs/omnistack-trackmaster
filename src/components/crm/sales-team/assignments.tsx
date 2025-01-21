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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  Users,
  Search,
  MoreVertical,
  UserCheck,
  Download,
  RefreshCcw,
  UserPlus,
  UserCog,
  History,
  CircleDollarSign,
  ArrowRightLeft,
  Clock,
  Filter,
  ShoppingBag
} from "lucide-react"

interface CustomerAssignment {
  id: string
  customer: {
    name: string
    email: string
    type: 'REGULAR' | 'VIP' | 'WHOLESALE'
    totalSpent: number
    lastOrder: string
    avatar?: string
  }
  assignedTo: {
    id: string
    name: string
    workload: number
    avatar?: string
  }
  assignedDate: string
  lastInteraction: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
}

const DUMMY_ASSIGNMENTS: CustomerAssignment[] = [
  {
    id: "1",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      type: "VIP",
      totalSpent: 125000,
      lastOrder: "2024-01-15"
    },
    assignedTo: {
      id: "sa1",
      name: "Sarah Smith",
      workload: 75
    },
    assignedDate: "2023-12-01",
    lastInteraction: "2024-01-20",
    status: "ACTIVE"
  },
  {
    id: "2",
    customer: {
      name: "Jane Wilson",
      email: "jane@example.com",
      type: "REGULAR",
      totalSpent: 45000,
      lastOrder: "2024-01-18"
    },
    assignedTo: {
      id: "sa2",
      name: "Mike Johnson",
      workload: 60
    },
    assignedDate: "2024-01-01",
    lastInteraction: "2024-01-19",
    status: "ACTIVE"
  }
]

export function CustomerAssignments() {
  const [assignments] = useState<CustomerAssignment[]>(DUMMY_ASSIGNMENTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [salesAssociate, setSalesAssociate] = useState("all")

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-500"
    if (workload >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Assignments</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage customer assignments and sales associate workloads
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

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">842</div>
            <p className="text-xs text-muted-foreground mt-1">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Workload</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all associates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Changes</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-0">
          <div className="mb-1">
            <h3 className="font-medium">Manage Assignments</h3>
            <p className="text-sm text-muted-foreground">
              Assign and manage customer relationships with sales associates
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative mt-2 flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer or sales associate..."
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
                  { value: "inactive", label: "Inactive" },
                  { value: "pending", label: "Pending" }
                ]}
              />
              <InputSelect
                name="salesAssociate"
                label=""
                value={salesAssociate}
                onChange={(e) => setSalesAssociate(e.target.value)}
                options={[
                  { value: "all", label: "All Associates" },
                  { value: "sa1", label: "Sarah Smith" },
                  { value: "sa2", label: "Mike Johnson" }
                ]}
              />
              <Button className="mt-2" variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Reassign
              </Button>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignment Date</TableHead>
                <TableHead>Last Interaction</TableHead>
                <TableHead>Customer Value</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={assignment.customer.avatar} alt={assignment.customer.name} />
                        <AvatarFallback className="uppercase">
                          {assignment.customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assignment.customer.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {assignment.customer.type === "VIP" && (
                            <Badge variant="default" className="bg-primary">VIP</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {assignment.customer.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={assignment.assignedTo.avatar} alt={assignment.assignedTo.name} />
                        <AvatarFallback className="uppercase">
                          {assignment.assignedTo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assignment.assignedTo.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-xs ${getWorkloadColor(assignment.assignedTo.workload)}`}>
                            {assignment.assignedTo.workload}% workload
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        assignment.status === "ACTIVE" ? "success" :
                        assignment.status === "PENDING" ? "warning" :
                        "secondary"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.assignedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div>{new Date(assignment.lastInteraction).toLocaleDateString()}</div>
                      <span className="text-xs text-muted-foreground">
                        Last activity
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div>{assignment.customer.totalSpent.toLocaleString()} ALL</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <ShoppingBag className="mr-1 h-3 w-3" />
                        Last: {new Date(assignment.customer.lastOrder).toLocaleDateString()}
                      </div>
                    </div>
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
                          <ArrowRightLeft className="mr-2 h-4 w-4" />
                          Reassign Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <UserCog className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}