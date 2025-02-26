"use client";

import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Trash, 
  Search, 
  Edit, 
  ExternalLink, 
  Power, 
  PowerOff,
  Beaker
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Business } from "@/app/api/external/omnigateway/types/business";
import { useBusiness } from "@/hooks/useBusiness";

interface BusinessActionsProps {
  business: Business;
  onActionComplete?: () => void;
}

export default function BusinessActions({ business, onActionComplete }: BusinessActionsProps) {
  const router = useRouter();
  const { 
    deactivateBusiness, 
    activateBusiness, 
    toggleTestAccountStatus,
    isLoading 
  } = useBusiness();
  
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showTestAccountDialog, setShowTestAccountDialog] = useState(false);
  
  const isActive = business.isActive;
  const isTestAccount = business.metadata?.isTestAccount === 'true';

  const handleView = () => {
    router.push(`/crm/platform/businesses/${business._id}`);
  };

  const handleEdit = () => {
    router.push(`/crm/platform/businesses/${business._id}/edit`);
  };

  const handleDeactivate = async () => {
    try {
      await deactivateBusiness(business._id);
      setShowDeactivateDialog(false);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error deactivating business:", error);
    }
  };

  const handleActivate = async () => {
    try {
      await activateBusiness(business._id);
      setShowActivateDialog(false);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error activating business:", error);
    }
  };

  const handleToggleTestAccount = async () => {
    try {
      await toggleTestAccountStatus(business._id, !isTestAccount);
      setShowTestAccountDialog(false);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error toggling test account status:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <Search className="mr-2 h-4 w-4" />
            <span>View Details</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Business</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {isActive ? (
            <DropdownMenuItem onClick={() => setShowDeactivateDialog(true)}>
              <PowerOff className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Deactivate</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowActivateDialog(true)}>
              <Power className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-green-600">Activate</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => setShowTestAccountDialog(true)}>
            <Beaker className="mr-2 h-4 w-4" />
            <span>{isTestAccount ? "Unmark as Test Account" : "Mark as Test Account"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Deactivate Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {business.name}? This will also deactivate all associated user accounts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate {business.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleActivate}
              disabled={isLoading}
            >
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Account Dialog */}
      <AlertDialog open={showTestAccountDialog} onOpenChange={setShowTestAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isTestAccount ? "Remove Test Account Flag" : "Mark as Test Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isTestAccount 
                ? `Are you sure you want to remove the test account flag from ${business.name}?`
                : `Are you sure you want to mark ${business.name} as a test account? Test accounts will be excluded from analytics and reports.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleTestAccount}
              disabled={isLoading}
            >
              {isTestAccount ? "Remove Flag" : "Mark as Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}