"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  MessageSquare,
  History,
  UserPlus,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  RefreshCcw,
  ArrowUpRight
} from "lucide-react"
import { CustomerStatus, CustomerType, LoyaltyTier } from "@prisma/client"
import InputSelect from "@/components/Common/InputSelect"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: CustomerStatus
  type: CustomerType
  loyaltyTier: LoyaltyTier
  orders: number
  lastOrder: string
  firstOrder: string
  registrationDate: string
  totalSpent: number
  avatar?: string
}

const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+355691234567",
    status: "ACTIVE",
    type: "REGULAR",
    loyaltyTier: "SILVER",
    orders: 15,
    lastOrder: "2024-01-15",
    firstOrder: "2023-05-20",
    registrationDate: "2023-05-15",
    totalSpent: 25000,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "+355697654321",
    status: "ACTIVE",
    type: "VIP",
    loyaltyTier: "GOLD",
    orders: 45,
    lastOrder: "2024-01-20",
    firstOrder: "2023-02-10",
    registrationDate: "2023-02-01",
    totalSpent: 125000,
  },
  // Add more dummy data...
]

export function AllCustomers() {
  const [customers] = useState<Customer[]>(DUMMY_CUSTOMERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [status, setStatus] = useState("all")
const [type, setType] = useState("all")

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
          <h2 className="text-2xl font-bold tracking-tight">All Customers</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View and manage all your customers in one place
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">1,274</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(12)}
                <span className={`text-sm ${getTrendClass(12)}`}>+12%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">892</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(5)}
                <span className={`text-sm ${getTrendClass(5)}`}>+5%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">2,450 ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(8)}
                <span className={`text-sm ${getTrendClass(8)}`}>+8%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">+124</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(15)}
                <span className={`text-sm ${getTrendClass(15)}`}>+15%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">New this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4">
      {/* Filters and Actions */}
<Card>
  <CardHeader>
  <div className="mb-4">
      <h3 className="font-medium">Filter Customers</h3>
      <p className="text-sm text-muted-foreground">
        Filter and search through your customer base
      </p>
    </div>
  </CardHeader>
  <CardContent className="p-0">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center flex-1 gap-2 max-w-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
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
        <InputSelect
          name="type"
          label=""
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "all", label: "All Types" },
            { value: "regular", label: "Regular" },
            { value: "vip", label: "VIP" }
          ]}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
    </div>
  </CardContent>
</Card>

        {/* Customers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Loyalty</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                      <Avatar>
  <AvatarImage src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} />
  <AvatarFallback className="uppercase">
    {customer.firstName[0]}{customer.lastName[0]}
  </AvatarFallback>
</Avatar>
                        <div>
                          <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {customer.type === "VIP" && (
                              <Badge variant="default" className="bg-primary">VIP</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Customer since {new Date(customer.registrationDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === "ACTIVE" ? "success" : "secondary"}
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div>{customer.orders} orders</div>
                        <span className="text-xs text-muted-foreground">
                          Last: {new Date(customer.lastOrder).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div>{new Date(customer.registrationDate).toLocaleDateString()}</div>
                        <span className="text-xs text-muted-foreground">
                          First order: {new Date(customer.firstOrder).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                    <Badge 
  variant={
    customer.loyaltyTier === "PLATINUM" ? "default" :
    customer.loyaltyTier === "GOLD" ? "warning" :
    customer.loyaltyTier === "SILVER" ? "secondary" :
    "outline"
  }
>
  {customer.loyaltyTier}
</Badge>
                    </TableCell>
                    <TableCell>{customer.totalSpent.toLocaleString()} ALL</TableCell>
<TableCell>
 <DropdownMenu>
   <DropdownMenuTrigger asChild>
     <Button variant="ghost" size="icon" className="h-8 w-8">
       <MoreVertical className="h-4 w-4" />
     </Button>
   </DropdownMenuTrigger>
   <DropdownMenuContent align="end">
     <DropdownMenuItem>
       <MessageSquare className="mr-2 h-4 w-4" />
       Send Message
     </DropdownMenuItem>
     <DropdownMenuItem>
       <History className="mr-2 h-4 w-4" />
       View History 
     </DropdownMenuItem>
     <DropdownMenuSeparator />
     <DropdownMenuItem>
       <Star className="mr-2 h-4 w-4" />
       Add to VIP
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
          {[...Array(Math.min(5, Math.ceil(customers.length / pageSize)))].map((_, i) => (
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
              onClick={() => setPage(p => Math.min(Math.ceil(customers.length / pageSize), p + 1))}
              disabled={page === Math.ceil(customers.length / pageSize)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>

    <p className="text-sm text-muted-foreground min-w-[180px] text-right">
      Showing <span className="font-medium">50</span> of{" "}
      <span className="font-medium">1,274</span> customers
    </p>
  </div>
</div>
</CardContent>
</Card>
</div>
</div>
)
}