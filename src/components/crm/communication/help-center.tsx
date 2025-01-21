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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer,
  Filter,
  Download,
  Plus,
  MessageSquare,
  BookOpen,
  ChevronRight,
  MessagesSquare
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";

// Dummy data arrays remain the same as in your original code
const DUMMY_TICKETS = Array.from({ length: 10 }, (_, i) => ({
  id: `TKT-2024-${String(i + 1).padStart(3, '0')}`,
  subject: ['Order Issue', 'Payment Problem', 'Product Question', 'Shipping Delay'][Math.floor(Math.random() * 4)],
  customer: {
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    avatar: null
  },
  status: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'PENDING'][Math.floor(Math.random() * 4)],
  priority: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
  category: ['Orders', 'Payments', 'Products', 'Shipping'][Math.floor(Math.random() * 4)],
  assignedTo: `Agent ${Math.floor(Math.random() * 5) + 1}`,
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
  lastUpdated: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString()
}));

const DUMMY_FAQS = [
  {
    category: "Orders & Shipping",
    questions: [
      { id: 1, question: "How do I track my order?", views: 1250, link: "#" },
      { id: 2, question: "What is your return policy?", views: 980, link: "#" },
      { id: 3, question: "How long does shipping take?", views: 1500, link: "#" }
    ]
  },
  {
    category: "Payments & Refunds",
    questions: [
      { id: 4, question: "What payment methods do you accept?", views: 2100, link: "#" },
      { id: 5, question: "How do I request a refund?", views: 1750, link: "#" },
      { id: 6, question: "Are my payment details secure?", views: 890, link: "#" }
    ]
  },
  {
    category: "Account & Profile",
    questions: [
      { id: 7, question: "How do I change my password?", views: 1680, link: "#" },
      { id: 8, question: "Can I merge multiple accounts?", views: 920, link: "#" },
      { id: 9, question: "How to update billing information?", views: 1450, link: "#" }
    ]
  }
];

const DUMMY_ARTICLES = [
  {
    category: "Getting Started",
    articles: [
      { id: 1, title: "Platform Overview", views: 2500, readTime: "5 min" },
      { id: 2, title: "Account Setup Guide", views: 1800, readTime: "8 min" },
      { id: 3, title: "Basic Navigation", views: 2200, readTime: "3 min" }
    ]
  },
  {
    category: "Advanced Features",
    articles: [
      { id: 4, title: "Custom Reports", views: 1200, readTime: "12 min" },
      { id: 5, title: "API Integration", views: 980, readTime: "15 min" },
      { id: 6, title: "Automation Rules", views: 1500, readTime: "10 min" }
    ]
  }
];

export function HelpCenter() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getStatusBadge = (status: string) => {
    const variants = {
      OPEN: "warning",
      IN_PROGRESS: "default",
      RESOLVED: "success",
      PENDING: "secondary"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      HIGH: "destructive",
      MEDIUM: "warning",
      LOW: "secondary"
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedTickets = DUMMY_TICKETS.slice(startIndex, endIndex);

  const renderTicketsTable = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative mt-3 flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
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
              { value: "open", label: "Open" },
              { value: "in_progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" },
              { value: "pending", label: "Pending" }
            ]}
          />
          <InputSelect
            name="priority"
            label=""
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: "all", label: "All Priority" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" }
            ]}
          />
          <Button className='mt-2' variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className='mt-2' variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket Info</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <div className="space-y-0.5">
                  <div className="font-medium">{ticket.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {ticket.subject}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={ticket.customer.avatar} />
                    <AvatarFallback>{ticket.customer.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{ticket.customer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.customer.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell>{ticket.assignedTo}</TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <div className="text-sm">
                    {new Date(ticket.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(ticket.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <InputSelect
                  name="actions"
                  label=""
                  value=""
                  onChange={(e) => {
                    // Handle different actions
                    switch(e.target.value) {
                      case "view":
                        // Handle view details
                        break;
                      case "update":
                        // Handle update status
                        break;
                      case "assign":
                        // Handle assign agent
                        break;
                    }
                  }}
                  options={[
                    { value: "", label: "Actions" },
                    { value: "view", label: "View Details" },
                    { value: "update", label: "Update Status" },
                    { value: "assign", label: "Assign Agent" },
                    { value: "reply", label: "Reply to Customer" },
                    { value: "close", label: "Close Ticket" }
                  ]}
                />
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
                {[...Array(Math.min(5, Math.ceil(DUMMY_TICKETS.length / pageSize)))].map((_, i) => (
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
                    onClick={() => setPage(p => Math.min(Math.ceil(DUMMY_TICKETS.length / pageSize), p + 1))}
                    disabled={page === Math.ceil(DUMMY_TICKETS.length / pageSize)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <p className="text-sm text-muted-foreground min-w-[180px] text-right">
            Showing <span className="font-medium">{displayedTickets.length}</span> of{" "}
            <span className="font-medium">{DUMMY_TICKETS.length}</span> tickets
          </p>
        </div>
      </div>
    </>
  );

  const renderFAQs = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="mt-3 relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search frequently asked questions..."
              className="pl-8"
            />
          </div>
          <InputSelect
            name="category"
            label=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "all", label: "All Categories" },
              { value: "orders", label: "Orders & Shipping" },
              { value: "payments", label: "Payments & Refunds" },
              { value: "account", label: "Account & Profile" }
            ]}
          />
        </div>
      </div>
      <div className="divide-y">
        {DUMMY_FAQS.map((section) => (
          <div key={section.category} className="p-6">
            <h3 className="font-medium text-lg mb-4">{section.category}</h3>
            <div className="grid gap-3">
              {section.questions.map((faq) => (
                <Card key={faq.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                          {faq.category === "Orders & Shipping" ? (
                            <MessagesSquare className="h-5 w-5 text-primary" />
                          ) : faq.category === "Payments & Refunds" ? (
                            <Timer className="h-5 w-5 text-primary" />
                          ) : (
                            <HelpCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-lg group-hover:text-primary transition-colors">{faq.question}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MessageSquare className="h-4 w-4 mr-1.5" />
                              {faq.views.toLocaleString()} views
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="text-sm text-muted-foreground">
                              Last updated 2 days ago
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderKnowledgeBase = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative mt-3 flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base articles..."
              className="pl-8"
            />
          </div>
          <InputSelect
            name="category"
            label=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "all", label: "All Categories" },
              { value: "getting-started", label: "Getting Started" },
              { value: "advanced", label: "Advanced Features" }
            ]}
          />
        </div>
      </div>
      <div className="p-6 grid gap-6">
        {DUMMY_ARTICLES.map((section) => (
          <div key={section.category}>
            <h3 className="font-medium text-lg mb-4">{section.category}</h3>
            <div className="grid gap-4">
              {section.articles.map((article) => (
                <Card key={article.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                          {article.category === "Getting Started" ? (
                            <BookOpen className="h-5 w-5 text-primary" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-lg group-hover:text-primary transition-colors">{article.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MessageSquare className="h-4 w-4 mr-1.5" />
                              {article.views.toLocaleString()} views
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1.5" />
                              {article.readTime} read
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="text-sm text-muted-foreground">
                              Updated recently
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Help Center</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage support tickets and help resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground mt-1">12 high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground mt-1">Based on 256 ratings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="p-0">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="tickets" className="flex-1">
                  <MessagesSquare className="mr-2 h-4 w-4" />
                  Support Tickets
                </TabsTrigger>
                <TabsTrigger value="faqs" className="flex-1">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex-1">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Knowledge Base
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tickets" className="m-0">
              {renderTicketsTable()}
            </TabsContent>

            <TabsContent value="faqs" className="m-0">
              {renderFAQs()}
            </TabsContent>

            <TabsContent value="articles" className="m-0">
              {renderKnowledgeBase()}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}