// components/crm/business/business-agents-content.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCcw,
  Bot,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAgents } from "@/hooks/useAgents";
import { useBusiness } from "@/hooks/useBusiness";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";

export default function BusinessAgentsContent({ businessId }) {
  const router = useRouter();
  const {
    isLoading: isLoadingAgents,
    agentConfigurations,
    availableAgents,
    getBusinessAgents,
    enableAgent,
    disableAgent,
    isInitialized: isAgentsInitialized
  } = useAgents();

  const { isLoading: isLoadingBusiness, getBusinessDetails,      isInitialized: isBusinessInitialized
  } = useBusiness();
  
  const [businessDetails, setBusinessDetails] = useState(null);
  const [showAgentConfigDialog, setShowAgentConfigDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [expandedAgents, setExpandedAgents] = useState({});

  const isInitialized = isAgentsInitialized && isBusinessInitialized;

  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [businessId, isInitialized]);

  const loadData = async () => {
    try {
      // Load business details
      const business = await getBusinessDetails(businessId);
      setBusinessDetails(business);
      
      // Load agent configurations
      await getBusinessAgents(businessId);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleToggleAgent = async (agentType, isEnabled) => {
    try {
      if (isEnabled) {
        await enableAgent(businessId, agentType);
      } else {
        await disableAgent(businessId, agentType);
      }
      await getBusinessAgents(businessId);
    } catch (error) {
      console.error(`Error toggling agent ${agentType}:`, error);
    }
  };

  const viewAgentConfiguration = (agent) => {
    setSelectedAgent(agent);
    router.push(`/crm/platform/businesses/${businessId}/agents/${agent.agentType}`);
  };
  
  const enableAndConfigureAgent = async (agent) => {
    try {
      // First enable the agent
      await enableAgent(businessId, agent.agentType);
      // Then go to configuration page
      router.push(`/crm/platform/businesses/${businessId}/agents/${agent.agentType}`);
    } catch (error) {
      console.error(`Error configuring agent ${agent.agentType}:`, error);
      toast.error(`Failed to configure agent: ${error.message}`);
    }
  };

  const toggleAgentExpansion = (agentType) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentType]: !prev[agentType]
    }));
  };

  const refreshData = () => {
    loadData();
  };

  const getAgentIcon = (agentType) => {
    switch(agentType) {
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

  const getAgentName = (agentType) => {
    return agentType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getAgentDescription = (agentType) => {
    switch(agentType) {
      case 'auto-assignment':
        return 'Automatically assigns tasks to staff members based on skills and availability';
      case 'compliance-monitoring':
        return 'Monitors regulatory requirements and ensures certification compliance for your team';
      case 'report-generation':
        return 'Creates automated reports and analytics based on your business data and metrics';
      case 'client-communication':
        return 'Manages and automates client interactions with timely responses and follow-ups';
      case 'resource-request':
        return 'Streamlines inventory management and procurement processes for your resources';
      case 'shift-optimization':
        return 'Optimizes work schedules based on staff availability, skills, and business needs';
      default:
        return 'Automates business processes using advanced AI to improve efficiency and results';
    }
  };

  const isLoading = isLoadingAgents || isLoadingBusiness;

  // Find agent types that are available but not configured yet
  const unconfiguredAgents = availableAgents
    ? availableAgents.filter(
        agentType => !agentConfigurations.some(config => config.agentType === agentType)
      )
    : [];

  // All agent types (configured + unconfigured)
  const allAgents = [
    ...agentConfigurations,
    ...unconfiguredAgents.map(agentType => ({ agentType, isEnabled: false, isUnconfigured: true }))
  ];

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI Agents</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Configure and manage intelligent agents for this business
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={refreshData}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Business Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Business Information</h2>
            <p className="text-sm text-muted-foreground mt-0 mb-1">
              Current subscription information and details
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg">{businessDetails?.name || "N/A"}</h3>
                <p className="text-sm text-muted-foreground">{businessDetails?.email || "N/A"}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Business Type:</span> {businessDetails?.type ? businessDetails.type.replace(/_/g, ' ') : "N/A"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Subscription Status:</span>
                  {businessDetails?.subscriptionStatus === 'active' && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> Active
                    </Badge>
                  )}
                  {businessDetails?.subscriptionStatus === 'trialing' && (
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      Trial
                    </Badge>
                  )}
                  {businessDetails?.subscriptionStatus !== 'active' && businessDetails?.subscriptionStatus !== 'trialing' && (
                    <Badge variant="outline">
                      {businessDetails?.subscriptionStatus || "N/A"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm">
                  <span className="font-medium">Plan:</span> {businessDetails?.subscription?.tier ? businessDetails.subscription.tier.charAt(0).toUpperCase() + businessDetails.subscription.tier.slice(1) : "N/A"}
                </p>
                {businessDetails?.subscriptionEndDate && (
                  <p className="text-sm">
                    <span className="font-medium">End Date:</span> {new Date(businessDetails.subscriptionEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Skeleton loaders */}
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-8 w-32 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : availableAgents?.length === 0 ? (
        <div className="col-span-full">
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Agents Available</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  No AI agents are currently available for this business. 
                  This might be due to the current subscription plan or configuration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : allAgents.length === 0 ? (
        <div className="col-span-full">
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Agents Configured</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  The agents are available for your subscription tier but not yet configured.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allAgents.map((agent) => (
           <Card 
           key={agent.agentType}
           className={`overflow-hidden transition-all ${agent.isEnabled ? 'border-green-300' : ''}`}
         >
           <CardHeader className="pb-2" style={{display: "block"}}>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${agent.isEnabled ? 'bg-green-100' : 'bg-slate-100'}`}>
                   {getAgentIcon(agent.agentType)}
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">{getAgentName(agent.agentType)}</h3>
                   <p className="text-sm text-muted-foreground">
                     {agent.isUnconfigured ? 'Not Configured' : (agent.isEnabled ? 'Enabled' : 'Disabled')}
                   </p>
                 </div>
               </div>
               <Switch
                 checked={agent.isEnabled}
                 disabled={agent.isUnconfigured}
                 onCheckedChange={(checked) => handleToggleAgent(agent.agentType, checked)}
               />
             </div>
           </CardHeader>
           <CardContent>
             <p className="text-sm h-12">{getAgentDescription(agent.agentType)}</p>
             <div className="flex justify-between items-center mt-4">
               {!agent.isUnconfigured && (
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => toggleAgentExpansion(agent.agentType)}
                 >
                   {expandedAgents[agent.agentType] ? (
                     <>
                       <ChevronDown className="mr-1 h-4 w-4" /> Hide Details
                     </>
                   ) : (
                     <>
                       <ChevronRight className="mr-1 h-4 w-4" /> View Details
                     </>
                   )}
                 </Button>
               )}
               <Button
                 variant="default"
                 size="sm"
                 onClick={() => agent.isUnconfigured ? enableAndConfigureAgent(agent) : viewAgentConfiguration(agent)}
                 className={agent.isUnconfigured ? "ml-auto" : ""}
               >
                 <Settings className="mr-1 h-4 w-4" /> {agent.isUnconfigured ? 'Set Up' : 'Configure'}
               </Button>
             </div>
             
             {/* Expanded details */}
             {!agent.isUnconfigured && expandedAgents[agent.agentType] && (
               <div className="mt-4 pt-4 border-t">
               <h4 className="font-medium mb-2">Agent Settings</h4>
               <div className="space-y-2">
                 {agent.requireApproval !== undefined && (
                   <div className="flex justify-between text-sm">
                     <span>Requires Approval:</span>
                     <span>{agent.requireApproval ? 'Yes' : 'No'}</span>
                   </div>
                 )}
                 {agent.assignmentFrequency !== undefined && (
                   <div className="flex justify-between text-sm">
                     <span>Update Frequency:</span>
                     <span>{agent.assignmentFrequency} minutes</span>
                   </div>
                 )}
                 {agent.monitoringFrequency !== undefined && (
                   <div className="flex justify-between text-sm">
                     <span>Monitoring Frequency:</span>
                     <span>{agent.monitoringFrequency} hours</span>
                   </div>
                 )}
                 {agent.autoResponseEnabled !== undefined && (
                   <div className="flex justify-between text-sm">
                     <span>Auto Response:</span>
                     <span>{agent.autoResponseEnabled ? 'Enabled' : 'Disabled'}</span>
                   </div>
                 )}
                 {agent.notificationSettings?.emailNotifications !== undefined && (
                   <div className="flex justify-between text-sm">
                     <span>Email Notifications:</span>
                     <span>{agent.notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                   </div>
                 )}
               </div>
             </div>
             )}
           </CardContent>
         </Card>
          ))}
        </div>
      )}

      {/* Upgrade Card - only show if on a tier that doesn't have all agents */}
      {!isLoading && availableAgents?.length > 0 && availableAgents?.length < 6 && 
       !['enterprise', 'trialing'].includes(businessDetails?.subscription?.tier) && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-bold text-lg">Upgrade for More Agents</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Unlock additional AI agents by upgrading your subscription plan. 
              {businessDetails?.subscription?.tier === 'basic' ? (
                ' Your Basic plan includes Auto Assignment. Upgrade to Professional or Enterprise plans for more agents.'
              ) : businessDetails?.subscription?.tier === 'professional' ? (
                ' Your Professional plan includes Auto Assignment, Compliance Monitoring, and Client Communication. Upgrade to Enterprise for all agents.'
              ) : (
                ' Advanced agents like Report Generation, Resource Request, and Shift Optimization are available on higher-tier plans.'
              )}
            </p>
            <Button onClick={() => router.push(`/crm/platform/businesses/${businessId}/subscription`)}>
              View Subscription Options
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}