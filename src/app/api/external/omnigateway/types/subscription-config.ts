// app/api/external/omnigateway/types/subscription-config.ts
export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    CAD = 'CAD',
    AUD = 'AUD',
    JPY = 'JPY',
    CHF = 'CHF'
  }
  
  export interface WebhookConfig {
    endpoint?: string;
    secret?: string;
    enabled?: boolean;
    events?: string[];
  }
  
  export interface StripeAccountConfig {
    accountId?: string;
    publicKey?: string;
    secretKey?: string;
  }
  
  export interface TrialConfig {
    enabled?: boolean;
    durationDays?: number;
  }
  
  export interface InvoiceSettings {
    generateInvoice?: boolean;
    daysUntilDue?: number;
    footer?: string;
  }
  
  export interface SubscriptionConfig {
    productPrefix: string;
    defaultCurrency: Currency;
    webhook: WebhookConfig;
    stripeAccount: StripeAccountConfig;
    trial: TrialConfig;
    invoiceSettings: InvoiceSettings;
  }
  
  export type UpdateSubscriptionConfigDto = Partial<SubscriptionConfig>;