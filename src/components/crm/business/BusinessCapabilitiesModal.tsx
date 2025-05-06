// components/crm/business/business-capabilities-modal.tsx
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBusinessCapabilities } from "@/hooks/useBusinessCapabilities";
import { Business, BusinessCapabilitiesUpdate } from "@/app/api/external/omnigateway/types/business";
import {
  AlarmClock,
  Smartphone,
  MapPin,
  Users,
  AlertTriangle,
  Check
} from "lucide-react";

interface BusinessCapabilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business | null;
  onCapabilitiesUpdated?: (updatedBusiness: Business) => void;
}

export default function BusinessCapabilitiesModal({
  isOpen,
  onClose,
  business,
  onCapabilitiesUpdated,
}: BusinessCapabilitiesModalProps) {
  const { 
    updateBusinessCapabilities, 
    isLoading,
    error
  } = useBusinessCapabilities();

  // Local state for the capabilities
  const [allowClockInOut, setAllowClockInOut] = useState<boolean>(true);
  const [hasAppAccess, setHasAppAccess] = useState<boolean>(true);
  const [allowCheckIn, setAllowCheckIn] = useState<boolean>(true);
  const [applyToAll, setApplyToAll] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Initialize values when business changes
  useEffect(() => {
    if (business) {
      setAllowClockInOut(business.allow_clockinout ?? true);
      setHasAppAccess(business.has_app_access ?? true);
      setAllowCheckIn(business.allow_checkin ?? true);
    }
    setSuccess(false);
  }, [business, isOpen]);

  // Handle save
  const handleSave = async () => {
    if (!business) return;

    const capabilities: BusinessCapabilitiesUpdate = {
      allow_clockinout: allowClockInOut,
      has_app_access: hasAppAccess,
      allow_checkin: allowCheckIn
    };

    if (applyToAll) {
      capabilities.applyToAllEmployees = true;
    }

    try {
      const result = await updateBusinessCapabilities(business._id, capabilities);
      
      if (result && result.success) {
        setSuccess(true);
        
        // Notify parent component
        if (onCapabilitiesUpdated) {
          onCapabilitiesUpdated(result.business);
        }
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error saving capabilities:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Business Capabilities</DialogTitle>
          <DialogDescription>
            {business ? (
              <span>Configure access capabilities for {business.name}</span>
            ) : (
              <span>Configure business capabilities</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-center">Capabilities Updated</h3>
              <p className="text-sm text-muted-foreground text-center">
                The business capabilities have been updated successfully.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-clockin">
                      <div className="flex items-center gap-2">
                        <AlarmClock className="h-4 w-4 text-muted-foreground" />
                        Allow Clock In/Out
                      </div>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to clock in and out of their shifts
                    </p>
                  </div>
                  <Switch
                    id="allow-clockin"
                    checked={allowClockInOut}
                    onCheckedChange={setAllowClockInOut}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="has-app-access">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        App Access
                      </div>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to access the mobile app
                    </p>
                  </div>
                  <Switch
                    id="has-app-access"
                    checked={hasAppAccess}
                    onCheckedChange={setHasAppAccess}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-checkin">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Allow Check-in
                      </div>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to check in at job sites and locations
                    </p>
                  </div>
                  <Switch
                    id="allow-checkin"
                    checked={allowCheckIn}
                    onCheckedChange={setAllowCheckIn}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="apply-to-all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        Apply to All Employees
                      </div>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Override individual employee settings with these values
                    </p>
                  </div>
                  <Switch
                    id="apply-to-all"
                    checked={applyToAll}
                    onCheckedChange={setApplyToAll}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {applyToAll && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Warning</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        This will override all individual employee capability settings with the
                        business-wide settings above. Any custom employee configurations will be lost.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Error</h4>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}