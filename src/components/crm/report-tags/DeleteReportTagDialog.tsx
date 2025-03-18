// components/report-tags/DeleteReportTagDialog.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { useState } from "react";
  
  interface DeleteReportTagDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    tagName: string;
  }
  
  export function DeleteReportTagDialog({ 
    open, 
    onClose, 
    onConfirm, 
    tagName 
  }: DeleteReportTagDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
  
    const handleDelete = async () => {
      try {
        setIsDeleting(true);
        await onConfirm();
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    };
  
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this tag?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tag "{tagName}" and cannot be undone.
              Reports that use this tag will no longer have it associated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Tag"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }