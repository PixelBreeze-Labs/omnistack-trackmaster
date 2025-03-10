import { useState, useCallback, useMemo } from 'react';
import { createOmniStackBookingApi } from '@/app/api/external/omnigateway/booking';
import { 
  Booking,
  BookingParams,
} from "@/app/api/external/omnigateway/types/bookings";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useBookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingBooking, setIsDeletingBooking] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createOmniStackBookingApi(apiKey) : null, [apiKey]);

  // Fetch bookings with optional filtering
  const fetchBookings = useCallback(async (params: BookingParams = {}) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.getBookings(params);
      setBookings(response.data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / (params.limit || 10)));
      return response;
    } catch (error) {
      toast.error('Failed to fetch bookings');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Get a single booking by ID
  const getBooking = useCallback(async (id: string) => {
    if (!api) return;
    try {
      setIsLoading(true);
      const booking = await api.getBooking(id);
      return booking;
    } catch (error) {
      toast.error('Failed to fetch booking details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Sync bookings from VenueBoost
  const syncBookings = useCallback(async () => {
    if (!api) return;
    try {
      setIsLoading(true);
      const response = await api.syncBookings();
      return response;
    } catch (error) {
      toast.error('Failed to sync bookings');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Delete a booking
  const deleteBooking = useCallback(async (booking: Booking) => {
    if (!api) {
      toast.error('API client not initialized');
      return;
    }
    
    try {
      setIsDeletingBooking(true);
      await api.deleteBooking(booking.id);
      
      // Remove booking from the local state to update UI
      setBookings(currentBookings => 
        currentBookings.filter(b => b.id !== booking.id)
      );
      
      // Update total count
      setTotalItems(prev => prev - 1);
      
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete booking');
      }
      
      throw error;
    } finally {
      setIsDeletingBooking(false);
    }
  }, [api]);

  return {
    isLoading,
    isDeletingBooking,
    bookings,
    totalItems,
    totalPages,
    fetchBookings,
    getBooking,
    syncBookings,
    deleteBooking,
    isInitialized: !!api
  };
};