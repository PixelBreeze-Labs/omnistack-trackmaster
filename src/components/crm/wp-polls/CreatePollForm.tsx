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
  CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePolls } from "@/hooks/usePolls";
import { useClients } from "@/hooks/useClients";
import { Poll, PollOption } from "@/app/api/external/omnigateway/types/polls";
import InputSelect from "@/components/Common/InputSelect";
import PollPreview from "./PollPreview";
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
    highlightAnimation: "fade",
    showResults: true,
    darkMode: false,
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
    darkModeBackground: "#222222",
    darkModeTextColor: "#ffffff",
    darkModeOptionBackground: "#333333",
    darkModeOptionHover: "#444444",
    darkModeLinkColor: "#ffffff",
    darkModeLinkHoverColor: "#2597a4",
    darkModeProgressBackground: "#444444",
    darkModeRadioBorder: "#444444",
    darkModeRadioCheckedBorder: "#2597a4",
    darkModeRadioCheckedDot: "#2597a4",
    darkModePercentageLabelColor: "#ffffff",
    darkModeIconColor: "#ffffff", 
    darkModeIconHoverColor: "#2597a4",
    // Fields for multi-client polls
    isMultiClient: false,
    additionalClientIds: [],
    clientStyleOverrides: {}
  });

  const [activeTab, setActiveTab] = useState("general");
  const [previewDarkMode, setPreviewDarkMode] = useState(false);
  const [availableClients, setAvailableClients] = useState<any[]>([]);

  // Animation options
  const animationOptions = [
    { value: "fade", label: "Fade In" },
    { value: "slide", label: "Slide" },
    { value: "pulse", label: "Pulse" },
    { value: "bounce", label: "Bounce" },
    { value: "none", label: "None" }
  ];

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
          // Filter out the current client and format for dropdown
          const otherClients = allClients.data
            .filter(client => client._id !== clientId)
            .map(client => ({
              value: client._id,
              label: client.name
            }));
          setAvailableClients(otherClients);
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

  const handleOptionHighlightChange = (index: number, value: string) => {
    setFormData(prev => {
      const newOptions = [...(prev.options || [])];
      newOptions[index] = { ...newOptions[index], customHighlight: value };
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
    
    try {
      // Set the primary client ID
      const pollData = {
        ...formData,
        clientId: clientId
      };
      
      await createPoll(pollData);
      toast.success("Poll created successfully");
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
    updatedAt: new Date().toISOString(),
    darkMode: previewDarkMode
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
            <h1 className="text-2xl font-bold tracking-tight">Create New Poll</h1>
            <p className="text-sm text-muted-foreground">
              Create a new poll for {clientName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main edit area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="styling">Styling</TabsTrigger>
                <TabsTrigger value="darkMode">Dark Mode</TabsTrigger>
                <TabsTrigger value="multiClient">Multi-Client</TabsTrigger>
              </TabsList>

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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="highlightAnimation">Results Animation</Label>
                        <InputSelect
                          name="highlightAnimation"
                          value={formData.highlightAnimation || "fade"}
                          onChange={handleInputChange}
                          options={animationOptions}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="highlightColor">Highlight Color</Label>
                        <div className="flex">
                          <Input
                            id="highlightColor"
                            name="highlightColor"
                            type="color"
                            value={formData.highlightColor || "#2597a4"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="highlightColor"
                            value={formData.highlightColor || "#2597a4"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
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
                        
                        <div className="flex items-center space-x-2 ml-8">
                          <Label htmlFor={`option-highlight-${index}`}>Custom Highlight (Optional)</Label>
                          <Input
                            id={`option-highlight-${index}`}
                            type="color"
                            value={option.customHighlight || formData.highlightColor || "#2597a4"}
                            onChange={(e) => handleOptionHighlightChange(index, e.target.value)}
                            className="w-10 p-1 h-8"
                          />
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

              {/* Styling Tab */}
              <TabsContent value="styling" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Visual Styling</CardTitle>
                    <CardDescription>Customize the appearance of the poll</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="voteButtonColor">Vote Button Color</Label>
                        <div className="flex">
                          <Input
                            id="voteButtonColor"
                            name="voteButtonColor"
                            type="color"
                            value={formData.voteButtonColor || "#0a0a0a"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="voteButtonColor"
                            value={formData.voteButtonColor || "#0a0a0a"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="voteButtonHoverColor">Vote Button Hover</Label>
                        <div className="flex">
                          <Input
                            id="voteButtonHoverColor"
                            name="voteButtonHoverColor"
                            type="color"
                            value={formData.voteButtonHoverColor || "#1d7a84"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="voteButtonHoverColor"
                            value={formData.voteButtonHoverColor || "#1d7a84"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="optionsBackgroundColor">Options Background</Label>
                        <div className="flex">
                          <Input
                            id="optionsBackgroundColor"
                            name="optionsBackgroundColor"
                            type="color"
                            value={formData.optionsBackgroundColor || "#fcfcfc"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="optionsBackgroundColor"
                            value={formData.optionsBackgroundColor || "#fcfcfc"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="optionsHoverColor">Options Hover</Label>
                        <div className="flex">
                          <Input
                            id="optionsHoverColor"
                            name="optionsHoverColor"
                            type="color"
                            value={formData.optionsHoverColor || "#f7f9fc"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="optionsHoverColor"
                            value={formData.optionsHoverColor || "#f7f9fc"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resultsLinkColor">Results Link Color</Label>
                        <div className="flex">
                          <Input
                            id="resultsLinkColor"
                            name="resultsLinkColor"
                            type="color"
                            value={formData.resultsLinkColor || "#0a0a0a"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="resultsLinkColor"
                            value={formData.resultsLinkColor || "#0a0a0a"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resultsLinkHoverColor">Results Link Hover</Label>
                        <div className="flex">
                          <Input
                            id="resultsLinkHoverColor"
                            name="resultsLinkHoverColor"
                            type="color"
                            value={formData.resultsLinkHoverColor || "#1d7a84"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="resultsLinkHoverColor"
                            value={formData.resultsLinkHoverColor || "#1d7a84"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="progressBarBackgroundColor">Progress Bar Background</Label>
                        <div className="flex">
                          <Input
                            id="progressBarBackgroundColor"
                            name="progressBarBackgroundColor"
                            type="color"
                            value={formData.progressBarBackgroundColor || "#f0f0f5"}
                            onChange={handleInputChange}
                            className="w-12 p-1 h-10"
                          />
                          <Input
                            name="progressBarBackgroundColor"
                            value={formData.progressBarBackgroundColor || "#f0f0f5"}
                            onChange={handleInputChange}
                            className="flex-1 ml-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-2">Radio Button Styling</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="radioBorderColor">Border (unchecked)</Label>
                          <div className="flex">
                            <Input
                              id="radioBorderColor"
                              name="radioBorderColor"
                              type="color"
                              value={formData.radioBorderColor || "#d0d5dd"}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              name="radioBorderColor"
                              value={formData.radioBorderColor || "#d0d5dd"}
                              onChange={handleInputChange}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="radioCheckedBorderColor">Border (checked)</Label>
                          <div className="flex">
                            <Input
                              id="radioCheckedBorderColor"
                              name="radioCheckedBorderColor"
                              type="color"
                              value={formData.radioCheckedBorderColor || "#2597a4"}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              name="radioCheckedBorderColor"
                              value={formData.radioCheckedBorderColor || "#2597a4"}
                              onChange={handleInputChange}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="radioCheckedDotColor">Dot Color</Label>
                          <div className="flex">
                            <Input
                              id="radioCheckedDotColor"
                              name="radioCheckedDotColor"
                              type="color"
                              value={formData.radioCheckedDotColor || "#2597a4"}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              name="radioCheckedDotColor"
                              value={formData.radioCheckedDotColor || "#2597a4"}
                              onChange={handleInputChange}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Icons and Labels section */}
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-2">Icons and Labels</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="percentageLabelColor">Percentage Label Color</Label>
                          <div className="flex">
                            <Input
                              id="percentageLabelColor"
                              name="percentageLabelColor"
                              type="color"
                              value={formData.percentageLabelColor || "#ffffff"}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              name="percentageLabelColor"
                              value={formData.percentageLabelColor || "#ffffff"}
                              onChange={handleInputChange}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="iconColor">Icon Color</Label>
                          <div className="flex">
                            <Input
                              id="iconColor"
                              name="iconColor"
                              type="color"
                              value={formData.iconColor || "#d0d5dd"}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              name="iconColor"
                              value={formData.iconColor || "#d0d5dd"}
                              onChange={handleInputChange}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="iconHoverColor">Icon Hover Color</Label>
                          <div className="flex">
                            <Input
                              id="iconHoverColor"
                              name="iconHoverColor"
                              type="color"
                              value={formData.iconHoverColor || "#2597a4"}
                              onChange={handleInputChange}
                              className="w-12 p-1 h-10"
                            />
                            <Input
                              name="iconHoverColor"
                              value={formData.iconHoverColor || "#2597a4"}
                              onChange={handleInputChange}
                              className="flex-1 ml-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dark Mode Tab */}
              <TabsContent value="darkMode" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Dark Mode Settings</CardTitle>
                    <CardDescription>Configure the dark mode version of the poll</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="darkMode"
                          checked={formData.darkMode}
                          onCheckedChange={(checked) => handleSwitchChange("darkMode", checked)}
                        />
                        <Label htmlFor="darkMode">Enable Dark Mode</Label>
                      </div>
                      
                      {formData.darkMode && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="darkModeBackground">Background Color</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeBackground"
                                  name="darkModeBackground"
                                  type="color"
                                  value={formData.darkModeBackground || "#222222"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeBackground"
                                  value={formData.darkModeBackground || "#222222"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="darkModeTextColor">Text Color</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeTextColor"
                                  name="darkModeTextColor"
                                  type="color"
                                  value={formData.darkModeTextColor || "#ffffff"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeTextColor"
                                  value={formData.darkModeTextColor || "#ffffff"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="darkModeOptionBackground">Option Background</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeOptionBackground"
                                  name="darkModeOptionBackground"
                                  type="color"
                                  value={formData.darkModeOptionBackground || "#333333"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeOptionBackground"
                                  value={formData.darkModeOptionBackground || "#333333"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="darkModeOptionHover">Option Hover Color</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeOptionHover"
                                  name="darkModeOptionHover"
                                  type="color"
                                  value={formData.darkModeOptionHover || "#444444"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeOptionHover"
                                  value={formData.darkModeOptionHover || "#444444"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="darkModeLinkColor">Link Color</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeLinkColor"
                                  name="darkModeLinkColor"
                                  type="color"
                                  value={formData.darkModeLinkColor || "#ffffff"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeLinkColor"
                                  value={formData.darkModeLinkColor || "#ffffff"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="darkModeLinkHoverColor">Link Hover Color</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeLinkHoverColor"
                                  name="darkModeLinkHoverColor"
                                  type="color"
                                  value={formData.darkModeLinkHoverColor || "#2597a4"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeLinkHoverColor"
                                  value={formData.darkModeLinkHoverColor || "#2597a4"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="darkModeProgressBackground">Progress Bar Background</Label>
                              <div className="flex">
                                <Input
                                  id="darkModeProgressBackground"
                                  name="darkModeProgressBackground"
                                  type="color"
                                  value={formData.darkModeProgressBackground || "#444444"}
                                  onChange={handleInputChange}
                                  className="w-12 p-1 h-10"
                                />
                                <Input
                                  name="darkModeProgressBackground"
                                  value={formData.darkModeProgressBackground || "#444444"}
                                  onChange={handleInputChange}
                                  className="flex-1 ml-2"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="text-md font-medium mb-2">Dark Mode Radio Button Styling</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="darkModeRadioBorder">Border (unchecked)</Label>
                                <div className="flex">
                                  <Input
                                    id="darkModeRadioBorder"
                                    name="darkModeRadioBorder"
                                    type="color"
                                    value={formData.darkModeRadioBorder || "#444444"}
                                    onChange={handleInputChange}
                                    className="w-12 p-1 h-10"
                                  />
                                  <Input
                                    name="darkModeRadioBorder"
                                    value={formData.darkModeRadioBorder || "#444444"}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-2"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="darkModeRadioCheckedBorder">Border (checked)</Label>
                                <div className="flex">
                                  <Input
                                    id="darkModeRadioCheckedBorder"
                                    name="darkModeRadioCheckedBorder"
                                    type="color"
                                    value={formData.darkModeRadioCheckedBorder || "#2597a4"}
                                    onChange={handleInputChange}
                                    className="w-12 p-1 h-10"
                                  />
                                  <Input
                                    name="darkModeRadioCheckedBorder"
                                    value={formData.darkModeRadioCheckedBorder || "#2597a4"}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-2"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="darkModeRadioCheckedDot">Dot Color</Label>
                                <div className="flex">
                                  <Input
                                    id="darkModeRadioCheckedDot"
                                    name="darkModeRadioCheckedDot"
                                    type="color"
                                    value={formData.darkModeRadioCheckedDot || "#2597a4"}
                                    onChange={handleInputChange}
                                    className="w-12 p-1 h-10"
                                  />
                                  <Input
                                    name="darkModeRadioCheckedDot"
                                    value={formData.darkModeRadioCheckedDot || "#2597a4"}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dark Mode Icons and Labels section */}
                          <div className="mt-6">
                            <h3 className="text-md font-medium mb-2">Dark Mode Icons and Labels</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="darkModePercentageLabelColor">Percentage Label Color</Label>
                                <div className="flex">
                                  <Input
                                    id="darkModePercentageLabelColor"
                                    name="darkModePercentageLabelColor"
                                    type="color"
                                    value={formData.darkModePercentageLabelColor || "#ffffff"}
                                    onChange={handleInputChange}
                                    className="w-12 p-1 h-10"
                                  />
                                  <Input
                                    name="darkModePercentageLabelColor"
                                    value={formData.darkModePercentageLabelColor || "#ffffff"}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-2"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="darkModeIconColor">Icon Color</Label>
                                <div className="flex">
                                  <Input
                                    id="darkModeIconColor"
                                    name="darkModeIconColor"
                                    type="color"
                                    value={formData.darkModeIconColor || "#ffffff"}
                                    onChange={handleInputChange}
                                    className="w-12 p-1 h-10"
                                  />
                                  <Input
                                    name="darkModeIconColor"
                                    value={formData.darkModeIconColor || "#ffffff"}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-2"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="darkModeIconHoverColor">Icon Hover Color</Label>
                                <div className="flex">
                                  <Input
                                    id="darkModeIconHoverColor"
                                    name="darkModeIconHoverColor"
                                    type="color"
                                    value={formData.darkModeIconHoverColor || "#2597a4"}
                                    onChange={handleInputChange}
                                    className="w-12 p-1 h-10"
                                  />
                                  <Input
                                    name="darkModeIconHoverColor"
                                    value={formData.darkModeIconHoverColor || "#2597a4"}
                                    onChange={handleInputChange}
                                    className="flex-1 ml-2"
                                  />
                                </div>
                              </div>
                            </div>
                            </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Multi-Client Tab */}
              <TabsContent value="multiClient" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Multi-Client Settings</CardTitle>
                    <CardDescription>Share this poll with other clients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isMultiClient"
                        checked={formData.isMultiClient}
                        onCheckedChange={(checked) => handleSwitchChange("isMultiClient", checked)}
                      />
                      <Label htmlFor="isMultiClient">Enable Multi-Client Poll</Label>
                    </div>
                    
                    {formData.isMultiClient && (
                      <div className="mt-4 space-y-4">
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
                              {availableClients.map(client => (
                                <option key={client.value} value={client.value}>
                                  {client.label}
                                </option>
                              ))}
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
                                  The poll will be shared with {formData.additionalClientIds.length} additional client(s).
                                </p>
                                <p className="text-xs text-green-600 mt-2">
                                  Note: After creating the poll, you can customize the style overrides for each client.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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

          {/* Preview panel */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Poll Preview
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewDarkMode(!previewDarkMode)}
                    className="ml-2"
                  >
                    {previewDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </CardTitle>
                <CardDescription>See how your poll will appear to users</CardDescription>
              </CardHeader>
              <CardContent>
                {formData.title && (
                  <PollPreview poll={previewPoll} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Add empty space div at the bottom */}
      <div className="h-8"></div>
    </div>
  );
}