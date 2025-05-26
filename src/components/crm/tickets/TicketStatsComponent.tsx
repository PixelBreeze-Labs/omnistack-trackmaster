// components/support/tickets/TicketStatsComponent.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TicketIcon,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { TicketStats } from "@/app/api/external/omnigateway/types/tickets";

interface TicketStatsComponentProps {
  stats: TicketStats;
  isLoading?: boolean;
}

export function TicketStatsComponent({ stats, isLoading = false }: TicketStatsComponentProps) {
  const totalActiveTickets = stats.open + stats.inProgress;
  const resolutionRate = stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0;
  
  const priorityEntries = Object.entries(stats.byPriority).sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return (priorityOrder[b[0] as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a[0] as keyof typeof priorityOrder] || 0);
  });

  const categoryEntries = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💳';
      case 'bug': return '🐛';
      case 'feature_request': return '💡';
      case 'account': return '👤';
      case 'training': return '📚';
      default: return '❓';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{stats.closed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resolution Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{resolutionRate.toFixed(1)}%</span>
                <Badge variant={resolutionRate > 80 ? "success" : resolutionRate > 60 ? "warning" : "destructive"}>
                  {resolutionRate > 80 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : resolutionRate > 60 ? (
                    <Minus className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {resolutionRate > 80 ? 'Good' : resolutionRate > 60 ? 'Fair' : 'Poor'}
                </Badge>
              </div>
              <Progress value={resolutionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.resolved} of {stats.total} tickets resolved
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Workload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalActiveTickets}</span>
                <Badge variant="outline">
                  {totalActiveTickets > 50 ? 'High' : totalActiveTickets > 20 ? 'Medium' : 'Low'}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open</span>
                  <span>{stats.open}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">In Progress</span>
                  <span>{stats.inProgress}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priorityEntries.map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
                    <span className="text-sm capitalize">{priority}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categoryEntries.map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="text-2xl mb-1">{getCategoryIcon(category)}</div>
                <div className="text-lg font-bold">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {category.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}