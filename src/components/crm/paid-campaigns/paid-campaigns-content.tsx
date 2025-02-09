"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RefreshCcw } from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import Link from "next/link";
import { usePaidCampaigns } from "@/hooks/usePaidCampaigns";

export default function PaidCampaignsComponent() {
  const { isLoading, campaigns, totalItems, totalPages, overview, fetchCampaigns, fetchOverview } = usePaidCampaigns();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchCampaigns({
      page,
      limit: pageSize,
      search: searchTerm,
    });
    fetchOverview();
  }, [fetchCampaigns, fetchOverview, page, pageSize, searchTerm]);

  const handleRefresh = () => {
    fetchCampaigns({
      page,
      limit: pageSize,
      search: searchTerm,
    });
    fetchOverview();
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your campaigns and view performance overview
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.viewCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Add to Carts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.cartCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.purchaseCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overview.revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Filter */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCcw className="h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No campaigns found.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell>{campaign.utmCampaign}</TableCell>
                    <TableCell>{campaign.utmSource}</TableCell>
                    <TableCell>{campaign.utmMedium}</TableCell>
                    <TableCell>{campaign.utmContent || '-'}</TableCell>
                    <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/crm/campaigns/${campaign._id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
                  { value: "50", label: "50 rows" },
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
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
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <p className="text-sm text-muted-foreground min-w-[180px] text-right">
                Showing {campaigns.length} of {totalItems} campaigns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
