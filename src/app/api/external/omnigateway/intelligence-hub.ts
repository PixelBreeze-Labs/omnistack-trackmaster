import { createOmniGateway } from './index';
import {
  IntelligenceSystemStats,
  ModelInfo,
  Insight,
  Prediction,
  FeatureSet
} from './types/intelligence-hub';

export const intelligenceHubApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // System status
    getStatus: async (): Promise<{status: string, services: string[]}> => {
      const endpoint = `/ml-test/status`;
      const { data } = await api.get(endpoint);
      return data;
    },
    
    // FEATURE ENDPOINTS
    saveFeatures: async (data: {
      entityId: string;
      entityType: string;
      featureSetName: string;
      features: Record<string, any>;
      businessId: string;
    }): Promise<any> => {
      const endpoint = `/ml-test/features/save`;
      const { data: responseData } = await api.post(endpoint, data);
      return responseData;
    },
    
    getFeatures: async (
      entityType: string,
      entityId: string,
      featureSetName: string
    ): Promise<any> => {
      const endpoint = `/ml-test/features/${entityType}/${entityId}/${featureSetName}`;
      const { data } = await api.get(endpoint);
      return data;
    },
    
    // MODEL ENDPOINTS
    registerModel: async (modelData: any): Promise<any> => {
      const endpoint = `/ml-test/models/register`;
      const { data } = await api.post(endpoint, modelData);
      return data;
    },
    
    getModels: async (): Promise<any> => {
      const endpoint = `/ml-test/models`;
      const { data } = await api.get(endpoint);
      return data;
    },
    
    getModel: async (modelId: string): Promise<any> => {
      const endpoint = `/ml-test/models/${modelId}`;
      const { data } = await api.get(endpoint);
      return data;
    },
    
    // PREDICTION ENDPOINTS
    makePrediction: async (data: {
      modelName: string;
      entityType: string;
      entityId: string;
      features: Record<string, any>;
      businessId: string;
      userId: string;
    }): Promise<any> => {
      const endpoint = `/ml-test/predict`;
      const { data: responseData } = await api.post(endpoint, data);
      return responseData;
    },
    
    provideFeedback: async (data: {
      predictionId: string;
      isCorrect: boolean;
      actualOutcome: any;
    }): Promise<any> => {
      const endpoint = `/ml-test/feedback`;
      const { data: responseData } = await api.post(endpoint, data);
      return responseData;
    },
    
    // INSIGHT ENDPOINTS
    getInsights: async (
      entityType: string,
      entityId: string,
      insightType?: string
    ): Promise<any> => {
      const queryParams = new URLSearchParams();
      if (insightType) queryParams.append('insightType', insightType);
      
      const queryString = queryParams.toString();
      const endpoint = `/ml-test/insights/${entityType}/${entityId}${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get(endpoint);
      return data;
    },
    
    generateInsights: async (data: {
      entityId: string;
      entityType: string;
      insightType: string;
      features: Record<string, any>;
      businessId: string;
    }): Promise<any> => {
      const endpoint = `/ml-test/insights/generate`;
      const { data: responseData } = await api.post(endpoint, data);
      return responseData;
    },
    
    // AGENT ENDPOINTS
    autoAssignTask: async (data: {
      taskId: string;
      businessId: string;
    }): Promise<any> => {
      const endpoint = `/ml-test/agents/auto-assign`;
      const { data: responseData } = await api.post(endpoint, data);
      return responseData;
    },
    
    scanComplianceIssues: async (businessId: string): Promise<any> => {
      const endpoint = `/ml-test/agents/compliance/${businessId}`;
      const { data } = await api.get(endpoint);
      return data;
    },
    
    generateReport: async (data: {
      businessId: string;
      reportType: string;
      options: any;
    }): Promise<any> => {
      const endpoint = `/ml-test/agents/report`;
      const { data: responseData } = await api.post(endpoint, data);
      return responseData;
    },
    
    // Mock method for system stats since it's not in the controller
    // This can be replaced later with a real endpoint
    getSystemStats: async (days?: number): Promise<IntelligenceSystemStats> => {
      // This is a mock implementation that returns hardcoded data for UI development
      // In production, we'd call a real endpoint
      return {
        totalModels: 5,
        activeModels: 3,
        totalFeatureSets: 12,
        totalPredictions: 243,
        totalInsights: 45,
        actionableInsights: 28,
        insightsActionTaken: 18,
        totalAgentActions: 156,
        successfulAgentActions: 142,
        businessesWithActiveModels: 3,
        avgModelsPerBusiness: 1.67,
        avgPredictionConfidence: 0.87,
        highSeverityInsightsCount: 8,
        recentAgentActions: [],
        recentInsights: [],
        recentPredictions: [],
        businessStats: []
      };
    }
  };
};