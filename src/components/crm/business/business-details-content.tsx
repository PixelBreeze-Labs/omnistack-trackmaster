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
  Menu,
  Key,
  Copy,
  EyeOffIcon,
  EyeIcon,
  AlertCircle,
  HardDrive,
  FileIcon,
  Database,
  Folder,
  Upload
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
import StorageOverrideModal from "./StorageOverrideModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import toast from 'react-hot-toast';
import VenueBoostSyncSection from "./VenueBoostSyncSection";
interface BusinessDetailsContentProps {
  businessId: string;
}

export default function BusinessDetailsContent({ businessId }: BusinessDetailsContentProps) {
  const router = useRouter();
  const { getBusinessDetails, getBusinessEmployees, isLoading, isInitialized } = useBusiness();
  const [business, setBusiness] = useState<Business | null>(null);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [totalEmployeePages, setTotalEmployeePages] = useState(1);
const [totalEmployees, setTotalEmployees] = useState(0);
const [activeTab, setActiveTab] = useState("overview");
const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

const maskApiKey = (apiKey) => {
  if (!apiKey) return "N/A";
  const visibleChars = 6;
  return `•••••••••••${apiKey.slice(-visibleChars)}`;
};

const copyApiKeyToClipboard = () => {
  if (business?.apiKey) {
    navigator.clipboard.writeText(business.apiKey)
      .then(() => {
        toast.success("The API key has been copied to your clipboard.");
      })
      .catch((error) => {
        console.error("Failed to copy API key:", error);
        toast.error("An error occurred while copying the API key.");
      });
  }
};

const loadEmployeeData = async (page = 1) => {
  if (!businessId) return;
  
  setIsLoadingEmployees(true);
  try {
    const response = await getBusinessEmployees(businessId, {
      page,
      limit: 10,
      sort: 'name_asc'
    });
    
    if (response) {
      setEmployees(response.items);
      setTotalEmployees(response.total);
      setTotalEmployeePages(response.pages);
      setCurrentPage(response.page);
    }
  } catch (error) {
    console.error("Error loading employees:", error);
  } finally {
    setIsLoadingEmployees(false);
  }
}

// Add this function to handle page changes
const handlePageChange = (page) => {
  loadEmployeeData(page);
};

const handleTabChange = (value) => {
  setActiveTab(value);
};

useEffect(() => {
  if (businessId) {
    if (isInitialized) {
      // Load business data first
      const loadAllData = async () => {
        try {
          // Load business data
          const data = await getBusinessDetails(businessId);
          setBusiness(data);
          
          // Then preload employees data
          await loadEmployeeData(1);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };
      
      loadAllData();
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

  const handleStorageUpdated = (updatedStorage: any) => {
    setBusiness(prev => ({
      ...prev,
      storage: {
        ...prev.storage,
        ...updatedStorage
      }
    }));
  };

  // Format business type display
  const formatBusinessType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatOperationType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format currency for display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes * k) / Math.log(k));
    return parseFloat((bytes * k / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
    <div className="container mx-auto px-4 space-y-6">
      {/* Header - Responsive Design */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-start sm:items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/crm/platform/businesses")} className="mt-1 sm:mt-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight break-words">
              {isLoading ? <Skeleton className="h-8 w-48" /> : business?.name || "Business Details"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 break-words">
              {isLoading ? <Skeleton className="h-4 w-64" /> : (
                business ? 
                `${business.email} • ${formatBusinessType(business.type)} • ${formatOperationType(business.operationType?.toString())}` : 
                "View and manage business information"
              )}
            </p>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="sm:hidden">
          <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Actions - Desktop */}
        <div className="hidden sm:flex gap-2">
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
        
        {/* Actions - Mobile */}
        {isMobileMenuOpen && (
          <div className="flex sm:hidden gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={loadBusinessData}
              disabled={isLoading}
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button 
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/crm/platform/businesses/${businessId}/edit`)}
              disabled={isLoading}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange} value={activeTab} >
        {/* Responsive Tabs */}
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs sm:text-sm">Subscription</TabsTrigger>
          <TabsTrigger value="employees" className="text-xs sm:text-sm">Employees</TabsTrigger>
          <TabsTrigger value="onboarding" className="text-xs sm:text-sm">Onboarding</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Information Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Business Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm">General business details and contact information</CardDescription>
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Business Type</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base">{formatBusinessType(business?.type || "")}</span>
                    </div>
                    {/* Operation Type */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Operation Type</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base">
                        {business?.operationType === 'field_service' ? 'Field Service Business' :
                        business?.operationType === 'in_house' ? 'In-House Projects Only' : 
                        'Hybrid (Both Field & In-House)'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Email</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base break-all">{business?.email}</span>
                    </div>
                    {business?.phone && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                          <span className="font-medium">Phone</span>
                        </div>
                        <span className="ml-7 sm:ml-0 text-sm sm:text-base">{business.phone}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Created</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base">{format(new Date(business?.createdAt || new Date()), 'MMMM d, yyyy')}</span>
                    </div>
                    {business?.apiKey && (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
    <div className="flex items-center gap-2">
      <Key className="h-5 w-5 text-muted-foreground shrink-0" />
      <span className="font-medium">API Key</span>
    </div>
    <div className="ml-7 sm:ml-0 flex items-center gap-2 break-all">
      <span className="text-sm sm:text-base font-mono">
        {isApiKeyVisible ? business.apiKey : maskApiKey(business.apiKey)}
      </span>
      <div className="flex items-center ml-1 space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
          title={isApiKeyVisible ? "Hide API Key" : "Show API Key"}
        >
          {isApiKeyVisible ? 
            <EyeOffIcon className="h-3 w-3 text-muted-foreground" /> : 
            <EyeIcon className="h-3 w-3 text-muted-foreground" />
          }
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={copyApiKeyToClipboard}
          title="Copy API Key"
        >
          <Copy className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    </div>
  </div>
)}
                  
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                          <span className="font-medium">VenueBoost ID</span>
                        </div>
                        <span className="ml-7 sm:ml-0 text-sm sm:text-base break-all">{business?.externalIds?.venueBoostId ?? "N/A"}</span>
                      </div>
                    

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Status</span>
                      </div>
                      <span className="ml-7 sm:ml-0">{getBusinessStatusBadge(business?.isActive ? BusinessStatus.ACTIVE : BusinessStatus.INACTIVE)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Admin Information Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Admin Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Details of the primary administrator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Admin Name</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base">{business?.adminUser?.name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Admin Email</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base break-all">{business?.adminUser?.email || "N/A"}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Capabilities Card */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-lg">Access Capabilities</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Manage employee app access and functionality
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCapabilitiesModal(true)}
                  className="self-start sm:self-auto"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlarmClock className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium text-sm sm:text-base">Clock In/Out</span>
                        </div>
                        <Badge 
                          className={business?.allow_clockinout !== false 
                            ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" 
                            : "bg-red-100 text-red-800 hover:bg-red-100 text-xs"}
                        >
                          {business?.allow_clockinout !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {business?.allow_clockinout !== false 
                          ? "Employees can clock in and out of shifts" 
                          : "Employees cannot clock in and out of shifts"}
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium text-sm sm:text-base">App Access</span>
                        </div>
                        <Badge 
                          className={business?.has_app_access !== false 
                            ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" 
                            : "bg-red-100 text-red-800 hover:bg-red-100 text-xs"}
                        >
                          {business?.has_app_access !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {business?.has_app_access !== false 
                          ? "Employees can access the mobile app" 
                          : "Employees cannot access the mobile app"}
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium text-sm sm:text-base">Location Check-in</span>
                        </div>
                        <Badge 
                          className={business?.allow_checkin !== false 
                            ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs" 
                            : "bg-red-100 text-red-800 hover:bg-red-100 text-xs"}
                        >
                          {business?.allow_checkin !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
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
                      className="text-xs sm:text-sm"
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
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Subscription Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Current subscription status and details</CardDescription>
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="font-medium">Status</span>
                    </div>
                    <span className="ml-7 sm:ml-0">{getSubscriptionBadge(business?.subscriptionStatus)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="font-medium">Plan</span>
                    </div>
                    <span className="ml-7 sm:ml-0 text-sm sm:text-base capitalize">{business?.subscription?.tier || "N/A"}</span>
                  </div>
                  {business?.subscriptionDetails && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">Price</span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base">
                        {formatCurrency(
                          business.subscriptionDetails.amount, 
                          business.subscriptionDetails.currency
                        )} / {business.subscriptionDetails.interval}
                      </span>
                    </div>
                  )}
                  {business?.subscriptionEndDate && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                        <span className="font-medium">
                          {business.subscriptionStatus === SubscriptionStatus.TRIALING ? "Trial Ends" : "Next Billing"}
                        </span>
                      </div>
                      <span className="ml-7 sm:ml-0 text-sm sm:text-base">{format(new Date(business.subscriptionEndDate), 'MMMM d, yyyy')}</span>
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
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg">Employees</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage staff and team members</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadEmployeeData(1)}
                disabled={isLoadingEmployees}
                className="self-start sm:self-auto text-xs sm:text-sm"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || isLoadingEmployees ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : employees.length === 0 ? (
              // Empty state
              <div className="text-center py-6 sm:py-8">
                <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium">No Employees Found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-1 sm:mt-2">
                  This business doesn't have any employees yet. Advise themn to add their employees to manage their access and capabilities.
                </p>
                
              </div>
            ) : (
              // Employees table
              <div className="space-y-4">
                <div className="overflow-x-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell w-[120px]">Status</TableHead>
                        <TableHead className="hidden md:table-cell w-[140px]">App Access</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee._id}>
                          <TableCell>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {employee.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">
                            {employee.email}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant={employee.user ? "default" : "outline"}
                              className="text-xs"
                            >
                              {employee.user ? "Has Account" : "No Account"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              className={
                                (employee.has_app_access === true || (employee.has_app_access === undefined && business?.has_app_access !== false))
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                                  : "bg-red-100 text-red-800 hover:bg-red-100 text-xs"
                              }
                            >
                              {(employee.has_app_access === true || (employee.has_app_access === undefined && business?.has_app_access !== false))
                                ? "Enabled"
                                : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-xs"
                              onClick={() => router.push(`/crm/platform/businesses/${business?._id}/employees/${employee._id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalEmployeePages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalEmployeePages) }, (_, i) => {
                          // Logic for showing correct page numbers
                          let pageNum = i + 1;
                          if (totalEmployeePages > 5 && currentPage > 3) {
                            pageNum = currentPage - 3 + i + 1;
                            if (pageNum > totalEmployeePages) {
                              pageNum = totalEmployeePages - (5 - (i + 1));
                            }
                          }
                          
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={pageNum === currentPage}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalEmployeePages, currentPage + 1))}
                            className={currentPage === totalEmployeePages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-muted-foreground">
                    {totalEmployees > 0 
                      ? `Showing ${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalEmployees)} of ${totalEmployees} employees`
                      : 'No employees found'}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/crm/platform/businesses/${business?._id}/employees/add`)}
                    disabled={!business?._id}
                    className="text-xs sm:text-sm"
                  >
                    Add Employee
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="onboarding">
  <div className="space-y-6">
    {/* Important Notice */}
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
              Data Tracking Notice
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              This onboarding data is collected for basic tracking and analytics purposes only. 
              The actual onboarding logic and user experience is controlled by localStorage on the business device. 
              This server-side data should be considered supplementary and may not always reflect the real-time state of the user's onboarding progress.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Walkthrough Progress Card */}
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Interactive Walkthrough
            </CardTitle>
            <CardDescription className="text-sm sm:text-sm">
              Guided tour through the application features
            </CardDescription>
          </div>
          <Badge 
            className={
              business?.onboarding?.walkthrough?.status === 'completed' 
                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                : business?.onboarding?.walkthrough?.status === 'in_progress'
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : business?.onboarding?.walkthrough?.status === 'dismissed'
                ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            }
          >
            {business?.onboarding?.walkthrough?.status?.replace('_', ' ').toUpperCase() || 'NOT STARTED'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : business?.onboarding?.walkthrough ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-blue-600">
                  {business.onboarding.walkthrough.currentStep || 0}
                </div>
                <div className="text-sm text-muted-foreground">Current Step</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-green-600">
                  {business.onboarding.walkthrough.progressPercentage || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-purple-600">
                  {business.onboarding.walkthrough.completionCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Completion Count</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{business.onboarding.walkthrough.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${business.onboarding.walkthrough.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Timing Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {business.onboarding.walkthrough.startedAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Started:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.walkthrough.startedAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
              {business.onboarding.walkthrough.completedAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Completed:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.walkthrough.completedAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
              {business.onboarding.walkthrough.lastActiveAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Last Active:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.walkthrough.lastActiveAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
              {business.onboarding.walkthrough.createdAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Record Created:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.walkthrough.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
            </div>

            {/* Device Information */}
            {(business.onboarding.walkthrough.deviceType || business.onboarding.walkthrough.isPWA !== undefined) && (
              <div className="border-t pt-3 mt-3">
                <div className="text-sm text-muted-foreground mb-2">Device Information</div>
                <div className="flex flex-wrap gap-2">
                  {business.onboarding.walkthrough.deviceType && (
                    <Badge variant="outline" className="text-sm">
                      {business.onboarding.walkthrough.deviceType}
                    </Badge>
                  )}
                  {business.onboarding.walkthrough.isPWA && (
                    <Badge variant="outline" className="text-sm">
                      PWA
                    </Badge>
                  )}
                  {business.onboarding.walkthrough.isFirstTime && (
                    <Badge variant="outline" className="text-sm">
                      First Time User
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No walkthrough data available</p>
            <p className="text-sm mt-1">The user hasn't started the interactive walkthrough yet</p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Setup Guide Progress Card */}
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Business Setup Guide
            </CardTitle>
            <CardDescription className="text-sm sm:text-sm">
              Step-by-step business configuration progress
            </CardDescription>
          </div>
          <Badge 
            className={
              business?.onboarding?.setupGuide?.status === 'completed' 
                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                : business?.onboarding?.setupGuide?.status === 'in_progress'
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : business?.onboarding?.setupGuide?.status === 'dismissed'
                ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            }
          >
            {business?.onboarding?.setupGuide?.status?.replace('_', ' ').toUpperCase() || 'NOT STARTED'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : business?.onboarding?.setupGuide ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-blue-600">
                  {business.onboarding.setupGuide.completedSteps?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Steps Completed</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-green-600">
                  {business.onboarding.setupGuide.progressPercentage || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-orange-600">
                  {business.onboarding.setupGuide.completionCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Completion Count</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Setup Progress</span>
                <span>{business.onboarding.setupGuide.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${business.onboarding.setupGuide.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Completed Steps */}
            {business.onboarding.setupGuide.completedSteps && business.onboarding.setupGuide.completedSteps.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Completed Steps</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {business.onboarding.setupGuide.completedSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-md border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm capitalize">
                        {step.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground border border-dashed rounded-md">
                <p className="text-sm">No setup steps completed yet</p>
              </div>
            )}

            {/* Timing Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t pt-3">
              {business.onboarding.setupGuide.startedAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Started:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.setupGuide.startedAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
              {business.onboarding.setupGuide.completedAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Completed:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.setupGuide.completedAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
              {business.onboarding.setupGuide.lastActiveAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Last Active:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.setupGuide.lastActiveAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
              {business.onboarding.setupGuide.createdAt && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Record Created:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(business.onboarding.setupGuide.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              )}
            </div>

            {/* Device Information */}
            {(business.onboarding.setupGuide.deviceType || business.onboarding.setupGuide.isPWA !== undefined) && (
              <div className="border-t pt-3 mt-3">
                <div className="text-sm text-muted-foreground mb-2">Device Information</div>
                <div className="flex flex-wrap gap-2">
                  {business.onboarding.setupGuide.deviceType && (
                    <Badge variant="outline" className="text-sm">
                      {business.onboarding.setupGuide.deviceType}
                    </Badge>
                  )}
                  {business.onboarding.setupGuide.isPWA && (
                    <Badge variant="outline" className="text-sm">
                      PWA
                    </Badge>
                  )}
                  {business.onboarding.setupGuide.isFirstTime && (
                    <Badge variant="outline" className="text-sm">
                      First Time User
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No setup guide data available</p>
            <p className="text-sm mt-1">The user hasn't accessed the business setup guide yet</p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Summary Card */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Onboarding Summary</CardTitle>
        <CardDescription className="text-sm sm:text-sm">
          Overview of onboarding engagement and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Activity Overview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Walkthrough Sessions:</span>
                <span className="font-medium">
                  {business?.onboarding?.walkthrough?.completionCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Setup Guide Sessions:</span>
                <span className="font-medium">
                  {business?.onboarding?.setupGuide?.completionCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Onboarding Records:</span>
                <span className="font-medium">
                  {(business?.onboarding?.walkthrough ? 1 : 0) + (business?.onboarding?.setupGuide ? 1 : 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Device Usage</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Walkthrough Device:</span>
                <span className="font-medium capitalize">
                  {business?.onboarding?.walkthrough?.deviceType || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Setup Guide Device:</span>
                <span className="font-medium capitalize">
                  {business?.onboarding?.setupGuide?.deviceType || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PWA Usage:</span>
                <span className="font-medium">
                  {business?.onboarding?.walkthrough?.isPWA || business?.onboarding?.setupGuide?.isPWA ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Business Settings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure business preferences and options</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Features & Agents</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Manage business features and AI agent configurations
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/crm/platform/businesses/${business?._id}/features`)}
                        disabled={!business?._id}
                        className="text-xs sm:text-sm"
                      >
                        Manage Features
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/crm/platform/businesses/${business?._id}/agents`)}
                        disabled={!business?._id}
                        className="text-xs sm:text-sm"
                      >
                        Configure Agents
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Capabilities & Access</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Manage app access and employee capabilities
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/crm/platform/businesses/${business?._id}/capabilities`)}
                        disabled={!business?._id}
                        className="text-xs sm:text-sm"
                      >
                        Manage Capabilities
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCapabilitiesModal(true)}
                        disabled={!business}
                        className="text-xs sm:text-sm"
                      >
                        Quick Configure
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

           {/* Add the VenueBoost Sync Section here */}
  <div className="mt-6">
    <VenueBoostSyncSection businessId={businessId} />
  </div>
        </TabsContent>
      </Tabs>

      {/* Storage Information Section - Below Tabs */}
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                File storage usage and limits for this business
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowStorageModal(true)}
              disabled={!business?.storage}
              className="self-start sm:self-auto"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure Storage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : business?.storage ? (
            <div className="space-y-6">
              {/* Storage Usage Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {business.storage.usage.totalSizeMB}
                  </div>
                  <div className="text-sm text-muted-foreground">MB Used</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {business.storage.usage.remainingMB}
                  </div>
                  <div className="text-sm text-muted-foreground">MB Available</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {business.storage.usage.fileCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Files</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {business.storage.usage.percentUsed}%
                  </div>
                  <div className="text-sm text-muted-foreground">Used</div>
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Storage Usage</span>
                  <span className="text-muted-foreground">
                    {business.storage.usage.totalSizeMB} MB / {business.storage.settings.limitMB} MB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      business.storage.usage.percentUsed > 90 ? 'bg-red-500' :
                      business.storage.usage.percentUsed > 75 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(business.storage.usage.percentUsed, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Storage Settings and Plan Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Settings */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Current Settings</h3>
                    <Badge variant={business.storage.isOverridden ? "default" : "outline"}>
                      {business.storage.isOverridden ? "Custom" : "Plan-based"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Storage Limit:</span>
                      <span className="font-medium">{business.storage.settings.limitMB} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max File Size:</span>
                      <span className="font-medium">{business.storage.settings.maxFileSizeMB} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscription Tier:</span>
                      <span className="font-medium capitalize">{business.subscription?.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Plan-based Limits */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Plan Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plan Storage:</span>
                      <span className="font-medium">
                        {business.storage.planBasedLimits?.storage_gb || 'N/A'} GB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan Users:</span>
                      <span className="font-medium">
                        {business.storage.planBasedLimits?.users === -1 ? 'Unlimited' : business.storage.planBasedLimits?.users || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan Projects:</span>
                      <span className="font-medium">
                        {business.storage.planBasedLimits?.projects === -1 ? 'Unlimited' : business.storage.planBasedLimits?.projects || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files by Category */}
              {Object.keys(business.storage.filesByCategory || {}).length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Files by Category</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(business.storage.filesByCategory).map(([category, count]) => (
                      <div key={category} className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">{count}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {category.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Files */}
              {business.storage.recentFiles && business.storage.recentFiles.length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Recent Files</h3>
                  </div>
                  <div className="space-y-2">
                    {business.storage.recentFiles.slice(0, 5).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {file.category}
                          </Badge>
                          <span>{formatBytes(file.size)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allowed File Types */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Allowed File Types</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {business.storage.settings.allowedFileTypes?.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      .{type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <HardDrive className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No storage information available</p>
              <p className="text-sm mt-1">Storage data could not be loaded for this business</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capabilities Modal */}
      <BusinessCapabilitiesModal 
        isOpen={showCapabilitiesModal}
        onClose={() => setShowCapabilitiesModal(false)}
        business={business}
        onCapabilitiesUpdated={handleCapabilitiesUpdated}
      />

      {/* Storage Override Modal */}
      <StorageOverrideModal 
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        business={business}
        onStorageUpdated={handleStorageUpdated}
      />

      {/* Bottom spacing */}
      <div className="h-10"></div>
    </div>
  );
}