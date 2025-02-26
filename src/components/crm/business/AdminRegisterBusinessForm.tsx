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
} from "@/components/ui/form";
import {
  Card,
  CardContent,
//   CardDescription,
//   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Building2,
  CheckCircle,
  CreditCard,
  Loader,
  User,
  ChevronsUpDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { BusinessType } from "@/app/api/external/omnigateway/types/business";

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
  const { toast } = useToast();

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
      toast({
        title: "Success",
        description: "Business registered successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to register business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="business" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
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
                <CardTitle>Business Details</CardTitle>
                {/* <CardDescription>
                  Enter the core information about the business
                </CardDescription> */}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
              <div className="flex justify-between">
                <Button variant="ghost" disabled>
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
                <CardTitle>Address Information</CardTitle>
                {/* <CardDescription>
                  Provide the business address details (optional)
                </CardDescription> */}
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
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
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
                <CardTitle>Admin User</CardTitle>
                {/* <CardDescription>
                  Set up the administrator account
                </CardDescription> */}
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

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="autoVerifyEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Auto-verify Email</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="sendWelcomeEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Send Welcome Email</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
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
                <CardTitle>Subscription Plan</CardTitle>
                {/* <CardDescription>
                  Select the subscription plan for this business
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Cycle</FormLabel>
                        <div className="flex space-x-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {/* Basic Plan */}
                          <div
                            className={`border rounded-lg p-4 cursor-pointer ${
                              field.value === "basic"
                                ? "border-2 border-primary ring-2 ring-primary/20"
                                : "border-gray-200"
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
                            <div className="mt-4">
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
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Up to 10 staff members</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Core scheduling features</span>
                              </li>
                              <li className="flex items-center text-sm text-gray-400">
                                <ChevronsUpDown className="h-4 w-4 mr-2" />
                                <span>Limited reporting</span>
                              </li>
                            </ul>
                          </div>

                          {/* Professional Plan */}
                          <div
                            className={`border rounded-lg p-4 cursor-pointer relative ${
                              field.value === "professional"
                                ? "border-2 border-primary ring-2 ring-primary/20"
                                : "border-gray-200"
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
                            <div className="mt-4">
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
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Unlimited staff members</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Advanced scheduling</span>
                              </li>
                              <li className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>Comprehensive reporting</span>
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
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
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
  );
}