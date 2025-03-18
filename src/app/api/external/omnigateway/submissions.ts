// app/api/external/omnigateway/submissions.ts
import { createOmniGateway } from './index';
import { Submission, SubmissionParams } from './types/submissions';

export const createSubmissionsApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getSubmissions: async (params: SubmissionParams = {}) => {
            const { data } = await api.get('/submissions', { params });
            return data;
        },
        getSubmission: async (id: string) => {
            const { data } = await api.get(`/submissions/${id}`);
            return data;
        },
        updateSubmission: async (id: string, updateData: { status?: string }) => {
            const { data } = await api.put(`/submissions/${id}`, updateData);
            return data;
        },
        createContactSubmission: async (contactData: {
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            content: string;
        }) => {
            const { data } = await api.post('/submissions/contact', contactData);
            return data;
        }
    };
};
