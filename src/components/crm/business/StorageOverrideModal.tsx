// StorageOverrideModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/new-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, HardDrive, FileIcon, Settings, Info } from "lucide-react";
import { useBusiness } from '@/hooks/useBusiness';

interface StorageOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: any;
  onStorageUpdated: (updatedStorage: any) => void;
}

export default function StorageOverrideModal({ 
  isOpen, 
  onClose, 
  business,
  onStorageUpdated 
}: StorageOverrideModalProps) {
  const [enableOverride, setEnableOverride] = useState(false);
  const [storageLimitMB, setStorageLimitMB] = useState('');
  const [maxFileSizeMB, setMaxFileSizeMB] = useState('');
  
  const { overrideBusinessStorageSettings, isLoading } = useBusiness();

  // Initialize form with current values
  useEffect(() => {
    if (business?.storage) {
      setEnableOverride(business.storage.isOverridden || false);
      
      if (business.storage.isOverridden) {
        setStorageLimitMB(business.storage.settings.limitMB.toString());
        setMaxFileSizeMB(business.storage.settings.maxFileSizeMB.toString());
      } else {
        // This is setting state based on plan limits, but it should set based on current settings
        const planStorageGB = business.storage.planBasedLimits?.storage_gb || 5;
        setStorageLimitMB((planStorageGB * 1024).toString());
        setMaxFileSizeMB('50');
      }
    }
  }, [business, isOpen]);

  const handleSubmit = async () => {
    try {
      const settings = {
        enableOverride,
        ...(enableOverride && {
          storageLimitMB: parseInt(storageLimitMB),
          maxFileSizeMB: parseInt(maxFileSizeMB)
        })
      };

      const result = await overrideBusinessStorageSettings(business._id, settings);
      
      if (result && result.storage) {
        onStorageUpdated(result.storage);
        onClose();
      }
    } catch (error) {
      console.error('Error updating storage settings:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const planStorageGB = business?.storage?.planBasedLimits?.storage_gb || 5;
  const planLimitMB = planStorageGB * 1024;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Storage Override Settings
          </DialogTitle>
          <DialogDescription>
            Configure custom storage limits for this business or use plan-based defaults.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Current Storage Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Current Usage</div>
                  <div className="font-medium">{business?.storage?.usage?.totalSizeMB || 0} MB</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current Limit</div>
                  <div className="font-medium">{business?.storage?.settings?.limitMB || 0} MB</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Files Count</div>
                  <div className="font-medium">{business?.storage?.usage?.fileCount || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Override Status</div>
                  <Badge variant={business?.storage?.isOverridden ? "default" : "outline"}>
                    {business?.storage?.isOverridden ? "Custom" : "Plan-based"}
                  </Badge>
                </div>
              </div>

              {/* Usage Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Storage Used</span>
                  <span>{business?.storage?.usage?.percentUsed || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(business?.storage?.usage?.percentUsed || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Override Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Enable Custom Storage Limits</Label>
              <div className="text-sm text-muted-foreground">
                Override plan-based limits with custom values
              </div>
            </div>
            <Switch
              checked={enableOverride}
              onCheckedChange={setEnableOverride}
              disabled={isLoading}
            />
          </div>

          {/* Plan-based vs Custom Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan-based Limits */}
            <Card className={!enableOverride ? "ring-2 ring-blue-200" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Plan-based Limits
                  {!enableOverride && <Badge variant="outline" className="text-xs">Active</Badge>}
                </CardTitle>
                <CardDescription className="text-xs">
                  Default limits from subscription tier: <span className="font-medium capitalize">{business?.subscription?.tier}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Storage Limit:</span>
                    <span className="font-medium">{planLimitMB} MB ({planStorageGB} GB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max File Size:</span>
                    <span className="font-medium">50 MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Settings */}
            <Card className={enableOverride ? "ring-2 ring-green-200" : "opacity-50"}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Custom Limits
                  {enableOverride && <Badge variant="outline" className="text-xs">Active</Badge>}
                </CardTitle>
                <CardDescription className="text-xs">
                  Override with custom storage limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storageLimitMB" className="text-sm font-medium">
                    Storage Limit (MB)
                  </Label>
                  <Input
                    id="storageLimitMB"
                    type="number"
                    placeholder="e.g., 2048"
                    value={storageLimitMB}
                    onChange={(e) => setStorageLimitMB(e.target.value)}
                    disabled={!enableOverride || isLoading}
                    min="1"
                    max="100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSizeMB" className="text-sm font-medium">
                    Max File Size (MB)
                  </Label>
                  <Input
                    id="maxFileSizeMB"
                    type="number"
                    placeholder="e.g., 100"
                    value={maxFileSizeMB}
                    onChange={(e) => setMaxFileSizeMB(e.target.value)}
                    disabled={!enableOverride || isLoading}
                    min="1"
                    max="1000"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Warnings */}
          {enableOverride && (
            <div className="space-y-2">
              {parseInt(storageLimitMB) < (business?.storage?.usage?.totalSizeMB || 0) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: New storage limit ({storageLimitMB} MB) is less than current usage ({business?.storage?.usage?.totalSizeMB} MB). 
                    This may prevent new file uploads.
                  </AlertDescription>
                </Alert>
              )}
              
              {parseInt(maxFileSizeMB) < 1 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Max file size must be at least 1 MB.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* File Types Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                Allowed File Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {business?.storage?.settings?.allowedFileTypes?.map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    .{type}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                File type restrictions are managed globally and cannot be overridden per business.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || (enableOverride && (!storageLimitMB || !maxFileSizeMB))}
            className="min-w-[100px]"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}