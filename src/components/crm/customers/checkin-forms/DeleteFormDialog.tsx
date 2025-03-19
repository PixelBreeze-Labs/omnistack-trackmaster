// components/crm/customers/checkin-forms/DeleteFormDialog.tsx
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";

interface DeleteFormDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formName: string;
}

export function DeleteFormDialog({ open, onClose, onConfirm, formName }: DeleteFormDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Check-in Form</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the check-in form <strong>{formName}</strong>?
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <div>
                <p className="font-medium">Warning: This action cannot be undone</p>
                <p className="text-sm mt-1">
                  All submissions associated with this form will remain in the system, but the form itself will be deleted permanently.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete Form
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}