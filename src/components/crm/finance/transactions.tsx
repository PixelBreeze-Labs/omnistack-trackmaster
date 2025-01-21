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
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
  Calendar,
  CreditCard,
  Wallet,
  Building,
  RefreshCcw,
  Store
} from "lucide-react";

const TRANSACTIONS = [
  {
    id: "TX-2024-001",
    date: "2024-01-20",
    customer: "John Doe",
    type: "SALE",
    method: "CREDIT_CARD",
    amount: 299.99,
    status: "COMPLETED",
    location: "Online Store"
  },
  {
    id: "TX-2024-002",
    date: "2024-01-20",
    customer: "Jane Smith",
    type: "REFUND",
    method: "WALLET",
    amount: -150.00,
    status: "PROCESSED",
    location: "Main Street Store"
  },
  // Add more transaction data...
];

const STATS = [
  {
    title: "Total Sales",
    value: "$12,499.99",
    change: "+12.5%",
    trend: "up"
  },
  {
    title: "Refunds",
    value: "$1,205.00",
    change: "-2.3%",
    trend: "down"
  },
  {
    title: "Net Revenue",
    value: "$11,294.99",
    change: "+8.2%",
    trend: "up"
  },
  {
    title: "Avg. Transaction",
    value: "$142.50",
    change: "+5.7%",
    trend: "up"
  }
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: string } = {
    "COMPLETED": "bg-green-100 text-green-800",
    "PROCESSED": "bg-blue-100 text-blue-800",
    "PENDING": "bg-yellow-100 text-yellow-800",
    "FAILED": "bg-red-100 text-red-800"
  };
  return variants[status] || variants["PENDING"];
};

const getMethodIcon = (method: string) => {
  const icons = {
    "CREDIT_CARD": <CreditCard className="h-4 w-4" />,
    "WALLET": <Wallet className="h-4 w-4" />,
    "CASH": <Building className="h-4 w-4" />
  };
  return icons[method as keyof typeof icons] || icons["CREDIT_CARD"];
};

export function TransactionsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor and manage all financial transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" style={{ backgroundColor: "#5FC4D0", color: "white" }}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`flex items-center ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? 
                    <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  }
                  {stat.change}
                </Badge>
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
                placeholder="Search transactions..." 
                className="pl-9 w-full"
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACTIONS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>{tx.customer}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === "REFUND" ? "destructive" : "default"}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(tx.method)}
                      {tx.method.replace("_", " ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      {tx.location}
                    </div>
                  </TableCell>
                  <TableCell className={tx.amount < 0 ? "text-red-600" : "text-green-600"}>
                    ${Math.abs(tx.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(tx.status)}>
                      {tx.status}
                    </Badge>
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

export default TransactionsContent;