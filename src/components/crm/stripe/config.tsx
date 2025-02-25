"use client";

import { useEffect, useState } from "react";
import { useSubscriptionConfig } from "@/hooks/useSubscriptionConfig";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Currency } from "@/app/api/external/omnigateway/types/subscription-config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputSelect from "@/components/Common/InputSelect";
import { 
  CreditCard, 
  WebhookIcon, 
  RefreshCcw, 
  Save, 
  Clock, 
  FileText,
  CheckCircle,
} from "lucide-react";

// Form schema validation with Zod
const configSchema = z.object({
  productPrefix: z.string().min(1, "Product prefix is required"),
  defaultCurrency: z.string(),
  stripeAccount: z.object({
    accountId: z.string().optional(),
    publicKey: z.string().optional(),
    secretKey: z.string().optional(),
  }),
  webhook: z.object({
    endpoint: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    secret: z.string().optional(),
    enabled: z.boolean().optional(),
    events: z.array(z.string()).optional(),
  }),
  trial: z.object({
    enabled: z.boolean().optional(),
    durationDays: z.number().min(0).optional(),
  }),
  invoiceSettings: z.object({
    generateInvoice: z.boolean().optional(),
    daysUntilDue: z.number().min(0).optional(),
    footer: z.string().optional(),
  }),
});

export function StripeConfig() {
  const { isLoading, isSaving, config, fetchConfig, updateConfig } = useSubscriptionConfig();
  const [activeTab, setActiveTab] = useState("stripe");
  const [configUpdated, setConfigUpdated] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(configSchema),
    defaultValues: {
      productPrefix: "",
      defaultCurrency: Currency.USD,
      stripeAccount: {
        accountId: "",
        publicKey: "",
        secretKey: "",
      },
      webhook: {
        endpoint: "",
        secret: "",
        enabled: false,
        events: [],
      },
      trial: {
        enabled: true,
        durationDays: 14,
      },
      invoiceSettings: {
        generateInvoice: true,
        daysUntilDue: 30,
        footer: "",
      },
    },
  });
  
  // Load config on component mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);
  
  // Update form when config is loaded
  useEffect(() => {
    if (config) {
      form.reset({
        productPrefix: config.productPrefix || "",
        defaultCurrency: config.defaultCurrency || Currency.USD,
        stripeAccount: {
          accountId: config.stripeAccount?.accountId || "",
          publicKey: config.stripeAccount?.publicKey || "",
          secretKey: "", // We don't show the secret key for security reasons
        },
        webhook: {
          endpoint: config.webhook?.endpoint || "",
          secret: "", // We don't show the secret for security reasons
          enabled: config.webhook?.enabled || false,
          events: config.webhook?.events || [],
        },
        trial: {
          enabled: config.trial?.enabled ?? true,
          durationDays: config.trial?.durationDays ?? 14,
        },
        invoiceSettings: {
          generateInvoice: config.invoiceSettings?.generateInvoice ?? true,
          daysUntilDue: config.invoiceSettings?.daysUntilDue ?? 30,
          footer: config.invoiceSettings?.footer || "",
        },
      });
    }
  }, [config, form]);

  const handleFormSubmit = async (data) => {
    try {
      await updateConfig(data);
      setConfigUpdated(true);
      setTimeout(() => setConfigUpdated(false), 3000);
    } catch (error) {
      console.error("Error updating config:", error);
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription Configuration</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-2">
            Configure your subscription settings and Stripe integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchConfig()} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <div>
            {configUpdated && (
              <Alert className="mb-6 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Configuration Updated</AlertTitle>
                <AlertDescription>
                  Your subscription configuration has been updated successfully.
                </AlertDescription>
              </Alert>
            )}

            {/* Main config settings */}
            <Card className="mb-6">
              <CardHeader>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                  <p className="text-sm text-muted-foreground mt-2 mb-2">
                    Configure basic subscription settings for your platform
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="productPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Prefix</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., STAFFLUENT_" {...field} />
                      </FormControl>
                      <FormDescription>
                        Only Stripe products with this prefix will be synced to your account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Currency</FormLabel>
                      <FormControl>
                        <InputSelect
                          name="defaultCurrency"
                          label=""
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          options={Object.values(Currency).map(currency => ({
                            value: currency,
                            label: currency
                          }))}
                        />
                      </FormControl>
                      <FormDescription>
                        Default currency for new subscriptions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tabbed configuration sections */}
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="stripe">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Stripe Account
                </TabsTrigger>
                <TabsTrigger value="webhook">
                  <WebhookIcon className="mr-2 h-4 w-4" />
                  Webhooks
                </TabsTrigger>
                <TabsTrigger value="trial">
                  <Clock className="mr-2 h-4 w-4" />
                  Trial Settings
                </TabsTrigger>
                <TabsTrigger value="invoice">
                  <FileText className="mr-2 h-4 w-4" />
                  Invoice Settings
                </TabsTrigger>
              </TabsList>

              {/* Stripe Account Tab */}
              <TabsContent value="stripe">
                <Card>
                  <CardHeader>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Stripe Account</h2>
                      <p className="text-sm text-muted-foreground mt-2 mb-2">
                        Connect your Stripe account for subscription and payment processing
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="stripeAccount.accountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Account ID</FormLabel>
                          <FormControl>
                            <Input placeholder="acct_..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stripeAccount.publicKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Public Key</FormLabel>
                          <FormControl>
                            <Input placeholder="pk_..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stripeAccount.secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Secret Key</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="sk_..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Leave blank to keep your existing secret key
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Webhook Tab */}
              <TabsContent value="webhook">
                <Card>
                  <CardHeader>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Webhook Configuration</h2>
                      <p className="text-sm text-muted-foreground mt-2 mb-2">
                        Configure webhooks to receive real-time updates from Stripe
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="webhook.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Webhooks
                            </FormLabel>
                            <FormDescription>
                              Receive events from Stripe for subscription updates
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
                      name="webhook.endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook Endpoint URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormDescription>
                            URL where Stripe will send webhook events
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="webhook.secret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook Secret</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="whsec_..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Leave blank to keep your existing webhook secret
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* We could add a multi-select for webhook events here */}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trial Settings Tab */}
              <TabsContent value="trial">
                <Card>
                  <CardHeader>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Trial Settings</h2>
                      <p className="text-sm text-muted-foreground mt-2 mb-2">
                        Configure trial settings for new subscriptions
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="trial.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Trial Period
                            </FormLabel>
                            <FormDescription>
                              Allow customers to try your service before being charged
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
                      name="trial.durationDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trial Duration (Days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Invoice Settings Tab */}
              <TabsContent value="invoice">
                <Card>
                  <CardHeader>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Invoice Settings</h2>
                      <p className="text-sm text-muted-foreground mt-2 mb-2">
                        Configure how invoices are generated and managed
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="invoiceSettings.generateInvoice"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Generate Invoices
                            </FormLabel>
                            <FormDescription>
                              Automatically generate invoices for subscription payments
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
                      name="invoiceSettings.daysUntilDue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Days Until Due</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of days until an invoice is considered due
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="invoiceSettings.footer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Footer</FormLabel>
                          <FormControl>
                            <Input placeholder="Custom footer text for invoices" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Form submission button - outside the Tabs component */}
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <div className="mt-6 flex justify-end">
                <Button 
                  id="save-button"
                  name="save-button"
                  type="submit" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Form>
      )}
       {/* Add bottom spacing */}
       <div className="h-4"></div>
    </div>
  );
}

export default StripeConfig;