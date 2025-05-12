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
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BusinessStatsList from "./business-stats-list";

// Task Assignment Stats Component
export const TaskAssignmentStats = ({ taskStats }) => {
  // Prepare data for charts directly from API response
  const statusData = [
    { name: 'Unassigned', value: taskStats.unassigned, color: '#94a3b8' },
    { name: 'Assigned', value: taskStats.assigned, color: '#60a5fa' },
    { name: 'In Progress', value: taskStats.inProgress, color: '#f59e0b' },
    { name: 'Completed', value: taskStats.completed, color: '#10b981' },
    { name: 'Canceled', value: taskStats.canceled, color: '#ef4444' },
    { name: 'Pending Approval', value: taskStats.pendingApproval, color: '#8b5cf6' }
  ].filter(item => item.value > 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Overview */}
        <div>
          <h3 className="text-sm font-medium mb-4">Task Status Distribution</h3>
          <div className="h-64">
            {statusData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-muted-foreground">No task distribution data to display</p>
              </div>
            )}
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
        <BusinessStatsList 
          businessStats={taskStats.businessStats}
          type="task"
        />
      </div>
    </div>
  );
};

// Employee Stats Component
export const EmployeeStatsComponent = ({ employeeStats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Employees</div>
          <div className="text-2xl font-bold mt-1">{employeeStats.totalEmployees}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Active Employees</div>
          <div className="text-2xl font-bold mt-1">{employeeStats.activeEmployees}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Utilization Rate</div>
          <div className="text-2xl font-bold mt-1">
            {employeeStats.totalEmployees > 0 
              ? `${Math.round((employeeStats.activeEmployees / employeeStats.totalEmployees) * 100)}%` 
              : '0%'}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Businesses</div>
          <div className="text-2xl font-bold mt-1">{employeeStats.businessStats.length}</div>
        </div>
      </div>
      
      {/* Businesses */}
      <div>
        <h3 className="text-sm font-medium mb-4">Employee Distribution by Business</h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Business</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total Employees</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Active Employees</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Specializations</th>
              </tr>
            </thead>
            <tbody>
              {employeeStats.businessStats.map((business, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 text-sm">{business.businessName}</td>
                  <td className="px-4 py-3 text-sm">{business.totalEmployees}</td>
                  <td className="px-4 py-3 text-sm">{business.activeEmployees}</td>
                  <td className="px-4 py-3 text-sm">
                    {Object.keys(business.specializations).length > 0 
                      ? Object.keys(business.specializations).join(", ")
                      : "No specializations"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// AI Auto-Assignment Component
export const AutoAssignmentStats = ({ autoAssignStats }) => {
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
          <div className="text-sm text-muted-foreground">Total Jobs - Process Unassigned Tasks
          </div>
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
        {/* Assignment Status Summary */}
        <div>
          <h3 className="text-sm font-medium mb-4"> Process Unassigned Tasks - Jobs Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium">Successful Jobs</div>
                </div>
              </div>
              <div className="text-xl font-bold">{autoAssignStats.successful}</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <div>
                  <div className="font-medium">Failed Jobs</div>
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
        
        {/* Assignment Status Distribution */}
        <div>
          <h3 className="text-sm font-medium mb-4">Job Status Distribution</h3>
          <div className="h-64">
            {autoAssignStats.totalAutoAssignments > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Successful', value: autoAssignStats.successful, color: '#10b981' },
                      { name: 'Failed', value: autoAssignStats.failed, color: '#ef4444' },
                      { name: 'Pending Approval', value: autoAssignStats.pendingApproval, color: '#60a5fa' }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {[
                      { name: 'Successful', value: autoAssignStats.successful, color: '#10b981' },
                      { name: 'Failed', value: autoAssignStats.failed, color: '#ef4444' },
                      { name: 'Pending Approval', value: autoAssignStats.pendingApproval, color: '#60a5fa' }
                    ].filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} jobs`, 'Count']}
                    contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-muted-foreground">No job distribution data to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Business-specific auto-assign stats */}
      <div>
        <h3 className="text-sm font-medium mb-4">Auto-Assignment by Business</h3>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Business</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total Jobs - Process Unassigned Tasks</th>
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
      </div>
    </div>
  );
};