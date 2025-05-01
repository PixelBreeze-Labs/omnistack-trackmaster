import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Poll } from "@/app/api/external/omnigateway/types/polls";
import { useClients } from "@/hooks/useClients";
import { 
  Vote, 
  Calendar, 
  BarChart2, 
  Palette, 
  Layout, 
  Eye, 
  Sun, 
  Moon, 
  Brush,
  CircleCheck,
  RadioTower,
  MousePointer,
  PieChart,
  Users
} from 'lucide-react';

interface PollDetailsModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateString;
  }
};

const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <div className="flex items-center space-x-2">
      <div 
        className="w-4 h-4 rounded-full border" 
        style={{ backgroundColor: color }}
      />
      <p className="text-sm font-mono">{color}</p>
    </div>
  </div>
);

const PollDetailsModal: React.FC<PollDetailsModalProps> = ({ poll, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientNames, setClientNames] = useState<{[key: string]: string}>({});
  const { getClient } = useClients();
  
  // Reset active tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen]);
  
  // Fetch client names when modal opens and poll is multi-client
  useEffect(() => {
    const fetchClientNames = async () => {
      if (!isOpen || !poll || !poll.isMultiClient || !poll.clientIds || poll.clientIds.length <= 1) {
        return;
      }
      
      const names: {[key: string]: string} = {};
      
      for (const clientId of poll.clientIds) {
        try {
          const response = await getClient(clientId);
          
          // Handle both the old and new response format
          const client = response?.client || response;
          
          if (client) {
            names[clientId] = client.name;
          } else {
            names[clientId] = `Client ${clientId.substring(0, 6)}...`;
          }
        } catch (error) {
          console.error(`Error loading client ${clientId}:`, error);
          names[clientId] = `Client ${clientId.substring(0, 6)}...`;
        }
      }
      
      setClientNames(names);
    };
    
    fetchClientNames();
  }, [isOpen, poll, getClient]);

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  // Determine if this is a multi-client poll
  const isMultiClientPoll = poll.isMultiClient && poll.clientIds && poll.clientIds.length > 1;

  // Get client name (or fallback to ID)
  const getClientName = (clientId: string) => {
    return clientNames[clientId] || `Client ${clientId.substring(0, 6)}...`;
  };

  // Generate tabs based on poll type
  const getTabs = () => {
    // Common tabs for all poll types
    const tabs = [
      <TabsTrigger key="overview" value="overview">Overview</TabsTrigger>,
      <TabsTrigger key="options" value="options">Options</TabsTrigger>
    ];
    
    // For multi-client polls, add distribution tab
    if (isMultiClientPoll) {
      tabs.push(<TabsTrigger key="distribution" value="distribution">Vote Distribution</TabsTrigger>);
    } 
    // For normal polls, add styling and dark mode tabs
    else {
      tabs.push(<TabsTrigger key="styling" value="styling">Styling</TabsTrigger>);
      tabs.push(<TabsTrigger key="darkMode" value="darkMode">Dark Mode</TabsTrigger>);
    }
    
    return tabs;
  };

  // Get a color for a specific client
  const getClientColor = (index: number) => {
    const colors = [
      '#2563eb', // blue
      '#db2777', // pink
      '#16a34a', // green
      '#ea580c', // orange
      '#9333ea', // purple
      '#0891b2', // cyan
      '#d97706', // amber
      '#4338ca', // indigo
      '#be123c', // rose
      '#166534'  // emerald
    ];
    
    return colors[index % colors.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Poll Details {isMultiClientPoll && <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">Multi-Client</Badge>}
          </DialogTitle>
          <DialogDescription>
            Complete information about "{poll.title}"
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-4">
            {getTabs()}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Title</p>
                  <p className="text-sm">{poll.title}</p>
                </div>
                {poll.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-sm">{poll.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">Created</p>
                  <p className="text-sm">{formatDate(poll.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Updated</p>
                  <p className="text-sm">{formatDate(poll.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Votes</p>
                  <p className="text-sm">{totalVotes}</p>
                </div>
                
                {isMultiClientPoll && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700">Clients Using This Poll</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {poll.clientIds?.map((clientId, index) => (
                        <Badge 
                          key={clientId} 
                          variant="outline"
                          style={{ borderColor: getClientColor(index), color: getClientColor(index) }}
                        >
                          {getClientName(clientId)}
                          {clientId === poll.clientId && " (Primary)"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Features & Settings</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={poll.showResults ? "default" : "outline"} className={poll.showResults ? "bg-green-100 text-green-800 border-green-200" : ""}>
                  <Eye className="mr-1 h-3 w-3" />
                  {poll.showResults ? "Show Results Enabled" : "Results Hidden Until Vote"}
                </Badge>
                
                <Badge variant={poll.autoEmbed ? "default" : "outline"} className={poll.autoEmbed ? "bg-blue-100 text-blue-800 border-blue-200" : ""}>
                  <Layout className="mr-1 h-3 w-3" />
                  {poll.autoEmbed ? "Auto-embed Enabled" : "Manual Embed Only"}
                </Badge>
                
                <Badge variant={poll.darkMode ? "default" : "outline"} className={poll.darkMode ? "bg-slate-700 text-slate-100 border-slate-600" : ""}>
                  {poll.darkMode ? <Moon className="mr-1 h-3 w-3" /> : <Sun className="mr-1 h-3 w-3" />}
                  {poll.darkMode ? "Dark Mode Enabled" : "Light Mode Only"}
                </Badge>
                
                {isMultiClientPoll && (
                  <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">
                    <Users className="mr-1 h-3 w-3" />
                    Multi-Client Poll
                  </Badge>
                )}

                {poll.allowMultipleVotes && (
                  <Badge variant="default" className="bg-amber-100 text-amber-800 border-amber-200">
                    <Vote className="mr-1 h-3 w-3" />
                    Multiple Votes Allowed
                  </Badge>
                )}
              </div>
              
              {poll.autoEmbed && poll.autoEmbedLocations && poll.autoEmbedLocations.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Auto-embed Locations</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {poll.autoEmbedLocations.map((location, index) => (
                      <Badge key={index} variant="outline">
                        Post ID: {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700">Animation Style</p>
                <p className="text-sm capitalize">{poll.highlightAnimation}</p>
              </div>
            </div>
          </TabsContent>
          
          {/* Options Tab */}
          <TabsContent value="options" className="space-y-4">
            <h3 className="text-lg font-medium">Poll Options</h3>
            <div className="space-y-4">
              {poll.options.map((option, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Option {index + 1}</p>
                      <p className="text-lg mt-1">{option.optionText}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className="mb-1">
                        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                      </Badge>
                      {totalVotes > 0 && (
                        <span className="text-sm font-medium">
                          {Math.round((option.votes / totalVotes) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {option.customHighlight && (
                    <div className="mt-3 flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full border mr-2" 
                        style={{ backgroundColor: option.customHighlight }}
                      />
                      <p className="text-sm">Custom highlight: {option.customHighlight}</p>
                    </div>
                  )}
                  
                  <div className="mt-2 bg-gray-100 rounded-md h-8 overflow-hidden">
                    <div 
                      className="h-full" 
                      style={{ 
                        width: totalVotes > 0 ? `${Math.round((option.votes / totalVotes) * 100)}%` : '0%',
                        backgroundColor: option.customHighlight || poll.highlightColor,
                        transition: 'width 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Vote Distribution Tab - Only for multi-client polls */}
          {isMultiClientPoll && (
            <TabsContent value="distribution" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Vote Distribution by Client</h3>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-4">
                    This poll is shared across multiple clients. Below is the vote distribution for each option.
                  </p>
                  
                  {/* Client Vote Distribution Summary */}
                  <div className="mb-6 border-b pb-4">
                    <h4 className="font-medium text-md mb-2">Vote Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {poll.clientIds?.map((clientId, index) => {
                        // Calculate total votes from this client
                        let clientVotes = 0;
                        poll.options.forEach(option => {
                          if (option.clientVotes && option.clientVotes[clientId]) {
                            clientVotes += option.clientVotes[clientId];
                          }
                        });
                        
                        // Calculate percentage
                        const percentage = totalVotes > 0 ? Math.round((clientVotes / totalVotes) * 100) : 0;
                        
                        return (
                          <div 
                            key={clientId} 
                            className="bg-white p-3 rounded-md border"
                            style={{ borderLeftWidth: '4px', borderLeftColor: getClientColor(index) }}
                          >
                            <h5 className="text-sm font-medium flex items-center gap-1">
                              {getClientName(clientId)}
                              {clientId === poll.clientId && (
                                <Badge variant="outline" className="text-xs">Primary</Badge>
                              )}
                            </h5>
                            <p className="text-2xl font-bold">{clientVotes}</p>
                            <p className="text-xs text-gray-500">{percentage}% of total votes</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Distribution by Option */}
                  <h4 className="font-medium text-md mb-3">Distribution by Option</h4>
                  {poll.options.map((option, optionIndex) => {
                    // Calculate total votes for this option
                    const optionVotes = option.votes;
                    
                    return (
                      <div key={optionIndex} className="mb-6 border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Option {optionIndex + 1}: {option.optionText}</h5>
                          <Badge variant="outline">{optionVotes} votes</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {poll.clientIds?.map((clientId, clientIndex) => {
                            // Get votes from this client for this option
                            const clientOptionVotes = option.clientVotes && option.clientVotes[clientId] ? option.clientVotes[clientId] : 0;
                            
                            // Calculate percentage of option votes
                            const percentage = optionVotes > 0 ? Math.round((clientOptionVotes / optionVotes) * 100) : 0;
                            
                            return (
                              <div 
                                key={clientId} 
                                className="bg-white p-2 rounded-md border"
                                style={{ borderLeftWidth: '4px', borderLeftColor: getClientColor(clientIndex) }}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">{getClientName(clientId)}</span>
                                  <span className="text-sm font-medium">{clientOptionVotes} votes ({percentage}%)</span>
                                </div>
                                
                                <div className="mt-1 bg-gray-100 rounded-md h-4 overflow-hidden">
                                  <div 
                                    className="h-full" 
                                    style={{ 
                                      width: optionVotes > 0 ? `${percentage}%` : '0%',
                                      backgroundColor: getClientColor(clientIndex),
                                      transition: 'width 0.5s ease-out'
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          )}
          
          {/* Styling Tab - Only for normal polls */}
          {!isMultiClientPoll && (
            <TabsContent value="styling" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Visual Styling</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                  <ColorSwatch color={poll.highlightColor} label="Highlight Color" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Animation Style</p>
                    <p className="text-sm capitalize">{poll.highlightAnimation}</p>
                  </div>
                  <ColorSwatch color={poll.voteButtonColor} label="Vote Button Color" />
                  <ColorSwatch color={poll.voteButtonHoverColor} label="Vote Button Hover" />
                  <ColorSwatch color={poll.optionsBackgroundColor} label="Options Background" />
                  <ColorSwatch color={poll.optionsHoverColor} label="Options Hover" />
                  <ColorSwatch color={poll.resultsLinkColor} label="Results Link Color" />
                  <ColorSwatch color={poll.resultsLinkHoverColor} label="Results Link Hover" />
                  <ColorSwatch color={poll.progressBarBackgroundColor} label="Progress Bar Background" />
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-2 border-t">
                  <RadioTower className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Radio Button Styling</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                  <ColorSwatch color={poll.radioBorderColor} label="Border (unchecked)" />
                  <ColorSwatch color={poll.radioCheckedBorderColor} label="Border (checked)" />
                  <ColorSwatch color={poll.radioCheckedDotColor} label="Dot Color" />
                </div>
              </div>
            </TabsContent>
          )}
          
          {/* Dark Mode Tab - Only for normal polls */}
          {!isMultiClientPoll && (
            <TabsContent value="darkMode" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Dark Mode Settings</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={poll.darkMode ? "default" : "outline"} className={poll.darkMode ? "bg-slate-700 text-slate-100 border-slate-600" : ""}>
                    {poll.darkMode ? "Dark Mode Enabled" : "Dark Mode Disabled"}
                  </Badge>
                </div>
                
                {poll.darkMode && (
                  <>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-4 rounded-md text-white">
                      <ColorSwatch color={poll.darkModeBackground} label="Background" />
                      <ColorSwatch color={poll.darkModeTextColor} label="Text Color" />
                      <ColorSwatch color={poll.darkModeOptionBackground} label="Option Background" />
                      <ColorSwatch color={poll.darkModeOptionHover} label="Option Hover" />
                      <ColorSwatch color={poll.darkModeLinkColor} label="Link Color" />
                      <ColorSwatch color={poll.darkModeLinkHoverColor} label="Link Hover Color" />
                      <ColorSwatch color={poll.darkModeProgressBackground} label="Progress Background" />
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 pt-2 border-t">
                      <RadioTower className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Dark Mode Radio Styling</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800 p-4 rounded-md text-white">
                      <ColorSwatch color={poll.darkModeRadioBorder} label="Border (unchecked)" />
                      <ColorSwatch color={poll.darkModeRadioCheckedBorder} label="Border (checked)" />
                      <ColorSwatch color={poll.darkModeRadioCheckedDot} label="Dot Color" />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PollDetailsModal;