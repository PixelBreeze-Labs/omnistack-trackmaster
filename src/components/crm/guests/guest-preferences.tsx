"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Search,
  Mail,
  Phone,
  BellRing,
  MessageCircle,
  UserCog,
  BedDouble,
  CircleDollarSign,
  Utensils,
  HandHeart,
  Clock,
  Save,
  CalendarIcon,
  Filter,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample data - in a real app, this would come from your API
const mockGuestList = [
  {
    id: "1",
    name: "Alexander Mitchell",
    email: "alex.mitchell@example.com",
    phone: "+1 (555) 123-4567",
    tier: "Gold Tier",
    lastStay: "Dec 15, 2023",
    upcomingStay: "March 22, 2025",
  },
  {
    id: "2",
    name: "Sophia Patel",
    email: "sophia.p@example.com",
    phone: "+1 (555) 987-6543",
    tier: "Silver Tier", 
    lastStay: "Feb 3, 2024",
    upcomingStay: null,
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "m.johnson@example.com",
    phone: "+1 (555) 456-7890",
    tier: "Bronze Tier",
    lastStay: "Nov 25, 2023",
    upcomingStay: "April 10, 2025",
  },
  {
    id: "4",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    phone: "+1 (555) 234-5678",
    tier: "Gold Tier",
    lastStay: "Jan 20, 2024",
    upcomingStay: "March 15, 2025",
  },
  {
    id: "5",
    name: "David Rodriguez",
    email: "david.r@example.com",
    phone: "+1 (555) 876-5432",
    tier: "Silver Tier",
    lastStay: "Feb 28, 2024",
    upcomingStay: null,
  }
];

const mockGuestPreferences = {
  communication: {
    preferredMethod: "email",
    allowMarketingEmails: true,
    allowPromotionalSMS: false,
    allowBookingReminders: true,
    allowFeedbackRequests: true,
    allowRestaurantMsg: true,
    allowVenueboostMsg: false,
    preferredFrequency: "weekly",
    preferredTime: "morning",
    unsubscribeReason: ""
  },
  stay: {
    preferredRoomType: "Executive Suite",
    preferredFloor: "high",
    preferredView: "ocean",
    preferredBedType: "king",
    requiresAccessibility: false,
    dietaryRestrictions: ["Vegetarian"],
    allowRoomCleaning: true,
    turndownService: true,
    specialOccasions: ["Anniversary: May 15"],
    arrivalTime: "afternoon",
    amenityPreferences: ["Extra pillows", "Fresh flowers", "Complimentary water"]
  },
  personalDetails: {
    guestNotes: "Prefers extra pillows. Always requests late checkout when possible.",
    emergencyContact: "Jennifer Mitchell: +1 (555) 999-8888",
    loyaltyNumber: "GL-123456",
    preferredLanguage: "English",
    isVIP: true,
    primaryPurpose: "business",
    dataPrivacySettings: "standard",
    referralSource: "friend"
  }
};

export function GuestPreferences() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(mockGuestList[0]);
  const [preferences, setPreferences] = useState(mockGuestPreferences);
  const [filteredGuests, setFilteredGuests] = useState(mockGuestList);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    upcoming: false,
    recent: false,
    tier: "all"
  });
  const [changesMade, setChangesMade] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [guestToSwitch, setGuestToSwitch] = useState(null);

  // Guest search functionality
  const handleSearch = () => {
    applyFilters(searchTerm, activeFilters);
  };

  const applyFilters = (search, filters) => {
    let filtered = [...mockGuestList];
    
    // Apply search term filter
    if (search.trim()) {
      filtered = filtered.filter(guest => 
        guest.name.toLowerCase().includes(search.toLowerCase()) ||
        guest.email.toLowerCase().includes(search.toLowerCase()) ||
        guest.phone.includes(search)
      );
    }
    
    // Apply upcoming stays filter
    if (filters.upcoming) {
      filtered = filtered.filter(guest => guest.upcomingStay !== null);
    }
    
    // Apply recent guests filter
    if (filters.recent) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filtered = filtered.filter(guest => {
        const stayDate = new Date(guest.lastStay);
        return stayDate >= sixMonthsAgo;
      });
    }
    
    // Apply tier filter
    if (filters.tier !== "all") {
      filtered = filtered.filter(guest => 
        guest.tier.toLowerCase().includes(filters.tier.toLowerCase())
      );
    }
    
    setFilteredGuests(filtered);
  };

  const clearFilters = () => {
    setActiveFilters({
      upcoming: false,
      recent: false,
      tier: "all"
    });
    applyFilters(searchTerm, {
      upcoming: false,
      recent: false,
      tier: "all"
    });
  };

  const handleSelectGuest = (guest) => {
    if (changesMade) {
      setGuestToSwitch(guest);
      setShowUnsavedDialog(true);
    } else {
      setSelectedGuest(guest);
      // In a real app, you would fetch the preferences for this guest
    }
  };

  const confirmGuestSwitch = () => {
    setSelectedGuest(guestToSwitch);
    setChangesMade(false);
    setShowUnsavedDialog(false);
  };

  const handlePreferenceChange = (section, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setChangesMade(true);
  };

  const handleArrayPreferenceChange = (section, field, value) => {
    setPreferences(prev => {
      const currentValues = [...prev[section][field]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        // Add the value if it doesn't exist
        currentValues.push(value);
      } else {
        // Remove the value if it exists
        currentValues.splice(index, 1);
      }
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: currentValues
        }
      };
    });
    setChangesMade(true);
  };

  const handleSavePreferences = () => {
    // In a real app, this would save the preferences to your API
    console.log("Saving preferences:", preferences);
    // Show success notification
    toast({
      title: "Preferences saved",
      description: `Successfully updated preferences for ${selectedGuest.name}`,
    });
    setChangesMade(false);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guest Preferences</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage guest communication and stay preferences
          </p>
        </div>
        <Button onClick={handleSavePreferences} disabled={!changesMade}>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guest Search Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Guest</CardTitle>
            {/* <CardDescription>Find a guest to view or edit their preferences</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search guests..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Filter Guests</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="p-2">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="upcoming" 
                                  checked={activeFilters.upcoming}
                                  onCheckedChange={(checked) => 
                                    setActiveFilters({...activeFilters, upcoming: checked})
                                  }
                                />
                                <label 
                                  htmlFor="upcoming" 
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Upcoming stays
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="recent" 
                                  checked={activeFilters.recent}
                                  onCheckedChange={(checked) => 
                                    setActiveFilters({...activeFilters, recent: checked})
                                  }
                                />
                                <label 
                                  htmlFor="recent" 
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Recent guests (6 months)
                                </label>
                              </div>
                              <div className="space-y-1 pt-2">
                                <Label className="text-xs">Loyalty Tier</Label>
                                <Select 
                                  value={activeFilters.tier}
                                  onValueChange={(value) => 
                                    setActiveFilters({...activeFilters, tier: value})
                                  }
                                >
                                  <SelectTrigger className="w-full h-8">
                                    <SelectValue placeholder="All tiers" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All tiers</SelectItem>
                                    <SelectItem value="gold">Gold Tier</SelectItem>
                                    <SelectItem value="silver">Silver Tier</SelectItem>
                                    <SelectItem value="bronze">Bronze Tier</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Button variant="outline" size="sm" onClick={clearFilters}>
                                Clear
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  applyFilters(searchTerm, activeFilters);
                                  setFilterMenuOpen(false);
                                }}
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter guests</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button size="sm" onClick={handleSearch}>Find</Button>
              </div>
              
              <div className="space-y-2 mt-4">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <div 
                      key={guest.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                        selectedGuest?.id === guest.id ? 'border-primary bg-muted/50' : ''
                      }`}
                      onClick={() => handleSelectGuest(guest)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{guest.name}</p>
                            {guest.upcomingStay && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center">
                                      <CalendarIcon className="h-3 w-3 text-primary" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Upcoming stay: {guest.upcomingStay}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Last stay: {guest.lastStay}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No guests found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Editor Section */}
        <div className="md:col-span-2 space-y-6">
          {selectedGuest && (
            <>
              {/* Guest Header */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg">
                          {selectedGuest.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedGuest.name}</h3>
                        <div className="flex gap-4 mt-1">
                          <div className="flex gap-1 items-center text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" /> 
                            <span>{selectedGuest.email}</span>
                          </div>
                          <div className="flex gap-1 items-center text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> 
                            <span>{selectedGuest.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge>{selectedGuest.tier}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences Tabs */}
              <Tabs defaultValue="communication">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                  <TabsTrigger value="stay">Stay Preferences</TabsTrigger>
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                </TabsList>
                
                {/* Communication Preferences */}
                <TabsContent value="communication">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Communication Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Preferred Contact Method</Label>
                          <Select 
                            value={preferences.communication.preferredMethod}
                            onValueChange={(value) => handlePreferenceChange('communication', 'preferredMethod', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Communication Frequency</Label>
                          <Select 
                            value={preferences.communication.preferredFrequency}
                            onValueChange={(value) => handlePreferenceChange('communication', 'preferredFrequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Preferred Time</Label>
                          <Select 
                            value={preferences.communication.preferredTime}
                            onValueChange={(value) => handlePreferenceChange('communication', 'preferredTime', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time of day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                              <SelectItem value="evening">Evening (5pm-9pm)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Opt-in Preferences</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                          </div>
                          <Switch 
                            checked={preferences.communication.allowMarketingEmails}
                            onCheckedChange={(checked) => handlePreferenceChange('communication', 'allowMarketingEmails', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Promotional SMS</Label>
                            <p className="text-sm text-muted-foreground">Receive text message promotions and offers</p>
                          </div>
                          <Switch 
                            checked={preferences.communication.allowPromotionalSMS}
                            onCheckedChange={(checked) => handlePreferenceChange('communication', 'allowPromotionalSMS', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Booking Reminders</Label>
                            <p className="text-sm text-muted-foreground">Receive reminders about upcoming bookings</p>
                          </div>
                          <Switch 
                            checked={preferences.communication.allowBookingReminders}
                            onCheckedChange={(checked) => handlePreferenceChange('communication', 'allowBookingReminders', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Feedback Requests</Label>
                            <p className="text-sm text-muted-foreground">Receive requests for feedback after stays</p>
                          </div>
                          <Switch 
                            checked={preferences.communication.allowFeedbackRequests}
                            onCheckedChange={(checked) => handlePreferenceChange('communication', 'allowFeedbackRequests', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Restaurant Messages</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about restaurant events and specials</p>
                          </div>
                          <Switch 
                            checked={preferences.communication.allowRestaurantMsg}
                            onCheckedChange={(checked) => handlePreferenceChange('communication', 'allowRestaurantMsg', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Venue Promotions</Label>
                            <p className="text-sm text-muted-foreground">Receive messages about venue events and promotions</p>
                          </div>
                          <Switch 
                            checked={preferences.communication.allowVenueboostMsg}
                            onCheckedChange={(checked) => handlePreferenceChange('communication', 'allowVenueboostMsg', checked)}
                          />
                        </div>
                      </div>
                      
                      {preferences.communication.unsubscribeReason && (
                        <div className="mt-6 p-4 border rounded-md bg-muted">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Unsubscribe Note</h4>
                              <p className="text-sm mt-1">{preferences.communication.unsubscribeReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Stay Preferences */}
                <TabsContent value="stay">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BedDouble className="h-5 w-5" />
                        Stay Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Preferred Room Type</Label>
                          <Select 
                            value={preferences.stay.preferredRoomType}
                            onValueChange={(value) => handlePreferenceChange('stay', 'preferredRoomType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Standard Room">Standard Room</SelectItem>
                              <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                              <SelectItem value="Executive Suite">Executive Suite</SelectItem>
                              <SelectItem value="Presidential Suite">Presidential Suite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Preferred Floor</Label>
                          <Select 
                            value={preferences.stay.preferredFloor}
                            onValueChange={(value) => handlePreferenceChange('stay', 'preferredFloor', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select floor preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Lower floors</SelectItem>
                              <SelectItem value="middle">Middle floors</SelectItem>
                              <SelectItem value="high">Higher floors</SelectItem>
                              <SelectItem value="no-preference">No preference</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Preferred View</Label>
                          <Select 
                            value={preferences.stay.preferredView}
                            onValueChange={(value) => handlePreferenceChange('stay', 'preferredView', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select view preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="city">City View</SelectItem>
                              <SelectItem value="garden">Garden View</SelectItem>
                              <SelectItem value="ocean">Ocean View</SelectItem>
                              <SelectItem value="no-preference">No preference</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Preferred Bed Type</Label>
                          <Select 
                            value={preferences.stay.preferredBedType}
                            onValueChange={(value) => handlePreferenceChange('stay', 'preferredBedType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select bed type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twin">Twin Beds</SelectItem>
                              <SelectItem value="queen">Queen Bed</SelectItem>
                              <SelectItem value="king">King Bed</SelectItem>
                              <SelectItem value="california-king">California King</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Typical Arrival Time</Label>
                          <Select 
                            value={preferences.stay.arrivalTime}
                            onValueChange={(value) => handlePreferenceChange('stay', 'arrivalTime', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select arrival time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                              <SelectItem value="evening">Evening (5pm-9pm)</SelectItem>
                              <SelectItem value="evening">Evening (5pm-9pm)</SelectItem>
              <SelectItem value="late">Late night (9pm+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <Label>Accessibility Requirements</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="accessibility"
              checked={preferences.stay.requiresAccessibility}
              onCheckedChange={(checked) => handlePreferenceChange('stay', 'requiresAccessibility', checked)}
            />
            <label
              htmlFor="accessibility"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Requires accessibility features
            </label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="font-semibold">Room Preferences</h4>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Daily Room Cleaning</Label>
            <p className="text-sm text-muted-foreground">Allow daily housekeeping services</p>
          </div>
          <Switch 
            checked={preferences.stay.allowRoomCleaning}
            onCheckedChange={(checked) => handlePreferenceChange('stay', 'allowRoomCleaning', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Turndown Service</Label>
            <p className="text-sm text-muted-foreground">Receive evening turndown service</p>
          </div>
          <Switch 
            checked={preferences.stay.turndownService}
            onCheckedChange={(checked) => handlePreferenceChange('stay', 'turndownService', checked)}
          />
          </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold">Dietary Restrictions</h4>
        <div className="grid grid-cols-2 gap-3">
          {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Kosher", "Halal", "Nut Allergy", "Shellfish Allergy"].map((restriction) => (
            <div key={restriction} className="flex items-center space-x-2">
              <Checkbox 
                id={`diet-${restriction}`}
                checked={preferences.stay.dietaryRestrictions.includes(restriction)}
                onCheckedChange={() => handleArrayPreferenceChange('stay', 'dietaryRestrictions', restriction)}
              />
              <label
                htmlFor={`diet-${restriction}`}
                className="text-sm font-medium leading-none"
              >
                {restriction}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold">Amenity Preferences</h4>
        <div className="grid grid-cols-2 gap-3">
          {["Extra pillows", "Fresh flowers", "Complimentary water", "Fruit basket", "Newspaper", "Slippers", "Bathrobe", "Hypoallergenic bedding"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity}`}
                checked={preferences.stay.amenityPreferences.includes(amenity)}
                onCheckedChange={() => handleArrayPreferenceChange('stay', 'amenityPreferences', amenity)}
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm font-medium leading-none"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Special Occasions</Label>
        <Textarea 
          placeholder="Enter any special occasions (birthdays, anniversaries, etc.)"
          value={preferences.stay.specialOccasions.join('\n')}
          onChange={(e) => handlePreferenceChange('stay', 'specialOccasions', e.target.value.split('\n').filter(line => line.trim() !== ''))}
          className="h-20"
        />
      </div>
    </CardContent>
  </Card>
</TabsContent>

{/* Personal Details */}
<TabsContent value="personal">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <UserCog className="h-5 w-5" />
        Personal Details
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Preferred Language</Label>
          <Select 
            value={preferences.personalDetails.preferredLanguage}
            onValueChange={(value) => handlePreferenceChange('personalDetails', 'preferredLanguage', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Primary Visit Purpose</Label>
          <Select 
            value={preferences.personalDetails.primaryPurpose}
            onValueChange={(value) => handlePreferenceChange('personalDetails', 'primaryPurpose', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="leisure">Leisure</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="family">Family Visit</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Loyalty Number</Label>
          <Input 
            value={preferences.personalDetails.loyaltyNumber}
            onChange={(e) => handlePreferenceChange('personalDetails', 'loyaltyNumber', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Data Privacy Settings</Label>
          <Select 
            value={preferences.personalDetails.dataPrivacySettings}
            onValueChange={(value) => handlePreferenceChange('personalDetails', 'dataPrivacySettings', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select privacy settings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal data sharing</SelectItem>
              <SelectItem value="standard">Standard data sharing</SelectItem>
              <SelectItem value="extended">Extended data sharing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Emergency Contact</Label>
        <Input 
          value={preferences.personalDetails.emergencyContact}
          onChange={(e) => handlePreferenceChange('personalDetails', 'emergencyContact', e.target.value)}
          placeholder="Name: Phone Number"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">VIP Status</Label>
          <p className="text-sm text-muted-foreground">Flag guest as VIP for special handling</p>
        </div>
        <Switch 
          checked={preferences.personalDetails.isVIP}
          onCheckedChange={(checked) => handlePreferenceChange('personalDetails', 'isVIP', checked)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Guest Notes</Label>
        <Textarea 
          placeholder="Enter any additional notes about this guest"
          value={preferences.personalDetails.guestNotes}
          onChange={(e) => handlePreferenceChange('personalDetails', 'guestNotes', e.target.value)}
          className="h-40"
        />
      </div>
    </CardContent>
  </Card>
</TabsContent>
</Tabs>
        </>
      )}
    </div>
  </div>
  
  {/* Unsaved Changes Dialog */}
  <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogDescription>
          You have unsaved changes for {selectedGuest?.name}. Would you like to save these changes before switching guests?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => {
          setShowUnsavedDialog(false);
          setChangesMade(false);
          confirmGuestSwitch();
        }}>
          Discard Changes
        </Button>
        <Button onClick={() => {
          handleSavePreferences();
          confirmGuestSwitch();
        }}>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
);
}