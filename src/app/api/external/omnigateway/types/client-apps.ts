// src/app/api/external/omnigateway/types/client-apps.ts

export enum ClientAppStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    INACTIVE = 'inactive'
  }
  
  export enum ClientAppType {
    REACT = 'react',
    WORDPRESS = 'wordpress',
    OTHER = 'other'
  }
  
  export interface ClientApp {
    _id: string;
    name: string;
    type: ClientAppType;
    apiKey: string;
    domain: string[];
    configuredAt: string;
    status: ClientAppStatus;
    reportConfig: {
      form: {
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
        title: string;
        subtitle: string;
      };
      email: {
        recipients: string[];
        fromName: string;
        fromEmail: string;
        subject: string;
        template?: string;
      };
    };
    __v?: number;
  }
  
  export interface ClientAppWithClient extends ClientApp {
    client?: {
      name: string | null;
      code: string | null;
    };
  }
  
  export interface ClientAppParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: ClientAppType;
    status?: ClientAppStatus;
    fromDate?: string;
    toDate?: string;
  }
  
  export interface ClientAppsResponse {
    data: ClientApp[];
    message: string;
    total: number;
  }