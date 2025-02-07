// hooks/useCustomSettings.ts
import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { Settings } from "@/types/settings";

export function useCustomSettings() {
   const { clientId } = useClient();
   const [settings, setSettings] = useState<Settings | null>(null);
   const [isLoading, setIsLoading] = useState(true);
  
   const fetchSettings = async () => {
     try {
       const res = await fetch(`/api/settings?clientId=${clientId}`);
       if (!res.ok) throw new Error('Failed to fetch settings');
       const data = await res.json();
       setSettings(data);
     } catch (error) {
       console.error('Failed to fetch settings:', error);
     } finally {
       setIsLoading(false);
     }
   };

   

   useEffect(() => {
     if (clientId) fetchSettings();
   }, [clientId]);
  
   return { 
     settings, 
     isLoading,
     isVenueBoostEnabled: settings?.integrations?.venueBoost?.enabled,
     venueShortCode: settings?.integrations?.venueBoost?.venueShortCode,
     webhookApiKey: settings?.integrations?.venueBoost?.webhookApiKey 
   };
}