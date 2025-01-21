"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  Users,
  BarChart,
  Package,
  Clock,
  ChevronRight,
  Filter,
  Slack,
  Mail,
  ArrowRight,
  PlayCircle,
  Settings,
  Tags,
  Truck,
  CreditCard,
  MessageSquare,
  Boxes
} from "lucide-react";
import { Badge } from "@/components/ui/badge"

const FEATURED_RESOURCES = [
  {
    title: "Order Management",
    description: "Learn to process and manage customer orders efficiently",
    icon: ShoppingCart,
    badge: "Essential",
    color: "bg-blue-500"
  },
  {
    title: "Customer Segmentation",
    description: "Segment customers and create targeted campaigns",
    icon: Users,
    badge: "New",
    color: "bg-purple-500"
  },
  {
    title: "Inventory Management",
    description: "Track and manage your product inventory",
    icon: Package,
    badge: "Updated",
    color: "bg-orange-500"
  },
  {
    title: "Analytics Dashboard",
    description: "Understanding your retail performance metrics",
    icon: BarChart,
    badge: "Popular",
    color: "bg-green-500"
  }
];

const RESOURCE_CATEGORIES = [
  {
    title: "Sales & Orders",
    items: [
      { title: "Processing Orders Guide", views: 12500, time: "5 min", status: "Essential" },
      { title: "Returns Management", views: 8300, time: "8 min", status: "Updated" },
      { title: "Payment Processing", views: 6200, time: "10 min", status: "Popular" }
    ],
    icon: ShoppingCart,
    color: "bg-blue-500/10",
    textColor: "text-blue-500"
  },
  {
    title: "Customer Management",
    items: [
      { title: "Customer Profiles Setup", views: 9800, time: "6 min", status: "New" },
      { title: "Loyalty Program Guide", views: 7400, time: "12 min", status: "Popular" },
      { title: "Customer Support Best Practices", views: 5600, time: "8 min", status: "Essential" }
    ],
    icon: Users,
    color: "bg-purple-500/10",
    textColor: "text-purple-500"
  },
  {
    title: "Products & Inventory",
    items: [
      { title: "Inventory Tracking", views: 15200, time: "7 min", status: "Essential" },
      { title: "Product Catalog Management", views: 11400, time: "10 min", status: "Updated" },
      { title: "Stock Level Automation", views: 8900, time: "8 min", status: "Popular" }
    ],
    icon: Boxes,
    color: "bg-orange-500/10",
    textColor: "text-orange-500"
  }
];

const QUICK_GUIDES = [
  {
    title: "Shipping Setup",
    description: "Configure shipping methods and zones",
    icon: Truck,
    color: "text-blue-500",
    link: "#"
  },
  {
    title: "Payment Methods",
    description: "Manage payment gateways",
    icon: CreditCard,
    color: "text-purple-500",
    link: "#"
  },
  {
    title: "Promotions",
    description: "Create and manage discounts",
    icon: Tags,
    color: "text-orange-500",
    link: "#"
  },
  {
    title: "Store Settings",
    description: "Basic store configuration",
    icon: Settings,
    color: "text-green-500",
    link: "#"
  }
];

const getStatusBadge = (status) => {
  const variants = {
    "New": "bg-green-100 text-green-700",
    "Updated": "bg-blue-100 text-blue-700",
    "Popular": "bg-purple-100 text-purple-700",
    "Essential": "bg-orange-100 text-orange-700"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status] || variants["New"]}`}>
      {status}
    </span>
  );
};

export function Resources() {
  return (
    <div className="space-y-6">
     {/* Header */}
     <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">
            Documentation & Guides
          </h2>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Everything you need to manage your online store and customers effectively. From basic setup to advanced configurations.
          </p>
        </div>
        
        {/* Search Card */}
        <Card>
          <CardHeader>
          <div className="mb-4">
            <h3 className="font-medium">Search Resources</h3>
            <p className="text-sm text-muted-foreground">
            Find guides, tutorials, and documentation that will help your retail business to thrive
            </p>
          </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search guides and tutorials..." 
                  className="pl-9 w-full"
                />
              </div>
              <Button variant="outline" className="sm:w-auto w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      

      {/* Featured Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_RESOURCES.map((resource) => (
          <Card 
            key={resource.title}
            className="group hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${resource.color} bg-opacity-10`}>
                    <resource.icon className={`h-6 w-6 ${resource.color}`} />
                  </div>
                  {getStatusBadge(resource.badge)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {resource.description}
                  </p>
                </div>
                <div className="flex items-center text-sm text-primary">
                  <span className="mr-2">View guide</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Setup Guides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Quick Setup Guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_GUIDES.map((guide) => (
              <div
                key={guide.title}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <guide.icon className={`h-5 w-5 ${guide.color}`} />
                </div>
                <div>
                  <h4 className="font-medium">{guide.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Resource Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {RESOURCE_CATEGORIES.map((category) => (
          <Card key={category.title} className="overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${category.color}`}>
                    <category.icon className={`h-5 w-5 ${category.textColor}`} />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-sm">
                  View all
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div 
                    key={item.title}
                    className="group flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {item.views.toLocaleString()} views
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.time}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Additional Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Live Chat Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get real-time assistance from our team
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <div className="p-2 rounded-lg bg-[#571EFE]/10">
                <Slack className="h-5 w-5 text-[#571EFE]" />
              </div>
              <div>
                <h4 className="font-medium">Merchant Community</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with other store owners
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <div className="p-2 rounded-lg bg-[#EA4335]/10">
                <Mail className="h-5 w-5 text-[#EA4335]" />
              </div>
              <div>
                <h4 className="font-medium">Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  Send us your detailed questions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        {/* Add bottom spacing */}
        <div className="h-8"></div>
    </div>
  );
}

export default Resources;