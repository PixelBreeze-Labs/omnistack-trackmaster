"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  RefreshCcw,
  Target,
  Users,
  ShoppingBag,
  Star,
  Award,
  Percent
} from "lucide-react"

interface PerformanceData {
  id: string
  name: string
  avatar?: string
  metrics: {
    target: number
    achieved: number
    customerSatisfaction: number
    conversion: number
    avgOrderValue: number
    totalSales: number
    activeCustomers: number
  }
  trend: {
    sales: number
    conversion: number
    satisfaction: number
  }
  rank: number
  period: string
}

const DUMMY_PERFORMANCE: PerformanceData[] = [
  {
    id: "1",
    name: "John Doe",
    metrics: {
      target: 500000,
      achieved: 425000,
      customerSatisfaction: 4.8,
      conversion: 68,
      avgOrderValue: 2450,
      totalSales: 425000,
      activeCustomers: 124
    },
    trend: {
      sales: 15,
      conversion: 5,
      satisfaction: 3
    },
    rank: 2,
    period: "2024-01"
  },
  {
    id: "2",
    name: "Sarah Smith",
    metrics: {
      target: 750000,
      achieved: 680000,
      customerSatisfaction: 4.9,
      conversion: 72,
      avgOrderValue: 2850,
      totalSales: 680000,
      activeCustomers: 156
    },
    trend: {
      sales: 18,
      conversion: 8,
      satisfaction: 4
    },
    rank: 1,
    period: "2024-01"
  }
]

export function SalesPerformance() {
  const [period, setPeriod] = useState("current")
  const [teamMembers] = useState<PerformanceData[]>(DUMMY_PERFORMANCE)

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendClass = (percentage: number) => {
    return percentage > 0 ? "text-green-500" : "text-red-500"
  }

  const getProgressClass = (achieved: number, target: number) => {
    const percentage = (achieved / target) * 100
    if (percentage >= 100) return "text-green-500"
    if (percentage >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor sales team performance and key metrics
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

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <InputSelect
                name="period"
                label=""
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                options={[
                  { value: "current", label: "Current Month" },
                  { value: "last", label: "Last Month" },
                  { value: "quarter", label: "This Quarter" },
                  { value: "year", label: "Year to Date" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Target Achievement</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">82%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(8)}
                <span className={`text-sm ${getTrendClass(8)}`}>+8%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average across team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">4.2M ALL</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(15)}
                <span className={`text-sm ${getTrendClass(15)}`}>+15%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Combined sales volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">68%</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(5)}
                <span className={`text-sm ${getTrendClass(5)}`}>+5%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Team conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">4.8/5.0</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(3)}
                <span className={`text-sm ${getTrendClass(3)}`}>+3%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sales Associate</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Target Progress</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Avg Order Value</TableHead>
                <TableHead>Active Customers</TableHead>
                <TableHead>Satisfaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="uppercase">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.rank === 1 && (
                            <Badge variant="default" className="bg-yellow-500">
                              <Award className="mr-1 h-3 w-3" />
                              Top Performer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold">
                      #{member.rank}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div 
                        className={`font-medium ${getProgressClass(
                          member.metrics.achieved, 
                          member.metrics.target
                        )}`}
                      >
                        {Math.round((member.metrics.achieved / member.metrics.target) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.metrics.achieved.toLocaleString()} / {member.metrics.target.toLocaleString()} ALL
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium">
                        {member.metrics.totalSales.toLocaleString()} ALL
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {getTrendIcon(member.trend.sales)}
                        <span className={`ml-1 ${getTrendClass(member.trend.sales)}`}>
                          {member.trend.sales}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium">{member.metrics.conversion}%</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {getTrendIcon(member.trend.conversion)}
                        <span className={`ml-1 ${getTrendClass(member.trend.conversion)}`}>
                          {member.trend.conversion}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.metrics.avgOrderValue.toLocaleString()} ALL
                  </TableCell>
                  <TableCell>{member.metrics.activeCustomers}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium">{member.metrics.customerSatisfaction}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {getTrendIcon(member.trend.satisfaction)}
                        <span className={`ml-1 ${getTrendClass(member.trend.satisfaction)}`}>
                          {member.trend.satisfaction}%
                        </span>
                      </div>
                    </div>
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