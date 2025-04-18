"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
  Palette,
  ToggleLeft,
  Eye,
  Sun,
  Moon,
  Plus,
  Minus,
  AlignLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePolls } from "@/hooks/usePolls";
import { useClients } from "@/hooks/useClients";
import { Poll, PollOption } from "@/app/api/external/omnigateway/types/polls";
import InputSelect from "@/components/Common/InputSelect";
import PollPreview from "./PollPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PollEditFormProps {
  clientId: string;
  pollId: string;
}

export default function PollEditForm({ clientId, pollId }: PollEditFormProps) {
  const router = useRouter();
  const { isLoading, isProcessing, fetchPoll, updatePoll } = usePolls();
  const { getClient, isLoading: isClientLoading } = useClients();

  const [clientName, setClientName] = useState("Client");
  const [poll, setPoll] = useState<Poll | null>(null);
  const [formData, setFormData] = useState<Partial<Poll>>({
    title: "",
    description: "",
    highlightColor: "#2597a4",
    highlightAnimation: "fade",
    showResults: true,
    darkMode: false,
    options: [],
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
    darkModeBackground: "#222222",
    darkModeTextColor: "#ffffff",
    darkModeOptionBackground: "#333333",
    darkModeOptionHover: "#444444",
    darkModeLinkColor: "#ffffff",
    darkModeLinkHoverColor: "#2597a4",
    darkModeProgressBackground: "#444444",
    darkModeRadioBorder: "#444444",
    darkModeRadioCheckedBorder: "#2597a4",
    darkModeRadioCheckedDot: "#2597a4"
  });

  const [activeTab, setActiveTab] = useState("general");
  const [previewDarkMode, setPreviewDarkMode] = useState(false);

  // Animation options
  const animationOptions = [
    { value: "fade", label: "Fade In" },
    { value: "slide", label: "Slide" },
    { value: "pulse", label: "Pulse" },
    { value: "bounce", label: "Bounce" },
    { value: "none", label: "None" }
  ];

  // Fetch client and poll data on load
  useEffect(() => {
    const loadClientAndPoll = async () => {
      try {
        // Load client info
        if (clientId) {
          const response = await getClient(clientId);
          const client = response.client || response;
          if (client) {
            setClientName(client.name);
          }
        }

        // Load poll data
        if (pollId) {
          const pollData = await fetchPoll(pollId);
          setPoll(pollData);
          setFormData(pollData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load poll data");
      }
    };

    loadClientAndPoll();
  }, [clientId, pollId, getClient, fetchPoll]);

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
      await updatePoll(pollId, formData);
      toast.success("Poll updated successfully");
      router.push(`/crm/platform/os-clients/${clientId}/polls`);
    } catch (error) {
      console.error("Error updating poll:", error);
      toast.error("Failed to update poll");
    }
  };

  const handleBackClick = () => {
    router.push(`/crm/platform/os-clients/${clientId}/polls`);
  };

  // If the poll hasn't loaded yet, show a loading state
  if (isLoading || !poll) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading poll data...</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Edit Poll</h1>
            <p className="text-sm text-muted-foreground">
              Modify poll settings and options for {clientName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main edit area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="styling">Styling</TabsTrigger>
                <TabsTrigger value="darkMode">Dark Mode</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>Edit the main poll details</CardDescription>
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
                  </CardContent>
                </Card>

                {formData.wordpressId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">WordPress Information</CardTitle>
                      <CardDescription>WordPress integration details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h3 className="font-medium text-blue-800">WordPress Integration</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          This poll is connected to WordPress with ID: {formData.wordpressId}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          Auto-embed settings and WordPress-specific options must be managed through the WordPress interface.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Options Tab */}
              <TabsContent value="options" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Poll Options</CardTitle>
                    <CardDescription>Edit the available choices for this poll</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.options && formData.options.map((option, index) => (
                      <div key={index} className="space-y-2 border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="flex items-center">
                          <span className="font-medium w-8">#{index + 1}</span>
                          <div className="flex-1">
                            <Label htmlFor={`option-${index}`}>Option Text</Label>
                            <Input
                              id={`option-${index}`}
                              value={option.optionText}
                              onChange={(e) => handleOptionTextChange(index, e.target.value)}
                              placeholder="Enter option text"
                            />
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
                          <span className="text-sm text-muted-foreground">
                            {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                          </span>
                        </div>
                      </div>
                    ))}
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
                        </>
                      )}
                    </div>
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
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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
                  <PollPreview 
                    poll={{
                      ...formData as Poll,
                      _id: pollId,
                      clientId: clientId,
                      darkMode: previewDarkMode
                    }} 
                  />
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