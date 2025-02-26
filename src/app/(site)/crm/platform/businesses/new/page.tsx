"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminRegisterBusinessForm from "@/components/crm/business/AdminRegisterBusinessForm";
import { useAdminSubscription } from "@/hooks/useAdminSubscription";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function RegisterBusinessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { registerAndSubscribeBusiness, isLoading } = useAdminSubscription();

  const handleSubmit = async (data: any) => {
    try {
      // Transform form data to match API expectations
      const apiData = {
        // Business details
        businessName: data.businessName,
        businessEmail: data.businessEmail,
        businessType: data.businessType,
        fullName: data.fullName,
        phone: data.phone || undefined,
        
        // Address details (if provided)
        address: {
          street: data.street || undefined,
          city: data.city || undefined,
          state: data.state || undefined,
          zip: data.zip || undefined,
          country: data.country || undefined,
        },
        
        // Tax information
        taxId: data.taxId || undefined,
        vatNumber: data.vatNumber || undefined,
        
        // Subscription details
        subscription: {
          planId: data.planId,
          interval: data.interval,
        },
        
        // Additional settings
        autoVerifyEmail: data.autoVerifyEmail,
        sendWelcomeEmail: data.sendWelcomeEmail,
      };
      
      const response = await registerAndSubscribeBusiness(apiData);
      
      toast({
        title: "Business Registered Successfully",
        description: `${data.businessName} has been registered with a ${data.interval}ly subscription.`,
      });
      
      // Redirect to the businesses list or the new business details
      if (response.businessId) {
        router.push(`/admin/businesses/${response.businessId}`);
      } else {
        router.push("/admin/businesses");
      }
    } catch (error: any) {
      console.error("Error registering business:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem registering the business.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Businesses
        </Button>
        <h1 className="text-3xl font-bold">Register New Business</h1>
        <p className="text-muted-foreground mt-2">
          Register a new business and set up their subscription in one step
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <AdminRegisterBusinessForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}