// app/api/external/omnigateway/types/business.ts
export enum BusinessType {
  // Companies
  CORPORATION = 'corporation',
  PRIVATE_COMPANY = 'private_company',
  PUBLIC_COMPANY = 'public_company',
  LLC = 'llc',

  // Partnerships
  PARTNERSHIP = 'partnership',
  LIMITED_PARTNERSHIP = 'limited_partnership',
  GENERAL_PARTNERSHIP = 'general_partnership',

  // Individual Ownership
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  SOLO_OWNERSHIP = 'solo_ownership',
  FREELANCER = 'freelancer',

  // Special Types
  STARTUP = 'startup',
  NONPROFIT = 'nonprofit',
  COOPERATIVE = 'cooperative',

  // Regional Types
  PLC = 'plc',                    // Public Limited Company (UK)
  LTD = 'ltd',                    // Limited Company (UK)
  GMBH = 'gmbh',                  // German Company Type
  SARL = 'sarl',                  // French Company Type

  // Other Categories
  FRANCHISE = 'franchise',
  FAMILY_BUSINESS = 'family_business',
  JOINT_VENTURE = 'joint_venture',
  OTHER = 'other'
}

export enum BusinessOperationType {
  FIELD_SERVICE = 'field_service',
  IN_HOUSE = 'in_house',
  HYBRID = 'hybrid'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  TRIALING = 'trialing'
}

export enum BusinessStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface BusinessAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface BusinessUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SubscriptionDetails {
  planId: string;
  priceId: string;
  interval: 'month' | 'year';
  amount: number;
  currency: string;
}

export interface BusinessCapabilities {
  allow_clockinout: boolean;
  has_app_access: boolean;
  allow_checkin: boolean;
}

export interface BusinessCapabilitiesUpdate extends Partial<BusinessCapabilities> {
  applyToAllEmployees?: boolean;
}

export interface EmployeeCapabilitiesUpdate extends Partial<BusinessCapabilities> {
}

export interface Business extends BusinessCapabilities {
  _id: string;
  name: string;
  type: BusinessType;
  email: string;
  phone?: string;
  clientId: string;
  adminUserId: string;
  userIds?: string[];
  address?: BusinessAddress;
  apiKey?: string;
  externalIds: {
    venueboostId?: string;
    [key: string]: string | undefined;
  };
  operationType?: BusinessOperationType;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate?: string;
  subscriptionDetails?: SubscriptionDetails;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  taxId?: string;
  vatNumber?: string;
  createdAt: string;
  updatedAt: string;
  adminUser?: BusinessUser;
}

export interface BusinessFormData {
  businessType: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode?: string;
    country: string;
  };
  taxId: string;
  vatNumber: string;
}

export interface BusinessSubscribeRequest {
  businessDetails?: {
    businessType?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postcode?: string;
      country?: string;
    };
    taxId?: string;
    vatNumber?: string;
  };
  subscription: {
    planId: string;
    interval: 'month' | 'year';
  };
}

export interface BusinessParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isTrialing?: boolean;
  isTestAccount?: boolean;
  isActive?: boolean;
  sort?: string;
}

export interface BusinessMetrics {
  totalBusinesses: number;
  activeBusinesses: number;
  trialBusinesses: number;
  businessesByStatus: {
    active: number;
    trialing: number;
    pastDue: number;
    canceled: number;
    incomplete: number;
  };
  trends: {
    newBusinesses: { value: number; percentage: number; };
    churnRate: { value: number; percentage: number; };
  };
}

export interface BusinessesResponse {
  items: Business[];
  total: number;
  pages: number;
  page: number;
  limit: number;
  metrics: BusinessMetrics;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  checkoutUrl: string;
}

export interface FinalizeSubscriptionResponse {
  success: boolean;
  message: string;
  businessId: string;
  status: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  businessId: string;
  user_id?: string;
  allow_clockinout?: boolean;
  has_app_access?: boolean;
  allow_checkin?: boolean;
  external_ids?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessUpdateResponse {
  success: boolean;
  message: string;
  business: Business;
}

export interface CapabilitiesUpdateResponse {
  success: boolean;
  message: string;
  business: Business;
  updatedEmployeesCount?: number;
}

export interface EmployeeUpdateResponse {
  success: boolean;
  message: string;
  employee: Employee;
  capabilities?: BusinessCapabilities;
}