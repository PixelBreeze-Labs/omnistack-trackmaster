// src/app/api/external/omnigateway/types/client-apps.ts

export enum ClientAppStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

export enum ClientAppType {
  REACT = 'react',
  WORDPRESS = 'wordpress',
  OTHER = 'other'
}

export interface ClientAppFormConfig {
  title: string;
  subtitle: string;
  nameInput?: {
    placeholder: string;
    required: boolean;
  };
  messageInput?: {
    placeholder: string;
    required: boolean;
  };
  submitButton?: {
    text: string;
    backgroundColor: string;
    textColor: string;
    iconColor: string;
  };
}

export interface ClientAppEmailConfig {
  recipients: string[];
  fromName: string;
  fromEmail: string;
  subject: string;
  template: string | null;
}

export interface ClientAppReportConfig {
  form: ClientAppFormConfig;
  email: ClientAppEmailConfig;
}

export interface ClientAppClient {
  name: string | null;
  code: string | null;
  _id?: string;
}

export interface ClientApp {
  _id: string;
  name: string;
  type: ClientAppType;
  apiKey: string;
  domain: string | string[];
  configuredAt: string;
  status: ClientAppStatus;
  reportConfig: ClientAppReportConfig;
}

export interface ClientAppWithClient extends ClientApp {
  client: ClientAppClient;
}

export interface ClientAppMetrics {
  totalApps: number;
  activeApps: number;
  inactiveApps: number;
  recentApps: number;
}

export interface ClientAppParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ClientAppsResponse {
  data: ClientAppWithClient[];
  total: number;
  message: string;
  metrics: ClientAppMetrics;
}