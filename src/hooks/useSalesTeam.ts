// hooks/useSalesTeam.ts
import { useState, useEffect } from 'react';
import { useClient } from '@/hooks/useClient';
import { SalesTeamMember, SalesTeamStats } from '@/types/sales-team';
import { toast } from 'sonner';

interface UseSalesTeamProps {
  initialPage?: number;
  initialLimit?: number;
}

export function useSalesTeam({ initialPage = 1, initialLimit = 10 }: UseSalesTeamProps = {}) {
  const { clientId } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [staff, setStaff] = useState<SalesTeamMember[]>([]);
  const [stats, setStats] = useState<SalesTeamStats | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    position: 'all',
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  });

  const fetchSalesTeam = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        clientId,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await fetch(`/api/sales-team?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setStaff(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages
      }));
    } catch (error) {
      console.error('Fetch sales team error:', error);
      toast.error('Failed to fetch sales team');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!clientId) return;

    try {
      const response = await fetch(`/api/sales-team/stats?clientId=${clientId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setStats(data);
    } catch (error) {
      console.error('Fetch stats error:', error);
      toast.error('Failed to fetch sales stats');
    }
  };

  // Export to CSV function
  const exportToCSV = async () => {
    if (!clientId) return;

    try {
      // Fetch all staff for export
      const queryParams = new URLSearchParams({
        clientId,
        limit: '1000', // Get more records for export
        ...filters
      });

      const response = await fetch(`/api/sales-team?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Format data for CSV
      const csvData = data.items.map((member: SalesTeamMember) => ({
        'Employee ID': member.employeeId,
        'First Name': member.firstName,
        'Last Name': member.lastName,
        'Email': member.email,
        'Phone': member.phone || '',
        'Role': member.role,
        'Sub Role': member.subRole || '',
        'Status': member.status,
        'Department': member.department.name,
        'Join Date': new Date(member.dateOfJoin).toLocaleDateString(),
        'Performance Score': member.performanceScore || 'N/A'
      }));

      // Convert to CSV
      const headers = Object.keys(csvData[0]);
      const csvString = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => 
            JSON.stringify(row[header as keyof typeof row])
          ).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sales_team_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success('Sales team data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export sales team data');
    }
  };

  useEffect(() => {
    fetchSalesTeam();
    fetchStats();
  }, [clientId, pagination.page, pagination.limit, filters]);

  return {
    isLoading,
    staff,
    stats,
    filters,
    setFilters,
    pagination,
    setPagination,
    exportToCSV,
    refresh: fetchSalesTeam
  };
}