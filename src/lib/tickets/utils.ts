// lib/tickets/utils.ts

import { TicketStatus, TicketPriority, TicketCategory } from "@/app/api/external/omnigateway/types/tickets";

export const TICKET_STATUS_OPTIONS = [
  { value: TicketStatus.OPEN, label: "Open", color: "blue" },
  { value: TicketStatus.IN_PROGRESS, label: "In Progress", color: "orange" },
  { value: TicketStatus.RESOLVED, label: "Resolved", color: "green" },
  { value: TicketStatus.CLOSED, label: "Closed", color: "gray" },
  { value: TicketStatus.DUPLICATE, label: "Duplicate", color: "purple" },
];

export const TICKET_PRIORITY_OPTIONS = [
  { value: TicketPriority.LOW, label: "Low", color: "gray", weight: 1 },
  { value: TicketPriority.MEDIUM, label: "Medium", color: "blue", weight: 2 },
  { value: TicketPriority.HIGH, label: "High", color: "orange", weight: 3 },
  { value: TicketPriority.URGENT, label: "Urgent", color: "red", weight: 4 },
];

export const TICKET_CATEGORY_OPTIONS = [
  { value: TicketCategory.TECHNICAL, label: "Technical", icon: "🔧" },
  { value: TicketCategory.BILLING, label: "Billing", icon: "💳" },
  { value: TicketCategory.BUG, label: "Bug Report", icon: "🐛" },
  { value: TicketCategory.FEATURE_REQUEST, label: "Feature Request", icon: "💡" },
  { value: TicketCategory.ACCOUNT, label: "Account", icon: "👤" },
  { value: TicketCategory.TRAINING, label: "Training", icon: "📚" },
  { value: TicketCategory.OTHER, label: "Other", icon: "❓" },
];

export const getStatusOption = (status: TicketStatus) => {
  return TICKET_STATUS_OPTIONS.find(option => option.value === status);
};

export const getPriorityOption = (priority: TicketPriority) => {
  return TICKET_PRIORITY_OPTIONS.find(option => option.value === priority);
};

export const getCategoryOption = (category: TicketCategory) => {
  return TICKET_CATEGORY_OPTIONS.find(option => option.value === category);
};

export const formatTicketId = (id: string) => {
  return `#${id.slice(-8).toUpperCase()}`;
};

export const getTimeSinceCreated = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();
  
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const getPriorityWeight = (priority: TicketPriority): number => {
  const option = getPriorityOption(priority);
  return option?.weight || 1;
};

export const sortTicketsByPriority = (tickets: any[]) => {
  return [...tickets].sort((a, b) => {
    const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    
    // If same priority, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getTicketSLA = (priority: TicketPriority, createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  
  let slaHours: number;
  switch (priority) {
    case TicketPriority.URGENT:
      slaHours = 2;
      break;
    case TicketPriority.HIGH:
      slaHours = 8;
      break;
    case TicketPriority.MEDIUM:
      slaHours = 24;
      break;
    case TicketPriority.LOW:
    default:
      slaHours = 72;
      break;
  }
  
  const remainingHours = slaHours - diffInHours;
  const isBreached = remainingHours < 0;
  
  return {
    slaHours,
    elapsedHours: diffInHours,
    remainingHours: Math.max(0, remainingHours),
    isBreached,
    percentage: Math.min(100, (diffInHours / slaHours) * 100)
  };
};

export const filterTicketsByText = (tickets: any[], searchText: string) => {
  if (!searchText.trim()) return tickets;
  
  const searchLower = searchText.toLowerCase();
  return tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchLower) ||
    ticket.description.toLowerCase().includes(searchLower) ||
    ticket.createdByName.toLowerCase().includes(searchLower) ||
    ticket.createdByEmail.toLowerCase().includes(searchLower) ||
    (ticket.business?.name && ticket.business.name.toLowerCase().includes(searchLower)) ||
    (ticket.assignedTo && ticket.assignedTo.toLowerCase().includes(searchLower)) ||
    ticket.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
  );
};