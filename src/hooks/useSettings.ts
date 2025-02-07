// hooks/useSettings.ts
import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { Settings } from "@/types/settings";
import { toast } from "react-hot-toast";

export function useSettings() {
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
        toast.error('Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };
  
    const updateSettings = async (newSettings: Settings) => {
      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            clientId,
            settings: newSettings
          })
        });
        
        if (!res.ok) throw new Error('Failed to update settings');
        const data = await res.json();
        setSettings(data);
        return data;
      } catch (error) {
        throw new Error('Failed to update settings');
      }
    };
  
    useEffect(() => {
      if (clientId) fetchSettings();
    }, [clientId]);
  
    return { settings, isLoading, updateSettings };
}
