// types/settings.ts
export interface Settings {
    integrations: {
      venueBoost: {
        enabled: boolean;
        webhookApiKey?: string;
        venueShortCode?: string; 
      };
    };
  }