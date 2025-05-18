"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Cpu,
  LineChart,
  BarChart,
  Lightbulb,
  Zap,
  Activity,
  ArrowUpRight,
  Terminal,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/new-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import InputSelect from "@/components/Common/InputSelect";
import { format, formatDistance } from "date-fns";
import { useML } from "@/hooks/useML";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function IntelligenceHubContent() {
    const {
        isLoading,
        systemStatus,
        systemStats,
        fetchSystemStatus,
        fetchSystemStats,
        fetchModels,
        makePrediction,
        registerModel,
        saveFeatures,
        clearTestResult,
        testResult,
        isInitialized
      } = useML();
    
      const [daysPeriod, setDaysPeriod] = useState(7);
      const [selectedTab, setSelectedTab] = useState("overview");
      
      // Dialogs
      const [showTestModelDialog, setShowTestModelDialog] = useState(false);
      const [showRegisterModelDialog, setShowRegisterModelDialog] = useState(false);
      const [showFeatureDialog, setShowFeatureDialog] = useState(false);
      
      // Form states
      const [testModelForm, setTestModelForm] = useState({
        modelName: "",
        entityType: "project",
        entityId: "",
        businessId: "",
        userId: "admin",
        features: "{}"
      });
      
      const [registerModelForm, setRegisterModelForm] = useState({
        modelName: "",
        version: "1.0.0",
        type: "classification",
        status: "active",
        businessId: "",
        description: ""
      });
      
      const [featureForm, setFeatureForm] = useState({
        entityId: "",
        entityType: "project",
        featureSetName: "project_risk",
        businessId: "",
        features: "{}"
      });
    
      useEffect(() => {
        if (isInitialized) {
          fetchSystemStatus();
          fetchSystemStats(daysPeriod);
          fetchModels();
        }
      }, [isInitialized, fetchSystemStatus, fetchSystemStats, fetchModels, daysPeriod]);

      const handleDaysPeriodChange = (value: string) => {
        setDaysPeriod(parseInt(value));
      };
    
      const refreshData = () => {
        fetchSystemStatus();
        fetchSystemStats(daysPeriod);
        fetchModels();
      };
    
      // Format time for display
      const formatTime = (dateStr?: string | null) => {
        if (!dateStr) return "N/A";
        return format(new Date(dateStr), "MMM d, yyyy HH:mm:ss");
      };
    
      // Get time ago for display
      const getTimeAgo = (dateStr?: string | null) => {
        if (!dateStr) return "";
        return formatDistance(new Date(dateStr), new Date(), { addSuffix: true });
      };
    
      // Get severity badge
      const getSeverityBadge = (severity: string | null) => {
        if (!severity) return <Badge variant="outline">Unknown</Badge>;
        
        switch (severity) {
          case "low":
            return <Badge className="bg-blue-500 hover:bg-blue-600">Low</Badge>;
          case "medium":
            return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
          case "high":
            return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
          case "critical":
            return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
          default:
            return <Badge variant="outline">{severity}</Badge>;
        }
      };
    
      // Get status badge
      const getStatusBadge = (status: string | null) => {
        if (!status) return <Badge variant="outline">Unknown</Badge>;
        
        switch (status) {
          case "active":
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
          case "inactive":
            return <Badge className="bg-gray-500 hover:bg-gray-600"><XCircle className="w-3 h-3 mr-1" /> Inactive</Badge>;
          case "training":
            return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Training</Badge>;
          case "failed":
            return <Badge className="bg-red-500 hover:bg-red-600"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
          case "completed":
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
          case "pending":
            return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
          case "operational":
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Operational</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      };

      const handleTestModelSubmit = () => {
        try {
          const parsedFeatures = JSON.parse(testModelForm.features);
          makePrediction({
            modelName: testModelForm.modelName,
            entityType: testModelForm.entityType,
            entityId: testModelForm.entityId,
            businessId: testModelForm.businessId,
            userId: testModelForm.userId,
            features: parsedFeatures
          });
        } catch (error) {
          console.error("Error parsing features JSON:", error);
        }
      };
    
      const handleRegisterModelSubmit = () => {
        registerModel(registerModelForm);
        setShowRegisterModelDialog(false);
      };
    
      const handleSaveFeaturesSubmit = () => {
        try {
          const parsedFeatures = JSON.parse(featureForm.features);
          saveFeatures({
            entityId: featureForm.entityId,
            entityType: featureForm.entityType,
            featureSetName: featureForm.featureSetName,
            businessId: featureForm.businessId,
            features: parsedFeatures
          });
          setShowFeatureDialog(false);
        } catch (error) {
          console.error("Error parsing features JSON:", error);
        }
      };
    
      const closeTestModelDialog = () => {
        setShowTestModelDialog(false);
        clearTestResult();
        setTestModelForm({
          modelName: "",
          entityType: "project",
          entityId: "",
          businessId: "",
          userId: "admin",
          features: "{}"
        });
      };

      return (
        <div className="container mx-auto space-y-6">
          <div className="space-y-4">
  {/* Header section */}
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Staffluent Intelligence Hub</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Monitor and test AI models, insights, and predictions for construction projects
      </p>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time Period:</span>
        <div className="w-32">
          <InputSelect
            name="daysPeriod"
            label=""
            value={daysPeriod.toString()}
            onChange={handleDaysPeriodChange}
            options={[
              { value: "1", label: "1 day" },
              { value: "7", label: "7 days" },
              { value: "30", label: "30 days" },
              { value: "90", label: "90 days" }
            ]}
          />
        </div>
      </div>
      <Button onClick={refreshData} variant="outline">
        <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
      </Button>
    </div>
  </div>
  
  {/* Action strip */}
  <div className="bg-gray-50 p-3 rounded-lg border flex flex-wrap gap-3 justify-between mb-4">
    <div className="flex items-center">
      <div className="rounded-full bg-primary p-2 mr-3">
        <Brain className="h-5 w-5 text-white" />
      </div>
      <div className="text-sm font-medium">Intelligence Actions</div>
    </div>
    
    <div className="flex gap-3 flex-wrap">
      <Button 
        className="bg-white border shadow-sm hover:bg-gray-50 text-black"
        onClick={() => setShowRegisterModelDialog(true)}
      >
        <Cpu className="mr-2 h-4 w-4 text-indigo-600" /> Register Model
      </Button>
      
      <Button 
        className="bg-primary shadow-sm"
        onClick={() => setShowTestModelDialog(true)}
      >
        <Terminal className="mr-2 h-4 w-4" /> Test Model
      </Button>
      
      <Button 
        className="bg-white border shadow-sm hover:bg-gray-50 text-black"
        onClick={() => setShowFeatureDialog(true)}
      >
        <Database className="mr-2 h-4 w-4 text-green-600" /> Save Features
      </Button>
      
      <Button 
        className="bg-white border shadow-sm hover:bg-gray-50 text-black"
      >
        <Lightbulb className="mr-2 h-4 w-4 text-amber-600" /> Generate Insights
      </Button>
    </div>
  </div>
</div>

          <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          {/* System Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current status of AI services and components
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : systemStatus ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full p-3 bg-green-100">
                        <Brain className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {getStatusBadge(systemStatus.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          All AI services are functioning normally
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last checked: {formatTime(new Date().toISOString())}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemStatus.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full p-2 bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{service}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500">Operational</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Could not retrieve system status</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))
            ) : systemStats ? (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <Cpu className="h-8 w-8 text-indigo-500" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">AI Models</p>
                          <h3 className="text-2xl font-bold">{systemStats.totalModels}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Active Models</p>
                        <p className="text-lg font-bold text-green-600">
                          {systemStats.activeModels}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <BarChart className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Predictions</p>
                          <h3 className="text-2xl font-bold">{systemStats.totalPredictions}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Avg. Confidence</p>
                        <p className="text-lg font-bold">
                          {(systemStats.avgPredictionConfidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <Lightbulb className="h-8 w-8 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                          <h3 className="text-2xl font-bold">{systemStats.totalInsights}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">High Severity</p>
                        <p className="text-lg font-bold text-amber-600">{systemStats.highSeverityInsightsCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <Zap className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">AI Actions</p>
                          <h3 className="text-2xl font-bold">{systemStats.totalAgentActions}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-bold text-green-600">
                          {systemStats.totalAgentActions > 0 
                            ? Math.round((systemStats.successfulAgentActions / systemStats.totalAgentActions) * 100) 
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="col-span-4 flex justify-center items-center h-32">
                <p className="text-muted-foreground">No intelligence hub data available</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common operations for AI testing and integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setShowRegisterModelDialog(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full p-2 bg-indigo-100">
                      <Cpu className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="font-medium">Register New Model</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Register a new AI model for prediction and insights</p>
                </div>
                
                <div 
                  className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setShowTestModelDialog(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full p-2 bg-blue-100">
                      <Terminal className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="font-medium">Test Model Prediction</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Test an AI model with custom feature data</p>
                </div>
                
                <div 
                  className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setShowFeatureDialog(true)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full p-2 bg-green-100">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="font-medium">Save Entity Features</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Save feature data for project, task, or business</p>
                </div>
                
                <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full p-2 bg-amber-100">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="font-medium">Generate Insights</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Generate AI insights for a project or business</p>
                </div>
                
                <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full p-2 bg-purple-100">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="font-medium">Auto-Assign Task</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Test auto-assignment AI for tasks</p>
                </div>
                
                <div className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full p-2 bg-red-100">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="font-medium">Scan Compliance Issues</div>
                  </div>
                  <p className="text-sm text-muted-foreground">AI scan for compliance issues in a business</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODELS TAB */}
        <TabsContent value="models">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>Registered AI models in the system</CardDescription>
              </div>
              <Button
                onClick={() => setShowRegisterModelDialog(true)}
                variant="outline"
                size="sm"
              >
                <Cpu className="mr-2 h-4 w-4" /> Register New Model
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Business ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Display sample models for demonstration */}
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">project_risk_prediction</div>
                        <div className="text-xs text-muted-foreground">Risk assessment model</div>
                      </TableCell>
                      <TableCell>1.0.0</TableCell>
                      <TableCell>classification</TableCell>
                      <TableCell>{getStatusBadge("active")}</TableCell>
                      <TableCell>business456</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Details</Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setTestModelForm({
                              ...testModelForm,
                              modelName: "project_risk_prediction",
                              businessId: "business456"
                            });
                            setShowTestModelDialog(true);
                          }}>Test</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">task_assignment_optimizer</div>
                        <div className="text-xs text-muted-foreground">Employee assignment model</div>
                      </TableCell>
                      <TableCell>2.1.3</TableCell>
                      <TableCell>recommendation</TableCell>
                      <TableCell>{getStatusBadge("active")}</TableCell>
                      <TableCell>business789</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Details</Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setTestModelForm({
                              ...testModelForm,
                              modelName: "task_assignment_optimizer",
                              businessId: "business789"
                            });
                            setShowTestModelDialog(true);
                          }}>Test</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">compliance_checker</div>
                        <div className="text-xs text-muted-foreground">Compliance detection model</div>
                      </TableCell>
                      <TableCell>1.2.0</TableCell>
                      <TableCell>classification</TableCell>
                      <TableCell>{getStatusBadge("active")}</TableCell>
                      <TableCell>business456</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Details</Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setTestModelForm({
                              ...testModelForm,
                              modelName: "compliance_checker",
                              businessId: "business456"
                            });
                            setShowTestModelDialog(true);
                          }}>Test</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">weather_impact_analyzer</div>
                        <div className="text-xs text-muted-foreground">Weather impact prediction</div>
                      </TableCell>
                      <TableCell>1.0.1</TableCell>
                      <TableCell>regression</TableCell>
                      <TableCell>{getStatusBadge("training")}</TableCell>
                      <TableCell>business123</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Details</Button>
                          <Button variant="outline" size="sm" disabled>Test</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEATURES TAB */}
        <TabsContent value="features">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Feature Sets</CardTitle>
                <CardDescription>Stored feature data for AI models</CardDescription>
              </div>
              <Button
                onClick={() => setShowFeatureDialog(true)}
                variant="outline"
                size="sm"
              >
                <Database className="mr-2 h-4 w-4" /> Save New Features
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>Feature Set</TableHead>
                      <TableHead>Business ID</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample feature sets for demonstration */}
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">project/project123</div>
                        <div className="text-xs text-muted-foreground">Commercial Building Project</div>
                      </TableCell>
                      <TableCell>project_risk</TableCell>
                      <TableCell>business456</TableCell>
                      <TableCell>{formatTime(new Date().toISOString())}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">task/task789</div>
                        <div className="text-xs text-muted-foreground">Foundation Work Task</div>
                      </TableCell>
                      <TableCell>task_completion</TableCell>
                      <TableCell>business456</TableCell>
                      <TableCell>{formatTime(new Date().toISOString())}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">business/business456</div>
                        <div className="text-xs text-muted-foreground">ABC Construction Company</div>
                      </TableCell>
                      <TableCell>business_metrics</TableCell>
                      <TableCell>business456</TableCell>
                      <TableCell>{formatTime(new Date().toISOString())}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">employee/emp123</div>
                        <div className="text-xs text-muted-foreground">John Contractor</div>
                      </TableCell>
                      <TableCell>employee_performance</TableCell>
                      <TableCell>business789</TableCell>
                      <TableCell>{formatTime(new Date().toISOString())}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TESTING TAB */}
        <TabsContent value="testing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Testing</CardTitle>
                <CardDescription>Test AI models with custom feature data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="font-medium mb-2">Test Model Prediction</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Test a model's prediction using custom input features.
                    </p>
                    <Button onClick={() => setShowTestModelDialog(true)}>
                      <Terminal className="mr-2 h-4 w-4" /> Start Model Test
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium mb-2">Auto-Assignment Testing</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Test the auto-assignment algorithm for tasks.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taskId" className="mb-2 block text-sm">
                          Task ID
                        </Label>
                        <Input
                          id="taskId"
                          placeholder="Enter task ID"
                          className="mb-4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessIdAutoAssign" className="mb-2 block text-sm">
                          Business ID
                        </Label>
                        <Input
                          id="businessIdAutoAssign"
                          placeholder="Enter business ID"
                          className="mb-4"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Zap className="mr-2 h-4 w-4" /> Test Auto-Assignment
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="font-medium mb-2">Insight Generation Testing</div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Test generating insights for entities.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="entityType" className="mb-2 block text-sm">
                          Entity Type
                        </Label>
                        <InputSelect
                          name="entityType"
                          label=""
                          value="project"
                          onChange={() => {}}
                          options={[
                            { value: "project", label: "Project" },
                            { value: "task", label: "Task" },
                            { value: "business", label: "Business" }
                          ]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="entityId" className="mb-2 block text-sm">
                          Entity ID
                        </Label>
                        <Input
                          id="entityId"
                          placeholder="Enter entity ID"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Lightbulb className="mr-2 h-4 w-4" /> Generate Test Insights
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Results</CardTitle>
                <CardDescription>Results from recent AI tests</CardDescription>
              </CardHeader>
              <CardContent>
                {testResult ? (
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-medium">{testResult.modelName}</div>
                        <Badge className="bg-blue-500">
                          {(testResult.confidence * 100).toFixed(1)}% Confidence
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-muted-foreground">Entity:</div>
                        <div className="text-sm border rounded-md p-2 bg-gray-50">
                          {testResult.entityType}/{testResult.entityId}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-2">Prediction Result:</div>
                        <div className="text-sm border rounded-md p-2 bg-gray-50 font-mono">
                          {JSON.stringify(testResult.output, null, 2)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-2">Input Features:</div>
                        <div className="text-sm border rounded-md p-2 bg-gray-50 font-mono max-h-40 overflow-y-auto">
                          {JSON.stringify(testResult.input, null, 2)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={clearTestResult}>
                          Clear
                        </Button>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" /> Correct
                          </Button>
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-1" /> Incorrect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No recent test results</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Run a model test to see the prediction results here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        </Tabs>

      {/* Register Model Dialog */}
      <Dialog open={showRegisterModelDialog} onOpenChange={setShowRegisterModelDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Register New AI Model</DialogTitle>
            <DialogDescription>
              Enter the details to register a new AI model in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modelName" className="text-right">
                Model Name
              </Label>
              <Input
                id="modelName"
                value={registerModelForm.modelName}
                onChange={(e) => setRegisterModelForm({...registerModelForm, modelName: e.target.value})}
                className="col-span-3"
                placeholder="project_risk_prediction"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="version" className="text-right">
                Version
              </Label>
              <Input
                id="version"
                value={registerModelForm.version}
                onChange={(e) => setRegisterModelForm({...registerModelForm, version: e.target.value})}
                className="col-span-3"
                placeholder="1.0.0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <InputSelect
                name="type"
                label=""
                value={registerModelForm.type}
                onChange={(value) => setRegisterModelForm({...registerModelForm, type: value})}
                options={[
                  { value: "classification", label: "Classification" },
                  { value: "regression", label: "Regression" },
                  { value: "recommendation", label: "Recommendation" },
                  { value: "other", label: "Other" }
                ]}
                wrapperClassName="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <InputSelect
                name="status"
                label=""
                value={registerModelForm.status}
                onChange={(value) => setRegisterModelForm({...registerModelForm, status: value})}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "training", label: "Training" }
                ]}
                wrapperClassName="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessId" className="text-right">
                Business ID
              </Label>
              <Input
                id="businessId"
                value={registerModelForm.businessId}
                onChange={(e) => setRegisterModelForm({...registerModelForm, businessId: e.target.value})}
                className="col-span-3"
                placeholder="business123"
              />
            </div>
            <div className="grid grid-cols-4 items-top gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={registerModelForm.description}
                onChange={(e) => setRegisterModelForm({...registerModelForm, description: e.target.value})}
                className="col-span-3 h-20"
                placeholder="Model description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterModelDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegisterModelSubmit} disabled={isLoading}>
              {isLoading ? "Processing..." : "Register Model"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Model Dialog */}
      <Dialog open={showTestModelDialog} onOpenChange={setShowTestModelDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Test AI Model</DialogTitle>
            <DialogDescription>
              Enter the model details and feature data to test a prediction
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testModelName" className="text-right">
                Model Name
              </Label>
              <Input
                id="testModelName"
                value={testModelForm.modelName}
                onChange={(e) => setTestModelForm({...testModelForm, modelName: e.target.value})}
                className="col-span-3"
                placeholder="project_risk_prediction"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testEntityType" className="text-right">
                Entity Type
              </Label>
              <InputSelect
                name="testEntityType"
                label=""
                value={testModelForm.entityType}
                onChange={(value) => setTestModelForm({...testModelForm, entityType: value})}
                options={[
                  { value: "project", label: "Project" },
                  { value: "task", label: "Task" },
                  { value: "business", label: "Business" },
                  { value: "employee", label: "Employee" }
                ]}
                wrapperClassName="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testEntityId" className="text-right">
                Entity ID
              </Label>
              <Input
                id="testEntityId"
                value={testModelForm.entityId}
                onChange={(e) => setTestModelForm({...testModelForm, entityId: e.target.value})}
                className="col-span-3"
                placeholder="project123"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testBusinessId" className="text-right">
                Business ID
              </Label>
              <Input
                id="testBusinessId"
                value={testModelForm.businessId}
                onChange={(e) => setTestModelForm({...testModelForm, businessId: e.target.value})}
                className="col-span-3"
                placeholder="business123"
              />
            </div>
            <div className="grid grid-cols-4 items-top gap-4">
              <Label htmlFor="testFeatures" className="text-right pt-2">
                Features
              </Label>
              <Textarea
                id="testFeatures"
                value={testModelForm.features}
                onChange={(e) => setTestModelForm({...testModelForm, features: e.target.value})}
                className="col-span-3 h-32 font-mono text-sm"
                placeholder='{"project_duration_days": 120, "days_remaining": 45, "completion_percentage": 0.65}'
              />
            </div>

            {testResult && (
              <div className="col-span-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Prediction Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Model:</div>
                      <div className="font-medium">{testResult.modelName}</div>
                      
                      <div className="text-muted-foreground">Prediction:</div>
                      <div className="font-medium">{JSON.stringify(testResult.output)}</div>
                      
                      <div className="text-muted-foreground">Confidence:</div>
                      <div className="font-medium">{(testResult.confidence * 100).toFixed(2)}%</div>
                      
                      <div className="text-muted-foreground">Entity:</div>
                      <div className="font-medium">{testResult.entityType}/{testResult.entityId}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeTestModelDialog}>
              Cancel
            </Button>
            <Button onClick={handleTestModelSubmit} disabled={isLoading}>
              {isLoading ? "Processing..." : "Test Model"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Features Dialog */}
      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Save Entity Features</DialogTitle>
            <DialogDescription>
              Save feature data for an entity to use with AI models
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featureEntityType" className="text-right">
                Entity Type
              </Label>
              <InputSelect
                name="featureEntityType"
                label=""
                value={featureForm.entityType}
                onChange={(value) => setFeatureForm({...featureForm, entityType: value})}
                options={[
                  { value: "project", label: "Project" },
                  { value: "task", label: "Task" },
                  { value: "business", label: "Business" },
                  { value: "employee", label: "Employee" }
                ]}
                wrapperClassName="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featureEntityId" className="text-right">
                Entity ID
              </Label>
              <Input
                id="featureEntityId"
                value={featureForm.entityId}
                onChange={(e) => setFeatureForm({...featureForm, entityId: e.target.value})}
                className="col-span-3"
                placeholder="project123"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featureSetName" className="text-right">
                Feature Set Name
              </Label>
              <Input
                id="featureSetName"
                value={featureForm.featureSetName}
                onChange={(e) => setFeatureForm({...featureForm, featureSetName: e.target.value})}
                className="col-span-3"
                placeholder="project_risk"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featureBusinessId" className="text-right">
                Business ID
              </Label>
              <Input
                id="featureBusinessId"
                value={featureForm.businessId}
                onChange={(e) => setFeatureForm({...featureForm, businessId: e.target.value})}
                className="col-span-3"
                placeholder="business123"
              />
            </div>
            <div className="grid grid-cols-4 items-top gap-4">
              <Label htmlFor="features" className="text-right pt-2">
                Features
              </Label>
              <Textarea
                id="features"
                value={featureForm.features}
                onChange={(e) => setFeatureForm({...featureForm, features: e.target.value})}
                className="col-span-3 h-32 font-mono text-sm"
                placeholder='{"project_duration_days": 120, "days_remaining": 45, "completion_percentage": 0.65, "team_size": 8, "task_complexity_average": 0.7, "blocked_tasks": 2}'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeaturesSubmit} disabled={isLoading}>
              {isLoading ? "Processing..." : "Save Features"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Add bottom spacing */}
       <div className="h-10"></div>
    </div>
  );
}