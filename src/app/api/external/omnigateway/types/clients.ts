// src/app/api/external/omnigateway/types/clients.ts

export enum ClientStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    INACTIVE = 'inactive'
}
  
export interface Client {
    _id: string;
    name: string;
    code: string;
    clientAppIds: string[];
    defaultCurrency: string;
    isActive: boolean;
    apiKey: string;
    createdAt: string;
    updatedAt: string;
    loyaltyProgram?: {
        programName: string;
        currency: string;
        pointsSystem: {
            earningPoints: {
                spend: number;
                signUpBonus: number;
                reviewPoints: number;
                socialSharePoints: number;
                bonusDays: Array<{
                    name: string;
                    date: string;
                    multiplier: number;
                }>;
            };
            redeemingPoints: {
                pointsPerDiscount: number;
                discountValue: number;
                discountType: string;
                exclusiveRewards: string[];
            };
        };
        membershipTiers: Array<{
            name: string;
            spendRange: {
                min: number;
                max: number;
                _id: string;
            };
            pointsMultiplier: number;
            birthdayReward: number;
            perks: string[];
            referralPoints: number;
        }>;
        stayTracking: {
            evaluationPeriod: {
                upgrade: number;
                downgrade: number;
            };
            pointsPerStay: Record<string, number>;
            stayDefinition: {
                minimumNights: number;
                checkoutRequired: boolean;
            };
        };
    };
    subscriptionConfig?: {
        productPrefix: string;
        defaultCurrency: string;
        webhook: {
            endpoint: string;
            enabled: boolean;
            events: string[];
        };
        stripeAccount: {
            accountId: string;
            publicKey: string;
        };
        trial: {
            enabled: boolean;
            durationDays: number;
        };
        invoiceSettings: {
            generateInvoice: boolean;
            daysUntilDue: number;
            footer: string;
        };
    };
    venueBoostConnection?: {
        venueShortCode: string;
        connectedAt: string;
        status: string;
    };
}
  
export interface ClientParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: ClientStatus;
    fromDate?: string;
    toDate?: string;
}

// Added metrics to the response interface
export interface ClientMetrics {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    recentClients: number;
}
  
export interface ClientsResponse {
    data: Client[];
    message: string;
    total: number;
    metrics?: ClientMetrics; // Added metrics to the response
}