import { createOmniGateway } from './index';
import { Booking, BookingParams, BookingsResponse, SyncResponse } from './types/bookings';

export const createOmniStackBookingApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    getBookings: async (params: BookingParams = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.status) queryParams.append('status', params.status);
      if (params.propertyId) queryParams.append('propertyId', params.propertyId);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      
      const queryString = queryParams.toString();
      const endpoint = `/bookings${queryString ? `?${queryString}` : ''}`;
      
      const { data } = await api.get<BookingsResponse>(endpoint);
      return data;
    },

    getBooking: async (id: string) => {
      const { data } = await api.get<{ data: Booking }>(`/bookings/${id}`);
      return data.data;
    },
    
    syncBookings: async () => {
      const { data } = await api.post<SyncResponse>('/bookings/sync');
      return data;
    },

    deleteBooking: async (id: string) => {
      const { data } = await api.delete(`/bookings/${id}`);
      return data;
    }
  };
};