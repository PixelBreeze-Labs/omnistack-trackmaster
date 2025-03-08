export enum BookingStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
  }
  
  export enum PaymentMethod {
    CARD = 'card',
    CASH = 'cash'
  }
  
  export interface Booking {
    id: string;
    propertyId: string;
    guestId: string;
    guestCount: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    discountAmount: number;
    subtotal: number;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    prepaymentAmount: number;
    stripePaymentId?: string;
    confirmationCode: string;
    createdAt: string;
    updatedAt: string;
    externalIds: {
      venueboostId?: string;
      [key: string]: string | undefined;
    };
    metadata?: {
      guestName?: string;
      guestEmail?: string;
      propertyName?: string;
      [key: string]: any;
    };
  }
  
  export interface BookingParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    status?: BookingStatus;
    propertyId?: string;
    fromDate?: string;
    toDate?: string;
  }
  
  export interface BookingsResponse {
    data: Booking[];
    message: string;
    total: number;
  }
  
  export interface SyncResponse {
    success: boolean;
    message: string;
    created: number;
    updated: number;
    unchanged: number;
    errors: number;
  }