// hooks/useBusinessCapabilities.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { createBusinessApi } from "@/app/api/external/omnigateway/business";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import { 
  BusinessCapabilitiesUpdate, 
  EmployeeCapabilitiesUpdate,
  Business,
  Employee,
  CapabilitiesUpdateResponse,
  EmployeeUpdateResponse
} from "@/app/api/external/omnigateway/types/business";

export function useBusinessCapabilities() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { apiKey } = useGatewayClientApiKey();
  const api = useMemo(() => apiKey ? createBusinessApi(apiKey) : null, [apiKey]);

  /**
   * Update business capabilities
   */
  const updateBusinessCapabilities = useCallback(async (
    businessId: string,
    capabilities: BusinessCapabilitiesUpdate
  ): Promise<CapabilitiesUpdateResponse | null> => {
    if (!api) return null;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.updateBusinessCapabilities(businessId, capabilities);
      
      setSuccess(true);
      toast({
        title: "Capabilities updated",
        description: response.message || "Business capabilities updated successfully",
        variant: "default",
      });
      
      return response;
    } catch (err) {
      console.error("Error updating business capabilities:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update capabilities";
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  /**
   * Update employee capabilities
   */
  const updateEmployeeCapabilities = useCallback(async (
    employeeId: string,
    capabilities: EmployeeCapabilitiesUpdate
  ): Promise<EmployeeUpdateResponse | null> => {
    if (!api) return null;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.updateEmployeeCapabilities(employeeId, capabilities);
      
      setSuccess(true);
      toast({
        title: "Capabilities updated",
        description: response.message || "Employee capabilities updated successfully",
        variant: "default",
      });
      
      return response;
    } catch (err) {
      console.error("Error updating employee capabilities:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update capabilities";
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    isLoading,
    error,
    success,
    updateBusinessCapabilities,
    updateEmployeeCapabilities,
    reset,
    isInitialized: !!api
  };
}