// components/crm/business/business-details-content.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCcw,
  Building2,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  CreditCard,
  Settings,
  AlarmClock,
  MapPin,
  Smartphone,
  Clock,
  Edit,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/new-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusiness } from "@/hooks/useBusiness";
import { format } from "date-fns";
import { Business, SubscriptionStatus, BusinessStatus } from "@/app/api/external/omnigateway/types/business";
import BusinessCapabilitiesModal from "./BusinessCapabilitiesModal";

interface BusinessDetailsContentProps {
  businessId: string;
}

export default function BusinessDetailsContent({ businessId }: BusinessDetailsContentProps) {
  const router = useRouter();
  const { getBusinessDetails, isLoading, isInitialized } = useBusiness();
  const [business, setBusiness] = useState<Business | null>(null);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = useState(false);

  useEffect(() => {
    if (businessId) {
      if (isInitialized) {
        loadBusinessData();
      }
    }
  }, [businessId, isInitialized]);

  const loadBusinessData = async () => {
    try {
      const data = await getBusinessDetails(businessId);
      setBusiness(data);
    } catch (error) {
      console.error("Error loading business data:", error);
    }
  };

  const handleCapabilitiesUpdated = (updatedBusiness: Business) => {
    setBusiness(updatedBusiness);
  };

  // Format business type display
  const formatBusinessType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format currency for display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  // Get business status badge
  const getBusinessStatusBadge = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case BusinessStatus.INACTIVE:
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get subscription status badge
  const getSubscriptionBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case SubscriptionStatus.TRIALING:
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" /> Trial</Badge>;
      case SubscriptionStatus.PAST_DUE:
        return <Badge className="bg-amber-500 hover:bg-amber-600"><XCircle className="w-3 h-3 mr-1" /> Past Due</Badge>;
      case SubscriptionStatus.CANCELED:
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/crm/platform/businesses")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isLoading ? <Skeleton className="h-8 w-48" /> : business?.name || "Business Details"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {isLoading ? <Skeleton className="h-4 w-64" /> : (
                business ? 
                `${business.email} • ${formatBusinessType(business.type)}` : 
                "View and manage business information"
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadBusinessData}
            disabled={isLoading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button 
            onClick={() => router.push(`/crm/platform/businesses/${businessId}/edit`)}
            disabled={isLoading}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Business
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>General business details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Business Type</span>
                      </div>
                      <span>{formatBusinessType(business?.type || "")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Email</span>
                      </div>
                      <span>{business?.email}</span>
                    </div>
                    {business?.phone && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Phone</span>
                        </div>
                        <span>{business.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Created</span>
                      </div>
                      <span>{format(new Date(business?.createdAt || new Date()), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Status</span>
                      </div>
                      {getBusinessStatusBadge(business?.isActive ? BusinessStatus.ACTIVE : BusinessStatus.INACTIVE)}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Admin Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>Details of the primary administrator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Admin Name</span>
                      </div>
                      <span>{business?.adminUser?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Admin Email</span>
                      </div>
                      <span>{business?.adminUser?.email || "N/A"}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Capabilities Card */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Access Capabilities</CardTitle>
                  <CardDescription>
                    Manage employee app access and functionality
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCapabilitiesModal(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlarmClock className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Clock In/Out</span>
                        </div>
                        <Badge 
                          className={business?.allow_clockinout !== false 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-red-100 text-red-800 hover:bg-red-100"}
                        >
                          {business?.allow_clockinout !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {business?.allow_clockinout !== false 
                          ? "Employees can clock in and out of shifts" 
                          : "Employees cannot clock in and out of shifts"}
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">App Access</span>
                        </div>
                        <Badge 
                          className={business?.has_app_access !== false 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-red-100 text-red-800 hover:bg-red-100"}
                        >
                          {business?.has_app_access !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {business?.has_app_access !== false 
                          ? "Employees can access the mobile app" 
                          : "Employees cannot access the mobile app"}
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Location Check-in</span>
                        </div>
                        <Badge 
                          className={business?.allow_checkin !== false 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-red-100 text-red-800 hover:bg-red-100"}
                        >
                          {business?.allow_checkin !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {business?.allow_checkin !== false 
                          ? "Employees can check in at locations" 
                          : "Employees cannot check in at locations"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex mt-4">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => router.push(`/crm/platform/businesses/${business?._id}/capabilities`)}
                      disabled={!business?._id}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Manage Employee Capabilities
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Information</CardTitle>
              <CardDescription>Current subscription status and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Status</span>
                    </div>
                    {getSubscriptionBadge(business?.subscriptionStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Plan</span>
                    </div>
                    <span className="capitalize">{business?.subscription?.tier || "N/A"}</span>
                  </div>
                  {business?.subscriptionDetails && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Price</span>
                      </div>
                      <span>
                        {formatCurrency(
                          business.subscriptionDetails.amount, 
                          business.subscriptionDetails.currency
                        )} / {business.subscriptionDetails.interval}
                      </span>
                    </div>
                  )}
                  {business?.subscriptionEndDate && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">
                          {business.subscriptionStatus === SubscriptionStatus.TRIALING ? "Trial Ends" : "Next Billing"}
                        </span>
                      </div>
                      <span>{format(new Date(business.subscriptionEndDate), 'MMMM d, yyyy')}</span>
                    </div>
                  )}

                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
              <CardDescription>Manage staff and team members</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Manage Business Employees</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                    View and manage employees, assign roles, and set access permissions.
                  </p>
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={() => router.push(`/crm/platform/businesses/${business?._id}/employees`)}
                      disabled={!business?._id}
                    >
                      View Employees
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Configure business preferences and options</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Features & Agents</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage business features and AI agent configurations
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/crm/platform/businesses/${business?._id}/features`)}
                        disabled={!business?._id}
                      >
                        Manage Features
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/crm/platform/businesses/${business?._id}/agents`)}
                        disabled={!business?._id}
                      >
                        Configure Agents
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Capabilities & Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage app access and employee capabilities
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/crm/platform/businesses/${business?._id}/capabilities`)}
                        disabled={!business?._id}
                      >
                        Manage Capabilities
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCapabilitiesModal(true)}
                        disabled={!business}
                      >
                        Quick Configure
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Capabilities Modal */}
      <BusinessCapabilitiesModal 
        isOpen={showCapabilitiesModal}
        onClose={() => setShowCapabilitiesModal(false)}
        business={business}
        onCapabilitiesUpdated={handleCapabilitiesUpdated}
      />
    </div>
  );
}