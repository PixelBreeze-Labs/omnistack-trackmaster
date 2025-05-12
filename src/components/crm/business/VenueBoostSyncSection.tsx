// VenueBoostSyncSection.tsx
import React, { useState } from 'react';
import {
  RefreshCcw,
  Database,
  Users,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/new-card';
import SyncVenueBoostModal from './SyncVenueBoostModal';
import { useBusiness } from '@/hooks/useBusiness';

interface VenueBoostSyncSectionProps {
  businessId: string;
}

const VenueBoostSyncSection: React.FC<VenueBoostSyncSectionProps> = ({ businessId }) => {
  const { syncTasksFromVenueBoost, syncEmployeesFromVenueBoost } = useBusiness();
  
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncType, setSyncType] = useState<'tasks' | 'employees' | null>(null);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncCount, setSyncCount] = useState<number | undefined>(undefined);

  const handleSyncTasks = async () => {
    setSyncType('tasks');
    setSyncStatus('loading');
    setSyncMessage('Syncing tasks from Core System...');
    setIsSyncModalOpen(true);
    
    try {
      const response = await syncTasksFromVenueBoost(businessId);
      
      if (response && response.success) {
        setSyncStatus('success');
        setSyncMessage(response.message || 'Tasks synced successfully');
        
        // Extract count from message like "Successfully synced 42 tasks"
        const countMatch = response.message?.match(/synced (\d+) tasks/i);
        if (countMatch && countMatch[1]) {
          setSyncCount(parseInt(countMatch[1], 10));
        }
      } else {
        setSyncStatus('error');
        setSyncMessage(response?.message || 'Failed to sync tasks');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(error.message || 'An unexpected error occurred while syncing tasks');
    }
  };

  const handleSyncEmployees = async () => {
    setSyncType('employees');
    setSyncStatus('loading');
    setSyncMessage('Syncing employees from Core System...');
    setIsSyncModalOpen(true);
    
    try {
      const response = await syncEmployeesFromVenueBoost(businessId);
      
      if (response && response.success) {
        setSyncStatus('success');
        setSyncMessage(response.message || 'Employees synced successfully');
        
        // Extract count from message like "Successfully synced 15 employees"
        const countMatch = response.message?.match(/synced (\d+) employees/i);
        if (countMatch && countMatch[1]) {
          setSyncCount(parseInt(countMatch[1], 10));
        }
      } else {
        setSyncStatus('error');
        setSyncMessage(response?.message || 'Failed to sync employees');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(error.message || 'An unexpected error occurred while syncing employees');
    }
  };

  const handleCloseModal = () => {
    setIsSyncModalOpen(false);
    setSyncStatus('idle');
    setSyncMessage('');
    setSyncCount(undefined);
    setSyncType(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">VenueBoost Sync</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manually trigger data synchronization from VenueBoost
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Tasks</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Sync tasks and assignments from Core System to update task status and details.
              </p>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleSyncTasks}
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Sync Tasks
              </Button>
            </div>
            
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Employees</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Sync staff profiles and employee data from Core System to update contact information.
              </p>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleSyncEmployees}
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Sync Employees
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-4">
          <div className="text-xs text-muted-foreground border-t pt-3 w-full">
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>Last synced: Automatic sync runs every 24 hours</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <SyncVenueBoostModal
        isOpen={isSyncModalOpen}
        onClose={handleCloseModal}
        syncType={syncType}
        status={syncStatus}
        message={syncMessage}
        count={syncCount}
      />
    </>
  );
};

export default VenueBoostSyncSection;