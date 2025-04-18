import React from 'react';
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
import { Poll } from "@/app/api/external/omnigateway/types/polls";
import { Vote, User, Calendar, BarChart2, Palette, Layout, Eye, Monitor, Sun, Moon } from 'lucide-react';

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

const PollDetailsModal: React.FC<PollDetailsModalProps> = ({ poll, isOpen, onClose }) => {
  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Poll Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the poll
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Basic Information */}
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
                <p className="text-sm font-medium text-gray-700">WordPress ID</p>
                <p className="text-sm">{poll.wordpressId || 'Not connected to WordPress'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Total Votes</p>
                <p className="text-sm">{totalVotes}</p>
              </div>
            </div>
          </div>
          
          {/* Poll Options */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Poll Options</h3>
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center border-b pb-2">
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium">{option.optionText}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Votes: {option.votes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {totalVotes > 0 
                        ? `${Math.round((option.votes / totalVotes) * 100)}%` 
                        : '0%'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Features & Settings */}
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
          
          {/* Styling Information (Collapsible) */}
          <details className="border-t pt-4">
            <summary className="text-lg font-medium cursor-pointer">
              <div className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                Styling Information
              </div>
            </summary>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Highlight Color</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: poll.highlightColor }}
                  />
                  <p className="text-sm">{poll.highlightColor}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Vote Button Color</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: poll.voteButtonColor }}
                  />
                  <p className="text-sm">{poll.voteButtonColor}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Options Background</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: poll.optionsBackgroundColor }}
                  />
                  <p className="text-sm">{poll.optionsBackgroundColor}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Progress Bar Background</p>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border" 
                    style={{ backgroundColor: poll.progressBarBackgroundColor }}
                  />
                  <p className="text-sm">{poll.progressBarBackgroundColor}</p>
                </div>
              </div>
              
              {poll.darkMode && (
                <>
                  <div className="md:col-span-2">
                    <h4 className="text-md font-medium">Dark Mode Colors</h4>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dark Mode Background</p>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: poll.darkModeBackground }}
                      />
                      <p className="text-sm">{poll.darkModeBackground}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dark Mode Text Color</p>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: poll.darkModeTextColor }}
                      />
                      <p className="text-sm">{poll.darkModeTextColor}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </details>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PollDetailsModal;