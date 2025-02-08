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
import { Search, Download, RefreshCcw, Eye, Star, Clock } from "lucide-react";
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
  const [storeFilter, setStoreFilter] = useState("");

  const {
    feedbacks,
    loading,
    // error,
    totalCount,
    fetchFeedback,
    // getFeedbackById,
  } = useCustomerFeedback();

  const { stats, loading: statsLoading } = useFeedbackStats();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFeedback({ search: searchTerm, status });
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, status, fetchFeedback]);

  const { data, pagination } = feedbacks;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleViewDetails = async (feedback) => {
    try {
      
      setSelectedFeedback(feedback);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };


const getRatingStars = (rating: number) => {
  const normalizedRating = Math.round((rating / 10) * 5); // Convert 10-point to 5 stars
  return (
    <div className="flex items-center gap-1">
      {Array(5).fill(0).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < normalizedRating 
              ? "text-yellow-500 fill-yellow-500" 
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">
        {rating}/10
      </span>
    </div>
  );
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
              name="store"
              label=""
              value={storeFilter}
              onChange={(e) => {
                setStoreFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All Stores" },
                ...Array.from(new Set(feedbacks.map(f => f.store.name)))
                  .map(store => ({ 
                    value: store, 
                    label: store 
                  }))
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
      <TableHead>Date</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Store</TableHead>
      <TableHead>Overall Rating</TableHead>
      <TableHead>Feedback</TableHead>
      <TableHead>Purchase</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
<TableBody>
  {feedbacks.map((item) => (
    <TableRow key={item.id}>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">
            {new Date(item.visit_date).toLocaleDateString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(item.created_at).toLocaleTimeString()}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {item.customer.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{item.customer.name}</span>
            <span className="text-xs text-muted-foreground">
              {item.customer.email}
            </span>
            {item.customer.phone && (
              <span className="text-xs text-muted-foreground">
                {item.customer.phone}
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{item.store.name}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {getRatingStars(item.ratings.overall)}
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={item.would_recommend ? "success" : "destructive"}>
              {item.would_recommend ? "Would Recommend" : "Wouldn't Recommend"}
            </Badge>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[200px] space-y-1">
          {item.feedback.product && (
            <div>
              <span className="text-xs font-medium">Product:</span>
              <p className="text-sm truncate" title={item.feedback.product}>
                {item.feedback.product}
              </p>
            </div>
          )}
          {item.feedback.service && (
            <div>
              <span className="text-xs font-medium">Service:</span>
              <p className="text-sm truncate" title={item.feedback.service}>
                {item.feedback.service}
              </p>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={item.purchase.amount ? "success" : "secondary"}>
            {item.purchase.amount ? `${item.purchase.amount} ALL` : 'No Purchase'}
          </Badge>
          <Badge variant={item.purchase.found_product ? "outline" : "secondary"}>
            {item.purchase.found_product ? "Found Product" : "Didn't Find Product"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(item)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
</Table>

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
       { value: "50", label: "50 rows" }
     ]}
   />

   <div className="flex-1 flex items-center justify-center">  
     <Pagination>
       <PaginationContent>
         <PaginationItem>
           <PaginationPrevious
             onClick={() => setPage(Math.max(1, page - 1))}
             disabled={page === 1}
           />
         </PaginationItem>
         {[...Array(5)].map((_, i) => {
           const pageNumber = page <= 3 
             ? i + 1 
             : page >= pagination?.last_page - 2
             ? pagination?.last_page - 4 + i
             : page - 2 + i;
           return (
             <PaginationItem key={i}>
               <PaginationLink
                 isActive={page === pageNumber}
                 onClick={() => setPage(pageNumber)}
               >
                 {pageNumber}
               </PaginationLink>
             </PaginationItem>
           );
         })}
         <PaginationItem>
           <PaginationNext
             onClick={() => setPage(Math.min(pagination?.last_page, page + 1))}
             disabled={page === pagination?.last_page}
           />
         </PaginationItem>
       </PaginationContent>
     </Pagination>
   </div>

   <p className="text-sm text-muted-foreground min-w-[180px] text-right">
     Showing {feedbacks.length} of {pagination?.total || 0} items
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
