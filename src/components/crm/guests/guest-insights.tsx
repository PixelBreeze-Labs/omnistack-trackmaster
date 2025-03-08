"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  DollarSign,
  Users,
  Clock,
  BarChart4,
  Mail,
  Phone,
  MapPin,
  User,
  Star,
  ArrowUpRight,
  Building,
} from "lucide-react";

// Sample data - in a real app, this would come from your API
const mockGuest = {
  name: "Alexander Mitchell",
  email: "alex.mitchell@example.com",
  phone: "+1 (555) 123-4567",
  profileImage: "",
  status: "ACTIVE",
  tier: "Gold Tier",
  totalSpend: 2450,
  totalBookings: 8,
  averageStay: 3.2,
  points: 1250,
  preferredRoomType: "Executive Suite",
  lastVisit: "2023-12-15",
  nextBooking: "2024-05-22",
};

const mockBookings = [
  {
    id: "BK-9876",
    checkIn: "2023-12-10",
    checkOut: "2023-12-15",
    roomType: "Executive Suite",
    guests: 2,
    totalAmount: 950,
    status: "COMPLETED",
    specialRequests: "Late check-out, Champagne upon arrival"
  },
  {
    id: "BK-8765",
    checkIn: "2023-08-05",
    checkOut: "2023-08-08",
    roomType: "Deluxe Room",
    guests: 1,
    totalAmount: 450,
    status: "COMPLETED",
    specialRequests: "High floor, away from elevator"
  },
  {
    id: "BK-7654",
    checkIn: "2024-05-22",
    checkOut: "2024-05-27",
    roomType: "Premier Suite",
    guests: 2,
    totalAmount: 1350,
    status: "CONFIRMED",
    specialRequests: "Anniversary celebration, Spa reservation"
  }
];

const mockMonthlyData = [
  { month: 'Jan', bookings: 1, spend: 350 },
  { month: 'Feb', bookings: 0, spend: 0 },
  { month: 'Mar', bookings: 1, spend: 400 },
  { month: 'Apr', bookings: 0, spend: 0 },
  { month: 'May', bookings: 0, spend: 0 },
  { month: 'Jun', bookings: 1, spend: 650 },
  { month: 'Jul', bookings: 0, spend: 0 },
  { month: 'Aug', bookings: 1, spend: 450 },
  { month: 'Sep', bookings: 0, spend: 0 },
  { month: 'Oct', bookings: 0, spend: 0 },
  { month: 'Nov', bookings: 0, spend: 0 },
  { month: 'Dec', bookings: 1, spend: 950 },
];

export function GuestInsights() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(mockGuest);

  // Guest search functionality would be implemented here
  const handleSearch = () => {
    // In a real app, this would call an API to search guests
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guest Insights</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Analyze guest behavior and preferences to provide personalized service
          </p>
        </div>
      </div>

      {/* Guest Search Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Find Guest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Guest Overview Section */}
      {selectedGuest && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedGuest.profileImage} alt={selectedGuest.name} />
                  <AvatarFallback className="text-lg">
                    {selectedGuest.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedGuest.name}</h3>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground mt-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedGuest.email}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground mt-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{selectedGuest.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="success">{selectedGuest.status}</Badge>
                <Badge variant="secondary">{selectedGuest.tier}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Total Spend</span>
                </div>
                <p className="text-xl font-semibold">${selectedGuest.totalSpend}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Total Bookings</span>
                </div>
                <p className="text-xl font-semibold">{selectedGuest.totalBookings}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Avg. Stay</span>
                </div>
                <p className="text-xl font-semibold">{selectedGuest.averageStay} nights</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Star className="h-4 w-4" />
                  <span>Loyalty Points</span>
                </div>
                <p className="text-xl font-semibold">{selectedGuest.points}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Insights Tabs */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="patterns">Booking Patterns</TabsTrigger>
          <TabsTrigger value="analytics">Spending Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{booking.roomType}</h4>
                          <Badge variant={booking.status === "COMPLETED" ? "outline" : "default"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Booking #{booking.id}</p>
                      </div>
                      <p className="font-semibold">${booking.totalAmount}</p>
                    </div>
                    
                    <div className="flex gap-6 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Check-in</p>
                        <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Check-out</p>
                        <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Guests</p>
                        <p>{booking.guests}</p>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Special Requests:</p>
                        <p className="text-sm">{booking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Booking Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Booking Frequency</h4>
                  <div className="h-48 flex items-end gap-2">
                    {mockMonthlyData.map((item) => (
                      <div key={item.month} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-primary/80 rounded-t-sm"
                          style={{ height: `${(item.bookings/1) * 100}px` }}
                        ></div>
                        <span className="text-xs mt-1">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Preferred Day of Week</h4>
                    <p className="text-xl font-semibold mt-2">Friday</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Average Lead Time</h4>
                    <p className="text-xl font-semibold mt-2">32 days</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Booking Cancellations</h4>
                    <p className="text-xl font-semibold mt-2">0</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Preferred Room Types</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Executive Suite</span>
                      <Badge variant="secondary">4 bookings</Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Deluxe Room</span>
                      <Badge variant="secondary">3 bookings</Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Premier Suite</span>
                      <Badge variant="secondary">1 booking</Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Spend</h4>
                  <div className="h-48 flex items-end gap-2">
                    {mockMonthlyData.map((item) => (
                      <div key={item.month} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-green-500/80 rounded-t-sm"
                          style={{ height: `${(item.spend/1000) * 100}px` }}
                        ></div>
                        <span className="text-xs mt-1">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Average Spend per Stay</h4>
                    <p className="text-xl font-semibold mt-2">$306</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Average Daily Rate</h4>
                    <p className="text-xl font-semibold mt-2">$120</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Revenue Growth</h4>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <p className="text-xl font-semibold text-green-500">+24%</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Additional Services Purchased</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Spa Services</span>
                      <span className="font-medium">$350</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Room Service</span>
                      <span className="font-medium">$280</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Restaurant</span>
                      <span className="font-medium">$420</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GuestInsights;