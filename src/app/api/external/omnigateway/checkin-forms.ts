// app/api/external/omnigateway/checkin-forms.ts
import { createOmniGateway } from './index';
import { 
  CreateCheckinFormConfigDto, 
  UpdateCheckinFormConfigDto, 
  CheckinFormParams,
  CheckinSubmissionParams,
  CheckinFormsResponse,
  CheckinSubmissionsResponse,
  CheckinFormConfig,
  CheckinSubmission
} from './types/checkin-forms';

export const createCheckinFormsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Form Configuration
    getCheckinForms: async (params: CheckinFormParams = {}): Promise<CheckinFormsResponse> => {
      const { data } = await api.get('/checkin-forms', { params });
      return data;
    },
    
    getCheckinForm: async (shortCode: string): Promise<CheckinFormConfig> => {
      const { data } = await api.get(`/checkin-forms/${shortCode}`);
      return data;
    },
    
    createCheckinForm: async (formData: CreateCheckinFormConfigDto): Promise<CheckinFormConfig> => {
      const { data } = await api.post('/checkin-forms', formData);
      return data;
    },
    
    updateCheckinForm: async (shortCode: string, formData: UpdateCheckinFormConfigDto): Promise<CheckinFormConfig> => {
      const { data } = await api.patch(`/checkin-forms/${shortCode}`, formData);
      return data;
    },
    
    deleteCheckinForm: async (shortCode: string): Promise<{ success: boolean }> => {
      const { data } = await api.delete(`/checkin-forms/${shortCode}`);
      return data;
    },
    
    // Submissions
    getSubmissions: async (params: CheckinSubmissionParams = {}): Promise<CheckinSubmissionsResponse> => {
      const { data } = await api.get('/checkin-submissions', { params });
      return data;
    },
    
    getFormSubmissions: async (formConfigId: string, params: CheckinSubmissionParams = {}): Promise<CheckinSubmissionsResponse> => {
      const { data } = await api.get(`/checkin-submissions`, { 
        params: { ...params, formConfigId } 
      });
      return data;
    },
    
    getSubmission: async (id: string): Promise<CheckinSubmission> => {
      const { data } = await api.get(`/checkin-submissions/${id}`);
      return data;
    },
    
    updateSubmissionStatus: async (id: string, status: string, verificationData?: Record<string, any>): Promise<CheckinSubmission> => {
      const { data } = await api.patch(`/checkin-submissions/${id}/status`, { 
        status, 
        verificationData 
      });
      return data;
    },
    
    deleteSubmission: async (id: string): Promise<{ success: boolean }> => {
      const { data } = await api.delete(`/checkin-submissions/${id}`);
      return data;
    }
  };
};