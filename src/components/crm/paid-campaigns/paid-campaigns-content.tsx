"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { RefreshCcw, Download, TrendingUp, Eye, ShoppingCart, DollarSign, Plus, Search } from 'lucide-react';
import InputSelect from '@/components/Common/InputSelect';
import Link from 'next/link';
import { usePaidCampaigns } from '@/hooks/usePaidCampaigns';
import { PaidCampaignForm } from './PaidCampaignForm';

export default function PaidCampaignsComponent() {
  const { isLoading, campaigns, totalItems, totalPages, overview, fetchCampaigns, fetchOverview, createCampaign } = usePaidCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [campaignFormOpen, setCampaignFormOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');

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
          <h2 className="text-2xl font-bold tracking-tight">Paid Campaigns</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track and analyze your paid marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setCampaignFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.viewCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cart Actions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.cartCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.purchaseCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Conv. Rate: {overview.conversionRate}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Filter */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="font-medium">Filter Campaigns</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your campaigns
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative mt-3 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <InputSelect
              name="source"
              label=""
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              options={[
                { value: "all", label: "All Sources" },
                { value: "facebook", label: "Facebook" },
                { value: "google", label: "Google" },
                { value: "instagram", label: "Instagram" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Add to Carts</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <RefreshCcw className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <TrendingUp className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No Campaigns Found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchTerm
                          ? "No campaigns match your search criteria. Try adjusting your filters."
                          : "Start tracking your paid campaigns to analyze their performance."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign._id}>
                    <TableCell className="font-medium">{campaign.utmCampaign}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.utmSource}</Badge>
                    </TableCell>
                    <TableCell>{campaign.utmMedium}</TableCell>
                    <TableCell>{campaign.utmContent || '-'}</TableCell>
                    <TableCell>{campaign.stats?.viewCount || 0}</TableCell>
                    <TableCell>{campaign.stats?.cartCount || 0}</TableCell>
                    <TableCell>{campaign.stats?.purchaseCount || 0}</TableCell>
                    <TableCell>{campaign.stats?.revenue?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/crm/platform/paid-campaigns/${campaign._id}`}>
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
      <PaidCampaignForm
        open={campaignFormOpen}
        onClose={() => setCampaignFormOpen(false)}
        onSubmit={createCampaign}
        title="Create New Campaign"
      />
       <div className="h-4"></div>
    </div>
  );
}