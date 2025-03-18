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

    const createReport = useCallback(async (reportData: any, files?: {
        media?: File[],
        audio?: File | null
    }) => {
        if (!api) return null;
    
        try {
            setIsLoading(true);
            
            // Always use FormData since it handles both with and without files better
            const formData = new FormData();
            
            // Clean up the reportData before adding to FormData
            const cleanedData = { ...reportData };
            
            // Convert empty strings to null for certain fields
            ['authorId', 'customAuthorName'].forEach(field => {
                if (cleanedData[field] === '') {
                    cleanedData[field] = null;
                }
            });
            
            // Handle location separately
            if (cleanedData.location) {
                // If lat or lng are empty, remove location
                if (
                    (cleanedData.location.lat === undefined || cleanedData.location.lat === null) && 
                    (cleanedData.location.lng === undefined || cleanedData.location.lng === null)
                ) {
                    delete cleanedData.location;
                } else {
                    cleanedData.location = JSON.stringify(cleanedData.location);
                }
            }
            
            // Process arrays properly
            const arrayFields = ['reportTags', 'tags'];
            arrayFields.forEach(field => {
                if (Array.isArray(cleanedData[field])) {
                    cleanedData[field].forEach((item: any, index: number) => {
                        formData.append(`${field}[${index}]`, item);
                    });
                    delete cleanedData[field]; // Remove the original field
                }
            });
            
            // Add all other fields
            Object.entries(cleanedData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });
            
            // Add media files
            if (files?.media && files.media.length > 0) {
                files.media.forEach(file => {
                    formData.append('media', file);
                });
            }
            
            // Add audio file if present
            if (files?.audio) {
                formData.append('audio', files.audio);
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