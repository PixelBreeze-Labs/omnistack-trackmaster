// src/components/ClientApps/ClientAppActionSelect.tsx

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import InputSelect from "@/components/Common/InputSelect";
import { ClientAppWithClient } from "@/app/api/external/omnigateway/types/client-apps";
import { DeleteClientAppModal, ToggleStatusModal } from "./ClientAppModals";

type ClientAppActionSelectProps = {
  clientApp: ClientAppWithClient;
  onDeleteClientApp: (clientApp: ClientAppWithClient) => Promise<void>;
  onToggleStatus: (clientApp: ClientAppWithClient) => Promise<void>;
  isProcessing?: boolean;
};

const ClientAppActionSelect = ({ 
  clientApp, 
  onDeleteClientApp, 
  onToggleStatus,
  isProcessing = false 
}: ClientAppActionSelectProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  // Handle selection changes
  useEffect(() => {
    if (selectedAction === "delete") {
      setIsDeleteModalOpen(true);
      setSelectedAction("");
    } else if (selectedAction === "toggle-status") {
      setIsToggleStatusModalOpen(true);
      setSelectedAction("");
    } else if (selectedAction === "copy-api-key") {
      navigator.clipboard.writeText(clientApp.apiKey);
      toast.success("API Key copied to clipboard");
      setSelectedAction("");
    } else if (selectedAction === "copy-id") {
      navigator.clipboard.writeText(clientApp._id);
      toast.success("Application ID copied to clipboard");
      setSelectedAction("");
    }
  }, [selectedAction, clientApp]);

  const handleDelete = async (app: ClientAppWithClient) => {
    await onDeleteClientApp(app);
  };
  
  const handleToggleStatus = async (app: ClientAppWithClient) => {
    await onToggleStatus(app);
  };

  return (
    <>
      <InputSelect
        name={`clientAppAction-${clientApp._id}`}
        label=""
        value={selectedAction}
        onChange={(e) => setSelectedAction(e.target.value)}
        options={[
          { value: "", label: "Actions" },
          { value: "copy-api-key", label: "Copy API Key" },
          { value: "copy-id", label: "Copy ID" },
          { value: "toggle-status", label: clientApp.status === 'active' ? "Deactivate" : "Activate" },
          { value: "delete", label: "Delete Application" },
        ]}
      />

      <DeleteClientAppModal
        clientApp={clientApp}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isProcessing}
      />

      <ToggleStatusModal
        clientApp={clientApp}
        isOpen={isToggleStatusModalOpen}
        onClose={() => setIsToggleStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default ClientAppActionSelect;