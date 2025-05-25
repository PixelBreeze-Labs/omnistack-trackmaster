"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Users,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  BarChart2,
  Building2,
  Settings,
  ArrowRight,
  XCircle,
  AlertTriangle,
  Activity,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIAgentsContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [agentStats, setAgentStats] = useState({
    totalAgents: 6,
    activeAgents: 0,
    totalBusinesses: 0,
    agentsInUse: 0
  });

  // Available agent types
  const agentTypes = [
    {
      id: 'auto-assignment',
      name: 'Auto Assignment Agent',
      description: 'Automatically assigns tasks to staff members based on skills, availability, and workload optimization.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'compliance-monitoring',
      name: 'Compliance Monitoring Agent',
      description: 'Monitors compliance with certifications, safety requirements, and regulatory standards.',
      icon: <ShieldCheck className="h-6 w-6" />,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'report-generation',
      name: 'Report Generation Agent',
      description: 'Generates automated reports, analytics, and business intelligence dashboards.',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'client-communication',
      name: 'Client Communication Agent',
      description: 'Automates client communications, updates, and relationship management.',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'resource-request',
      name: 'Resource Management Agent',
      description: 'Manages resource requests, inventory forecasting, and supply chain optimization.',
      icon: <Layers className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'shift-optimization',
      name: 'Shift Optimization Agent',
      description: 'Optimizes staff scheduling, shift assignments, and workforce planning.',
      icon: <BarChart2 className="h-6 w-6" />,
      color: 'bg-teal-100 text-teal-700'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from API
      setAgentStats({
        totalAgents: 6,
        activeAgents: 6,
        totalBusinesses: 1,
        agentsInUse: 6
      });
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleViewBusinessAgents = () => {
    router.push('/crm/platform/businesses');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and deploy intelligent automation agents across your businesses
          </p>
        </div>
        <Button onClick={handleViewBusinessAgents} className="w-fit">
          <Building2 className="mr-2 h-4 w-4" />
          Manage Business Agents
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agent Types</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              Available agent types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{agentStats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              Currently deployed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Using AI agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.agentsInUse}</div>
            <p className="text-xs text-muted-foreground">
              Across all businesses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Agent Types */}
      <Card>
        <CardHeader>

        <div className="mb-1">
            <h3 className="font-medium flex"><Bot className="h-5 w-5" />
            Available AI Agents</h3>
            <p className="text-sm text-muted-foreground">
            Choose from our comprehensive suite of AI agents to automate your business processes
            </p>
          </div>
          
        </CardHeader>
        <CardContent>
          <div className="grid mt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentTypes.map((agent) => (
  <Card key={agent.id} className="relative hover:shadow-md transition-shadow">
    <CardHeader style={{display: "block"}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${agent.color}`}>
            {agent.icon}
          </div>
          <h3 className="font-semibold text-base">{agent.name}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          Available
        </Badge>
      </div>
    </CardHeader>
    <div className="pt-3">
      <p className="text-sm text-muted-foreground">
        {agent.description}
      </p>
    </div>
  </Card>
))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-amber-800">Advanced Configuration</h3>
              <p className="text-sm text-amber-700">
                To configure and deploy AI agents for specific businesses, please navigate to the 
                individual business pages. Each business can have its own customized agent settings 
                and configurations tailored to their specific needs.
              </p>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleViewBusinessAgents}
                  className="border-amber-300 text-amber-800 hover:bg-amber-100"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Go to Business Management
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-1">
                <span className="text-xs font-bold px-2">1</span>
              </div>
              <div>
                <h4 className="font-medium">Select a Business</h4>
                <p className="text-sm text-muted-foreground">
                  Navigate to the business you want to configure agents for
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-1">
                <span className="text-xs font-bold px-2">2</span>
              </div>
              <div>
                <h4 className="font-medium">Choose Agent Types</h4>
                <p className="text-sm text-muted-foreground">
                  Select which AI agents you want to deploy for that business
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-1">
                <span className="text-xs font-bold px-2">3</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Customize each agent's behavior and parameters to match business needs
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-1">
                <span className="text-xs font-bold px-2">4</span>
              </div>
              <div>
                <h4 className="font-medium">Enable & Monitor</h4>
                <p className="text-sm text-muted-foreground">
                  Activate agents and monitor their performance through the dashboard
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add bottom spacing */}
      <div className="h-10"></div>
    </div>
  );
}