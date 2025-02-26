// hooks/useLocations.ts
import { useState, useCallback, useMemo } from 'react';
import { createLocationsApi } from '@/app/api/external/omnigateway/locations';
import { useGatewayClientApiKey } from './useGatewayClientApiKey';

interface LocationOption {
  value: string;
  label: string;
}

export const useLocations = () => {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createLocationsApi(apiKey) : null, [apiKey]);

  // Fetch all countries
  const fetchCountries = useCallback(async () => {
    if (!api) return;
    
    setIsLoadingCountries(true);
    try {
      const countries = await api.getCountries();
      setCountries(
        countries.map(country => ({
          value: country._id,
          label: country.name
        }))
      );
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setIsLoadingCountries(false);
    }
  }, [api]);

  // Fetch states for a country
  const fetchStates = useCallback(async (countryId: string) => {
    if (!api || !countryId) {
      setStates([]);
      return;
    }
    
    setIsLoadingStates(true);
    try {
      const states = await api.getStates(countryId);
      setStates(
        states.map(state => ({
          value: state._id,
          label: state.name
        }))
      );
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setIsLoadingStates(false);
    }
  }, [api]);

  // Fetch cities for a state
  const fetchCities = useCallback(async (stateId: string) => {
    if (!api || !stateId) {
      setCities([]);
      return;
    }
    
    setIsLoadingCities(true);
    try {
      const cities = await api.getCities(stateId);
      setCities(
        cities.map(city => ({
          value: city._id,
          label: city.name
        }))
      );
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setIsLoadingCities(false);
    }
  }, [api]);

  // Clear location data (useful when country/state changes)
  const clearLocationData = useCallback(() => {
    setStates([]);
    setCities([]);
  }, []);

  return {
    countries,
    states,
    cities,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    fetchCountries,
    fetchStates,
    fetchCities,
    clearLocationData,
    isInitialized: !!api
  };
};