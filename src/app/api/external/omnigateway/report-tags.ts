// app/api/external/omnigateway/report-tags.ts
import { createOmniGateway } from './index';
import { CreateReportTagDto, UpdateReportTagDto, ReportTag } from './types/report-tags';

export const createReportTagsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getReportTags: async (params = {}) => {
            const { data } = await api.get('/report-tags', { params });
            return data;
        },
        createReportTag: async (tagData: CreateReportTagDto) => {
            const { data } = await api.post('/report-tags', tagData);
            return data;
        },
        updateReportTag: async (id: string, tagData: Partial<UpdateReportTagDto>) => {
            const { data } = await api.put(`/report-tags/${id}`, tagData);
            return data;
        },
        getReportTag: async (id: string) => {
            const { data } = await api.get(`/report-tags/${id}`);
            return data;
        },
        deleteReportTag: async (id: string) => {
            const { data } = await api.delete(`/report-tags/${id}`);
            return data;
        }
    };
};