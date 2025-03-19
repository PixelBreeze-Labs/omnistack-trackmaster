// app/api/external/omnigateway/types/checkin-forms.ts
export interface FormField {
    name: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox';
    label: { [key: string]: string };
    placeholder?: { [key: string]: string };
    required: boolean;
    options?: Array<{
      value: string;
      label: { [key: string]: string };
    }>;
    defaultValue?: any;
    validation?: string;
  }
  
  export interface FormSection {
    name: string;
    title: { [key: string]: string };
    fields: string[];
  }
  
  export interface FormConfig {
    fields: FormField[];
    sections: FormSection[];
    languages: string[];
    defaultLanguage: string;
    submitButtonText: { [key: string]: string };
  }
  
  export interface CheckinFormConfig {
    _id: string;
    shortCode: string;
    clientId: string;
    propertyId?: string;
    bookingId?: string;
    name: string;
    isActive: boolean;
    formConfig: FormConfig;
    expiresAt?: string;
    isPreArrival: boolean;
    requiresAuthentication: boolean;
    receiptEmail?: string;
    views: number;
    lastViewed?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CheckinSubmission {
    _id: string;
    formConfigId: string;
    clientId: string;
    propertyId?: string;
    bookingId?: string;
    guestId?: string;
    formData: Record<string, any>;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    status: 'pending' | 'completed' | 'verified' | 'rejected';
    needsParkingSpot: boolean;
    expectedArrivalTime?: string;
    specialRequests?: string[];
    attachmentUrls?: string[];
    verifiedAt?: string;
    verifiedBy?: string;
    verificationData?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }
  
  export type CreateCheckinFormConfigDto = {
    name: string;
    propertyId?: string;
    bookingId?: string;
    formConfig: FormConfig;
    isActive?: boolean;
    isPreArrival?: boolean;
    requiresAuthentication?: boolean;
    expiresAt?: string;
    receiptEmail?: string;
    metadata?: Record<string, any>;
  }
  
  export type UpdateCheckinFormConfigDto = Partial<CreateCheckinFormConfigDto>;
  
  export interface CheckinFormParams {
    page?: number;
    limit?: number;
    search?: string;
    propertyId?: string;
    bookingId?: string;
    isActive?: boolean;
    isPreArrival?: boolean;
  }
  
  export interface CheckinSubmissionParams {
    page?: number;
    limit?: number;
    formConfigId?: string;
    propertyId?: string;
    guestId?: string;
    bookingId?: string;
    email?: string;
    status?: 'pending' | 'completed' | 'verified' | 'rejected';
    needsParkingSpot?: boolean;
  }
  
  export interface CheckinFormMetrics {
    totalForms: number;
    activeForms: number;
    views: number;
    submissions: number;
    submissionRate: number;
    trends: {
      forms: { value: number; percentage: number; };
      views: { value: number; percentage: number; };
      submissions: { value: number; percentage: number; };
    };
  }
  
  export interface CheckinFormsResponse {
    items: CheckinFormConfig[];
    total: number;
    pages: number;
    page: number;
    limit: number;
    metrics: CheckinFormMetrics;
  }
  
  export interface CheckinSubmissionsResponse {
    items: CheckinSubmission[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }