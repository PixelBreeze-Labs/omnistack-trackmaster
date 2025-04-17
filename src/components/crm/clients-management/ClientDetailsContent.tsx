"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/new-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building,
  Check,
  Gift,
  AlertTriangle,
  RefreshCcw,
  Trash2,
  Calendar,
  Monitor,
  Globe,
  Copy,
  ClipboardCopy,
  Plus,
  BarChart3,
  FileQuestion,
  PieChart,
  MessageSquare,
  Shield,
  FileBarChart2,
  LockKeyhole
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useClientApps } from "@/hooks/useClientApps";
import { toast } from "react-hot-toast";
import { Client } from "@/app/api/external/omnigateway/types/clients";
import { ClientApp } from "@/app/api/external/omnigateway/types/client-apps";

interface ClientDetailsContentProps {
  clientId: string;
}

// Special Feature Cards based on client ID
const SpecialFeatureCards = ({ clientId }) => {
  if (clientId === "67feac2cd5060f88345d0056") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-blue-500" />
              WP Polls Plugin
            </CardTitle>
            <CardDescription>Manage polls and questionnaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                  <PieChart className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium">12</span>
                  <span className="text-xs text-muted-foreground">Active Polls</span>
                </div>
                <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium">1,254</span>
                  <span className="text-xs text-muted-foreground">Responses</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last poll created:</span>
                  <span className="font-medium">Apr 12, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most active poll:</span>
                  <span className="font-medium">Reader Satisfaction</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>
              Manage Polls
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              WP Secure Reports Plugin
            </CardTitle>
            <CardDescription>Manage confidential reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 rounded-lg p-3 flex flex-col items-center">
                  <FileBarChart2 className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium">8</span>
                  <span className="text-xs text-muted-foreground">Active Forms</span>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center">
                  <LockKeyhole className="h-8 w-8 text-indigo-500 mb-2" />
                  <span className="text-sm font-medium">48</span>
                  <span className="text-xs text-muted-foreground">Secure Reports</span>
                </div>
              </div>
              <Badge className="bg-green-500">
                <Check className="mr-1 h-3 w-3" />
                Secure Encryption Enabled
              </Badge>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last report received:</span>
                  <span className="font-medium">Apr 16, 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>
              View Secure Reports
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (clientId === "680027c0860084f81c6090cd") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-blue-500" />
              WP Polls Plugin
            </CardTitle>
            <CardDescription>Manage polls and questionnaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                  <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium">4</span>
                  <span className="text-xs text-muted-foreground">Active Polls</span>
                </div>
                <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium">387</span>
                  <span className="text-xs text-muted-foreground">Responses</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last poll created:</span>
                  <span className="font-medium">Apr 9, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most active poll:</span>
                  <span className="font-medium">Customer Experience</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>
              Manage Polls
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return null;
};
// Delete Client Modal Component
const DeleteClientModal = ({ 
  client, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(client);
      toast.success("Client deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting client:", error);
      // Error is handled by the hook and displayed there
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Client
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete client {client?.name}? This action cannot be undone and will remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ClientDetailsContent({ clientId }: ClientDetailsContentProps) {
  const router = useRouter();
  const { getClient, deleteClient, isLoading, isProcessing } = useClients();
  const { fetchClientApps, clientApps, isLoading: isAppsLoading } = useClientApps();
  const [client, setClient] = useState<Client | null>(null);
  const [clientApplications, setClientApplications] = useState<ClientApp[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const clientData = await getClient(clientId);
        setClient(clientData);
        
        // Fetch client apps associated with this client
        if (clientData?.clientAppIds?.length > 0) {
          // Here we'd ideally filter client apps by client, but for now we'll just fetch all
          // and filter on the client side since we don't have a direct endpoint for this
          const apps = await fetchClientApps();
          const filteredApps = apps?.data?.filter(app => 
            clientData.clientAppIds.includes(app._id)
          ) || [];
          setClientApplications(filteredApps);
        }
      } catch (error) {
        console.error("Error loading client details:", error);
        toast.error("Failed to load client details");
      }
    };

    if (clientId) {
      loadClient();
    }
  }, [clientId, getClient, fetchClientApps]);

  const handleBackClick = () => {
    router.push("/crm/platform/os-clients");
  };

  const handleCAClick = () => {
    router.push("/crm/platform/os-client-apps");
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (client) => {
    try {
      await deleteClient(client._id);
      toast.success(`Client ${client.name} deleted successfully`);
      router.push("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading || !client) {
    return (
      <div className="flex justify-center items-center h-96">
        <RefreshCcw className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBackClick}
            className="h-8 w-8 p-0 mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{client.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Client details and associated applications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-red-600 hover:bg-red-700"
            size="sm" 
            disabled={isProcessing} 
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Client
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications ({clientApplications.length})</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Client Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{client.code}</code>
                    {client.isActive ? (
                      <Badge variant="success" className="bg-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Client ID</h3>
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono truncate max-w-[200px]">
                        {client._id}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(client._id, "Client ID copied to clipboard")}
                      >
                        <ClipboardCopy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">API Key</h3>
                    <div className="flex items-center gap-2">
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono truncate max-w-[200px]">
                        {client.apiKey ? client.apiKey : "N/A"}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(client.apiKey || "", "API Key copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Default Currency</h3>
                    <p>{client.defaultCurrency || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Created Date</h3>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(client.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                    <div>
                      {client.isActive ? (
                        <Badge variant="success" className="bg-green-500">
                          <Check className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Applications</h3>
                    <p className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      {clientApplications.length} Connected Apps
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">VenueBoost Integration</CardTitle>
                <CardDescription>Venue booking system connection</CardDescription>
              </CardHeader>
              <CardContent>
                {client.venueBoostConnection ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="bg-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatDate(client.venueBoostConnection.connectedAt)}</span>
                    </div>
                    <p className="text-sm">
                      Venue Code: <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{client.venueBoostConnection.venueShortCode || "N/A"}</code>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Not Connected
                    </Badge>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" size="sm" disabled={!!client.venueBoostConnection}>
                  {client.venueBoostConnection ? "Manage Connection" : "Connect VenueBoost"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loyalty Program</CardTitle>
                <CardDescription>Customer loyalty configuration</CardDescription>
              </CardHeader>
              <CardContent>
                {client.loyaltyProgram && client.loyaltyProgram.programName ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500">
                        <Gift className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{client.loyaltyProgram.programName}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.loyaltyProgram.pointsPerCurrency} points per {client.defaultCurrency}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Gift className="mr-1 h-3 w-3" />
                      Not Configured
                    </Badge>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" size="sm">
                  {client.loyaltyProgram && client.loyaltyProgram.programName ? "Manage Program" : "Setup Loyalty Program"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Special Feature Cards - Only render for specific client IDs */}
  <SpecialFeatureCards clientId={clientId} />
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Client Applications</CardTitle>
                  <CardDescription>Applications associated with this client</CardDescription>
                </div>
                <Button size="sm" onClick={handleCAClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Application
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAppsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : clientApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This client doesn't have any associated applications yet.
                  </p>
                  <Button size="sm" onClick={handleCAClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientApplications.map(app => (
                    <Card key={app._id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                              <Monitor className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">{app.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                {Array.isArray(app.domain) && app.domain.length > 0 
                                  ? app.domain[0] 
                                  : 'No domain'}
                                <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                                  {app.type.charAt(0).toUpperCase() + app.type.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={app.status === 'active' ? 'default' : 'destructive'}
                              className={app.status === 'active' ? 'bg-green-500' : ''}
                            >
                              {app.status === 'active' ? (
                                <><Check className="mr-1 h-3 w-3" />Active</>
                              ) : (
                                <><AlertTriangle className="mr-1 h-3 w-3" />Inactive</>
                              )}
                            </Badge>
                        
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Configuration</CardTitle>
              <CardDescription>Basic settings and configuration options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Client Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{client.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Code:</span>
                        <span className="text-sm font-medium">{client.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Default Currency:</span>
                        <span className="text-sm font-medium">{client.defaultCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span>
                          {client.isActive ? (
                            <Badge variant="success" className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">API Configuration</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Client ID:</span>
                        <span className="text-sm font-mono truncate max-w-[200px]">{client._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">API Key:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-mono">{client.apiKey ? client.apiKey.substring(0, 10) + "..." : "N/A"}</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            className="h-5 w-5 p-0"
                            onClick={() => copyToClipboard(client.apiKey || "", "API Key copied to clipboard")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <span className="text-sm">{formatDate(client.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <span className="text-sm">{formatDate(client.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">Delete Client</h4>
                        <p className="text-sm text-red-600 mb-3">
                          Permanently delete this client and all associated data. This action cannot be undone.
                        </p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleDeleteClick}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Client
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <DeleteClientModal
        client={client}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isProcessing}
      />

       {/* Add empty space div at the bottom */}
    <div className="h-8"></div>
    </div>
  );
}