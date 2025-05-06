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
  Mail,
  Settings,
  Trash2,
  Edit,
  ClipboardCheck,
  UserCheck,
  Beaker,
  Bot,
  CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Business } from "@/app/api/external/omnigateway/types/business";
import { useBusiness } from "@/hooks/useBusiness";
import InputSelect from "@/components/Common/InputSelect";
import { useToast } from "@/components/ui/use-toast";

interface BusinessActionsProps {
  business: Business;
  onActionComplete?: () => void;
}

export default function BusinessActions({ business, onActionComplete }: BusinessActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    deactivateBusiness, 
    activateBusiness, 
    toggleTestAccountStatus,
    softDeleteBusiness,
    sendMagicLink,
    isLoading 
  } = useBusiness();
  
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showTestAccountDialog, setShowTestAccountDialog] = useState(false);
  const [showMagicLinkDialog, setShowMagicLinkDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  
  const isActive = business.isActive;
  const isTestAccount = business.metadata?.isTestAccount === 'true';

  const handleView = () => {
    router.push(`/crm/platform/businesses/${business._id}`);
  };

  const handleEdit = () => {
    router.push(`/crm/platform/businesses/${business._id}/edit`);
  };
  
  const handleCapabilities = () => {
    router.push(`/crm/platform/businesses/${business._id}/capabilities`);
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

  const handleDelete = async () => {
    try {
      await softDeleteBusiness(business._id);
      setShowDeleteDialog(false);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };

  const handleSendMagicLink = async () => {
    try {
      setIsSendingMagicLink(true);
      await sendMagicLink(business.adminUser?.email || business.email);
      setShowMagicLinkDialog(false);
      setIsSendingMagicLink(false);
      
      toast({
        title: "Magic link sent",
        description: `A login link has been sent to ${business.adminUser?.email || business.email}`,
      });
      
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error sending magic link:", error);
      setIsSendingMagicLink(false);
      
      toast({
        title: "Error",
        description: "Failed to send magic link",
        variant: "destructive",
      });
    }
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    if (!action) return;
    
    switch(action) {
      case "view":
        handleView();
        break;
      case "edit":
        handleEdit();
        break;
      case "capabilities":
        handleCapabilities();
        break;
      case "deactivate":
        setShowDeactivateDialog(true);
        break;
      case "activate":
        setShowActivateDialog(true);
        break;
      case "test-account":
        setShowTestAccountDialog(true);
        break;
      case "magic-link":
        setShowMagicLinkDialog(true);
        break;
      case "delete":
        setShowDeleteDialog(true);
        break;
      case "manage-features":
        router.push(`/crm/platform/businesses/${business._id}/features`);
        break;
      case "manage-agents":
        router.push(`/crm/platform/businesses/${business._id}/agents`);
        break;
      case "manage-subscription":
        router.push(`/crm/platform/businesses/${business._id}/subscription`);
        break;
      default:
        break;
    }
    
    // Reset the select value
    setTimeout(() => {
      e.target.value = "";
    }, 100);
  };

  const getActionOptions = () => {
    
    const options = [
      { value: "", label: "Actions" },
      { value: "view", label: "View Details" },
      { value: "edit", label: "Edit Business" },
      { value: "capabilities", label: "Manage Capabilities" },
      { value: "magic-link", label: "Send Magic Link" },
      { value: "manage-features", label: "Manage Features" },
      { value: "manage-agents", label: "Manage Agents" },
      { value: "manage-subscription", label: "Manage Subscription" },
    ];
    
    // Add conditional actions
    if (isActive) {
      options.push({ value: "deactivate", label: "Deactivate" });
    } else {
      options.push({ value: "activate", label: "Activate" });
    }
    
    options.push({ 
      value: "test-account", 
      label: isTestAccount ? "Unmark as Test Account" : "Mark as Test Account" 
    });
    
    // Add delete action
    options.push({ value: "delete", label: "Delete Business" });
    
    return options;
  };

  return (
    <>
      <div className="w-[150px]">
        <InputSelect
          name="business-actions"
          label=""
          options={getActionOptions()}
          value=""
          onChange={handleActionChange}
        />
      </div>

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

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {business.name}? This business and its associated data will be hidden from view but can be restored by an administrator if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Magic Link Dialog */}
      <AlertDialog open={showMagicLinkDialog} onOpenChange={setShowMagicLinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Send Magic Link
            </AlertDialogTitle>
            <AlertDialogDescription>
              Send a login link to {business.adminUser?.email || business.email}. The user will be able to log in without entering a password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSendMagicLink}
              disabled={isSendingMagicLink}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}