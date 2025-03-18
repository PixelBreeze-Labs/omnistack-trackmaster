import { useState, useCallback, useMemo } from 'react';
import { createAdminReportsApi } from '@/app/api/external/omnigateway/admin-reports';
import { AdminReport, AdminReportParams, ReportStatus } from '@/app/api/external/omnigateway/types/admin-reports';
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

    // Updated createReport function in useAdminReports.ts
    const createReport = useCallback(async (reportData: any, files?: {
        media?: File[],
        audio?: File | null
      }) => {
        if (!api) return null;
      
        try {
          setIsLoading(true);
          
          // Create FormData for multipart submission
          const formData = new FormData();
          
          // CRITICAL: Add media files first to ensure they're properly attached
          // NOTE: The field name must match the controller's expected name
          if (files?.media && files.media.length > 0) {
            console.log('Adding media files:', files.media.length);
            files.media.forEach((file, index) => {
              console.log(`Adding media file ${index}:`, file.name, file.type, file.size);
              formData.append('media', file);
            });
          }
          
          // Add audio file if present
          if (files?.audio && files.audio instanceof File) {
            formData.append('audio', files.audio);
          }
          
          // Add all basic fields
          formData.append('title', reportData.title || '');
          formData.append('content', reportData.content || '');
          formData.append('category', reportData.category || '');
          formData.append('status', reportData.status || ReportStatus.ACTIVE);
          
          // Add boolean fields as strings
          formData.append('isAnonymous', reportData.isAnonymous ? 'true' : 'false');
          formData.append('isFeatured', reportData.isFeatured ? 'true' : 'false');
          formData.append('visibleOnWeb', reportData.visibleOnWeb ? 'true' : 'false');
          
          // Add optional fields if they exist
          if (reportData.authorId) {
            formData.append('authorId', reportData.authorId);
          }
          
          if (reportData.customAuthorName) {
            formData.append('customAuthorName', reportData.customAuthorName);
          }
      
          // Handle location as a JSON string if it exists
          if (reportData.location && 
              ((reportData.location.lat !== undefined && reportData.location.lat !== null) || 
               (reportData.location.lng !== undefined && reportData.location.lng !== null))) {
            formData.append('location', JSON.stringify(reportData.location));
          }
          
          // Handle reportTags - CRITICAL FIX
          if (reportData.reportTags && reportData.reportTags.length > 0) {
          
            formData.append('reportTags', JSON.stringify(reportData.reportTags));
            
          }
          
          // Submit the form
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

    const updateStatus = useCallback(async (id: string, status: string) => {
        if (!api) return false;

        try {
            setIsLoading(true);
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
            toast.error('Failed to update status');
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
        deleteReport,
        updateReportTags,
        isInitialized: !!api
    };
};