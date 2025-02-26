"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  businessId: string;
  businessName: string;
  businessEmail: string;
  adminName: string;
  password: string;
  onClose: () => void;
}

export default function RegistrationSuccessModal({
  isOpen,
  businessId,
  businessName,
  businessEmail,
  adminName,
  password,
  onClose,
}: RegistrationSuccessModalProps) {
  const router = useRouter();
  const [passwordCopied, setPasswordCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const viewBusiness = () => {
    router.push(`/crm/platform/businesses/${businessId}`);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto bg-green-100 p-3 rounded-full w-fit">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center text-xl mt-4">
            Business Registered Successfully
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {businessName} has been registered and is ready to use.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              <span>Admin: {adminName}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>Email: {businessEmail}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md border">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                <span className="font-medium">Temporary Password</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(password)}
                className="h-8 px-2"
              >
                {passwordCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-2 font-mono text-sm bg-gray-100 p-2 rounded">
              {password}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Make sure to save this password. It will not be shown again.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:flex-1" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="sm:flex-1" 
            onClick={viewBusiness}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Business
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}