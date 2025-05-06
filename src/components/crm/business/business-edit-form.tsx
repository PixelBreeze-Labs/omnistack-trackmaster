"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Check,
  AlertTriangle,
  AlarmClock,
  Smartphone,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/new-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessCapabilities } from "@/hooks/useBusinessCapabilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Business, 
  BusinessType,
  BusinessCapabilities
} from "@/app/api/external/omnigateway/types/business";

// Form schema
const businessFormSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  type: z.string({
    required_error: "Please select a business type.",
  }),
  taxId: z.string().optional(),
  vatNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

// Capabilities schema
const capabilitiesSchema = z.object({
  allow_clockinout: z.boolean(),
  has_app_access: z.boolean(),
  allow_checkin: z.boolean(),
});

interface BusinessEditFormProps {
  businessId: string;
}

export default function BusinessEditForm({ businessId }: BusinessEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getBusinessDetails, updateBusiness, isLoading: isBusinessLoading } = useBusiness();
  const { updateBusinessCapabilities, isLoading: isCapabilitiesLoading } = useBusinessCapabilities();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Initialize form
  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "",
      taxId: "",
      vatNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
  });

  // Initialize capabilities form
  const capabilitiesForm = useForm<z.infer<typeof capabilitiesSchema>>({
    resolver: zodResolver(capabilitiesSchema),
    defaultValues: {
      allow_clockinout: true,
      has_app_access: true,
      allow_checkin: true,
    },
  });

  // Load business data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getBusinessDetails(businessId);
        setBusiness(data);
        
        // Set form values
        form.reset({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          type: data.type,
          taxId: data.taxId || "",
          vatNumber: data.vatNumber || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zip: data.address?.zip || "",
            country: data.address?.country || "",
          },
        });
        
        // Set capabilities form values
        capabilitiesForm.reset({
          allow_clockinout: data.allow_clockinout !== false,
          has_app_access: data.has_app_access !== false,
          allow_checkin: data.allow_checkin !== false,
        });
      } catch (error) {
        console.error("Error loading business data:", error);
        toast({
          title: "Error",
          description: "Failed to load business data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (businessId) {
      loadData();
    }
  }, [businessId, getBusinessDetails, form, capabilitiesForm, toast]);

  // Handle basic details form submission
  const onSubmit = async (values: z.infer<typeof businessFormSchema>) => {
    if (!business) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const result = await updateBusiness(businessId, values);
      
      if (result) {
        setBusiness(result.business);
        setSaveSuccess(true);
        
        toast({
          title: "Success",
          description: "Business details updated successfully",
        });
        
        // Reset form with new values
        form.reset({
          name: result.business.name,
          email: result.business.email,
          phone: result.business.phone || "",
          type: result.business.type,
          taxId: result.business.taxId || "",
          vatNumber: result.business.vatNumber || "",
          address: {
            street: result.business.address?.street || "",
            city: result.business.address?.city || "",
            state: result.business.address?.state || "",
            zip: result.business.address?.zip || "",
            country: result.business.address?.country || "",
          },
        });
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Error",
        description: "Failed to update business details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle capabilities form submission
  const onCapabilitiesSubmit = async (values: z.infer<typeof capabilitiesSchema>) => {
    if (!business) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const result = await updateBusinessCapabilities(businessId, values);
      
      if (result) {
        setBusiness(result.business);
        setSaveSuccess(true);
        
        toast({
          title: "Success",
          description: "Business capabilities updated successfully",
        });
        
        // Reset form with new values
        capabilitiesForm.reset({
          allow_clockinout: result.business.allow_clockinout !== false,
          has_app_access: result.business.has_app_access !== false,
          allow_checkin: result.business.allow_checkin !== false,
        });
      }
    } catch (error) {
      console.error("Error updating capabilities:", error);
      toast({
        title: "Error",
        description: "Failed to update business capabilities",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // List of business types for the dropdown
  const businessTypes = Object.values(BusinessType).map(type => ({
    value: type,
    label: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push(`/crm/platform/businesses/${businessId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Business</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Update business information and settings
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/crm/platform/businesses/${businessId}`)}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Business Details</TabsTrigger>
            <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          </TabsList>
          
          {/* Business Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update basic business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Business Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter business name" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Business Type */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                {businessTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter business email" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Phone */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter business phone" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Tax ID */}
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter tax ID" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* VAT Number */}
                      <FormField
                        control={form.control}
                        name="vatNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VAT Number</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter VAT number" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Address Section */}
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-medium mb-4">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Street */}
                        <FormField
                          control={form.control}
                          name="address.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Enter street address" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* City */}
                        <FormField
                          control={form.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* State */}
                        <FormField
                          control={form.control}
                          name="address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter state or province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* ZIP */}
                        <FormField
                          control={form.control}
                          name="address.zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter ZIP or postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Country */}
                        <FormField
                          control={form.control}
                          name="address.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      {saveSuccess && (
                        <div className="flex items-center mr-auto text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          <span className="text-sm">Changes saved successfully</span>
                        </div>
                      )}
                      <Button
                        type="submit"
                        disabled={isSaving || isBusinessLoading}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Capabilities Tab */}
          <TabsContent value="capabilities">
            <Card>
              <CardHeader>
                <CardTitle>Business Capabilities</CardTitle>
                <CardDescription>
                  Configure access capabilities for this business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...capabilitiesForm}>
                  <form onSubmit={capabilitiesForm.handleSubmit(onCapabilitiesSubmit)} className="space-y-6">
                    {/* Allow Clock In/Out */}
                    <FormField
                      control={capabilitiesForm.control}
                      name="allow_clockinout"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>
                                <div className="flex items-center gap-2">
                                  <AlarmClock className="h-4 w-4 text-muted-foreground" />
                                  Allow Clock In/Out
                                </div>
                              </FormLabel>
                              <FormDescription>
                                Allow employees to clock in and out of their shifts
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* App Access */}
                    <FormField
                      control={capabilitiesForm.control}
                      name="has_app_access"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                                  App Access
                                </div>
                              </FormLabel>
                              <FormDescription>
                                Allow employees to access the mobile app
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Allow Check-in */}
                    <FormField
                      control={capabilitiesForm.control}
                      name="allow_checkin"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  Allow Check-in
                                </div>
                              </FormLabel>
                              <FormDescription>
                                Allow employees to check in at job sites and locations
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Warning about applying to all employees */}
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800">Important Note</h4>
                          <p className="text-xs text-amber-700 mt-1">
                            These settings will apply as defaults for all employees. To override these settings for 
                            specific employees, use the Employee Capabilities page.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      {saveSuccess && (
                        <div className="flex items-center mr-auto text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          <span className="text-sm">Capabilities saved successfully</span>
                        </div>
                      )}
                      <Button
                        type="submit"
                        disabled={isSaving || isCapabilitiesLoading}
                      >
                        {isSaving ? "Saving..." : "Save Capabilities"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}