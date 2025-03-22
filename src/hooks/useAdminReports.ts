import { useState, useCallback, useMemo } from 'react';
import { createAdminReportsApi } from '@/app/api/external/omnigateway/admin-reports';
import { AdminReport, AdminReportParams, CommentStatus, FlagStatus, ReportStatus } from '@/app/api/external/omnigateway/types/admin-reports';
import { useGatewayClientApiKey } from '@/hooks/useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useAdminReports = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createAdminReportsApi(apiKey) : null, [apiKey]);

    const fetchReports = useCallback(async (params: AdminReportParams = {}) => {
        if (!api) return;

        setIsLoading(true);
        try {
            const response = await api.getAdminReports(params);
            setReports(response.data);
            setTotalItems(response.meta.total);
            setCurrentPage(response.meta.page);
            setTotalPages(Math.ceil(response.meta.total / response.meta.limit));
            return response;
        } catch (error) {
            console.error('Error fetching admin reports:', error);
            toast.error('Failed to fetch reports. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createReport = useCallback(async (formData: FormData) => {
        if (!api) return null;
      
        try {
          setIsLoading(true);
          
          // Submit the form directly with the received FormData
          const report = await api.createReportFromAdmin(formData);
          toast.success('Report created successfully');
          
          // Refresh the reports list
          fetchReports();
          return report;
        } catch (error) {
          console.error('Error creating report:', error);
          toast.error('Failed to create report: ' + (error instanceof Error ? error.message : 'Unknown error'));
          return null;
        } finally {
          setIsLoading(false);
        }
    }, [api, fetchReports]);
      
    const getReport = useCallback(async (id: string) => {
        if (!api) return null;

        try {
            setIsLoading(true);
            const report = await api.getReport(id);
            return report;
        } catch (error) {
            console.error('Error fetching report details:', error);
            toast.error('Failed to fetch report details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateVisibility = useCallback(async (id: string, visibleOnWeb: boolean) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.updateVisibility(id, visibleOnWeb);
            toast.success(`Report ${visibleOnWeb ? 'published' : 'unpublished'} successfully`);
            
            // Update local state
            setReports(prev => 
                prev.map(report => 
                    report._id === id 
                        ? { ...report, visibleOnWeb } 
                        : report
                )
            );
            
            return true;
        } catch (error) {
            console.error('Error updating report visibility:', error);
            toast.error('Failed to update visibility');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateFeatured = useCallback(async (id: string, isFeatured: boolean) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            // Use the dedicated endpoint for updating featured status
            await api.updateFeatured(id, isFeatured);
            toast.success(`Report ${isFeatured ? 'featured' : 'unfeatured'} successfully`);
            
            // Update local state
            setReports(prev => 
                prev.map(report => 
                    report._id === id 
                        ? { ...report, isFeatured } 
                        : report
                )
            );
            
            return true;
        } catch (error) {
            console.error('Error updating report featured status:', error);
            toast.error('Failed to update featured status');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

   // Fixed updateStatus function in useAdminReports.ts
const updateStatus = useCallback(async (id: string, status: string) => {
    if (!api) return false;

    try {
        setIsLoading(true);
        
        // Log what's being sent to API
        console.log('Hook: Updating status', { id, status });
        
        // Use the dedicated endpoint for updating status
        await api.updateStatus(id, status);
        
        const statusLabels = {
            [ReportStatus.PENDING_REVIEW]: 'Pending Review',
            [ReportStatus.REJECTED]: 'Rejected',
            [ReportStatus.ACTIVE]: 'Active',
            [ReportStatus.IN_PROGRESS]: 'In Progress',
            [ReportStatus.RESOLVED]: 'Resolved',
            [ReportStatus.CLOSED]: 'Closed',
            [ReportStatus.NO_RESOLUTION]: 'No Resolution'
        };
        
        toast.success(`Report status updated to ${statusLabels[status as ReportStatus] || status}`);
        
        // Update local state
        setReports(prev => 
            prev.map(report => 
                report._id === id 
                    ? { ...report, status } 
                    : report
            )
        );
        
        return true;
    } catch (error) {
        console.error('Error updating report status:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        toast.error('Failed to update status');
        return false;
    } finally {
        setIsLoading(false);
    }
}, [api]);

    // Update the report's creation date
    const updateCreatedAt = useCallback(async (id: string, createdAt: Date) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.updateCreatedAt(id, createdAt);
            
            // Format the date for toast message
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(createdAt);
            
            toast.success(`Report publication date updated to ${formattedDate}`);
            
            // Update local state
            setReports(prev => 
                prev.map(report => 
                    report._id === id 
                        ? { ...report, createdAt: createdAt.toISOString() } 
                        : report
                )
            );
            
            return true;
        } catch (error) {
            console.error('Error updating report creation date:', error);
            toast.error('Failed to update publication date');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const deleteReport = useCallback(async (id: string) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.deleteReport(id);
            toast.success('Report deleted successfully');
            
            // Update local state
            setReports(prev => prev.filter(report => report._id !== id));
            setTotalItems(prev => prev - 1);
            
            return true;
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateReportTags = useCallback(async (id: string, reportTags: string[]) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.updateReportTags(id, reportTags);
            toast.success('Report tags updated successfully');
            
            // Update local state
            setReports(prev => 
                prev.map(report => 
                    report._id === id 
                        ? { ...report, reportTags } 
                        : report
                )
            );
            
            return true;
        } catch (error) {
            console.error('Error updating report tags:', error);
            toast.error('Failed to update report tags');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

      // Get comments for a report
      const getReportComments = useCallback(async (id: string) => {
        if (!api) return { data: [], total: 0 };

        try {
            setIsLoading(true);
            const response = await api.getReportComments(id);
            return response;
        } catch (error) {
            console.error('Error fetching report comments:', error);
            toast.error('Failed to fetch comments');
            return { data: [], total: 0 };
        } finally {
            setIsLoading(false);
        }
    }, [api]);


    // Update comment status
    const updateCommentStatus = useCallback(async (reportId: string, commentId: string, status: CommentStatus) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.updateCommentStatus(reportId, commentId, status);
            
            const statusLabels = {
                [CommentStatus.PENDING_REVIEW]: 'Pending Review',
                [CommentStatus.APPROVED]: 'Approved',
                [CommentStatus.REJECTED]: 'Rejected'
            };
            
            toast.success(`Comment status updated to ${statusLabels[status]}`);
            return true;
        } catch (error) {
            console.error('Error updating comment status:', error);
            toast.error('Failed to update comment status');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    // Delete a comment
    const deleteComment = useCallback(async (reportId: string, commentId: string) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.deleteComment(reportId, commentId);
            toast.success('Comment deleted successfully');
            
            // Update comment count in local state
            setReports(prev => 
                prev.map(report => 
                    report._id === reportId 
                        ? { 
                            ...report, 
                            commentCount: Math.max(0, (report.commentCount || 0) - 1)
                        } 
                        : report
                )
            );
            
            return true;
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    // Get flags for a report
    const getReportFlags = useCallback(async (id: string) => {
        if (!api) return { data: [], count: 0 };

        try {
            setIsLoading(true);
            const response = await api.getReportFlags(id);
            return response;
        } catch (error) {
            console.error('Error fetching report flags:', error);
            toast.error('Failed to fetch flags');
            return { data: [], count: 0 };
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    // Update flag status
    const updateFlagStatus = useCallback(async (reportId: string, flagId: string, status: FlagStatus) => {
        if (!api) return false;

        try {
            setIsLoading(true);
            await api.updateFlagStatus(reportId, flagId, status);
            
            const statusLabels = {
                [FlagStatus.PENDING]: 'Pending',
                [FlagStatus.REVIEWED]: 'Reviewed',
                [FlagStatus.DISMISSED]: 'Dismissed'
            };
            
            toast.success(`Flag status updated to ${statusLabels[status]}`);
            return true;
        } catch (error) {
            console.error('Error updating flag status:', error);
            toast.error('Failed to update flag status');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        reports,
        totalItems,
        currentPage,
        totalPages,
        fetchReports,
        createReport,
        getReport,
        updateVisibility,
        updateFeatured,
        updateStatus,
        updateCreatedAt,
        deleteReport,
        updateReportTags,
        getReportComments,
        updateCommentStatus,
        deleteComment,
        getReportFlags,
        updateFlagStatus,
        isInitialized: !!api
    };
};