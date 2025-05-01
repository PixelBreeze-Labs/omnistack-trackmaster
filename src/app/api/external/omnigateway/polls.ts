import { createOmniGateway } from './index';
import { PollsResponse, PollParams, Poll, PollOption, PollStatsResponse } from './types/polls';

export const createPollsApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);
  
  return {
    // Get all polls with optional filtering
    getPolls: async (params: PollParams = {}): Promise<PollsResponse> => {
      const queryParams = new URLSearchParams();
      
      // Handle pagination
      if (params.page !== undefined && params.limit !== undefined) {
        // Convert page to skip
        const skip = (params.page - 1) * params.limit;
        queryParams.append('skip', skip.toString());
        queryParams.append('limit', params.limit.toString());
      } else {
        if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
      }
      
      // Add other filters
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      
      const queryString = queryParams.toString();
      const endpoint = `/polls${queryString ? `?${queryString}` : ''}`;
      
      try {
        const { data } = await api.get<PollsResponse>(endpoint);
        return data;
      } catch (error) {
        console.error('Error fetching polls:', error);
        throw error;
      }
    },
    
    // Get all polls for a specific client
getPollsByClientId: async (clientId: string, params: PollParams = {}): Promise<PollsResponse> => {
  const queryParams = new URLSearchParams();
  
  // Handle pagination
  if (params.page !== undefined && params.limit !== undefined) {
    const skip = (params.page - 1) * params.limit;
    queryParams.append('skip', skip.toString());
    queryParams.append('limit', params.limit.toString());
  } else {
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
  }
  
  // Add other filters
  if (params.search) queryParams.append('search', params.search);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.fromDate) queryParams.append('fromDate', params.fromDate);
  if (params.toDate) queryParams.append('toDate', params.toDate);
  
  const queryString = queryParams.toString();
  const endpoint = `/polls/by-client/${clientId}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const { data } = await api.get<PollsResponse>(endpoint);
    return data;
  } catch (error) {
    console.error(`Error fetching polls for client ${clientId}:`, error);
    throw error;
  }
},
    
    // Get a single poll by ID
    getPoll: async (id: string, clientId?: string): Promise<Poll> => {
      try {
        // Add clientId as a query parameter if provided
        const queryParams = clientId ? `?clientId=${clientId}` : '';
        const { data } = await api.get<Poll>(`/polls/${id}${queryParams}`);
        return data;
      } catch (error) {
        console.error(`Error fetching poll ${id}:`, error);
        throw error;
      }
    },
    
    // Get a poll by WordPress ID
    getPollByWordpressId: async (wordpressId: number): Promise<Poll> => {
      try {
        const { data } = await api.get<Poll>(`/polls/wordpress/${wordpressId}`);
        return data;
      } catch (error) {
        console.error(`Error fetching poll with WordPress ID ${wordpressId}:`, error);
        throw error;
      }
    },
    
    // Update a poll
    updatePoll: async (id: string, pollData: Partial<Poll>, clientId?: string): Promise<Poll> => {
      try {
        // Add clientId as a query parameter if provided
        const queryParams = clientId ? `?clientId=${clientId}` : '';
        const { data } = await api.put<Poll>(`/polls/${id}${queryParams}`, pollData);
        return data;
      } catch (error) {
        console.error(`Error updating poll ${id}:`, error);
        throw error;
      }
    },
    
    // Delete a poll
    deletePoll: async (id: string, clientId?: string): Promise<void> => {
      try {
        // Add clientId as a query parameter if provided
        const queryParams = clientId ? `?clientId=${clientId}` : '';
        await api.delete(`/polls/${id}${queryParams}`);
      } catch (error) {
        console.error(`Error deleting poll ${id}:`, error);
        throw error;
      }
    },
    
    // Vote on a poll option
    votePoll: async (id: string, optionIndex: number): Promise<Poll> => {
      try {
        const { data } = await api.post<Poll>(`/polls/${id}/vote`, { optionIndex });
        return data;
      } catch (error) {
        console.error(`Error voting on poll ${id}:`, error);
        throw error;
      }
    },
    
    // Get stats for polls
    getPollStats: async (): Promise<PollStatsResponse> => {
      try {
        const { data } = await api.get<PollStatsResponse>(`/polls/stats`);
        return data;
      } catch (error) {
        console.error('Error fetching poll stats:', error);
        throw error;
      }
    },

    // Create a new poll
createPoll: async (pollData: Partial<Poll>): Promise<Poll> => {
  try {
    const { data } = await api.post<Poll>('/polls', pollData);
    return data;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
},

// Create a multi-client poll
createMultiClientPoll: async (pollData: Partial<Poll>): Promise<Poll> => {
  try {
    const { data } = await api.post<Poll>('/polls/multi-client', pollData);
    return data;
  } catch (error) {
    console.error('Error creating multi-client poll:', error);
    throw error;
  }
},
    
    // Get stats for polls for a specific client
    getPollStatsByClientId: async (clientId: string): Promise<PollStatsResponse> => {
      try {
        const { data } = await api.get<PollStatsResponse>(`/polls/stats/by-client/${clientId}`);
        return data;
      } catch (error) {
        console.error(`Error fetching poll stats for client ${clientId}:`, error);
        throw error;
      }
    }
  };
};