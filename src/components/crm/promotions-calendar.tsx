"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromoCalendar } from "@/components/ui/promo-calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarPlus,
  CalendarRange,
  Filter,
  Tag,
  CircleDollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PromotionEvent {
  id: string;
  name: string;
  type: "discount" | "coupon" | "flash_sale" | "seasonal" | "bundle";
  startDate: Date;
  endDate: Date;
  status: "active" | "scheduled" | "ended";
  value: string;
}

const DUMMY_EVENTS: PromotionEvent[] = [
  {
    id: "1",
    name: "Summer Sale",
    type: "seasonal",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 7, 31),
    status: "scheduled",
    value: "25% OFF"
  },
  {
    id: "2",
    name: "Flash Deal - Electronics",
    type: "flash_sale",
    startDate: new Date(2024, 5, 15),
    endDate: new Date(2024, 5, 16),
    status: "scheduled",
    value: "40% OFF"
  },
  {
    id: "3",
    name: "Welcome Discount",
    type: "coupon",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    status: "active",
    value: "15% OFF"
  }
];

const EVENT_TYPES = [
  { type: "flash_sale", label: "Flash Sales", color: "bg-red-500" },
  { type: "seasonal", label: "Seasonal", color: "bg-amber-500" },
  { type: "coupon", label: "Coupons", color: "bg-green-500" },
  { type: "discount", label: "Discounts", color: "bg-blue-500" },
  { type: "bundle", label: "Bundles", color: "bg-purple-500" }
];

export function PromotionsCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [events] = useState<PromotionEvent[]>(DUMMY_EVENTS);
  const [typeFilter, setTypeFilter] = useState("all");

  const handleEventClick = (event: PromotionEvent) => {
    // Handle event click
    console.log('Event clicked:', event);
  };

  const handleEventEdit = (event: PromotionEvent) => {
    // Handle event edit
    console.log('Edit event:', event);
  };

  const handleEventDelete = (event: PromotionEvent) => {
    // Handle event delete
    console.log('Delete event:', event);
  };

  const filteredEvents = typeFilter === 'all' 
    ? events 
    : events.filter(event => event.type === typeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promotions Calendar</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Plan and visualize your promotional events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <CalendarRange className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button size="sm">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Running now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">This quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2</div>
            <p className="text-xs text-muted-foreground mt-1">Days per event</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Card */}
<Card>

  <CardContent className="p-0 mb-2 flex justify-between">
    <div className=" items-center justify-between gap-4">
    <div className="mb-1">
      <h3 className="font-medium">Filter Events</h3>
      <p className="text-sm text-muted-foreground">
        Search and filter through promotional events
      </p>
    </div>
    </div>
    <div className="flex items-center justify-end gap-6 p-4">
      {EVENT_TYPES.map(({ type, label, color }) => (
        <div key={type} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  </CardContent>
  <CardContent>
    {/* // TODO: solution for this */}
    {/* <PromoCalendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      events={filteredEvents}
      onEventClick={handleEventClick}
    /> */}
  </CardContent>
</Card>

    </div>
  );
}

export default PromotionsCalendar;