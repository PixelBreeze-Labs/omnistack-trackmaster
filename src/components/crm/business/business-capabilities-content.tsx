// components/crm/business/business-capabilities-content.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCcw,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  Shield,
  AlarmClock,
  SquareCheck,
  Smartphone,
  MapPin,
  Building2,
  ChevronRight,
  Filter,
  Briefcase
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessCapabilities } from "@/hooks/useBusinessCapabilities";
import { 
  Business, 
  Employee,
  BusinessStatus,
  SubscriptionStatus
} from "@/app/api/external/omnigateway/types/business";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import toast from "react-hot-toast";

interface BusinessCapabilitiesContentProps {
  businessId: string;
}

export default function BusinessCapabilitiesContent({ businessId }: BusinessCapabilitiesContentProps) {
  const router = useRouter();
  const { 
    getBusinessDetails, 
    getBusinessEmployees, 
    isLoading: isLoadingBusiness,
    isInitialized: isBusinessInitialized
  } = useBusiness();
  const { 
    updateBusinessCapabilities, 
    updateEmployeeCapabilities, 
    isLoading: isUpdatingCapabilities,
    isInitialized: isBusinessCapabilitiesInitialized
  } = useBusinessCapabilities();

  // Business state
  const [business, setBusiness] = useState<Business | null>(null);
  const [allowClockInOut, setAllowClockInOut] = useState<boolean>(true);
  const [hasAppAccess, setHasAppAccess] = useState<boolean>(true);
  const [allowCheckIn, setAllowCheckIn] = useState<boolean>(true);
  
  // Employee state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeCapabilitiesDialog, setShowEmployeeCapabilitiesDialog] = useState<boolean>(false);
  const [employeeAllowClockInOut, setEmployeeAllowClockInOut] = useState<boolean | null>(null);
  const [employeeHasAppAccess, setEmployeeHasAppAccess] = useState<boolean | null>(null);
  const [employeeAllowCheckIn, setEmployeeAllowCheckIn] = useState<boolean | null>(null);
  const [totalEmployeePages, setTotalEmployeePages] = useState<number>(1);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);
  const [selectedEmployeeUser, setSelectedEmployeeUser] = useState<any>(null);
  
  // Apply to all employees dialog
  const [showApplyToAllDialog, setShowApplyToAllDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load employee data
  const loadEmployeeData = useCallback(async (page = 1, search = "") => {
    setIsLoadingEmployees(true);
    try {
      const response = await getBusinessEmployees(businessId, {
        page,
        limit: itemsPerPage,
        search,
        sort: 'name_asc'
      });
      
      if (response) {
        // Store the employees from the response
        setEmployees(response.items);
        setFilteredEmployees(response.items);
        setTotalEmployees(response.total);
        setTotalEmployeePages(response.pages);
        setCurrentPage(response.page);
        
        // If business capabilities are provided, update business defaults
        if (response.businessCapabilities) {
          // Only update if business data hasn't been loaded yet or if we need to refresh
          if (!business) {
            setAllowClockInOut(response.businessCapabilities.allow_clockinout);
            setHasAppAccess(response.businessCapabilities.has_app_access);
            setAllowCheckIn(response.businessCapabilities.allow_checkin);
          }
        }
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [businessId, getBusinessEmployees, itemsPerPage, business]);

  // Load business data
  const loadBusinessData = useCallback(async () => {
    setIsLoading(true);
    try {
      const businessData = await getBusinessDetails(businessId);
      setBusiness(businessData);
      
      // Set capability states
      setAllowClockInOut(businessData.allow_clockinout !== false);
      setHasAppAccess(businessData.has_app_access !== false);
      setAllowCheckIn(businessData.allow_checkin !== false);
      
      // Load real employee data
      await loadEmployeeData(1, searchTerm);
    } catch (error) {
      console.error("Error loading business data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, getBusinessDetails, loadEmployeeData, searchTerm]);

  // Load business data on mount
// Fix the dependencies in the main useEffect
useEffect(() => {
    if (businessId && isBusinessCapabilitiesInitialized) {
      loadBusinessData();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any state that might cause memory leaks
      setEmployees([]);
      setFilteredEmployees([]);
      setBusiness(null);
    };
  }, [businessId, isBusinessCapabilitiesInitialized]); // Keep minimal dependencies

  // Filter employees based on search term
  const filterEmployees = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    
    const filtered = employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page on filter
  }, [searchTerm, employees]);

  // Update filtered employees when search term changes
  useEffect(() => {
    if (employees.length > 0) {
      filterEmployees();
    }
  }, [searchTerm, employees, filterEmployees]);

  // Handle search
  const handleSearch = useCallback(() => {
    loadEmployeeData(1, searchTerm);
  }, [loadEmployeeData, searchTerm]);
  
  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    loadEmployeeData(page, searchTerm);
  }, [loadEmployeeData, searchTerm]);

  // Handle save business capabilities
  const handleSaveCapabilities = async () => {
    if (!business) return;
    
    try {
      const result = await updateBusinessCapabilities(business._id, {
        allow_clockinout: allowClockInOut,
        has_app_access: hasAppAccess,
        allow_checkin: allowCheckIn
      });
      
      if (result && result.success) {
        setBusiness(result.business);
        // Reload business data to ensure everything is updated
        await loadBusinessData();
        toast.success("Business capabilities updated successfully");
      }
    } catch (error) {
      console.error("Error saving capabilities:", error);
      toast.error("Failed to update business capabilities");
    }
  };

  // Handle apply to all employees
  const handleApplyToAll = async () => {
    if (!business) return;
    
    try {
      const result = await updateBusinessCapabilities(business._id, {
        allow_clockinout: allowClockInOut,
        has_app_access: hasAppAccess,
        allow_checkin: allowCheckIn,
        applyToAllEmployees: true
      });
      
      if (result && result.success) {
        setBusiness(result.business);
        setShowApplyToAllDialog(false);
        
        // Reload employee data to get updated capabilities
        await loadEmployeeData(currentPage, searchTerm);
        toast.success("Applied capabilities to all employees");
      }
    } catch (error) {
      console.error("Error applying to all employees:", error);
      toast.error("Failed to apply capabilities to all employees");
    }
  };

  // Handle opening employee capabilities dialog
  const handleEditEmployeeCapabilities = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeAllowClockInOut(employee.allow_clockinout !== undefined ? employee.allow_clockinout : null);
    setEmployeeHasAppAccess(employee.has_app_access !== undefined ? employee.has_app_access : null);
    setEmployeeAllowCheckIn(employee.allow_checkin !== undefined ? employee.allow_checkin : null);
    
    // Set user information if available for display in the dialog
    if (employee.user) {
      setSelectedEmployeeUser(employee.user);
    } else {
      setSelectedEmployeeUser(null);
    }
    
    setShowEmployeeCapabilitiesDialog(true);
  };

  // Handle save employee capabilities
  const handleSaveEmployeeCapabilities = async () => {
    if (!selectedEmployee) return;
    
    try {
      const capabilities: any = {};
      
      if (employeeAllowClockInOut !== null) {
        capabilities.allow_clockinout = employeeAllowClockInOut;
      }
      
      if (employeeHasAppAccess !== null) {
        capabilities.has_app_access = employeeHasAppAccess;
      }
      
      if (employeeAllowCheckIn !== null) {
        capabilities.allow_checkin = employeeAllowCheckIn;
      }
      
      const result = await updateEmployeeCapabilities(selectedEmployee._id, capabilities);
      
      if (result && result.success) {
        // Update employee in local state for immediate feedback
        const updatedEmployees = filteredEmployees.map(emp => 
          emp._id === result.employee._id ? result.employee : emp
        );
        
        setFilteredEmployees(updatedEmployees);
        setEmployees(prev => prev.map(emp => 
          emp._id === result.employee._id ? result.employee : emp
        ));
        
        // Close the dialog
        setShowEmployeeCapabilitiesDialog(false);
        
        // Show success toast
        toast.success(`Updated capabilities for ${selectedEmployee.name}`);
      }
    } catch (error) {
      console.error("Error saving employee capabilities:", error);
      toast.error("Failed to update employee capabilities");
    }
  };

  // Reset employee capabilities to business defaults
  const resetEmployeeCapabilities = () => {
    if (!business || !selectedEmployee) return;
    
    setEmployeeAllowClockInOut(business.allow_clockinout);
    setEmployeeHasAppAccess(business.has_app_access);
    setEmployeeAllowCheckIn(business.allow_checkin);
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

  // Format capability description
  const getCapabilityStatus = (value: boolean | undefined | null, businessDefault: boolean) => {
    if (value === null || value === undefined) {
      return {
        status: "Using default",
        description: `Using business default (${businessDefault ? 'Enabled' : 'Disabled'})`,
        effective: businessDefault
      };
    }
    
    return {
      status: value ? "Enabled" : "Disabled",
      description: value ? "Explicitly enabled for this employee" : "Explicitly disabled for this employee",
      effective: value
    };
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push(`/crm/platform/businesses/${businessId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Business Capabilities</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Manage capability settings for this business and its employees
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={loadBusinessData}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Business Info Card */}
      {isLoading ? (
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{business?.name || "Business"}</CardTitle>
            <CardDescription>
              {business?.email} • {business?.type.replace(/_/g, ' ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Status Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Business Status:</span>
                    {getBusinessStatusBadge(business?.isActive ? BusinessStatus.ACTIVE : BusinessStatus.INACTIVE)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subscription:</span>
                    {getSubscriptionBadge(business?.subscriptionStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plan Tier:</span>
                    <span className="text-sm font-medium">
                      {business?.subscription?.tier 
                        ? business.subscription.tier.charAt(0).toUpperCase() + business.subscription.tier.slice(1) 
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Admin Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Admin:</span>
                    <span className="text-sm font-medium">{business?.adminUser?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Admin Email:</span>
                    <span className="text-sm">{business?.adminUser?.email || "N/A"}</span>
                  </div>
                  {business?.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Business Phone:</span>
                      <span className="text-sm">{business.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Business Capabilities and Employee Capabilities */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">Business Capabilities</TabsTrigger>
          <TabsTrigger value="employees">Employee Capabilities</TabsTrigger>
        </TabsList>

        {/* Business Capabilities Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business-wide Capabilities</CardTitle>
              <CardDescription>
                Configure default capabilities for all employees in this business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-clockin">
                          <div className="flex items-center gap-2">
                            <AlarmClock className="h-4 w-4 text-muted-foreground" />
                            Allow Clock In/Out
                          </div>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow employees to clock in and out of their shifts
                        </p>
                      </div>
                      <Switch
                        id="allow-clockin"
                        checked={allowClockInOut}
                        onCheckedChange={setAllowClockInOut}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="has-app-access">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            App Access
                          </div>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow employees to access the mobile app
                        </p>
                      </div>
                      <Switch
                        id="has-app-access"
                        checked={hasAppAccess}
                        onCheckedChange={setHasAppAccess}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-checkin">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Allow Check-in
                          </div>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow employees to check in at job sites and locations
                        </p>
                      </div>
                      <Switch
                        id="allow-checkin"
                        checked={allowCheckIn}
                        onCheckedChange={setAllowCheckIn}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={loadBusinessData}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplyToAllDialog(true)}
                  disabled={isLoading || isUpdatingCapabilities}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Apply to All Employees
                </Button>
                <Button 
                  onClick={handleSaveCapabilities}
                  disabled={isLoading || isUpdatingCapabilities}
                >
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Employee Capabilities Tab */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Capabilities</CardTitle>
              <CardDescription>
                Manage individual employee access to features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and filter bar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      className="w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSearch}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      loadEmployeeData(1, "");
                    }}
                    disabled={!searchTerm}
                  >
                    Clear
                  </Button>
                </div>

                {/* Employees table */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead className="w-[140px]">Clock In/Out</TableHead>
                        <TableHead className="w-[140px]">App Access</TableHead>
                        <TableHead className="w-[140px]">Check-in</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingEmployees ? (
                        // Skeleton loader for employees
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={`skeleton-${i}`}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Skeleton className="h-5 w-36" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-9 w-16 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <Users className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No employees found</p>
                              {searchTerm && (
                                <p className="text-sm text-muted-foreground">
                                  Try adjusting your search
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <TableRow key={employee._id}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {employee.email}
                                  {employee.user && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                      Has Account
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {employee.allow_clockinout !== undefined ? (
                                <Badge
                                  className={
                                    employee.allow_clockinout
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                  }
                                >
                                  {employee.allow_clockinout ? "Enabled" : "Disabled"}
                                </Badge>
                              ) : (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {employee.has_app_access !== undefined ? (
                                <Badge
                                  className={
                                    employee.has_app_access
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                  }
                                >
                                  {employee.has_app_access ? "Enabled" : "Disabled"}
                                </Badge>
                              ) : (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {employee.allow_checkin !== undefined ? (
                                <Badge
                                  className={
                                    employee.allow_checkin
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                  }
                                >
                                  {employee.allow_checkin ? "Enabled" : "Disabled"}
                                </Badge>
                              ) : (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditEmployeeCapabilities(employee)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalEmployeePages > 1 && (
                  <div className="flex justify-center">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Apply to All Employees Dialog */}
      <AlertDialog open={showApplyToAllDialog} onOpenChange={setShowApplyToAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply to All Employees?</AlertDialogTitle>
            <AlertDialogDescription>
              This will override individual employee settings and apply the business-wide capabilities to all employees.
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Clock In/Out:</span>
                  <Badge
                    className={
                      allowClockInOut
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {allowClockInOut ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">App Access:</span>
                  <Badge
                    className={
                      hasAppAccess
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {hasAppAccess ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Check-in:</span>
                  <Badge
                    className={
                      allowCheckIn
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {allowCheckIn ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApplyToAll}
              disabled={isUpdatingCapabilities}
            >
              <Users className="mr-2 h-4 w-4" />
              Apply to All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Employee Capabilities Dialog */}
      <AlertDialog open={showEmployeeCapabilitiesDialog} onOpenChange={setShowEmployeeCapabilitiesDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Employee Capabilities</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEmployee && (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{selectedEmployee.name}</span>
                  <span className="text-sm">{selectedEmployee.email}</span>
                  {selectedEmployeeUser && (
                    <div className="mt-1 text-xs text-blue-600">
                      This employee has a user account. Changes will affect their app access.
                    </div>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="emp-allow-clockin" className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlarmClock className="h-4 w-4 text-muted-foreground" />
                  Allow Clock In/Out
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setEmployeeAllowClockInOut(null)}
                  >
                    Use Default
                  </Button>
                  <Switch
                    id="emp-allow-clockin"
                    checked={employeeAllowClockInOut === null 
                      ? (business?.allow_clockinout ?? true) 
                      : employeeAllowClockInOut}
                    onCheckedChange={(checked) => setEmployeeAllowClockInOut(checked)}
                    disabled={employeeAllowClockInOut === null}
                  />
                </div>
              </Label>
              <p className="text-xs text-muted-foreground pl-6">
                {employeeAllowClockInOut === null 
                  ? `Using business default (${(business?.allow_clockinout ?? true) ? 'Enabled' : 'Disabled'})` 
                  : employeeAllowClockInOut 
                    ? 'Employee can clock in and out' 
                    : 'Employee cannot clock in and out'}
              </p>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="emp-has-app-access" className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  App Access
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setEmployeeHasAppAccess(null)}
                  >
                    Use Default
                  </Button>
                  <Switch
                    id="emp-has-app-access"
                    checked={employeeHasAppAccess === null 
                      ? (business?.has_app_access ?? true) 
                      : employeeHasAppAccess}
                    onCheckedChange={(checked) => setEmployeeHasAppAccess(checked)}
                    disabled={employeeHasAppAccess === null}
                  />
                </div>
              </Label>
              <p className="text-xs text-muted-foreground pl-6">
                {employeeHasAppAccess === null 
                  ? `Using business default (${(business?.has_app_access ?? true) ? 'Enabled' : 'Disabled'})` 
                  : employeeHasAppAccess 
                    ? 'Employee can access the mobile app' 
                    : 'Employee cannot access the mobile app'}
              </p>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="emp-allow-checkin" className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Allow Check-in
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setEmployeeAllowCheckIn(null)}
                  >
                    Use Default
                  </Button>
                  <Switch
                    id="emp-allow-checkin"
                    checked={employeeAllowCheckIn === null 
                      ? (business?.allow_checkin ?? true) 
                      : employeeAllowCheckIn}
                    onCheckedChange={(checked) => setEmployeeAllowCheckIn(checked)}
                    disabled={employeeAllowCheckIn === null}
                  />
                </div>
              </Label>
              <p className="text-xs text-muted-foreground pl-6">
                {employeeAllowCheckIn === null 
                  ? `Using business default (${(business?.allow_checkin ?? true) ? 'Enabled' : 'Disabled'})` 
                  : employeeAllowCheckIn 
                    ? 'Employee can check in at locations' 
                    : 'Employee cannot check in at locations'}
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveEmployeeCapabilities}
              disabled={isUpdatingCapabilities}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}