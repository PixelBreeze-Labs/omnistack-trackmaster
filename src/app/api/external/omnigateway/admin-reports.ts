import { createOmniGateway } from './index';
import { AdminReport, AdminReportParams } from './types/admin-reports';

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
            const { data } = await api.post('/community-reports/admin', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        },
        
        // Update report visibility
        updateVisibility: async (id: string, visibleOnWeb: boolean) => {
            const { data } = await api.put(`/community-reports/${id}`, { 
                visibleOnWeb 
            });
            return data;
        },
        
        // Update featured status
        updateFeatured: async (id: string, isFeatured: boolean) => {
            const { data } = await api.put(`/community-reports/${id}`, { 
                isFeatured 
            });
            return data;
        },
        
        // Update report status
        updateStatus: async (id: string, status: string) => {
            const { data } = await api.put(`/community-reports/${id}`, { 
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
            const { data } = await api.put(`/community-reports/${id}`, { 
                reportTags 
            });
            return data;
        }
    };
};