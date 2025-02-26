// src/components/admin/RegisterBusinessContent.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AdminRegisterBusinessForm from "@/components/crm/business/AdminRegisterBusinessForm";
import RegistrationSuccessModal from "@/components/crm/business/RegistrationSuccessModal";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function RegisterBusinessContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationResult, setRegistrationResult] = useState({
    businessId: "",
    businessName: "",
    businessEmail: "",
    adminName: "",
    password: "",
  });

  const handleSubmit = async (responseData: any) => {
    try {
      // If we receive an API response directly, we can use it immediately
      // Set values for success modal from the response
      setRegistrationResult({
        businessId: responseData.businessId,
        businessName: responseData.businessName || "",
        businessEmail: responseData.email || "",
        adminName: responseData.fullName || "",
        password: responseData.password || "Unable to retrieve password",
      });
      
      // Show success modal
      setShowSuccess(true);
      
      toast({
        title: "Business Registered Successfully",
        description: `Business has been registered successfully.`,
      });
    } catch (error: any) {
      console.error("Error handling registration response:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem registering the business.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/crm/platform/businesses")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Businesses
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Register Business</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Register a new business and set up their subscription in one step
          </p>
        </div>
      </div>
      
      <AdminRegisterBusinessForm onSubmit={handleSubmit} />
      
      <RegistrationSuccessModal
        isOpen={showSuccess}
        businessId={registrationResult.businessId}
        businessName={registrationResult.businessName}
        businessEmail={registrationResult.businessEmail}
        adminName={registrationResult.adminName}
        password={registrationResult.password}
        onClose={() => {
          setShowSuccess(false);
          router.push("/crm/platform/businesses");
        }}
      />

        {/* Add empty space div at the bottom */}
  <div className="h-2"></div>
    </div>
  );
}