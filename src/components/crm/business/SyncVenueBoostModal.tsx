// SyncVenueBoostModal.tsx
import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  X, 
  Info,
  RefreshCcw,
  Database
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SyncVenueBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncType: 'tasks' | 'employees' | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  count?: number;
}

const SyncVenueBoostModal: React.FC<SyncVenueBoostModalProps> = ({
  isOpen,
  onClose,
  syncType,
  status,
  message,
  count
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => status !== 'loading' && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'loading' && (
              <>
                <RefreshCcw className="h-5 w-5 animate-spin text-blue-500" />
                <span>Syncing {syncType === 'tasks' ? 'Tasks' : 'Employees'} from Core System</span>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Sync Completed Successfully</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Sync Failed</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {status === 'loading' && (
              `Connecting to Core System and syncing ${syncType === 'tasks' ? 'tasks' : 'employees'} for this business. Please wait...`
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {status === 'loading' && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
              <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
              <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                <p className="text-sm text-green-800">{message}</p>
              </div>
              
              {count !== undefined && (
                <div className="flex items-center justify-center">
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    <div>
                      <span className="font-bold text-lg">{count}</span>
                      <span className="ml-1">{syncType === 'tasks' ? 'tasks' : 'employees'} synced</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-800">{message}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                <Info className="h-4 w-4" />
                <span>Please try again or contact support if the issue persists.</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          {status !== 'loading' && (
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncVenueBoostModal;