"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  Search, 
  Megaphone,
  Users,
  Target,
  TrendingUp,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Ban,
  Eye,
  BarChart3,
  Mail,
  Share2
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import InputSelect from "@/components/Common/InputSelect";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "social" | "display" | "referral";
  status: "draft" | "running" | "paused" | "completed";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  engagement: number;
  conversion: number;
  audience: string;
  description: string;
  channels: string[];
}

const DUMMY_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Summer Collection Launch",
    type: "email",
    status: "running",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    budget: 50000,
    spent: 24500,
    reach: 25000,
    engagement: 42.5,
    conversion: 3.8,
    audience: "All Customers",
    description: "New summer collection promotional campaign",
    channels: ["email", "instagram", "facebook"]
  },
  {
    id: "2",
    name: "Referral Program Q2",
    type: "referral",
    status: "running",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    budget: 75000,
    spent: 45000,
    reach: 15000,
    engagement: 68.2,
    conversion: 12.4,
    audience: "Existing Customers",
    description: "Customer referral rewards program",
    channels: ["email", "app", "sms"]
  },
  {
    id: "3",
    name: "Holiday Season Preview",
    type: "social",
    status: "draft",
    startDate: "2024-11-15",
    endDate: "2024-12-31",
    budget: 100000,
    spent: 0,
    reach: 0,
    engagement: 0,
    conversion: 0,
    audience: "All Segments",
    description: "Holiday collection early access campaign",
    channels: ["instagram", "facebook", "tiktok"]
  }
];

export function CampaignsList() {
  const [campaigns] = useState<Campaign[]>(DUMMY_CAMPAIGNS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableActions, setTableActions] = useState<Record<string, string>>({});
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter campaigns based on search term and filters
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      const matchesType = typeFilter === "all" || campaign.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  // Calculate pagination
  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredCampaigns.slice(start, end);
  }, [filteredCampaigns, page, pageSize]);

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      running: "success",
      paused: "warning",
      completed: "default"
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "instagram":
      case "facebook":
      case "tiktok":
        return <Share2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ALL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marketing Campaigns</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Plan, manage and track your marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "running").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(campaigns.reduce((sum, c) => sum + c.reach, 0) / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">Audience reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(campaigns.reduce((sum, c) => sum + c.conversion, 0) / campaigns.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((campaigns.reduce((sum, c) => sum + c.spent, 0) / 
                campaigns.reduce((sum, c) => sum + c.budget, 0)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Of total budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <div className="mb-1">
            <h3 className="font-medium">Filter Campaigns</h3>
            <p className="text-sm text-muted-foreground">
              Search and filter through your marketing campaigns
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-2 max-w-3xl">
              <div className="relative mt-2 flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <InputSelect
                name="status"
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "draft", label: "Draft" },
                  { value: "running", label: "Running" },
                  { value: "paused", label: "Paused" },
                  { value: "completed", label: "Completed" }
                ]}
              />
              <InputSelect
                name="type"
                label=""
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "email", label: "Email" },
                  { value: "social", label: "Social Media" },
                  { value: "display", label: "Display Ads" },
                  { value: "referral", label: "Referral" }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {campaign.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(campaign.startDate).toLocaleDateString()} -
                      <br />
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {campaign.engagement}% engagement
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.conversion}% conversion
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {campaign.reach.toLocaleString()} users
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target: {campaign.audience}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {formatBudget(campaign.spent)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        of {formatBudget(campaign.budget)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {campaign.channels.map((channel, index) => (
                        <div
                          key={channel}
                          className="h-8 w-8 rounded-full bg-background border-2 border-muted flex items-center justify-center"
                          style={{ zIndex: 10 - index }}
                        >
                          {getChannelIcon(channel)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                   <InputSelect
                    name="action"
                    label=""
                    value={tableActions[campaign.id] || "select"}
                    onChange={(e) => setTableActions(prev => ({
                      ...prev,
                      [campaign.id]: e.target.value
                    }))}
                    options={[
                    { value: "select", label: "Select Action" },
                    { value: "view", label: "View Details" }, 
                    { value: "analytics", label: "Analytics" },
                    { value: "edit", label: "Edit" },
                    { value: "duplicate", label: "Duplicate" },
                    { value: "pause", label: "Pause" },
                    { value: "delete", label: "Delete" }
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
              {[...Array(Math.min(5, Math.ceil(campaigns.length / pageSize)))].map((_, i) => (
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
                  onClick={() => setPage(p => Math.min(Math.ceil(campaigns.length / pageSize), p + 1))}
                  disabled={page === Math.ceil(campaigns.length / pageSize)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <p className="text-sm text-muted-foreground min-w-[180px] text-right">
          Showing <span className="font-medium">{pageSize}</span> of{" "}
          <span className="font-medium">{campaigns.length}</span> discounts
        </p>
      </div>
      </div>
        </CardContent>
      </Card>
       {/* Add empty space div at the bottom */}
  <div className="h-8"></div>
    </div>
  );
}

export default CampaignsList;