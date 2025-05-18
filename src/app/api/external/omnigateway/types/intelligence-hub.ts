
export interface ModelInfo {
    id: string;
    modelName: string;
    version: string;
    type: 'classification' | 'regression' | 'recommendation' | 'other';
    status: 'active' | 'inactive' | 'training' | 'failed';
    businessId: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    accuracy?: number;
    trainingComplete?: boolean;
    lastTrainedAt?: string;
  }
  
  export interface FeatureSet {
    id: string;
    entityId: string;
    entityType: string;
    featureSetName: string;
    businessId: string;
    features: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Prediction {
    id: string;
    modelName: string;
    entityType: string;
    entityId: string;
    input: Record<string, any>;
    output: any;
    confidence: number;
    businessId: string;
    userId: string;
    createdAt: string;
    feedbackProvided?: boolean;
    isCorrect?: boolean;
    actualOutcome?: any;
  }
  
  export interface Insight {
    id: string;
    entityId: string;
    entityType: string;
    insightType: string;
    content: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    businessId: string;
    createdAt: string;
    isActionable: boolean;
    actionTaken: boolean;
    relatedPredictionId?: string;
    expiresAt?: string;
  }
  
  export interface AgentAction {
    id: string;
    agentType: string;
    actionType: string;
    entityId: string;
    entityType: string;
    status: 'pending' | 'completed' | 'failed';
    result: any;
    businessId: string;
    createdAt: string;
    completedAt?: string;
  }
  
  export interface AISystemStatus {
    status: 'operational' | 'degraded' | 'maintenance';
    services: string[];
    activeModels: number;
    recentPredictions: number;
    recentInsights: number;
    lastUpdated: string;
  }
  
  export interface BusinessIntelligenceStats {
    businessId: string;
    businessName: string;
    modelsCount: number;
    activeModels: number;
    featureSetsCount: number;
    predictionsCount: number;
    insightsCount: number;
    insightsActionTaken: number;
    agentActionsCount: number;
    lastActivityDate?: string;
  }
  
  export interface IntelligenceSystemStats {
    totalModels: number;
    activeModels: number;
    totalFeatureSets: number;
    totalPredictions: number;
    totalInsights: number;
    actionableInsights: number;
    insightsActionTaken: number;
    totalAgentActions: number;
    successfulAgentActions: number;
    businessesWithActiveModels: number;
    avgModelsPerBusiness: number;
    avgPredictionConfidence: number;
    highSeverityInsightsCount: number;
    recentAgentActions: AgentAction[];
    recentInsights: Insight[];
    recentPredictions: Prediction[];
    businessStats: BusinessIntelligenceStats[];
  }
  
  export interface ModelPerformanceMetrics {
    modelId: string;
    modelName: string;
    version: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    totalPredictions: number;
    correctPredictions: number;
    incorrectPredictions: number;
    avgConfidence: number;
    lastEvaluated: string;
  }
  
  export interface ModelTestRequest {
    modelName: string;
    features: Record<string, any>;
    businessId: string;
  }
  
  export interface ModelTestResponse {
    modelName: string;
    prediction: any;
    confidence: number;
    processingTime: number;
    featureImportance?: Record<string, number>;
  }