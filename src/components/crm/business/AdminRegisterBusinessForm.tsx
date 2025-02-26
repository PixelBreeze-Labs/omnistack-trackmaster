"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
//   CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  CheckCircle,
  CreditCard,
  Loader,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { BusinessType } from "@/app/api/external/omnigateway/types/business";
import InputSelect from "@/components/Common/InputSelect";

const formSchema = z.object({
  // Business details
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessEmail: z.string().email("Invalid email address"),
  businessType: z.string(),
  phone: z.string().optional(),
  
  // Address (all optional)
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  
  // Tax info (optional)
  taxId: z.string().optional(),
  vatNumber: z.string().optional(),
  
  // Admin user details
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  
  // Subscription details
  planId: z.enum(["basic", "professional"]),
  interval: z.enum(["month", "year"]),
  
  // Additional settings
  autoVerifyEmail: z.boolean().default(true),
  sendWelcomeEmail: z.boolean().default(true),
});

const businessTypes = Object.entries(BusinessType).map(([key, value]) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' '),
  value
}));

export default function AdminRegisterBusinessForm({
  onSubmit
}: {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>
}) {
  const [activeTab, setActiveTab] = useState("business");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "other",
      planId: "professional",
      interval: "month",
      autoVerifyEmail: true,
      sendWelcomeEmail: true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs defaultValue="business" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="business">
                <Building2 className="mr-2 h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger value="address">
                <Briefcase className="mr-2 h-4 w-4" />
                Address
              </TabsTrigger>
              <TabsTrigger value="admin">
                <User className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="subscription">
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </TabsTrigger>
            </TabsList>

            {/* Business Details Tab */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                    <div >
                <h2 className="text-lg font-medium">Business Details</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Enter the core information about the business
            </p>
            </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="info@acmeinc.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
    control={form.control}
    name="businessType"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Business Type</FormLabel>
        <FormControl>
          <InputSelect
            name="businessType"
            label=""
            options={businessTypes.map((type) => ({
              value: type.value,
              label: type.label
            }))}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <div className="flex mt-4 justify-between">
                  <Button variant="secondary" disabled>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("address")}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                    <div>
                <h2 className="text-lg font-medium">Address Information</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Provide the business address details (optional)
            </p>
            </div>
                 
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal/ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="12-3456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VAT Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="EU123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <div className="flex mt-4 justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveTab("business")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("admin")}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Admin User Tab */}
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                    <div>
                <h2 className="text-lg font-medium">Admin User</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Set up the administrator account
            </p>
            </div>
                 
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="autoVerifyEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto-verify Email
                            </FormLabel>
                            <FormDescription>
                              Automatically verify the admin user's email address
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sendWelcomeEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send Welcome Email
                            </FormLabel>
                            <FormDescription>
                              Send a welcome email with login credentials
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <div className="flex mt-4 justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveTab("address")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("subscription")}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                    <div>
                <h2 className="text-lg font-medium">Subscription Plan</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-4">
            Select the subscription plan for this business
            </p>
            </div>
                  
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="interval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Cycle</FormLabel>
                          <div className="flex space-x-4 mt-2">
                            <Button
                              type="button"
                              variant={field.value === "month" ? "default" : "outline"}
                              className="flex-1"
                              onClick={() => form.setValue("interval", "month")}
                            >
                              Monthly
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "year" ? "default" : "outline"}
                              className="flex-1"
                              onClick={() => form.setValue("interval", "year")}
                            >
                              Yearly
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Save 20%
                              </span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="planId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscription Plan</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* Basic Plan */}
                            <div
                              className={`border rounded-lg p-6 cursor-pointer transition-all hover:border-primary/60 ${
                                field.value === "basic"
                                  ? "border-2 border-primary ring-2 ring-primary/20"
                                  : "border-border"
                              }`}
                              onClick={() => form.setValue("planId", "basic")}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg">Basic Plan</h3>
                                  <p className="text-gray-500 text-sm">
                                    For small teams
                                  </p>
                                </div>
                                {field.value === "basic" && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div className="mt-4 flex items-baseline">
                                <span className="text-2xl font-bold">
                                  {form.watch("interval") === "month"
                                    ? "$29"
                                    : "$23"}
                                </span>
                                <span className="text-gray-500 ml-1">
                                  / month
                                </span>
                              </div>
                              <ul className="mt-4 space-y-2">
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Up to 10 staff members</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Core scheduling features</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Email support</span>
                                </li>
                              </ul>
                            </div>

                            {/* Professional Plan */}
                            <div
                              className={`border rounded-lg p-6 cursor-pointer relative transition-all hover:border-primary/60 ${
                                field.value === "professional"
                                  ? "border-2 border-primary ring-2 ring-primary/20"
                                  : "border-border"
                              }`}
                              onClick={() => form.setValue("planId", "professional")}
                            >
                              <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                                Recommended
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg">Professional Plan</h3>
                                  <p className="text-gray-500 text-sm">
                                    For growing businesses
                                  </p>
                                </div>
                                {field.value === "professional" && (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div className="mt-4 flex items-baseline">
                                <span className="text-2xl font-bold">
                                  {form.watch("interval") === "month"
                                    ? "$49"
                                    : "$39"}
                                </span>
                                <span className="text-gray-500 ml-1">
                                  / month
                                </span>
                              </div>
                              <ul className="mt-4 space-y-2">
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Unlimited staff members</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Advanced scheduling</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Comprehensive reporting</span>
                                </li>
                                <li className="flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                  <span>Priority support</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <div className="flex mt-4 justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveTab("admin")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Business"
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}