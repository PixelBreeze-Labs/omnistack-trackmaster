"use client";

import { useEffect, useState } from "react";
import {
  ListFilter,
  Search,
  DownloadCloud,
  RefreshCcw,
  CheckCircle,
  Layers,
  Shield,
  FileSpreadsheet,
  PenTool,
  Building,
  Package,
  Truck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { useFeatures } from "@/hooks/useFeatures";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeaturesListContent() {
  const {
    isLoading,
    features,
    tierFeatures,
    fetchFeatures
  } = useFeatures();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  useEffect(() => {
    if (!features) return;

    const filtered = Object.entries(features).filter(([key, value]) => {
      const searchRegex = new RegExp(searchTerm, 'i');
      return searchRegex.test(key) || searchRegex.test(String(value));
    });

    setFilteredFeatures(filtered);
  }, [features, searchTerm]);

  const refreshData = () => {
    fetchFeatures();
  };

  const getCategoryIcon = (feature) => {
    const featureStr = String(feature).toLowerCase();
    if (featureStr.includes('dashboard')) return <FileSpreadsheet className="h-4 w-4" />;
    if (featureStr.includes('time') || featureStr.includes('schedule') || featureStr.includes('attendance')) return <PenTool className="h-4 w-4" />;
    if (featureStr.includes('project') || featureStr.includes('task')) return <Layers className="h-4 w-4" />;
    if (featureStr.includes('client')) return <Users className="h-4 w-4" />;
    if (featureStr.includes('quality') || featureStr.includes('compliance') || featureStr.includes('safety')) return <Shield className="h-4 w-4" />;
    if (featureStr.includes('equipment')) return <PenTool className="h-4 w-4" />;
    if (featureStr.includes('site')) return <Building className="h-4 w-4" />;
    if (featureStr.includes('supply')) return <Package className="h-4 w-4" />;
    if (featureStr.includes('field') || featureStr.includes('route')) return <Truck className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getCategoryFromFeatureName = (feature) => {
    const featureStr = String(feature).toLowerCase();
    if (featureStr.includes('dashboard')) return "Dashboards";
    if (featureStr.includes('time') || featureStr.includes('schedule') || featureStr.includes('attendance')) return "Time & Scheduling";
    if (featureStr.includes('project') || featureStr.includes('task')) return "Project Management";
    if (featureStr.includes('client')) return "Client Management";
    if (featureStr.includes('quality') || featureStr.includes('compliance') || featureStr.includes('safety')) return "Quality & Safety";
    if (featureStr.includes('equipment')) return "Equipment";
    if (featureStr.includes('site')) return "Site Management";
    if (featureStr.includes('supply')) return "Supply Management";
    if (featureStr.includes('field') || featureStr.includes('route')) return "Field Operations";
    if (featureStr.includes('report') || featureStr.includes('analytics')) return "Reports & Analytics";
    if (featureStr.includes('communication')) return "Communication";
    if (featureStr.includes('mobile')) return "Mobile Access";
    if (featureStr.includes('integration')) return "Integrations";
    if (featureStr.includes('support')) return "Support";
    if (featureStr.includes('team')) return "Team Management";
    if (featureStr.includes('leave')) return "Leave Management";
    if (featureStr.includes('overtime')) return "Overtime Management";
    if (featureStr.includes('invoice')) return "Invoice Management";
    return "Other";
  };

 
  const getPlanBadges = (featureKey) => {
    const badges = [];
    
    // Get the feature value (lowercase string) from the key
    const featureValue = features[featureKey];
    
    // Now check which tier includes this feature value
    if (tierFeatures?.basic?.includes(featureValue)) {
      badges.push(<Badge key="basic" className="bg-gray-200 text-gray-800 mr-1">Basic</Badge>);
    } else if (tierFeatures?.professional?.includes(featureValue)) {
      badges.push(<Badge key="professional" className="bg-blue-200 text-blue-800 mr-1">Professional</Badge>);
    } else if (tierFeatures?.enterprise?.includes(featureValue)) {
      badges.push(<Badge key="enterprise" className="bg-purple-200 text-purple-800 mr-1">Enterprise</Badge>);
    } else {
      badges.push(<Badge key="none" variant="outline" className="mr-1">No Plan</Badge>);
    }
    
    return badges;
  };

  // Group features by category for the categorized view
  const groupedFeatures = filteredFeatures.reduce((acc, [key, value]) => {
    const category = getCategoryFromFeatureName(value);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push([key, value]);
    return acc;
  }, {});

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Features</h2>
          <p className="text-sm text-muted-foreground mt-2">
            View all available features in the system
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
            <h2 className="text-xl font-bold tracking-tight">Filter Features</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-1">
          Search and filter through the available features
          </p>
            
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search features..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshData}>
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Button variant="outline">
                <DownloadCloud className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different view modes */}
      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="categorized">Categorized View</TabsTrigger>
        </TabsList>
        
        {/* All Features Tab Content */}
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature Key</TableHead>
                    <TableHead>Feature Value</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Plans</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredFeatures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center gap-3">
                          <ListFilter className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Features Found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm text-center">
                            {searchTerm 
                              ? "No features match your search criteria. Try adjusting your search." 
                              : "No features have been defined yet."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFeatures.map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>{String(value)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(value)}
                            <span>{getCategoryFromFeatureName(value)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPlanBadges(key)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categorized View Tab Content */}
        <TabsContent value="categorized">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-20 w-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : filteredFeatures.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-8">
                <ListFilter className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No Features Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm text-center">
                  {searchTerm 
                    ? "No features match your search criteria. Try adjusting your search." 
                    : "No features have been defined yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                    {/* <CardDescription>
                      {categoryFeatures.length} feature{categoryFeatures.length !== 1 ? 's' : ''}
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryFeatures.map(([key, value]) => (
                        <Card key={key} className="bg-slate-50">
                          <CardContent className="p-4">
                            <div className="font-medium flex items-center gap-2">
                              {getCategoryIcon(value)}
                              <span>{key}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{String(value)}</p>
                            <div className="mt-2">
                              {getPlanBadges(key)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}