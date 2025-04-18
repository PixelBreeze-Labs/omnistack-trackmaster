export interface PollOption {
    optionText: string;
    votes: number;
    customHighlight?: string;
  }
  
  export interface Poll {
    _id: string;
    title: string;
    description?: string;
    highlightColor: string;
    highlightAnimation: 'fade' | 'slide' | 'pulse' | 'bounce' | 'none';
    showResults: boolean;
    autoEmbed: boolean;
    autoEmbedLocations: number[];
    options: PollOption[];
    clientId: string;
    wordpressId?: number;
    createdAt: string;
    updatedAt: string;
    
    // Style customization
    voteButtonColor: string;
    voteButtonHoverColor: string;
    optionsBackgroundColor: string;
    optionsHoverColor: string;
    resultsLinkColor: string;
    resultsLinkHoverColor: string;
    progressBarBackgroundColor: string;
    
    // Radio button styling
    radioBorderColor: string;
    radioCheckedBorderColor: string;
    radioCheckedDotColor: string;
    
    // Dark mode properties
    darkMode: boolean;
    darkModeBackground: string;
    darkModeTextColor: string;
    darkModeOptionBackground: string;
    darkModeOptionHover: string;
    darkModeLinkColor: string;
    darkModeLinkHoverColor: string;
    darkModeProgressBackground: string;
    darkModeRadioBorder: string;
    darkModeRadioCheckedBorder: string;
    darkModeRadioCheckedDot: string;
  }
  
  export interface PollStats {
    totalPolls: number;
    totalVotes: number;
    mostPopularPoll?: {
      id: string;
      title: string;
      votes: number;
    };
    latestPolls?: Array<{
      _id: string;
      title: string;
      createdAt: string;
    }>;
  }
  
  export interface PollsResponse {
    data: Poll[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNext: boolean;
    };
  }
  
  export interface PollStatsResponse {
    totalPolls: number;
    totalVotes: number;
    mostPopularPoll: {
      id: string;
      title: string;
      votes: number;
    } | null;
    latestPolls: Array<{
      id: string;
      title: string;
      createdAt: string;
    }>;
  }
  
  export interface PollParams {
    page?: number;
    limit?: number;
    skip?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fromDate?: string;
    toDate?: string;
  }