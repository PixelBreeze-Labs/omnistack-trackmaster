"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/new-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  RefreshCcw,
  Save,
  Sun,
  Moon,
  Plus,
  Trash,
  Users,
  CheckCircle,
  AlertTriangle,
  Webhook
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePolls } from "@/hooks/usePolls";
import { useClients } from "@/hooks/useClients";
import { Poll, PollOption } from "@/app/api/external/omnigateway/types/polls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreatePollFormProps {
  clientId: string;
}

export default function CreatePollForm({ clientId }: CreatePollFormProps) {
  const router = useRouter();
  const { isProcessing, createPoll } = usePolls();
  const { getClient, fetchClients, isLoading: isClientLoading, clients } = useClients();

  const [clientName, setClientName] = useState("Client");
  const [formData, setFormData] = useState<Partial<Poll>>({
    title: "",
    description: "",
    highlightColor: "#2597a4",
    showResults: true,
    options: [
      { optionText: "Option 1", votes: 0 },
      { optionText: "Option 2", votes: 0 }
    ],
    voteButtonColor: "#0a0a0a",
    voteButtonHoverColor: "#1d7a84",
    optionsBackgroundColor: "#fcfcfc",
    optionsHoverColor: "#f7f9fc",
    resultsLinkColor: "#0a0a0a",
    resultsLinkHoverColor: "#1d7a84",
    progressBarBackgroundColor: "#f0f0f5",
    radioBorderColor: "#d0d5dd",
    radioCheckedBorderColor: "#2597a4",
    radioCheckedDotColor: "#2597a4",
    percentageLabelColor: "#ffffff",
    iconColor: "#d0d5dd",
    iconHoverColor: "#2597a4",
    // Multi-client polls are always enabled
    isMultiClient: true,
    additionalClientIds: [],
    clientStyleOverrides: {}
  });

  const [activeTab, setActiveTab] = useState("multiClient");
  const [previewDarkMode, setPreviewDarkMode] = useState(false);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  
  // Featured clients to show at the top of the selection
  const featuredClientNames = ["Neps", "Iconstyle", "GazetaReforma"];
  const [featuredClients, setFeaturedClients] = useState<any[]>([]);
  const [otherClients, setOtherClients] = useState<any[]>([]);

  // Fetch client data on load
  useEffect(() => {
    const loadClient = async () => {
      try {
        // Load client info
        if (clientId) {
          const response = await getClient(clientId);
          const client = response?.client || response;
          if (client) {
            setClientName(client.name);
          }
        }
        
        // Load all clients for multi-client selection
        const allClients = await fetchClients();
        if (allClients && allClients.data) {
          // Filter out the current client
          const otherClientsList = allClients.data.filter(client => client._id !== clientId);
          
          // Separate featured clients from others
          const featured = [];
          const others = [];
          
          for (const client of otherClientsList) {
            const clientOption = {
              value: client._id,
              label: client.name
            };
            
            if (featuredClientNames.includes(client.name)) {
              featured.push(clientOption);
            } else {
              others.push(clientOption);
            }
          }
          
          setFeaturedClients(featured);
          setOtherClients(others);
          setAvailableClients([...featured, ...others]);
        }
      } catch (error) {
        console.error("Error loading client data:", error);
        toast.error("Failed to load client data");
      }
    };
  
    loadClient();
  }, [clientId, getClient, fetchClients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleOptionTextChange = (index: number, value: string) => {
    setFormData(prev => {
      const newOptions = [...(prev.options || [])];
      newOptions[index] = { ...newOptions[index], optionText: value };
      return { ...prev, options: newOptions };
    });
  };

  const handleAddOption = () => {
    setFormData(prev => {
      const newOptions = [...(prev.options || [])];
      newOptions.push({ optionText: `Option ${newOptions.length + 1}`, votes: 0 });
      return { ...prev, options: newOptions };
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options && formData.options.length > 2) {
      setFormData(prev => {
        const newOptions = [...(prev.options || [])];
        newOptions.splice(index, 1);
        return { ...prev, options: newOptions };
      });
    } else {
      toast.error("Polls must have at least two options");
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle multi-client client selection
  const handleClientSelection = (selectedOptions: string[]) => {
    setFormData(prev => ({
      ...prev,
      additionalClientIds: selectedOptions
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Poll title is required");
      return;
    }
    
    if (!formData.options || formData.options.length < 2) {
      toast.error("Poll must have at least two options");
      return;
    }
    
    if (!formData.additionalClientIds || formData.additionalClientIds.length === 0) {
      toast.error("Please select at least one client to share this poll with");
      return;
    }
    
    try {
      // Set the primary client ID
      const pollData = {
        ...formData,
        clientId: clientId,
        isMultiClient: true // Ensure it's a multi-client poll
      };
      
      await createPoll(pollData);
      toast.success("Multi-client poll created successfully");
      router.push(`/crm/platform/os-clients/${clientId}/wp-polls`);
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll");
    }
  };

  const handleBackClick = () => {
    router.push(`/crm/platform/os-clients/${clientId}/wp-polls`);
  };

  // Create a preview Poll object
  const previewPoll: Poll = {
    ...(formData as any),
    _id: "preview-id",
    clientId: clientId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isClientLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <h1 className="text-2xl font-bold tracking-tight">Create Multi-Client Poll</h1>
            <p className="text-sm text-muted-foreground">
              Share a poll across multiple clients from {clientName}
            </p>
          </div>
        </div>
      </div>

      {/* WordPress Notice Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Multi-Client Poll Creation</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This form is exclusively for creating polls that are shared across multiple clients. For basic single-client polls, please create them directly from WordPress.
            </p>
            <div className="mt-3">
              <Button variant="outline" size="sm" className="bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                <Webhook className="mr-2 h-4 w-4" />
                Clients WordPress
              </Button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-1">
          {/* Main edit area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="multiClient">Client Selection</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>

              {/* Multi-Client Tab - Now First Tab */}
              <TabsContent value="multiClient" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Client Selection</CardTitle>
                    <CardDescription>Select which clients this poll will be shared with</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Multi-Client Poll</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            This poll will be shared with multiple clients. Each client can have their own style overrides, but the poll options and voting data will be shared across all clients.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {availableClients.length > 0 ? (
                      <div className="space-y-2">
                        <Label htmlFor="additionalClientIds">Select Clients to Share With</Label>
                        <select
                          id="additionalClientIds"
                          multiple
                          className="w-full p-2 border rounded-md h-32"
                          value={formData.additionalClientIds || []}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            handleClientSelection(selected);
                          }}
                        >
                          {/* Featured Clients Group */}
                          <optgroup label="Featured Clients">
                            {featuredClients.map(client => (
                              <option key={client.value} value={client.value}>
                                {client.label}
                              </option>
                            ))}
                          </optgroup>
                          
                          {/* Other Clients Group */}
                          {otherClients.length > 0 && (
                            <optgroup label="Other Clients">
                              {otherClients.map(client => (
                                <option key={client.value} value={client.value}>
                                  {client.label}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <p className="text-xs text-muted-foreground">
                          Hold CTRL (or CMD on Mac) to select multiple clients
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                        <p className="text-sm text-gray-600">
                          No other clients available to share with
                        </p>
                      </div>
                    )}
                    
                    {formData.additionalClientIds && formData.additionalClientIds.length > 0 && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800">Selected Clients</h4>
                            <p className="text-sm text-green-700 mt-1">
                              This poll will be shared with {formData.additionalClientIds.length} client(s).
                            </p>
                            <p className="text-xs text-green-600 mt-2">
                              Note: After creating the poll, you can customize the style overrides for each client.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>Set the main poll details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Poll Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleInputChange}
                        placeholder="Enter poll title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        placeholder="Enter poll description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showResults"
                          checked={formData.showResults}
                          onCheckedChange={(checked) => handleSwitchChange("showResults", checked)}
                        />
                        <Label htmlFor="showResults">Allow users to view results before voting</Label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoEmbed"
                          checked={formData.autoEmbed}
                          onCheckedChange={(checked) => handleSwitchChange("autoEmbed", checked)}
                        />
                        <Label htmlFor="autoEmbed">Auto-embed on website</Label>
                      </div>
                    </div>

                    {formData.autoEmbed && (
                      <div className="pt-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="autoEmbedAllPosts"
                            checked={formData.autoEmbedAllPosts}
                            onCheckedChange={(checked) => handleSwitchChange("autoEmbedAllPosts", checked)}
                          />
                          <Label htmlFor="autoEmbedAllPosts">Embed in all posts and pages</Label>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Options Tab */}
              <TabsContent value="options" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Poll Options</CardTitle>
                    <CardDescription>Add the available choices for this poll</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.options && formData.options.map((option, index) => (
                      <div key={index} className="space-y-2 border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex items-center">
                          <span className="font-medium w-8">#{index + 1}</span>
                          <div className="flex-1">
                            <Label htmlFor={`option-${index}`}>Option Text</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`option-${index}`}
                                value={option.optionText}
                                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                placeholder="Enter option text"
                                className="flex-1"
                              />
                              <Button 
                                type="button"
                                variant="outline" 
                                size="icon"
                                onClick={() => handleRemoveOption(index)}
                                disabled={formData.options && formData.options.length <= 2}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddOption}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackClick}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} type="button" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Poll
                  </>
                )}
              </Button>
            </div>
          </div>

         
        </div>
      </form>

      {/* Add empty space div at the bottom */}
      <div className="h-8"></div>
    </div>
  );
}