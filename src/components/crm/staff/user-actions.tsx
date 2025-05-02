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
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import InputSelect from "@/components/Common/InputSelect";

interface UserActionsProps {
  user: any;
  onActionComplete?: () => void;
  // Allow passing the hooks directly to make this component reusable
  actions: {
    softDeleteUser: (userId: string) => Promise<any>
    isLoading: boolean;
  };
}

export default function UserActions({ user, onActionComplete, actions }: UserActionsProps) {
  const router = useRouter();
  const { softDeleteUser, isLoading } = actions;
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check if user is active - default to true if not explicitly set to false
  const isActive = user.isActive !== false;

  const handleView = () => {
    router.push(`/crm/platform/users/${user._id}`);
  };




  const handleDelete = async () => {
    try {
      await softDeleteUser(user._id);
      setShowDeleteDialog(false);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

 

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    if (!action) return;
    
    switch(action) {
      case "view":
        handleView();
        break;
      case "delete":
        setShowDeleteDialog(true);
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
    ];
    // Add delete action
    options.push({ value: "delete", label: "Delete User" });
    
    return options;
  };

  return (
    <>
      <div className="w-[150px]">
        <InputSelect
          name="user-actions"
          label=""
          options={getActionOptions()}
          value=""
          onChange={handleActionChange}
        />
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.name} {user.surname || ''}? 
              This user and their associated data will be hidden from view but can be restored by an administrator if needed.
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

    
    </>
  );
}