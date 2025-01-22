"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Users,
  Target,
  Megaphone,
  Settings,
  BarChart3,
  Calendar,
  CircleDollarSign,
  Share2,
} from "lucide-react";

export function CampaignCreate() {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    type: "",
    objective: "",
    startDate: null,
    endDate: null,
    budget: "",
    audience: "",
    channels: [],
    isScheduled: false
  });

  const updateCampaignData = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Campaign</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Set up and launch a new marketing campaign
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Review & Launch</Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              1
            </div>
            <div className="text-sm font-medium">Basic Info</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              2
            </div>
            <div className="text-sm font-medium">Audience</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              3
            </div>
            <div className="text-sm font-medium">Content</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              4
            </div>
            <div className="text-sm font-medium">Schedule & Budget</div>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          Draft
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Main Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input
                  placeholder="Enter campaign name"
                  value={campaignData.name}
                  onChange={(e) => updateCampaignData('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select
                  value={campaignData.type}
                  onValueChange={(value) => updateCampaignData('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="retention">Customer Retention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your campaign"
                  value={campaignData.description}
                  onChange={(e) => updateCampaignData('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Objective</Label>
                <RadioGroup
                  value={campaignData.objective}
                  onValueChange={(value) => updateCampaignData('objective', value)}
                >
                  <div className="grid gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="awareness" id="awareness" />
                      <Label htmlFor="awareness">Increase Brand Awareness</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="traffic" id="traffic" />
                      <Label htmlFor="traffic">Drive Website Traffic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sales" id="sales" />
                      <Label htmlFor="sales">Generate Sales</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Audience Targeting */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Audience Targeting</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select
                  value={campaignData.audience}
                  onValueChange={(value) => updateCampaignData('audience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="new">New Customers</SelectItem>
                    <SelectItem value="existing">Existing Customers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marketing Channels</Label>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="email" />
                    <Label htmlFor="email">Email Marketing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="social" />
                    <Label htmlFor="social">Social Media</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sms" />
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="push" />
                    <Label htmlFor="push">Push Notifications</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Budget */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Schedule & Budget</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Start Date</Label>
                  <DatePicker
                    date={campaignData.startDate}
                    onSelect={(date) => updateCampaignData('startDate', date)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>End Date</Label>
                  <DatePicker
                    date={campaignData.endDate}
                    onSelect={(date) => updateCampaignData('endDate', date)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Campaign Budget</Label>
                <div className="relative">
                  <CircleDollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter budget amount"
                    className="pl-8"
                    value={campaignData.budget}
                    onChange={(e) => updateCampaignData('budget', e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Recommended budget: 50,000 - 100,000 ALL
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Settings */}
        <div className="space-y-6">
          {/* Campaign Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>Campaign Preview</CardTitle>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <div className="mb-4">
                  <Megaphone className="h-8 w-8 mx-auto text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Campaign preview will be available once you add content
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Add Content
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Estimate */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Performance Estimate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Estimated Reach</Label>
                    <div className="text-2xl font-bold">15K - 25K</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Potential Engagement</Label>
                    <div className="text-2xl font-bold">3.2K - 5.8K</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Est. Conversion Rate</Label>
                    <div className="text-2xl font-bold">2.8% - 4.2%</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">ROI Estimate</Label>
                    <div className="text-2xl font-bold">2.4x - 3.8x</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Campaign Strength</Label>
                    <Badge variant="secondary">Good</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-3/4 bg-green-500 rounded-full" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your settings and historical data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Checklist */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Campaign Checklist</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Basic information completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">Audience targeting in progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted" />
                  <span className="text-sm text-muted-foreground">Content not started</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted" />
                  <span className="text-sm text-muted-foreground">Schedule & budget pending</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <Button className="w-full" variant="outline">
                    View Full Checklist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Quick Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Define Your Audience</p>
                    <p className="text-sm text-muted-foreground">
                      Be specific about who you want to reach for better results
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Set Clear Goals</p>
                    <p className="text-sm text-muted-foreground">
                      Define measurable objectives for your campaign
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Track Performance</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor key metrics to optimize your campaign
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}