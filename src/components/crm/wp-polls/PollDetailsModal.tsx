import React, { useState } from 'react';
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
  MousePointer
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

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Poll Details
          </DialogTitle>
          <DialogDescription>
            Complete information about "{poll.title}"
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
            <TabsTrigger value="darkMode">Dark Mode</TabsTrigger>
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
          
          {/* Styling Tab */}
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
          
          {/* Dark Mode Tab */}
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
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PollDetailsModal;