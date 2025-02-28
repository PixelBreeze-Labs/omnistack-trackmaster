"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  CheckCircle,
  RefreshCcw,
  FileSpreadsheet,
  PenTool,
  Layers,
  Shield,
  Building,
  Users,
  Package,
  Truck,
  AlertTriangle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useFeatures } from "@/hooks/useFeatures";
import { useBusiness } from "@/hooks/useBusiness";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import InputSelect from "@/components/Common/InputSelect";

export default function BusinessFeaturesContent({ businessId }) {
  const router = useRouter();
  const {
    isLoading: isLoadingFeatures,
    features,
    tierFeatures,
    tierLimits,
    fetchFeatures,
    getBusinessFeatures,
    addCustomFeature,
    removeCustomFeature,
    setCustomLimit,
    removeCustomLimit
  } = useFeatures();

  const { isLoading: isLoadingBusiness } = useBusiness();

  const [businessDetails, setBusinessDetails] = useState(null);
  const [businessFeatures, setBusinessFeatures] = useState([]);
  const [customFeatures, setCustomFeatures] = useState([]);
  const [planFeatures, setPlanFeatures] = useState([]);
  const [businessLimits, setBusinessLimits] = useState({});
  const [customLimits, setCustomLimits] = useState({});
  const [planLimits, setPlanLimits] = useState({});
  const [selectedFeatureToAdd, setSelectedFeatureToAdd] = useState("");
  const [showAddFeatureDialog, setShowAddFeatureDialog] = useState(false);
  const [showAddLimitDialog, setShowAddLimitDialog] = useState(false);
  const [selectedLimitKey, setSelectedLimitKey] = useState("");
  const [selectedLimitValue, setSelectedLimitValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [activeTab, setActiveTab] = useState("features");

  useEffect(() => {
    fetchFeatures();
    loadBusinessFeatures();
  }, [businessId, fetchFeatures]);

  useEffect(() => {
    if (features && businessDetails) {
      // Filter features that aren't in the business's plan and aren't custom
      const availableFeatures = Object.entries(features)
        .filter(([key]) => {
          const tier = businessDetails?.subscription?.tier || 'basic';
          const tierFeatureList = tierFeatures?.[tier] || [];
          return !tierFeatureList.includes(key) && !customFeatures.includes(key);
        });

      const filtered = availableFeatures.filter(([key, value]) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return searchRegex.test(key) || searchRegex.test(String(value));
      });

      setFilteredFeatures(filtered);
    }
  }, [features, businessDetails, customFeatures, tierFeatures, searchTerm]);

  const loadBusinessFeatures = async () => {
    try {
      const result = await getBusinessFeatures(businessId);
      setBusinessDetails(result?.business);
      setBusinessFeatures(result.features || []);
      setCustomFeatures(result.customFeatures || []);
      setBusinessLimits(result.limits || {});
      setCustomLimits(result.customLimits || {});

      // Calculate plan features (business features minus custom features)
      if (result.features && result.customFeatures) {
        const planOnly = result.features.filter(
          feature => !result.customFeatures.includes(feature)
        );
        setPlanFeatures(planOnly);
      }

      // Calculate plan limits (business limits minus custom limits)
      if (result.limits && result.customLimits) {
        const planOnlyLimits = { ...result.limits };
        Object.keys(result.customLimits).forEach(key => {
          delete planOnlyLimits[key];
        });
        setPlanLimits(planOnlyLimits);
      }
    } catch (error) {
      console.error("Error loading business features:", error);
    }
  };

  const handleAddCustomFeature = async () => {
    if (!selectedFeatureToAdd) {
      toast.error("Please select a feature to add");
      return;
    }

    try {
      await addCustomFeature(businessId, selectedFeatureToAdd);
      setShowAddFeatureDialog(false);
      setSelectedFeatureToAdd("");
      loadBusinessFeatures();
    } catch (error) {
      console.error("Error adding custom feature:", error);
    }
  };

  const handleRemoveCustomFeature = async (featureKey) => {
    try {
      await removeCustomFeature(businessId, featureKey);
      loadBusinessFeatures();
    } catch (error) {
      console.error("Error removing custom feature:", error);
    }
  };

  const handleAddCustomLimit = async () => {
    if (!selectedLimitKey || selectedLimitValue === "") {
      toast.error("Please select a limit and value");
      return;
    }

    try {
      await setCustomLimit(businessId, selectedLimitKey, parseInt(selectedLimitValue));
      setShowAddLimitDialog(false);
      setSelectedLimitKey("");
      setSelectedLimitValue("");
      loadBusinessFeatures();
    } catch (error) {
      console.error("Error setting custom limit:", error);
    }
  };

  const handleRemoveCustomLimit = async (limitKey) => {
    try {
      await removeCustomLimit(businessId, limitKey);
      loadBusinessFeatures();
    } catch (error) {
      console.error("Error removing custom limit:", error);
    }
  };

  const refreshData = () => {
    loadBusinessFeatures();
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

  const getDisplayName = (key) => {
    return features?.[key] || key;
  };

  const isLoading = isLoadingFeatures || isLoadingBusiness;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Business Features</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Customize features and limits for this business
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

      {/* Feature Management Tabs */}
      <Tabs defaultValue="features" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="features">Features Management</TabsTrigger>
          <TabsTrigger value="limits">Limits Management</TabsTrigger>
        </TabsList>

        {/* Features Tab Content */}
        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Features */}
            <Card>
              <CardHeader>

              <div>
            <h2 className="text-xl font-bold tracking-tight">Current Features</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-1">
          Features available to this business
          </p>
            
            </div>
                
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : businessFeatures.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">No Features Available</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This business doesn't have any features assigned to it yet.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessFeatures.map((featureKey) => (
                        <TableRow key={featureKey}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(featureKey)}
                              <div>
                                <div className="font-medium">{featureKey}</div>
                                <div className="text-xs text-muted-foreground">{getDisplayName(featureKey)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {customFeatures.includes(featureKey) ? (
                              <Badge className="bg-purple-500 hover:bg-purple-600">Custom</Badge>
                            ) : (
                              <Badge className="bg-blue-500 hover:bg-blue-600">Plan</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {customFeatures.includes(featureKey) && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleRemoveCustomFeature(featureKey)}
                              >
                                <MinusCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <div className="flex justify-end">
                <Button onClick={() => setShowAddFeatureDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Feature
                </Button>
              </div>
            </Card>

            {/* Plan Features */}
            <Card>
              <CardHeader>
              <div>
            <h2 className="text-xl font-bold tracking-tight">Plan Features</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-1">
          Features included in the {businessDetails?.subscription?.tier || "current"} plan
          </p>
            
            </div>
                
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : planFeatures.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">No Plan Features</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This business's plan doesn't include any features.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planFeatures.map((featureKey) => (
                        <TableRow key={featureKey}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(featureKey)}
                              <div>
                                <div className="font-medium">{featureKey}</div>
                                <div className="text-xs text-muted-foreground">{getDisplayName(featureKey)}</div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Limits Tab Content */}
        <TabsContent value="limits">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Limits */}
            <Card>
              <CardHeader>
              <div>
            <h2 className="text-xl font-bold tracking-tight">Current Limits</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-1">
          Resource limits for this business
          </p>
            
            </div>
               
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : Object.keys(businessLimits).length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">No Limits Defined</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This business doesn't have any resource limits defined.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Limit</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(businessLimits).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">
                            {key.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell>
                            {value === -1 ? "Unlimited" : value}
                          </TableCell>
                          <TableCell>
                            {Object.keys(customLimits).includes(key) ? (
                              <Badge className="bg-purple-500 hover:bg-purple-600">Custom</Badge>
                            ) : (
                              <Badge className="bg-blue-500 hover:bg-blue-600">Plan</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {Object.keys(customLimits).includes(key) && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleRemoveCustomLimit(key)}
                              >
                                <MinusCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <div className="flex justify-end">
                <Button onClick={() => setShowAddLimitDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Limit
                </Button>
              </div>
            </Card>

            {/* Plan Limits */}
            <Card>
              <CardHeader>
              <div>
            <h2 className="text-xl font-bold tracking-tight">Plan Limits</h2>
          <p className="text-sm text-muted-foreground mt-0 mb-1">
          Resource limits included in the {businessDetails?.subscription?.tier || "current"} plan
          </p>
            
            </div>
               
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : Object.keys(planLimits).length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">No Plan Limits</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This business's plan doesn't include any resource limits.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Limit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(planLimits).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">
                            {key.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell>
                            {value === -1 ? "Unlimited" : value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Custom Feature Dialog */}
      <Dialog open={showAddFeatureDialog} onOpenChange={setShowAddFeatureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Feature</DialogTitle>
            <DialogDescription>
              Add a custom feature to this business that is not included in their plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feature-search">Search Features</Label>
              <Input 
                id="feature-search"
                placeholder="Search for a feature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-select">Select Feature</Label>
              <InputSelect
                name="feature-select"
                label=""
                options={filteredFeatures.map(([key, value]) => ({
                  value: key,
                  label: key
                }))}
                value={selectedFeatureToAdd}
                onChange={(e) => setSelectedFeatureToAdd(e.target.value)}
              />
              {selectedFeatureToAdd && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {getDisplayName(selectedFeatureToAdd)}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFeatureDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomFeature}>
              Add Feature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Limit Dialog */}
      <Dialog open={showAddLimitDialog} onOpenChange={setShowAddLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Limit</DialogTitle>
            <DialogDescription>
              Set a custom resource limit for this business.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
          <div className="space-y-2">
              <Label htmlFor="limit-key">Resource</Label>
              <InputSelect
                name="limit-key"
                label=""
                options={Object.keys(tierLimits?.['enterprise'] || {}).map((key) => ({
                  value: key,
                  label: key.replace(/_/g, ' ')
                }))}
                value={selectedLimitKey}
                onChange={(e) => setSelectedLimitKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit-value">Limit Value</Label>
              <Input 
                id="limit-value"
                type="number"
                placeholder="Enter limit value (-1 for unlimited)"
                value={selectedLimitValue}
                onChange={(e) => setSelectedLimitValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLimitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomLimit}>
              Set Limit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}