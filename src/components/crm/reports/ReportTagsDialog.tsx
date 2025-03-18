import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminReport } from "@/app/api/external/omnigateway/types/admin-reports";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tag, Search, Plus, X } from "lucide-react";
import { useReportTags } from "@/hooks/useReportTags";
import { createAdminReportsApi } from "@/app/api/external/omnigateway/admin-reports";
import { useGatewayClientApiKey } from "@/hooks/useGatewayClientApiKey";
import toast from 'react-hot-toast';

interface ReportTagsDialogProps {
  open: boolean;
  onClose: () => void;
  report: AdminReport;
  onTagsUpdated?: () => void; // Add callback for parent component refresh
}

export function ReportTagsDialog({ 
  open, 
  onClose, 
  report,
  onTagsUpdated
}: ReportTagsDialogProps) {
  const { reportTags, fetchReportTags, isLoading, isInitialized } = useReportTags();
  const [selectedTags, setSelectedTags] = useState<string[]>(report.reportTags || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { apiKey } = useGatewayClientApiKey();

  useEffect(() => {
    if (open && isInitialized) {
      fetchReportTags();
    }
  }, [open, fetchReportTags, isInitialized]);

  // When dialog opens, initialize selected tags from report
  useEffect(() => {
    if (open) {
      // Handle both string IDs and full tag objects
      const tagIds = Array.isArray(report.reportTags) 
        ? report.reportTags.map(tag => typeof tag === 'string' ? tag : tag._id)
        : [];
      setSelectedTags(tagIds);
    }
  }, [open, report]);

  const handleToggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSave = async () => {
    if (!apiKey || !report._id) {
        toast.error('Missing API key or report ID"');
      
      return;
    }

    setIsProcessing(true);
    try {
      // Use the Admin Reports API to update tags
      const adminReportsApi = createAdminReportsApi(apiKey);
      await adminReportsApi.updateReportTags(report._id, selectedTags);
      toast.success('Report tags updated successfully');
    
      
      // Call the callback to refresh parent component
      if (onTagsUpdated) {
        onTagsUpdated();
      }
      
      onClose();

       // Add a slight delay to ensure the dialog closing animation completes
    setTimeout(() => {
      // Force refresh the page after dialog is closed
      window.location.reload();
    }, 300);
    } catch (error) {
      console.error("Error updating tags:", error);
      toast.error('Failed to update report tags');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter tags based on search term
  const filteredTags = reportTags?.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Manage Report Tags
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium mb-2">
            Report: <span className="text-muted-foreground">{report.title}</span>
          </h3>
          
          {/* Selected tags display */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {selectedTags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags selected</p>
            ) : (
              selectedTags.map(tagId => {
                const tag = reportTags?.find(t => t._id === tagId);
                return (
                  <Badge 
                    key={tagId} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag?.name || tagId}
                    <button 
                      onClick={() => handleToggleTag(tagId)}
                      className="h-3.5 w-3.5 rounded-full hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })
            )}
          </div>
          
          {/* Tag search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              className="pl-8 mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Available tags */}
          <div className="border rounded-md h-56 overflow-y-auto p-3">
            {isLoading ? (
              <p className="text-center text-muted-foreground text-sm">Loading tags...</p>
            ) : reportTags?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No tags found</p>
                <Button size="sm" variant="outline" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tag
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTags?.map(tag => (
                  <div key={tag._id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={tag._id} 
                      checked={selectedTags.includes(tag._id)} 
                      onCheckedChange={() => handleToggleTag(tag._id)}
                    />
                    <label 
                      htmlFor={tag._id} 
                      className="flex flex-1 text-sm items-center justify-between cursor-pointer truncate"
                    >
                      <span>{tag.name}</span>
                      {tag.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {tag.description}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
                
                {filteredTags?.length === 0 && searchTerm && (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground">No tags match your search</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}