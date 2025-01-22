"use client"

import React, { useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Heart,
  Star,
  TrendingUp,
  MessageSquare,
  Download,
  Filter,
  Clock,
  RefreshCcw
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";

// Dummy feedback data
const DUMMY_FEEDBACK = Array.from({ length: 20 }, (_, i) => ({
  id: `FB-${i + 1}`,
  customer: {
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    avatar: null
  },
  rating: Math.floor(Math.random() * 2) + 4,
  category: ['Product', 'Service', 'Delivery', 'Support'][Math.floor(Math.random() * 4)],
  feedback: [
    'Excellent service and fast delivery!',
    'Great product quality, will order again.',
    'Very satisfied with the support.',
    'Good experience overall.'
  ][Math.floor(Math.random() * 4)],
  status: ['NEW', 'REVIEWED', 'RESPONDED'][Math.floor(Math.random() * 3)],
  date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString()
}));

export function CustomerFeedback() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedFeedback = DUMMY_FEEDBACK.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const variants = {
      NEW: "warning",
      REVIEWED: "default",
      RESPONDED: "success"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Feedback</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor and manage customer feedback and ratings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground mt-1">From 2,845 ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground mt-1">Within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Positive feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground mt-1">More than last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
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
                { value: "new", label: "New" },
                { value: "reviewed", label: "Reviewed" },
                { value: "responded", label: "Responded" }
              ]}
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.customer.avatar} />
                        <AvatarFallback>{item.customer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <div className="font-medium">{item.customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      {getRatingStars(item.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate">
                      {item.feedback}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <InputSelect
                      name="actions"
                      label=""
                      value=""
                      onChange={(e) => {
                        switch(e.target.value) {
                          case "view":
                            // Handle view details
                            break;
                          case "respond":
                            // Handle respond
                            break;
                          case "update":
                            // Handle update status
                            break;
                        }
                      }}
                      options={[
                        { value: "", label: "Actions" },
                        { value: "view", label: "View Details" },
                        { value: "respond", label: "Respond" },
                        { value: "update", label: "Update Status" }
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
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
                    {[...Array(Math.min(5, Math.ceil(DUMMY_FEEDBACK.length / pageSize)))].map((_, i) => (
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
                        onClick={() => setPage(p => Math.min(Math.ceil(DUMMY_FEEDBACK.length / pageSize), p + 1))}
                        disabled={page === Math.ceil(DUMMY_FEEDBACK.length / pageSize)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing <span className="font-medium">{displayedFeedback.length}</span> of{" "}
                <span className="font-medium">{DUMMY_FEEDBACK.length}</span> items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}