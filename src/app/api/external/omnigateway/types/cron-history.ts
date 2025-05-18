// app/api/external/omnigateway/types/cron-history.ts
export interface CronJobHistoryItem {
    id: string;
    jobName: string;
    startTime: string;
    endTime?: string;
    duration?: number;
    status: 'completed' | 'failed' | 'started';
    businessId?: string;
    businessIds?: string[];
    businessName?: string;
    details?: Record<string, any>;
    error?: string;
  }
  
  export interface CronJobHistoryResponse {
    total: number;
    page: number;
    limit: number;
    jobs: CronJobHistoryItem[];
  }
  
  export interface JobTypeStats {
    total: number;
    successful: number;
    failed: number;
    avgDuration: number;
  }
  
  export interface BusinessCronStats {
    businessId: string;
    businessName: string;
    total: number;
    successful: number;
    failed: number;
  }
  
  export interface CronJobStats {
    totalRuns: number;
    successful: number;
    failed: number;
    jobTypes: Record<string, JobTypeStats>;
    businessStats: BusinessCronStats[];
  }
  
  // Task assignment statistics
  export interface BusinessTaskStats {
    businessId: string;
    businessName: string;
    totalTasks: number;
    unassigned: number;
    assigned: number;
    inProgress: number;
    completed: number;
    canceled: number;
    pendingApproval: number;
    autoAssignEnabled: boolean;
  }
  
  export interface TaskStats {
    totalTasks: number;
    unassigned: number;
    assigned: number;
    inProgress: number;
    completed: number;
    canceled: number;
    pendingApproval: number;
    businessStats: BusinessTaskStats[];
  }
  
  // Employee statistics
  export interface BusinessEmployeeStats {
    businessId: string;
    businessName: string;
    totalEmployees: number;
    activeEmployees: number;
    specializations: Record<string, number>;
    skillLevels: {
      novice: number;
      intermediate: number;
      advanced: number;
      expert: number;
    };
  }
  
  export interface EmployeeStats {
    totalEmployees: number;
    activeEmployees: number;
    businessStats: BusinessEmployeeStats[];
  }
  
  // Auto-assignment statistics
  export interface BusinessAutoAssignStats {
    businessId: string;
    businessName: string;
    enabled: boolean;
    totalAssignments: number;
    successful: number;
    failed: number;
    pendingApproval: number;
  }
  
  export interface AutoAssignStats {
    totalBusinesses: number;
    businessesWithAutoAssign: number;
    totalAutoAssignments: number;
    successful: number;
    failed: number;
    pendingApproval: number;
    businessStats: BusinessAutoAssignStats[];
  }
  
  // Business details and statistics
  export interface BusinessDetailsResponse {
    business: {
      id: string;
      name: string;
      email: string;
      type: string;
      subscriptionStatus: string;
      subscriptionEndDate?: string;
      enabledFeatures: string[];
    };
    stats: {
      employees: number;
      tasks: {
        total: number;
        unassigned: number;
        assigned: number;
        inProgress: number;
        completed: number;
        canceled: number;
        pendingApproval: number;
      };
      autoAssignments: {
        total: number;
        successful: number;
        failed: number;
      };
    };
  }

  export interface WeatherBusinessStats {
    businessId: string;
    businessName: string;
    weatherEnabled: boolean;
    totalJobs: number;
    successful: number;
    failed: number;
    alertCount: number;
    lastRunStatus: string | null;
    lastRunDate: string | null;
  }
  
  export interface WeatherJobDetails {
    id: string;
    jobName: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: string;
    totalBusinesses: number;
    processedBusinesses: number;
    failedBusinesses: number;
    totalAlerts: number;
    error?: string;
  }
  
  export interface WeatherMonitoringStats {
    stats: {
      totalJobs: number;
      successful: number;
      failed: number;
      avgDuration: number;
      totalAlerts: number;
      businessesWithAlerts: number;
      businessesWithWeatherEnabled: number;
    };
    businessStats: WeatherBusinessStats[];
    recentJobs: WeatherJobDetails[];
  }