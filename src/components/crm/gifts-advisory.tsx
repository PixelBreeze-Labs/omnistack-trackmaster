"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Gift,
  TrendingUp,
  Sparkles,
  BadgeCheck,
  Calendar,
  Download,
  RefreshCcw,
  Filter,
  ChevronRight,
  User,
  Clock,
  Heart,
  Star
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";

// Dummy data for recommendations
const DUMMY_RECOMMENDATIONS = Array.from({ length: 10 }, (_, i) => ({
  id: `REC-${i + 1}`,
  customer: {
    name: `Customer ${i + 1}`,
    avatar: null,
    preferences: ['Electronics', 'Fashion', 'Home'][Math.floor(Math.random() * 3)]
  },
  occasion: ['Birthday', 'Anniversary', 'Holiday'][Math.floor(Math.random() * 3)],
  budget: Math.floor(Math.random() * 50000) + 10000,
  suggestedItems: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
    id: `ITEM-${i}-${j}`,
    name: ['Luxury Watch', 'Designer Bag', 'Smart Device', 'Gift Card'][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * 40000) + 5000,
    matchScore: Math.floor(Math.random() * 30) + 70
  })),
  status: ['PENDING', 'ACCEPTED', 'COMPLETED'][Math.floor(Math.random() * 3)],
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString()
}));

// Dummy data for trending gifts
const DUMMY_TRENDING = Array.from({ length: 6 }, (_, i) => ({
  id: `TREND-${i + 1}`,
  name: ['Smart Watch', 'Designer Handbag', 'Wireless Earbuds', 'Premium Wallet', 'Gift Set', 'Gift Card'][i],
  category: ['Electronics', 'Fashion', 'Accessories'][Math.floor(Math.random() * 3)],
  price: Math.floor(Math.random() * 50000) + 5000,
  popularity: Math.floor(Math.random() * 50) + 50,
  matchRate: Math.floor(Math.random() * 20) + 80,
  image: null
}));

// Dummy data for upcoming occasions
const DUMMY_OCCASIONS = Array.from({ length: 5 }, (_, i) => ({
  id: `OCC-${i + 1}`,
  customer: {
    name: `Customer ${i + 1}`,
    avatar: null
  },
  occasion: ['Birthday', 'Anniversary', 'Holiday'][Math.floor(Math.random() * 3)],
  date: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
  previousGifts: ['Watch', 'Bag', 'Electronics'][Math.floor(Math.random() * 3)],
  budget: Math.floor(Math.random() * 50000) + 10000
}));

export function GiftsAdvisory() {
  const [activeTab, setActiveTab] = useState("recommendations");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "warning",
      ACCEPTED: "success",
      COMPLETED: "default"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gifts Advisory</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Personalized gift recommendations for your customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Gift className="mr-2 h-4 w-4" />
            New Recommendation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Of recommendations accepted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Gift Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5K ALL</div>
            <p className="text-xs text-muted-foreground mt-1">Per recommendation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suggestions</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Pending recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground mt-1">In next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="recommendations" className="flex-1">
                <Gift className="mr-2 h-4 w-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending Gifts
              </TabsTrigger>
              <TabsTrigger value="occasions" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Occasions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recommendations" className="m-0 border-t">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recommendations..."
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
                    { value: "pending", label: "Pending" },
                    { value: "accepted", label: "Accepted" },
                    { value: "completed", label: "Completed" }
                  ]}
                />
                <InputSelect
                  name="priceRange"
                  label=""
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  options={[
                    { value: "all", label: "All Prices" },
                    { value: "low", label: "Under 10K" },
                    { value: "medium", label: "10K - 50K" },
                    { value: "high", label: "Over 50K" }
                  ]}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Recommendations Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Occasion</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Suggested Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_RECOMMENDATIONS.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={rec.customer.avatar} />
                          <AvatarFallback>{rec.customer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="font-medium">{rec.customer.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Prefers {rec.customer.preferences}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{rec.occasion}</Badge>
                    </TableCell>
                    <TableCell>{rec.budget.toLocaleString()} ALL</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {rec.suggestedItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="text-sm">{item.name}</div>
                            <Badge variant="secondary">{item.matchScore}% match</Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(rec.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(rec.createdAt).toLocaleDateString()}
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
                            case "edit":
                              // Handle edit recommendation
                              break;
                            case "update":
                              // Handle update status
                              break;
                          }
                        }}
                        options={[
                          { value: "", label: "Actions" },
                          { value: "view", label: "View Details" },
                          { value: "edit", label: "Edit Recommendation" },
                          { value: "update", label: "Update Status" },
                          { value: "archive", label: "Archive" }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="trending" className="m-0 border-t">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trending gifts..."
                    className="pl-8"
                  />
                </div>
                <InputSelect
                  name="category"
                  label=""
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: "all", label: "All Categories" },
                    { value: "electronics", label: "Electronics" },
                    { value: "fashion", label: "Fashion" },
                    { value: "accessories", label: "Accessories" }
                  ]}
                />
              </div>
            </div>

          {/* Trending Gifts Grid */}
          <div className="p-6 grid gap-6 md:grid-cols-3">
              {DUMMY_TRENDING.map((gift) => (
                <Card key={gift.id} className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg bg-muted mb-4 flex items-center justify-center">
                      <Gift className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{gift.name}</h4>
                        <Badge variant="secondary">{gift.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{gift.price.toLocaleString()} ALL</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{gift.matchRate}% match rate</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{gift.popularity}% popularity</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="occasions" className="m-0 border-t">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search upcoming occasions..."
                    className="pl-8"
                  />
                </div>
                <InputSelect
                  name="occasion"
                  label=""
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: "all", label: "All Occasions" },
                    { value: "birthday", label: "Birthdays" },
                    { value: "anniversary", label: "Anniversaries" },
                    { value: "holiday", label: "Holidays" }
                  ]}
                />
              </div>
            </div>

            {/* Upcoming Occasions List */}
            <div className="divide-y">
              {DUMMY_OCCASIONS.map((occasion) => (
                <div key={occasion.id} className="p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={occasion.customer.avatar} />
                        <AvatarFallback>{occasion.customer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{occasion.customer.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{occasion.occasion}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(occasion.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Budget: {occasion.budget.toLocaleString()} ALL</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Previous gift: {occasion.previousGifts}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}