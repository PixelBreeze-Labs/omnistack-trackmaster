// hooks/useVenueBoost.ts
import { useCallback, useMemo } from 'react';
import { createVBApi } from '../app/api/external/omnigateway/vb';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';

export function useVenueBoost() {
  const { apiKey } = useGatewayClientApiKey();
  

  const vbApi = useMemo(() => apiKey ? createVBApi(apiKey) : null, [apiKey]);

  const connectVenueBoost = useCallback(async (venueShortCode: string, webhookApiKey: string) => {
    if (!vbApi) throw new Error('API not ready');
    return await vbApi.connect(venueShortCode, webhookApiKey);
  }, [vbApi]);
 

  return {
    connectVenueBoost,
    isReady: !!vbApi
  };
}