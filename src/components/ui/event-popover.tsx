import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarEvent } from "@/components/ui/promo-calendar"
import { Clock, CircleDollarSign, Edit, Trash2 } from 'lucide-react'

interface EventPopoverProps {
  event: CalendarEvent
  children: React.ReactNode
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
}

export function EventPopover({ event, children, onEdit, onDelete }: EventPopoverProps) {
  const getEventColor = (type: string) => {
    const colors = {
      discount: "bg-blue-50 text-blue-700 border-blue-200",
      coupon: "bg-green-50 text-green-700 border-green-200",
      flash_sale: "bg-red-50 text-red-700 border-red-200",
      seasonal: "bg-amber-50 text-amber-700 border-amber-200",
      bundle: "bg-purple-50 text-purple-700 border-purple-200"
    }
    return colors[type] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{event.title}</h4>
            <Badge 
              variant="secondary" 
              className={`capitalize ${getEventColor(event.type)}`}
            >
              {event.type.replace('_', ' ')}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm gap-2">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{event.value}</span>
            </div>
            <div className="flex items-center text-sm gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(event.startDate).toLocaleDateString()} - 
                {new Date(event.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit?.(event)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive"
              onClick={() => onDelete?.(event)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}