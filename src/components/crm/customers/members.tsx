"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import InputSelect from "@/components/Common/InputSelect"
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
  Star,
  Gift,
  History,
  Coins,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Download,
  RefreshCcw
} from "lucide-react"
import { CustomerStatus, CustomerType, LoyaltyTier } from "@prisma/client"

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: CustomerStatus
  type: CustomerType
  loyaltyPoints: number
  loyaltyTier: LoyaltyTier
  lastActivity: string
  totalSpent: number
}

const DUMMY_MEMBERS: Member[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+355691234567",
    status: "ACTIVE",
    type: "VIP",
    loyaltyPoints: 2500,
    loyaltyTier: "GOLD",
    lastActivity: "2024-01-15",
    totalSpent: 75000
  },
  // Add more dummy data as needed
]

export function Members() {
    const [members] = useState<Member[]>(DUMMY_MEMBERS)
    const [searchTerm, setSearchTerm] = useState("")
    const [status, setStatus] = useState("all")
    const [tier, setTier] = useState("all")
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
            <h2 className="text-2xl font-bold tracking-tight">Members</h2>
            <p className="text-sm text-muted-foreground mt-2">
              View and manage your loyalty program members
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
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">856</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(15)}
                  <span className={`text-sm ${getTrendClass(15)}`}>+15%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">From last month</p>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">624</div>
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
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">125,430</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(20)}
                  <span className={`text-sm ${getTrendClass(20)}`}>+20%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Points issued this month</p>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">45,780</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(12)}
                  <span className={`text-sm ${getTrendClass(12)}`}>+12%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Points redeemed this month</p>
            </CardContent>
          </Card>
        </div>
  
        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="font-medium">Manage Members</h3>
              <p className="text-sm text-muted-foreground">
                Search, filter, and manage club members and their loyalty benefits
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center flex-1 gap-2 max-w-3xl">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members by name, email, or phone..."
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
                  name="tier"
                  label=""
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  options={[
                    { value: "all", label: "All Tiers" },
                    { value: "platinum", label: "Platinum" },
                    { value: "gold", label: "Gold" },
                    { value: "silver", label: "Silver" }
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Gift className="mr-2 h-4 w-4" />
                  Issue Points
                </Button>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Members Table Card */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
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
                          <div className="flex items-center gap-1 mt-0.5">
                            {member.type === "VIP" && (
                              <Badge variant="default" className="bg-primary">VIP</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {member.loyaltyPoints.toLocaleString()} points
                            </span>
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
                    <TableCell>
                      <Badge 
                        variant={
                          member.loyaltyTier === "PLATINUM" ? "default" :
                          member.loyaltyTier === "GOLD" ? "warning" :
                          member.loyaltyTier === "SILVER" ? "secondary" :
                          "outline"
                        }
                      >
                        {member.loyaltyTier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-yellow-500" />
                        {member.loyaltyPoints.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(member.lastActivity).toLocaleDateString()}</TableCell>
                    <TableCell>{member.totalSpent.toLocaleString()} ALL</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Gift className="mr-2 h-4 w-4" />
                            Issue Points
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" />
                            Upgrade Tier
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
        Showing <span className="font-medium">50</span> of{" "}
        <span className="font-medium">1,274</span> members
      </p>
    </div>
  </div>
  </CardContent>
  </Card>
  </div>
  )
  }