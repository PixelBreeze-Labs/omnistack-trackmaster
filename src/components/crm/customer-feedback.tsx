"use client";

import React, { useEffect, useState } from "react";
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
import { Search, Download, RefreshCcw, Eye, Star, Filter, Clock } from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { useCustomerFeedback } from "@/hooks/useCustomerFeedback";
import { useFeedbackStats } from "@/hooks/useFeedbackStats";
import { FeedbackModal } from "@/components/crm/customer-feedback/FeedbackModal";

export function CustomerFeedback() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    feedbacks,
    loading,
    error,
    totalCount,
    fetchFeedback,
    getFeedbackById,
  } = useCustomerFeedback();

  const { stats, loading: statsLoading } = useFeedbackStats();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFeedback({ search: searchTerm, status });
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, status, fetchFeedback]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleViewDetails = async (id: string) => {
    try {
      const data = await getFeedbackById(id);
      setSelectedFeedback(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      NEW: "warning",
      REVIEWED: "default",
      RESPONDED: "success",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 inline-block ${
            index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
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
          <Button variant="outline" size="sm" onClick={() => fetchFeedback({ search: searchTerm, status })} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
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
      {statsLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || "0.0"}/5</div>
          <p className="text-xs text-muted-foreground mt-1">From {stats?.totalRatings || 0} ratings</p>
        </>
      )}
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
      <Badge>{stats?.responseRate || 0}%</Badge>
    </CardHeader>
    <CardContent>
      {statsLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{stats?.responseRate || 0}%</div>
          <p className="text-xs text-muted-foreground mt-1">Within 24 hours</p>
        </>
      )}
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
      <Badge>{stats?.satisfactionScore || 0}%</Badge>
    </CardHeader>
    <CardContent>
      {statsLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{stats?.satisfactionScore || 0}%</div>
          <p className="text-xs text-muted-foreground mt-1">Positive feedback</p>
        </>
      )}
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Trending</CardTitle>
      <Badge>{stats?.trending || 0}%</Badge>
    </CardHeader>
    <CardContent>
      {statsLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{stats?.trending || 0}%</div>
          <p className="text-xs text-muted-foreground mt-1">Change from last month</p>
        </>
      )}
    </CardContent>
  </Card>
</div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <div className="mb-1">
            <h3 className="font-medium">Filter Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through customer feedback
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4">
            <div className="relative mt-2 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <InputSelect
              name="status"
              label=""
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All Status" },
                { value: "new", label: "New" },
                { value: "reviewed", label: "Reviewed" },
                { value: "responded", label: "Responded" },
              ]}
            />
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex justify-center items-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : feedbacks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
                        />
                      </svg>
                      <h3 className="text-lg font-medium">No feedback found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm || status !== 'all' 
                          ? "Try adjusting your filters or search terms"
                          : "Customer feedback will appear here when they provide ratings and reviews"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.customer.avatar} />
                          <AvatarFallback>
                            {item.customer.name ? item.customer.name.substring(0, 2).toUpperCase() : 'NA'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="font-medium">{item.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{item.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {Array(5).fill(0).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < (item.rating || 0) 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.category || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate" title={item.product_feedback}>
                        {item.product_feedback || 'No feedback provided'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === "NEW" ? "warning" :
                        item.status === "REVIEWED" ? "default" : "success"
                      }>
                        {item.status || 'PENDING'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(item.id)}
                        disabled={loading}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <InputSelect
                name="pageSize"
                label=""
                value={pageSize.toString()}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPage(1);
                }}
                options={[
                  { value: "10", label: "10 rows" },
                  { value: "20", label: "20 rows" },
                  { value: "50", label: "50 rows" },
                ]}
              />
              
              <div className="flex-1 flex items-center justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          onClick={() => setPage(i + 1)}
                          disabled={loading}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage((p) => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                        disabled={page === Math.ceil(totalCount / pageSize) || loading || totalCount === 0}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              
              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing <span className="font-medium">{feedbacks?.length}</span> of{" "}
                <span className="font-medium">{totalCount || 0}</span> items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feedback={selectedFeedback}
      />

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
