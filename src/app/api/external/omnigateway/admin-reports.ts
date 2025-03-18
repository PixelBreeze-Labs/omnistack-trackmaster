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
        
        // Get report details
        getReport: async (id: string) => {
            const { data } = await api.get(`/community-reports/${id}`);
            return data;
        },
        
        // Create a new report from admin
        createReportFromAdmin: async (reportData: any) => {
            const { data } = await api.post('/community-reports/admin', reportData);
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