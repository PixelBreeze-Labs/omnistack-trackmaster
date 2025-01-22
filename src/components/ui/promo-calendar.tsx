"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface CalendarEvent {
  id: string;
  title: string;
  type: "discount" | "coupon" | "flash_sale" | "seasonal" | "bundle";
  startDate: Date;
  endDate: Date;
  status: "active" | "scheduled" | "ended";
  value: string;
}

interface PromoCalendarProps extends React.ComponentProps<typeof DayPicker> {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

function PromoCalendar({
  className,
  classNames,
  showOutsideDays = true,
  events = [],
  onEventClick,
  ...props
}: PromoCalendarProps) {
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return day >= start && day <= end;
    });
  };

  const renderDay = (day: Date) => {
    const dayEvents = getEventsForDay(day);

    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <div className="text-xs font-medium">{day.getDate()}</div>
        {dayEvents.length > 0 && (
          <div className="flex gap-1 mt-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "w-2 h-2 rounded-full",
                  {
                    "bg-blue-500": event.type === "discount",
                    "bg-green-500": event.type === "coupon",
                    "bg-red-500": event.type === "flash_sale",
                    "bg-amber-500": event.type === "seasonal",
                    "bg-purple-500": event.type === "bundle",
                  }
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "grid grid-cols-1 gap-4",
        month: "space-y-4",
        caption: "flex justify-between items-center mb-2",
        caption_label: "text-lg font-semibold",
        nav: "flex items-center space-x-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 flex items-center justify-center"
        ),
        table: "w-full border-collapse text-center",
        head_row: "grid grid-cols-7 gap-0.5",
        head_cell: "text-sm font-medium text-center w-full h-10",
        row: "grid grid-cols-7 gap-0.5",
        cell: "w-full h-12 text-center relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-full flex items-center justify-center"
        ),
        day_selected: "bg-primary text-white",
        day_today: "bg-accent text-white",
        day_outside: "text-muted-foreground opacity-50",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ date }) => renderDay(date),
      }}
      {...props}
    />
  );
}

PromoCalendar.displayName = "PromoCalendar";

export { PromoCalendar };
