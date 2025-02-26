// app/api/external/omnigateway/locations.ts
import { createOmniGateway } from './index';

interface Country {
  _id: string;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

interface State {
  _id: string;
  name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string;
  latitude: string;
  longitude: string;
}

interface City {
  _id: string;
  name: string;
  state_id: string;
  state_code: string;
  state_name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  latitude: string;
  longitude: string;
  wikiDataId: string;
}

export const createLocationsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);

  return {
    // Get all countries
    getCountries: async (): Promise<Country[]> => {
      const { data } = await api.get('/locations/countries');
      return data;
    },

    // Get states by country ID
    getStates: async (countryId: string): Promise<State[]> => {
      const { data } = await api.get(`/locations/states?countryId=${countryId}`);
      return data;
    },

    // Get cities by state ID
    getCities: async (stateId: string): Promise<City[]> => {
      const { data } = await api.get(`/locations/cities?stateId=${stateId}`);
      return data;
    }
  };
};