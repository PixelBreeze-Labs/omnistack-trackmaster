"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  BarChart2,
  Users,
  Layers,
  Database,
  Clock,
  Files,
  FileSpreadsheet,
  Building2,
  Zap,
  ChevronRight,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeatures } from "@/hooks/useFeatures";

const TIER_COLORS = {
  basic: {
    primary: 'bg-blue-500',
    secondary: 'bg-blue-100 text-blue-700',
    border: 'border-blue-500'
  },
  professional: {
    primary: 'bg-purple-500',
    secondary: 'bg-purple-100 text-purple-700',
    border: 'border-purple-500'
  },
  enterprise: {
    primary: 'bg-indigo-500',
    secondary: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-500'
  },
  trialing: {
    primary: 'bg-green-500',
    secondary: 'bg-green-100 text-green-700',
    border: 'border-green-500'
  }
};

export default function PlanDetailsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const {
    isLoading,
    features, 
    tierFeatures,
    tierLimits,
    fetchFeatures,
  } = useFeatures();

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const goBack = () => {
    router.back();
  };

  const formatLimitValue = (value) => {
    if (value === -1) return 'Unlimited';
    return value;
  };

  // Group features by categories for better organization
  const groupFeaturesByCategory = (tier) => {
    if (!tierFeatures || !features) return {};
    
    const tierFeatureList = tierFeatures[tier] || [];
    const grouped = {};
    
    tierFeatureList.forEach(featureKey => {
      // Extract category from feature key (first part before underscore)
      let category = 'other';
      
      if (featureKey.includes('DASHBOARD')) category = 'dashboard';
      else if (featureKey.includes('TIME') || featureKey.includes('LEAVE') || featureKey.includes('BREAK')) category = 'time';
      else if (featureKey.includes('PROJECT') || featureKey.includes('TASK')) category = 'project';
      else if (featureKey.includes('TEAM') || featureKey.includes('CLIENT')) category = 'team';
      else if (featureKey.includes('QUALITY') || featureKey.includes('SAFETY') || featureKey.includes('COMPLIANCE')) category = 'quality';
      else if (featureKey.includes('EQUIPMENT') || featureKey.includes('FIELD')) category = 'field';
      else if (featureKey.includes('REPORT') || featureKey.includes('ANALYTICS')) category = 'reports';
      else if (featureKey.includes('SUPPORT') || featureKey.includes('INTEGRATION')) category = 'support';
      
      if (!grouped[category]) grouped[category] = [];
      
      grouped[category].push({
        key: featureKey,
        name: features[featureKey] || featureKey
      });
    });
    
    return grouped;
  };

  // Get icon for each category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'dashboard': return <FileSpreadsheet className="h-5 w-5" />;
      case 'time': return <Clock className="h-5 w-5" />;
      case 'project': return <Layers className="h-5 w-5" />;
      case 'team': return <Users className="h-5 w-5" />;
      case 'quality': return <Zap className="h-5 w-5" />;
      case 'field': return <Building2 className="h-5 w-5" />;
      case 'reports': return <BarChart2 className="h-5 w-5" />;
      case 'support': return <Files className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  // Get title for each category
  const getCategoryTitle = (category) => {
    switch(category) {
      case 'dashboard': return 'Dashboards';
      case 'time': return 'Time & Attendance Management';
      case 'project': return 'Project & Task Management';
      case 'team': return 'Team & Client Management';
      case 'quality': return 'Quality & Safety Controls';
      case 'field': return 'Field Operations & Equipment';
      case 'reports': return 'Reports & Analytics';
      case 'support': return 'Support & Integrations';
      default: return 'Other Features';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Features and limits for each subscription tier
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" onClick={fetchFeatures}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs  defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="basic">Basic Plan</TabsTrigger>
          <TabsTrigger value="professional">Professional Plan</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise Plan</TabsTrigger>
          <TabsTrigger value="trialing" className="hidden lg:block">Trial</TabsTrigger>
        </TabsList>

        {['basic', 'professional', 'enterprise', 'trialing'].map(tier => (
          <TabsContent key={tier} value={tier} className="space-y-6">
            {/* Plan Header */}
            <Card className={`border-l-4 ml-4 ${TIER_COLORS[tier].border}`}>
  <CardHeader>
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight">
          {tier === 'trialing' ? 'Trial' : 
           tier === 'basic' ? 'Basic' : 
           tier === 'professional' ? 'Professional' : 
           tier === 'enterprise' ? 'Enterprise' : tier} Plan
        </h2>
        <Badge className={TIER_COLORS[tier].secondary}>
          {tier === 'basic' && 'Essential'}
          {tier === 'professional' && 'Most Popular'}
          {tier === 'enterprise' && 'Full Featured'}
          {tier === 'trialing' && '14 Day Trial'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        {tier === 'basic' && 'Essential features for small teams'}
        {tier === 'professional' && 'Advanced features for growing businesses'}
        {tier === 'enterprise' && 'Complete solution for large organizations'}
        {tier === 'trialing' && 'Try out all features before subscribing'}
      </p>
    </div>
  </CardHeader>
</Card>

            {/* Resource Limits */}
            <Card>
              <CardHeader>
              <div>
                  <h3 className="text-2xl font-bold tracking-tight">Resource Limits</h3>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
          Maximum allowed resources for this plan
          </p>
                   
                  </div>
               
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tierLimits && Object.entries(tierLimits[tier] || {}).map(([key, value]) => (
                      <Card key={key} className="border shadow-none">
                        <CardContent className="p-0">
                          <div className="space-y-2">
                            <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                            <div className="flex items-end justify-between">
                              <span className="text-2xl font-bold">{formatLimitValue(value)}</span>
                              <span className="text-xs text-muted-foreground">Max</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Table */}
            <Card>
              <CardHeader>
                <div>
              <h3 className="text-xl font-bold tracking-tight">Available Features</h3>
          <p className="text-sm text-muted-foreground mt-0 mb-4">
          Features included in this plan
          </p>
          </div>
                
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-96 w-full" />
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupFeaturesByCategory(tier)).map(([category, categoryFeatures]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded ${TIER_COLORS[tier].secondary}`}>
                            {getCategoryIcon(category)}
                          </div>
                          <h3 className="text-lg font-medium">{getCategoryTitle(category)}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-10">
                          {categoryFeatures.map(feature => (
                            <div key={feature.key} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>{feature.name.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <div className="border-t mt-4 bg-gray-50 p-4 flex justify-between">
                <p className="text-sm mt-2 text-muted-foreground">
                  {tierFeatures && tierFeatures[tier] ? tierFeatures[tier].length : 0} features included
                </p>
                <Button variant="outline" size="sm" onClick={() => window.open('https://staffluent.co', '_blank')}>
                  View Pricing on Website <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}