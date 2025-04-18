import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createPollsApi } from '@/app/api/external/omnigateway/polls';
import { Poll, PollParams, PollsResponse, PollStatsResponse } from '@/app/api/external/omnigateway/types/polls';
import { toast } from 'react-hot-toast';

export const usePolls = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [stats, setStats] = useState<PollStatsResponse | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Create polls API instance
  const pollsApi = createPollsApi(user?.apiKey || '');

  // Fetch polls with optional filtering
  const fetchPolls = useCallback(async (clientId: string, params: PollParams = {}) => {
    setIsLoading(true);
    try {
      const response = await pollsApi.getPollsByClientId(clientId, params);
      setPolls(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(response.meta.pages);
      setCurrentPage(params.page || 1);
      return response;
    } catch (error) {
      console.error(`Error fetching polls for client ${clientId}:`, error);
      toast.error('Failed to fetch polls');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pollsApi]);

  // Fetch a single poll
  const fetchPoll = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const poll = await pollsApi.getPoll(id);
      setCurrentPoll(poll);
      return poll;
    } catch (error) {
      console.error(`Error fetching poll ${id}:`, error);
      toast.error('Failed to fetch poll details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pollsApi]);

  // Fetch poll by WordPress ID
  const fetchPollByWordpressId = useCallback(async (wordpressId: number) => {
    setIsLoading(true);
    try {
      const poll = await pollsApi.getPollByWordpressId(wordpressId);
      setCurrentPoll(poll);
      return poll;
    } catch (error) {
      console.error(`Error fetching poll with WordPress ID ${wordpressId}:`, error);
      toast.error('Failed to fetch poll details');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pollsApi]);

  // Update a poll
  const updatePoll = useCallback(async (id: string, pollData: Partial<Poll>) => {
    setIsProcessing(true);
    try {
      const updatedPoll = await pollsApi.updatePoll(id, pollData);
      setCurrentPoll(updatedPoll);
      
      // Update the poll in the list if it exists
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll._id === id ? updatedPoll : poll
        )
      );
      
      toast.success('Poll updated successfully');
      return updatedPoll;
    } catch (error) {
      console.error(`Error updating poll ${id}:`, error);
      toast.error('Failed to update poll');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [pollsApi]);

  // Delete a poll
  const deletePoll = useCallback(async (id: string) => {
    setIsProcessing(true);
    try {
      await pollsApi.deletePoll(id);
      
      // Remove the poll from the list
      setPolls(prevPolls => prevPolls.filter(poll => poll._id !== id));
      
      toast.success('Poll deleted successfully');
    } catch (error) {
      console.error(`Error deleting poll ${id}:`, error);
      toast.error('Failed to delete poll');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [pollsApi]);

  // Vote on a poll
  const votePoll = useCallback(async (id: string, optionIndex: number) => {
    try {
      const updatedPoll = await pollsApi.votePoll(id, optionIndex);
      
      // Update current poll if it's the one we're viewing
      if (currentPoll && currentPoll._id === id) {
        setCurrentPoll(updatedPoll);
      }
      
      // Update the poll in the list if it exists
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll._id === id ? updatedPoll : poll
        )
      );
      
      return updatedPoll;
    } catch (error) {
      console.error(`Error voting on poll ${id}:`, error);
      toast.error('Failed to register vote');
      throw error;
    }
  }, [pollsApi, currentPoll]);

  // Fetch poll stats
  const fetchPollStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const statsData = await pollsApi.getPollStats();
      setStats(statsData);
      return statsData;
    } catch (error) {
      console.error('Error fetching poll stats:', error);
      toast.error('Failed to fetch poll statistics');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pollsApi]);

  return {
    isLoading,
    isProcessing,
    polls,
    currentPoll,
    stats,
    totalItems,
    totalPages,
    currentPage,
    fetchPolls,
    fetchPoll,
    fetchPollByWordpressId,
    updatePoll,
    deletePoll,
    votePoll,
    fetchPollStats
  };
};