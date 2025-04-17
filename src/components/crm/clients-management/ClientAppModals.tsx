// src/components/ClientApps/ClientAppModals.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Code,
  RefreshCcw,
  Plus,
  Trash2,
  PowerOff,
  AlertCircle,
  Monitor,
  Globe,
} from "lucide-react";
import InputSelect from "@/components/Common/InputSelect";
import { z } from "zod";
import { ClientAppWithClient, ClientAppType } from "@/app/api/external/omnigateway/types/client-apps";
import { useClients } from "@/hooks/useClients";

// Define app types
const appTypes = [
  { value: ClientAppType.REACT, label: "React Application" },
  { value: ClientAppType.WORDPRESS, label: "WordPress Website" },
  { value: ClientAppType.OTHER, label: "Other Application" }
];

// Zod validation schema
const clientAppSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.string().min(1, "App type is required"),
  domain: z.string().url("Must be a valid URL").or(z.array(z.string().url("Must be a valid URL"))),
  email: z.string().email("Must be a valid email").optional(),
  clientId: z.string().optional(),
});

type CreateClientAppModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
};

export const CreateClientAppModal: React.FC<CreateClientAppModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState(ClientAppType.REACT);
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [clientId, setClientId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load clients for selection
  const { clients, fetchClients, isInitialized } = useClients();

  useEffect(() => {
    if (isInitialized && open) {
      fetchClients();
    }
  }, [isInitialized, open, fetchClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const domainArray = domain.split(',').map(d => d.trim());
      const validData = clientAppSchema.parse({
        name,
        type,
        domain: domainArray.length === 1 ? domainArray[0] : domainArray,
        email,
        clientId: clientId || undefined
      });

      setErrors({});
      await onSubmit(validData);
      // Reset form
      setName("");
      setType(ClientAppType.REACT);
      setDomain("");
      setEmail("");
      setClientId("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Add New Client Application
          </DialogTitle>
          <DialogDescription>
            Create a new client application. This will generate an API key and set up the application configuration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Application Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My React App"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Application Type <span className="text-red-500">*</span>
            </label>
            <InputSelect
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as ClientAppType)}
              options={appTypes}
              className={errors.type ? "border-red-500" : ""}
            />
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain <span className="text-red-500">*</span>
            </label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. https://myapp.com (comma-separate multiple domains)"
              className={errors.domain ? "border-red-500" : ""}
            />
            {errors.domain ? (
              <p className="text-red-500 text-xs mt-1">{errors.domain}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                For multiple domains, separate with commas (e.g., https://myapp.com, https://app.myapp.com)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Contact Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. contact@myapp.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="clientId" className="text-sm font-medium">
              Associated Client
            </label>
            <InputSelect
              name="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              options={[
                { value: "", label: "None (Independent App)" },
                ...clients.map(client => ({
                  value: client._id,
                  label: client.name || client.code
                }))
              ]}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 flex items-start gap-3 mt-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Important information:</p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>A unique API key will be generated automatically</li>
                <li>The application will be created with active status</li>
                <li>Default report form and email configuration will be created</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary">
              {isSubmitting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Client App Modal Component
type DeleteClientAppModalProps = {
  clientApp: ClientAppWithClient | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clientApp: ClientAppWithClient) => Promise<void>;
  isDeleting?: boolean;
};

export const DeleteClientAppModal: React.FC<DeleteClientAppModalProps> = ({ 
  clientApp, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}) => {
  const handleConfirm = async () => {
    if (!clientApp) return;
    
    try {
      await onConfirm(clientApp);
      onClose();
    } catch (error) {
      console.error("Error deleting client app:", error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Client Application
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the application <strong>{clientApp?.name}</strong>? This action cannot be undone and will remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Toggle Status Modal Component
type ToggleStatusModalProps = {
  clientApp: ClientAppWithClient | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clientApp: ClientAppWithClient) => Promise<void>;
  isProcessing?: boolean;
};

export const ToggleStatusModal: React.FC<ToggleStatusModalProps> = ({ 
  clientApp, 
  isOpen, 
  onClose, 
  onConfirm, 
  isProcessing = false 
}) => {
  const action = clientApp?.status === 'active' ? "deactivate" : "activate";

  const handleConfirm = async () => {
    if (!clientApp) return;
    
    try {
      await onConfirm(clientApp);
      onClose();
    } catch (error) {
      console.error(`Error ${action}ing client app:`, error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PowerOff className="h-5 w-5 text-warning" />
            {clientApp?.status === 'active' ? "Deactivate" : "Activate"} Application
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {action} the application <strong>{clientApp?.name}</strong>? 
            {clientApp?.status === 'active' 
              ? " Deactivating will prevent API calls from this application." 
              : " Activating will restore API access for this application."
            }
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            className={clientApp?.status === 'active' ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
            onClick={handleConfirm} 
            disabled={isProcessing}
          >
            {isProcessing 
              ? `${clientApp?.status === 'active' ? "Deactivating" : "Activating"}...` 
              : `${clientApp?.status === 'active' ? "Deactivate" : "Activate"} Application`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};