// app/api/external/omnigateway/communications.ts
import { createOmniGateway } from './index';

// Types for communications
export interface SendCommunicationData {
  type: 'EMAIL' | 'SMS';
  recipient: string;
  subject?: string;
  message: string;
  metadata?: Record<string, any>;
  template?: string;
}

export interface CommunicationResponse {
  success: boolean;
  deliveryId: string;
  provider: string;
  status: string;
  messageId?: string;
}

export const createOmniStackCommunicationApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    sendCommunication: async (communicationData: SendCommunicationData) => {
      const { data } = await api.post('/communications/send', communicationData);
      return data as CommunicationResponse;
    },
    
    // Get delivery status of a communication
    getDeliveryStatus: async (deliveryId: string) => {
      const { data } = await api.get(`/communications/status/${deliveryId}`);
      return data;
    }
  };
};