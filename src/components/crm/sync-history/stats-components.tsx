// components for Task Assignment, Employee Stats, and AI Auto-Assignment tabs

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AlertCircle, Bot, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BusinessStatsList from "./business-stats-list";

// Task Assignment Stats Component
export const TaskAssignmentStats = ({ taskStats }) => {
  if (!taskStats || !taskStats.businessStats || taskStats.businessStats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No task assignment data available</p>
      </div>
    );
  }
  
  // Prepare data for charts
  const statusData = [
    { name: 'Unassigned', value: taskStats.unassigned, color: '#94a3b8' },
    { name: 'Assigned', value: taskStats.assigned, color: '#60a5fa' },
    { name: 'In Progress', value: taskStats.inProgress, color: '#f59e0b' },
    { name: 'Completed', value: taskStats.completed, color: '#10b981' },
    { name: 'Canceled', value: taskStats.canceled, color: '#ef4444' },
    { name: 'Pending Approval', value: taskStats.pendingApproval, color: '#8b5cf6' }
  ].filter(item => item.value > 0);
  
  // If no tasks at all, show empty state
  if (statusData.length === 0 || taskStats.totalTasks === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No tasks have been created yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Overview */}
        <div>
          <h3 className="text-sm font-medium mb-4">Task Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tasks`, 'Count']}
                  contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Task Metrics */}
        <div>
          <h3 className="text-sm font-medium mb-4">Task Assignment Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Tasks</div>
              <div className="text-2xl font-bold mt-1">{taskStats.totalTasks}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Assignment Rate</div>
              <div className="text-2xl font-bold mt-1">
                {taskStats.totalTasks > 0 
                  ? `${Math.round(((taskStats.assigned + taskStats.inProgress + taskStats.completed) / taskStats.totalTasks) * 100)}%` 
                  : '0%'}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="text-2xl font-bold mt-1">
                {taskStats.totalTasks > 0 
                  ? `${Math.round((taskStats.completed / taskStats.totalTasks) * 100)}%` 
                  : '0%'}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending Approvals</div>
              <div className="text-2xl font-bold mt-1">{taskStats.pendingApproval}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business-specific task stats */}
      <div>
        <h3 className="text-sm font-medium mb-4">Task Distribution by Business</h3>
        {taskStats.businessStats.length > 0 ? (
          <BusinessStatsList 
            businessStats={taskStats.businessStats}
            type="task"
          />
        ) : (
          <div className="text-sm text-muted-foreground">No business-specific task data available</div>
        )}
      </div>
    </div>
  );
};

// Employee Stats Component
export const EmployeeStatsComponent = ({ employeeStats }) => {
  // If we don't have employee data, show no data state
  if (!employeeStats) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No employee data available</p>
      </div>
    );
  }
  
  // Empty state when no employee data
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">No employee statistics available yet</p>
      <p className="text-sm text-muted-foreground mt-2">
        Employee data will be displayed once available from the backend.
      </p>
    </div>
  );
};

// AI Auto-Assignment Component
export const AutoAssignmentStats = ({ autoAssignStats }) => {
  if (!autoAssignStats) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No auto-assignment data available</p>
      </div>
    );
  }
  
  // Helper function to get status badge
  const getStatusBadge = (type) => {
    switch (type) {
      case "successful":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Successful</Badge>;
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "pending":
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Prepare data for charts
  const assignmentData = [
    { name: 'Successful', value: autoAssignStats.successful, color: '#10b981' },
    { name: 'Failed', value: autoAssignStats.failed, color: '#ef4444' },
    { name: 'Pending Approval', value: autoAssignStats.pendingApproval, color: '#60a5fa' }
  ].filter(item => item.value > 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Businesses</div>
          <div className="text-2xl font-bold mt-1">{autoAssignStats.totalBusinesses}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Using Auto-Assign</div>
          <div className="text-2xl font-bold mt-1">{autoAssignStats.businessesWithAutoAssign}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Assignments</div>
          <div className="text-2xl font-bold mt-1">{autoAssignStats.totalAutoAssignments}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Success Rate</div>
          <div className="text-2xl font-bold mt-1">
            {autoAssignStats.totalAutoAssignments > 0 
              ? `${Math.round((autoAssignStats.successful / autoAssignStats.totalAutoAssignments) * 100)}%` 
              : '0%'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Status Distribution */}
        <div>
          <h3 className="text-sm font-medium mb-4">Assignment Status Distribution</h3>
          {assignmentData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assignmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {assignmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} assignments`, 'Count']}
                    contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-muted-foreground">No assignment data available</p>
            </div>
          )}
        </div>
        
        {/* Assignment Status Summary */}
        <div>
          <h3 className="text-sm font-medium mb-4">Assignment Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium">Successful Assignments</div>
                </div>
              </div>
              <div className="text-xl font-bold">{autoAssignStats.successful}</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <div className="font-medium">Failed Assignments</div>
                </div>
              </div>
              <div className="text-xl font-bold">{autoAssignStats.failed}</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <div className="font-medium">Pending Approvals</div>
                </div>
              </div>
              <div className="text-xl font-bold">{autoAssignStats.pendingApproval}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business-specific auto-assign stats */}
      <div>
        <h3 className="text-sm font-medium mb-4">Auto-Assignment by Business</h3>
        {autoAssignStats.businessStats && autoAssignStats.businessStats.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Business</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Successful</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Failed</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Pending</th>
                </tr>
              </thead>
              <tbody>
                {autoAssignStats.businessStats.map((business, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 text-sm">{business.businessName}</td>
                    <td className="px-4 py-3 text-sm">
                      {business.enabled ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Enabled</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{business.totalAssignments}</td>
                    <td className="px-4 py-3 text-sm">{business.successful}</td>
                    <td className="px-4 py-3 text-sm">{business.failed}</td>
                    <td className="px-4 py-3 text-sm">{business.pendingApproval}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No business-specific auto-assignment data available</div>
        )}
      </div>
    </div>
  );
};