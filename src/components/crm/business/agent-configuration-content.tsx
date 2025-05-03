// components/crm/business/agent-configuration-content.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Bot,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  BarChart2,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgents } from "@/hooks/useAgents";
import { useBusiness } from "@/hooks/useBusiness";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import InputSelect from "@/components/Common/InputSelect";

export default function AgentConfigurationContent({ businessId, agentType }) {
  const router = useRouter();
  const {
    isLoading: isLoadingAgents,
    getAgentConfiguration,
    enableAgent,
    disableAgent,
    updateAgentConfiguration,
    isInitialized
  } = useAgents();

  const { isLoading: isLoadingBusiness, getBusinessDetails } = useBusiness();
  
  const [businessDetails, setBusinessDetails] = useState(null);
  const [agentConfig, setAgentConfig] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [businessId, agentType, isInitialized]);

  const loadData = async () => {
    try {
      // Load business details
      const business = await getBusinessDetails(businessId);
      setBusinessDetails(business);
      
      // Load agent configuration
      const config = await getAgentConfiguration(businessId, agentType);
      setAgentConfig(config);
      setIsEnabled(config?.isEnabled);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load agent configuration");
    }
  };

  const handleToggleAgent = async () => {
    try {
      setIsSaving(true);
      if (!isEnabled) {
        await enableAgent(businessId, agentType);
        toast.success(`${getAgentName(agentType)} enabled successfully`);
      } else {
        await disableAgent(businessId, agentType);
        toast.success(`${getAgentName(agentType)} disabled successfully`);
      }
      setIsEnabled(!isEnabled);
      await loadData();
    } catch (error) {
      console.error(`Error toggling agent:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateConfiguration = async (formData) => {
    try {
      setIsSaving(true);
      await updateAgentConfiguration(businessId, agentType, formData);
      await loadData();
    } catch (error) {
      console.error("Error updating configuration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAgentIcon = (type) => {
    switch(type) {
      case 'auto-assignment':
        return <Users className="h-5 w-5" />;
      case 'compliance-monitoring':
        return <ShieldCheck className="h-5 w-5" />;
      case 'report-generation':
        return <FileText className="h-5 w-5" />;
      case 'client-communication':
        return <Briefcase className="h-5 w-5" />;
      case 'resource-request':
        return <Layers className="h-5 w-5" />;
      case 'shift-optimization':
        return <BarChart2 className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  const getAgentName = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getAgentDescription = (type) => {
    switch(type) {
      case 'auto-assignment':
        return 'Automatically assigns tasks to staff members based on skills and availability';
      case 'compliance-monitoring':
        return 'Monitors compliance with certifications and requirements';
      case 'report-generation':
        return 'Generates automated reports and analytics';
      case 'client-communication':
        return 'Automates client communications and updates';
      case 'resource-request':
        return 'Manages resource requests and inventory forecasting';
      case 'shift-optimization':
        return 'Optimizes staff scheduling and shift assignments';
      default:
        return 'Advanced AI agent to automate business processes';
    }
  };

  // Render different forms based on agent type
  const renderConfigurationForm = () => {
    if (!agentConfig) return null;

    switch (agentType) {
      case 'auto-assignment':
        return <AutoAssignmentConfigForm config={agentConfig} onSave={handleUpdateConfiguration} />;
      case 'compliance-monitoring':
        return <ComplianceMonitoringConfigForm config={agentConfig} onSave={handleUpdateConfiguration} />;
      case 'report-generation':
        return <ReportGenerationConfigForm config={agentConfig} onSave={handleUpdateConfiguration} />;
      case 'client-communication':
        return <ClientCommunicationConfigForm config={agentConfig} onSave={handleUpdateConfiguration} />;
      case 'resource-request':
        return <ResourceRequestConfigForm config={agentConfig} onSave={handleUpdateConfiguration} />;
      case 'shift-optimization':
        return <ShiftOptimizationConfigForm config={agentConfig} onSave={handleUpdateConfiguration} />;
      default:
        return (
          <div className="py-6 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Configuration Not Available</h3>
            // components/crm/business/agent-configuration-content.tsx (continued)
             <p className="text-sm text-muted-foreground mt-2">
              Configuration form for this agent type is not available.
            </p>
          </div>
        );
    }
  };

  const isLoading = isLoadingAgents || isLoadingBusiness;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push(`/crm/platform/businesses/${businessId}/agents`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {getAgentName(agentType)} Configuration
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Configure and manage the {getAgentName(agentType)} settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm mr-2">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleAgent}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Agent Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEnabled ? 'bg-green-100' : 'bg-slate-100'}`}>
              {getAgentIcon(agentType)}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{getAgentName(agentType)}</h2>
              <p className="text-sm text-muted-foreground mt-0 mb-1">
                {getAgentDescription(agentType)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : (
            <>
              {!isEnabled && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Agent is disabled</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        This agent is currently disabled. Enable it to start using its features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Agent Status</h3>
                  <p className="text-sm flex items-center gap-1">
                    <span className="font-medium">Status:</span>
                    {isEnabled ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600">
                        <XCircle className="mr-1 h-3 w-3" /> Inactive
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Agent Type:</span> {getAgentName(agentType)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Business Information</h3>
                  <p className="text-sm">
                    <span className="font-medium">Business:</span> {businessDetails?.name || "N/A"}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Subscription Plan:</span> {businessDetails?.subscription?.tier ? businessDetails.subscription.tier.charAt(0).toUpperCase() + businessDetails.subscription.tier.slice(1) : "N/A"}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Card>
        <CardHeader className="pb-0">
          <h3 className="text-lg font-medium">Configuration Settings</h3>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Tabs defaultValue="general" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              {/* Tab content */}
              <div className="mt-6">
                {renderConfigurationForm()}
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-10"></div>
    </div>
  );
}

// Auto Assignment Config Form
const autoAssignmentSchema = z.object({
  requireApproval: z.boolean().optional(),
  assignmentFrequency: z.number().min(1).max(60),
  respectMaxWorkload: z.boolean().optional(),
  maxTasksPerStaff: z.number().min(1).max(100),
  weights: z.object({
    skillMatch: z.number().min(0).max(1),
    availability: z.number().min(0).max(1),
    proximity: z.number().min(0).max(1),
    workload: z.number().min(0).max(1),
  }),
  notificationSettings: z.object({
    emailNotifications: z.boolean().optional(),
    notifyOnAssignment: z.boolean().optional(),
    notifyOnRejection: z.boolean().optional(),
  }),
});

function AutoAssignmentConfigForm({ config, onSave }) {
  const form = useForm({
    resolver: zodResolver(autoAssignmentSchema),
    defaultValues: {
      requireApproval: config.requireApproval,
      assignmentFrequency: config.assignmentFrequency,
      respectMaxWorkload: config.respectMaxWorkload,
      maxTasksPerStaff: config.maxTasksPerStaff,
      weights: {
        skillMatch: config.weights?.skillMatch || 0.4,
        availability: config.weights?.availability || 0.3,
        proximity: config.weights?.proximity || 0.1,
        workload: config.weights?.workload || 0.2,
      },
      notificationSettings: {
        emailNotifications: config.notificationSettings?.emailNotifications || false,
        notifyOnAssignment: config.notificationSettings?.notifyOnAssignment || false,
        notifyOnRejection: config.notificationSettings?.notifyOnRejection || false,
      },
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TabsContent value="general" className="space-y-4">
          <FormField
            control={form.control}
            name="requireApproval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Approval</FormLabel>
                  <FormDescription>
                    Require manager approval before assignments
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
            name="assignmentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignment Frequency (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How often the agent checks for unassigned tasks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="respectMaxWorkload"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Respect Max Workload</FormLabel>
                  <FormDescription>
                    Limit assignments based on staff workload
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
            name="maxTasksPerStaff"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Tasks Per Staff</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of tasks assigned to a staff member
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <FormField
            control={form.control}
            name="notificationSettings.emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Send email notifications for agent actions
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
            name="notificationSettings.notifyOnAssignment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notify on Assignment</FormLabel>
                  <FormDescription>
                    Send notification when a task is assigned
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
            name="notificationSettings.notifyOnRejection"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notify on Rejection</FormLabel>
                  <FormDescription>
                    Send notification when an assignment is rejected
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
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-md mb-4">
            <h4 className="font-medium mb-2">Assignment Weight Configuration</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Configure how different factors are weighted in the assignment algorithm.
              Total values should add up to 1.0
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weights.skillMatch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Match Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={1}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weights.availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={1}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weights.proximity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proximity Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={1}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weights.workload"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workload Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={1}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </TabsContent>
        
        <div className="flex justify-end">
          <Button type="submit"  className="mb-3 mr-3">
            <Save className="mr-2 h-4 w-4" /> Save Configuration
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Create simple placeholder forms for other agent types

// Compliance Monitoring Config Form
function ComplianceMonitoringConfigForm({ config, onSave }) {
  const form = useForm({
    defaultValues: {
      requireApproval: config.requireApproval,
      monitoringFrequency: config.monitoringFrequency,
      certificationWarningDays: config.certificationWarningDays,
      notificationSettings: {
        emailNotifications: config.notificationSettings?.emailNotifications || false,
        notifyOnAssignment: config.notificationSettings?.notifyOnAssignment || false,
        notifyOnRejection: config.notificationSettings?.notifyOnRejection || false,
      },
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TabsContent value="general" className="space-y-4">
          <FormField
            control={form.control}
            name="requireApproval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Approval</FormLabel>
                  <FormDescription>
                    Require manager approval for compliance actions
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
            name="monitoringFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monitoring Frequency (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How often the agent checks for compliance issues
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certificationWarningDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Warning Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={90}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Days before expiration to send warnings
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <FormField
            control={form.control}
            name="notificationSettings.emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Send email notifications for compliance issues
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
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="bg-slate-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">No additional settings</h4>
            <p className="text-sm text-muted-foreground">
              There are no advanced settings for this agent type.
            </p>
          </div>
        </TabsContent>
        
        <div className="flex justify-end">
          <Button type="submit"  className="mb-3 mr-3">
            <Save className="mr-2 h-4 w-4" /> Save Configuration
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Simple placeholder forms for other agent types
function ReportGenerationConfigForm({ config, onSave }) {
  return (
    <div className="space-y-4">
      <TabsContent value="general">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Require Approval</Label>
              <p className="text-sm text-muted-foreground">
                Require approval before generating reports
              </p>
            </div>
            <Switch
              checked={config.requireApproval}
              onCheckedChange={(checked) => onSave({...config, requireApproval: checked})}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for generated reports
              </p>
            </div>
            <Switch
              checked={config.notificationSettings?.emailNotifications}
              onCheckedChange={(checked) => onSave({
                ...config, 
                notificationSettings: {
                  ...config.notificationSettings,
                  emailNotifications: checked
                }
              })}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="bg-slate-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">No additional settings</h4>
          <p className="text-sm text-muted-foreground">
            Advanced settings for this agent type are not yet available.
          </p>
        </div>
      </TabsContent>
      
      <div className="flex justify-end pt-4">
        <Button onClick={() => onSave(config)}  className="mb-3 mr-3">
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}

function ClientCommunicationConfigForm({ config, onSave }) {
  return (
    <div className="space-y-4">
      <TabsContent value="general">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Response Enabled</Label>
              <p className="text-sm text-muted-foreground">
                Automatically respond to client communications
              </p>
            </div>
            <Switch
              checked={config.autoResponseEnabled}
              onCheckedChange={(checked) => onSave({...config, autoResponseEnabled: checked})}
            />
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Scheduled Updates</Label>
              <p className="text-sm text-muted-foreground">
                Send scheduled updates to clients
              </p>
            </div>
            <Switch
              checked={config.scheduledUpdatesEnabled}
              onCheckedChange={(checked) => onSave({...config, scheduledUpdatesEnabled: checked})}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for client communications
              </p>
            </div>
            <Switch
              checked={config.notificationSettings?.emailNotifications}
              onCheckedChange={(checked) => onSave({
                ...config, 
                notificationSettings: {
                  ...config.notificationSettings,
                  emailNotifications: checked
                }
              })}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="bg-slate-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">No additional settings</h4>
          <p className="text-sm text-muted-foreground">
            Advanced settings for this agent type are not yet available.
          </p>
        </div>
      </TabsContent>
      
      <div className="flex justify-end pt-4">
        <Button onClick={() => onSave(config)}  className="mb-3 mr-3">
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}

function ResourceRequestConfigForm({ config, onSave }) {
  return (
    <div className="space-y-4">
      <TabsContent value="general">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Approve</Label>
              <p className="text-sm text-muted-foreground">
                Automatically approve resource requests
              </p>
            </div>
            <Switch
              checked={config.autoApprove}
              onCheckedChange={(checked) => onSave({...config, autoApprove: checked})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Inventory Check Frequency (hours)</Label>
            <Input
              type="number"
              min={1}
              max={168}
              value={config.inventoryCheckFrequency}
              onChange={(e) => onSave({...config, inventoryCheckFrequency: parseInt(e.target.value)})}
            />
            <p className="text-sm text-muted-foreground">
              How often the agent checks inventory levels
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Forecast Frequency (hours)</Label>
            <Input
              type="number"
              min={1}
              max={672}
              value={config.forecastFrequency}
              onChange={(e) => onSave({...config, forecastFrequency: parseInt(e.target.value)})}
            />
            <p className="text-sm text-muted-foreground">
              How often the agent updates forecasts
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for resource requests
              </p>
            </div>
            <Switch
              checked={config.notificationSettings?.emailNotifications}
              onCheckedChange={(checked) => onSave({
                ...config, 
                notificationSettings: {
                  ...config.notificationSettings,
                  emailNotifications: checked
                }
              })}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Advance Orders</Label>
              <p className="text-sm text-muted-foreground">
                Enable automatic advance ordering based on forecasts
              </p>
            </div>
            <Switch
              checked={config.enableAdvanceOrders}
              onCheckedChange={(checked) => onSave({...config, enableAdvanceOrders: checked})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Advance Order Days</Label>
            <Input
              type="number"
              min={1}
              max={90}
              value={config.advanceOrderDays}
              onChange={(e) => onSave({...config, advanceOrderDays: parseInt(e.target.value)})}
            />
            <p className="text-sm text-muted-foreground">
              How many days in advance to place orders
            </p>
          </div>
        </div>
      </TabsContent>
      
      <div className="flex justify-end pt-4">
        <Button onClick={() => onSave(config)} className="mb-3 mr-3">
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}

function ShiftOptimizationConfigForm({ config, onSave }) {
  return (
    <div className="space-y-4">
      <TabsContent value="general">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Weekly Optimization Schedule</Label>
            <Input
              value={config.weeklyOptimizationCron}
              onChange={(e) => onSave({...config, weeklyOptimizationCron: e.target.value})}
            />
            <p className="text-sm text-muted-foreground">
              Cron expression for weekly optimization schedule
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Daily Forecast Schedule</Label>
            <Input
              value={config.dailyForecastCron}
              onChange={(e) => onSave({...config, dailyForecastCron: e.target.value})}
            />
            <p className="text-sm text-muted-foreground">
              Cron expression for daily forecast schedule
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Optimization Strategy</Label>
            <Select 
              value={config.optimizationStrategy} 
              onValueChange={(value) => onSave({...config, optimizationStrategy: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select optimization strategy" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="WORKLOAD_BALANCED">Workload Balanced</SelectItem>
                <SelectItem value="COST_OPTIMIZED">Cost Optimized</SelectItem>
                <SelectItem value="SKILL_OPTIMIZED">Skill Optimized</SelectItem>
                <SelectItem value="AVAILABILITY_OPTIMIZED">Availability Optimized</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Strategy used for optimizing shifts
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Optimization Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications when optimization runs
              </p>
            </div>
            <Switch
              checked={config.sendOptimizationNotifications}
              onCheckedChange={(checked) => onSave({...config, sendOptimizationNotifications: checked})}
            />
          </div>
          
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Forecast Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications when forecasts are updated
              </p>
            </div>
            <Switch
              checked={config.sendForecastNotifications}
              onCheckedChange={(checked) => onSave({...config, sendForecastNotifications: checked})}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="bg-slate-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">No additional settings</h4>
          <p className="text-sm text-muted-foreground">
            Advanced settings for this agent type are not yet available.
          </p>
        </div>
      </TabsContent>
      
      <div className="flex justify-end pt-4">
        <Button onClick={() => onSave(config)} className="mb-3 mr-3">
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}