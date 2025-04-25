// hooks/useGatewayClientApiKey.ts
import { useEffect, useState } from 'react';
import { useClient } from './useClient';
import { useSession } from 'next-auth/react';

export const useGatewayClientApiKey = () => {
    const { clientId } = useClient();
    const { data: session, status } = useSession();
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Clear previous state when dependencies change
        setApiKey(null);
        setError(null);
        
        // Skip if session is loading or client ID is not available
        if (status === 'loading' || !clientId) {
            return;
        }
              
        const fetchApiKey = async () => {
            setIsLoading(true);

            try {
                // Add cache busting and session ID to ensure we get fresh data
                // The session ID ensures we re-fetch when the user changes
                const timestamp = new Date().getTime();
                const sessionId = session?.user?.id || 'no-session';
                
                const response = await fetch(
                    `/api/client/gateway-api-key?clientId=${clientId}&t=${timestamp}&sid=${sessionId}`, 
                    {
                        // Ensure no caching
                        headers: {
                            'Cache-Control': 'no-cache, no-store',
                            'Pragma': 'no-cache'
                        },
                        // Include credentials for auth
                        credentials: 'same-origin'
                    }
                );
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to fetch API key');
                }

                const data = await response.json();
                setApiKey(data.apiKey);
            } catch (err) {
                console.error('API key fetch error:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                setApiKey(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApiKey();
    }, [clientId, session?.user?.id, status]);

    return { apiKey, error, isLoading };
};