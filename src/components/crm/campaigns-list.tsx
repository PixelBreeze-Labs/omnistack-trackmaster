"use client";

import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [typeFilter, setTypeFilter] = useState("all");

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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground mt-1">Audience reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-muted-foreground mt-1">Across campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Of total budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Campaigns</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="display">Display Ads</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default CampaignsList;