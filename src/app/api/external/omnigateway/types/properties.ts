// app/api/external/omnigateway/types/properties.ts
export enum PropertyType {
    APARTMENT = 'apartment',
    HOUSE = 'house',
    VILLA = 'villa',
    CABIN = 'cabin',
    STUDIO = 'studio',
    HOTEL_ROOM = 'hotel_room',
    HOSTEL = 'hostel',
    RESORT = 'resort',
    CONDO = 'condo',
    BUNGALOW = 'bungalow',
    CHALET = 'chalet',
    COTTAGE = 'cottage',
    GUEST_HOUSE = 'guest_house',
    FARM_STAY = 'farm_stay',
    OTHER = 'other'
  }
  
  export enum PropertyStatus {
    ACTIVE = 'active',
    MAINTENANCE = 'maintenance',
    INACTIVE = 'inactive'
  }
  
  export interface RentalUnit {
    id: string;
    name: string;
    address?: string;
    unit_code?: string;
    created_at: string;
    accommodation_type?: string;
    url?: string;
    status: PropertyStatus;
    externalIds: {
      venueboostId?: string;
      [key: string]: string | undefined;
    };
    type: PropertyType;
    metadata?: {
      [key: string]: any;
    };
    currency?: string;
  }
  
  export interface RentalUnitParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    status?: PropertyStatus;
    type?: PropertyType;
  }
  
  export interface RentalUnitsResponse {
    data: RentalUnit[];
    message: string;
    total: number;
  }
  
  export interface SyncResponse {
    success: boolean;
    message: string;
    created: number;
    updated: number;
    unchanged: number;
  }