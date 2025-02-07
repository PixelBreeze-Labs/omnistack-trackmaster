// app/api/external/omnigateway/vb.ts
import { createOmniGateway } from './index';

export const createVBApi = (clientApiKey: string) => {
    const omniGateway = createOmniGateway(clientApiKey);

    return {
      connect: async (venueShortCode: string, webhookApiKey: string) => {
        const { data } = await omniGateway.post('/vb/connect', { venueShortCode, webhookApiKey });
        return data;
      },
    };
  };