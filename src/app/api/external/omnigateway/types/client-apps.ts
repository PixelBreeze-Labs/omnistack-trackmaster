// src/app/api/external/omnigateway/types/client-apps.ts

export enum ClientAppStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

export enum ClientAppType {
  REACT = 'react',
  WORDPRESS = 'wordpress',
  VUE = 'vue',
  NEXT = 'next',
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

export interface ClientAppBrandColors {
  primaryColor?: string;
  primaryHoverColor?: string;
  secondaryColor?: string;
  secondaryHoverColor?: string;
  textOnPrimaryColor?: string;
  textColor?: string;
  darkModePreference?: boolean;
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
  domain: string[];
  configuredAt: string;
  status: ClientAppStatus;
  reportConfig: ClientAppReportConfig;
  client?: ClientAppClient;
  brandColors?: ClientAppBrandColors;
}

export interface ClientAppParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  skip?: number;
}

export interface ClientAppMetrics {
  totalApps: number;
  activeApps: number;
  inactiveApps: number;
  recentApps: number;
}

export interface ClientAppsResponse {
  data: ClientApp[];
  total: number;
  message: string;
  metrics: ClientAppMetrics;
}