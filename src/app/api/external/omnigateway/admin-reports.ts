import { createOmniGateway } from './index';
import { AdminReportParams } from './types/admin-reports';

export const createAdminReportsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        // Get all community reports with admin capabilities
        getAdminReports: async (params: AdminReportParams = {}) => {
            const { data } = await api.get('/community-reports/admin', { params });
            return data;
        },
        
        // Get report details (admin specific endpoint with better error handling)
        getReport: async (id: string) => {
            try {
                const { data } = await api.get(`/community-reports/admin/${id}`);
                return data;
            } catch (error) {
                console.error('Error fetching report details:', error);
                throw error;
            }
        },
        
        createReportFromAdmin: async (formData: FormData) => {
            // Log form data being sent for debugging
            const formDataEntries = Array.from(formData.entries()).map(entry => {
                const [key, value] = entry;
                if (value instanceof File) {
                    return [key, `File: ${value.name} (${value.size} bytes)`];
                }
                return entry;
            });
            console.log('Sending FormData to server:', Object.fromEntries(formDataEntries));
            
            try {
                const { data } = await api.post('/community-reports/admin', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return data;
            } catch (error) {
                console.error('Error creating report from admin:', error);
                if (error.response?.data) {
                    console.error('Server error details:', error.response.data);
                }
                throw error;
            }
        },
        
        // Update report visibility
        updateVisibility: async (id: string, visibleOnWeb: boolean) => {
            const { data } = await api.put(`/community-reports/${id}`, { 
                visibleOnWeb 
            });
            return data;
        },
        
        // Update featured status - using dedicated endpoint
        updateFeatured: async (id: string, isFeatured: boolean) => {
            const { data } = await api.put(`/community-reports/${id}/featured`, { 
                isFeatured 
            });
            return data;
        },
        
        // Update report status - using dedicated endpoint
        updateStatus: async (id: string, status: string) => {
            // Debug logging to verify what's being sent
            console.log('Updating status for report:', id, 'New status:', status);
            
            const { data } = await api.put(`/community-reports/${id}/status`, { 
                status 
            });
            return data;
        },
        
        // Delete a report
        deleteReport: async (id: string) => {
            const { data } = await api.delete(`/community-reports/${id}`);
            return data;
        },
        
        // Update report tags
        updateReportTags: async (id: string, reportTags: string[]) => {
            const { data } = await api.put(`/community-reports/${id}/tags`, { 
                reportTags 
            });
            return data;
        },

        // Update report creation date
        updateCreatedAt: async (id: string, createdAt: Date) => {
            const { data } = await api.put(`/community-reports/${id}`, { 
                createdAt: createdAt.toISOString() 
            });
            return data;
        },
    };
};