// hooks/useMLTest.ts
import { useState, useCallback, useMemo } from 'react';
import { intelligenceHubApi } from '@/app/api/external/omnigateway/intelligence-hub';
import { 
  IntelligenceSystemStats, 
  ModelInfo, 
  Insight, 
  Prediction
} from '@/app/api/external/omnigateway/types/intelligence-hub';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useML = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{status: string, services: string[]} | null>(null);
  const [systemStats, setSystemStats] = useState<IntelligenceSystemStats | null>(null);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  
  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? intelligenceHubApi(apiKey) : null, [apiKey]);
  
  // Get system status
  const fetchSystemStatus = useCallback(async () => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const status = await api.getStatus();
      setSystemStatus(status);
      return status;
    } catch (error) {
      console.error("Error fetching system status:", error);
      toast.error("Failed to fetch system status");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Fetch system statistics (mock data for now)
  const fetchSystemStats = useCallback(async (days?: number) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const stats = await api.getSystemStats(days);
      setSystemStats(stats);
      return stats;
    } catch (error) {
      console.error("Error fetching system stats:", error);
      toast.error("Failed to fetch system statistics");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Fetch models
  const fetchModels = useCallback(async () => {
    if (!api) return [];
    
    try {
      setIsLoading(true);
      const modelList = await api.getModels();
      setModels(modelList);
      return modelList;
    } catch (error) {
      console.error("Error fetching AI models:", error);
      toast.error("Failed to fetch AI models");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Get model details
  const getModelDetails = useCallback(async (modelId: string) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const model = await api.getModel(modelId);
      setSelectedModel(model);
      return model;
    } catch (error) {
      console.error("Error fetching model details:", error);
      toast.error("Failed to fetch model details");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Register model
  const registerModel = useCallback(async (modelData: any) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.registerModel(modelData);
      toast.success("Model registered successfully");
      return result;
    } catch (error) {
      console.error("Error registering model:", error);
      toast.error("Failed to register model");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Make prediction
  const makePrediction = useCallback(async (data: {
    modelName: string;
    entityType: string;
    entityId: string;
    features: Record<string, any>;
    businessId: string;
    userId: string;
  }) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.makePrediction(data);
      setTestResult(result);
      return result;
    } catch (error) {
      console.error("Error making prediction:", error);
      toast.error("Failed to make prediction");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Provide feedback
  const provideFeedback = useCallback(async (data: {
    predictionId: string;
    isCorrect: boolean;
    actualOutcome: any;
  }) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.provideFeedback(data);
      toast.success("Feedback provided successfully");
      return result;
    } catch (error) {
      console.error("Error providing feedback:", error);
      toast.error("Failed to provide feedback");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Get insights
  const getInsights = useCallback(async (
    entityType: string,
    entityId: string,
    insightType?: string
  ) => {
    if (!api) return [];
    
    try {
      setIsLoading(true);
      const insights = await api.getInsights(entityType, entityId, insightType);
      return insights;
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Failed to fetch insights");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Generate insights
  const generateInsights = useCallback(async (data: {
    entityId: string;
    entityType: string;
    insightType: string;
    features: Record<string, any>;
    businessId: string;
  }) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.generateInsights(data);
      toast.success("Insights generated successfully");
      return result;
    } catch (error) {
      console.error("Error generating insights:", error);
      toast.error("Failed to generate insights");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Save features
  const saveFeatures = useCallback(async (data: {
    entityId: string;
    entityType: string;
    featureSetName: string;
    features: Record<string, any>;
    businessId: string;
  }) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.saveFeatures(data);
      toast.success("Features saved successfully");
      return result;
    } catch (error) {
      console.error("Error saving features:", error);
      toast.error("Failed to save features");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Get features
  const getFeatures = useCallback(async (
    entityType: string,
    entityId: string,
    featureSetName: string
  ) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const features = await api.getFeatures(entityType, entityId, featureSetName);
      return features;
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("Failed to fetch features");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Auto-assign task
  const autoAssignTask = useCallback(async (taskId: string, businessId: string) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.autoAssignTask({ taskId, businessId });
      toast.success("Task auto-assigned successfully");
      return result;
    } catch (error) {
      console.error("Error auto-assigning task:", error);
      toast.error("Failed to auto-assign task");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Scan compliance issues
  const scanComplianceIssues = useCallback(async (businessId: string) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.scanComplianceIssues(businessId);
      return result;
    } catch (error) {
      console.error("Error scanning compliance issues:", error);
      toast.error("Failed to scan compliance issues");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Generate report
  const generateReport = useCallback(async (data: {
    businessId: string;
    reportType: string;
    options: any;
  }) => {
    if (!api) return null;
    
    try {
      setIsLoading(true);
      const result = await api.generateReport(data);
      toast.success("Report generated successfully");
      return result;
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  // Clear test result
  const clearTestResult = useCallback(() => {
    setTestResult(null);
  }, []);
  
  return {
    isLoading,
    systemStatus,
    systemStats,
    models,
    selectedModel,
    testResult,
    fetchSystemStatus,
    fetchSystemStats,
    fetchModels,
    getModelDetails,
    registerModel,
    makePrediction,
    provideFeedback,
    getInsights,
    generateInsights,
    saveFeatures,
    getFeatures,
    autoAssignTask,
    scanComplianceIssues,
    generateReport,
    clearTestResult,
    isInitialized: !!api
  };
};