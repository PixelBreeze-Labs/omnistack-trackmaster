export interface PollOption {
  optionText: string;
  votes: number;
  customHighlight?: string;
  clientVotes?: Map<string, number>; // Tracks votes by client ID
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
  autoEmbedAllPosts?: boolean; // New field added for "embed in all posts" option
  options: PollOption[];
  clientId: string; // Primary client ID
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
  
  // Style properties for percentage label and icons
  percentageLabelColor: string;
  iconColor: string;
  iconHoverColor: string;
  
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
  darkModePercentageLabelColor: string;
  darkModeIconColor: string;
  darkModeIconHoverColor: string;
  
  // Multi-client properties
  isMultiClient: boolean;
  clientIds: string[]; // All client IDs that have access to this poll
  additionalClientIds?: string[]; // Used during creation/update
  clientStyleOverrides?: { [clientId: string]: any }; // Style overrides for specific clients
}

// Create a separate interface for poll creation since some fields are optional
export interface CreatePollDto {
  title: string;
  description?: string;
  highlightColor?: string;
  highlightAnimation?: 'fade' | 'slide' | 'pulse' | 'bounce' | 'none';
  showResults?: boolean;
  autoEmbed?: boolean;
  autoEmbedLocations?: number[];
  autoEmbedAllPosts?: boolean;
  options: PollOption[];
  clientId: string; // Primary client ID
  
  // Style customization fields (all optional with defaults)
  voteButtonColor?: string;
  voteButtonHoverColor?: string;
  optionsBackgroundColor?: string;
  optionsHoverColor?: string;
  resultsLinkColor?: string;
  resultsLinkHoverColor?: string;
  progressBarBackgroundColor?: string;
  radioBorderColor?: string;
  radioCheckedBorderColor?: string;
  radioCheckedDotColor?: string;
  percentageLabelColor?: string;
  iconColor?: string;
  iconHoverColor?: string;
  
  // Dark mode properties (optional)
  darkMode?: boolean;
  darkModeBackground?: string;
  darkModeTextColor?: string;
  darkModeOptionBackground?: string;
  darkModeOptionHover?: string;
  darkModeLinkColor?: string;
  darkModeLinkHoverColor?: string;
  darkModeProgressBackground?: string;
  darkModeRadioBorder?: string;
  darkModeRadioCheckedBorder?: string;
  darkModeRadioCheckedDot?: string;
  darkModePercentageLabelColor?: string;
  darkModeIconColor?: string;
  darkModeIconHoverColor?: string;
  
  // Multi-client properties
  isMultiClient?: boolean;
  additionalClientIds?: string[];
  clientStyleOverrides?: { [clientId: string]: any };
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