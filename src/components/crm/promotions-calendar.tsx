"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export function PromotionsCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [events] = useState<PromotionEvent[]>(DUMMY_EVENTS);
  const [view, setView] = useState<"month" | "week">("month");
  const [typeFilter, setTypeFilter] = useState("all");

  const getEventTypeColor = (type: string) => {
    const colors = {
      discount: "bg-blue-100 text-blue-800 border-blue-300",
      coupon: "bg-green-100 text-green-800 border-green-300",
      flash_sale: "bg-red-100 text-red-800 border-red-300",
      seasonal: "bg-amber-100 text-amber-800 border-amber-300",
      bundle: "bg-purple-100 text-purple-800 border-purple-300"
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getDayContent = (day: Date) => {
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return day >= eventStart && day <= eventEnd;
    });

    if (dayEvents.length === 0) return null;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="absolute bottom-0 left-0 right-0 p-1">
            <div className="flex flex-wrap gap-0.5">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className={`w-2 h-2 rounded-full ${
                    event.type === 'flash_sale' ? 'bg-red-500' :
                    event.type === 'seasonal' ? 'bg-amber-500' :
                    event.type === 'coupon' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h4 className="font-medium">
              {day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </h4>
            <div className="space-y-1">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-2 rounded-md border ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{event.name}</span>
                    <Badge variant="outline" className="capitalize">
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm mt-1 flex items-center gap-2">
                    <CircleDollarSign className="h-3 w-3" />
                    {event.value}
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

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
        <CardHeader className="space-y-0">
          <div className="flex items-center justify-between space-y-2">
            <CardTitle>Calendar View</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="discount">Discounts</SelectItem>
                  <SelectItem value="coupon">Coupons</SelectItem>
                  <SelectItem value="flash_sale">Flash Sales</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="bundle">Bundles</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm">Flash Sales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm">Seasonal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Coupons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm">Discounts</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => getDayContent(date)
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default PromotionsCalendar;