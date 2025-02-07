// components/admin/settings/integrations-tab.tsx
"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";
import { useSettings } from '@/hooks/useSettings';
import { ConnectVenueBoostModal } from './connect-venueboost-modal';

export function IntegrationsTab() {
  const { settings } = useSettings();
  const [showVBModal, setShowVBModal] = useState(false);

  const isVBConnected = settings?.integrations?.venueBoost?.enabled;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* VenueBoost Integration */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                <h3 className="font-medium">VenueBoost</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect with VenueBoost to sync with better platform
              </p>
              {isVBConnected && (
                <div className="text-sm text-muted-foreground">
                  Connected to: {settings?.integrations?.venueBoost?.venueShortCode}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isVBConnected ? "default" : "secondary"}>
                {isVBConnected ? "Connected" : "Not Connected"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowVBModal(true)}
              >
                {isVBConnected ? "Configure" : "Connect"}
              </Button>
            </div>
          </div>

          {/* Other integrations can go here */}
        </CardContent>
      </Card>

      {/* VenueBoost Modal */}
      {showVBModal && (
        <ConnectVenueBoostModal
          isOpen={showVBModal}
          onClose={() => setShowVBModal(false)}
          currentSettings={settings?.integrations?.venueBoost}
        />
      )}
    </div>
  );
}