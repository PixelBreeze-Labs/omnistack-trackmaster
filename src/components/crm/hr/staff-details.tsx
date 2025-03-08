"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
//   CardDescription,
//   CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  User, 
  MessageSquare,
  Check, 
  Clock,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useClient } from '@/hooks/useClient';

// Communication form schema
const communicationFormSchema = z.object({
  type: z.enum(['EMAIL', 'SMS']),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required').max(
    1000, 
    'Message is too long (max 1000 characters)'
  )
});

// Types
interface StaffCommunication {
    id: string;
    type: 'EMAIL' | 'SMS' | 'NOTE';  // Added 'NOTE' type
    subject: string;
    message: string;
    status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';
    sentAt: string;
    deliveredAt?: string;
    readAt?: string;
  }

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  employeeId: string;
  role: string;
  subRole?: string;
  status: string;
  dateOfJoin: string;
  departmentId: string;
  department: {
    id: string;
    name: string;
  };
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
  };
  communications: StaffCommunication[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function StaffDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { clientId } = useClient();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);


  const form = useForm<z.infer<typeof communicationFormSchema>>({
    resolver: zodResolver(communicationFormSchema),
    defaultValues: {
      type: 'EMAIL',
      subject: '',
      message: ''
    }
  });

  // Check if user has access to this page
  useEffect(() => {
    if (session?.user?.clientType !== 'BOOKING') {
      router.push('/crm/platform/hr/staff');
      toast.error('Access denied. This page is only available for MetroSuites.');
    }
  }, [session, router]);

  // Fetch staff details with communications
  useEffect(() => {
    const fetchStaffDetails = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        // First fetch basic staff details
        const response = await fetch(`/api/staff/${params.id}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch staff details');
        }
        
        const data = await response.json();
        
        // Then fetch communications if they exist
        try {
          const commsResponse = await fetch(`/api/staff/${params.id}/communications`);
          if (commsResponse.ok) {
            const commsData = await commsResponse.json();
            data.communications = commsData;
          } else {
            data.communications = [];
          }
        } catch (error) {
          console.warn('Failed to fetch communications, using empty array', error);
          data.communications = [];
        }
        
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff details:', error);
        toast.error('Failed to load staff details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffDetails();
  }, [params.id, clientId]);

  // Handle sending new communication
  const onSubmit = async (values: z.infer<typeof communicationFormSchema>) => {
    if (!staff) return;
    
    try {
      setIsSending(true);
      const response = await fetch(`/api/staff/${staff.id}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send communication');
      }
      
      // Add the new communication to the list
      const newComm = await response.json();
      setStaff(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          communications: [newComm, ...(prev.communications || [])]
        };
      });
      
      // Reset form
      form.reset();
      
      toast.success(`${values.type === 'EMAIL' ? 'Email' : 'SMS'} sent successfully`);
    } catch (error) {
      console.error('Error sending communication:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send communication');
    } finally {
      setIsSending(false);
    }
  };


  // Create a separate form for notes
const noteForm = useForm({
    resolver: zodResolver(z.object({
      subject: z.string().min(1, 'Title is required'),
      message: z.string().min(1, 'Note content is required')
    })),
    defaultValues: {
      subject: '',
      message: ''
    }
  });
  

  // Handle note submission
const onSubmitNote = async (values) => {
    try {
      setIsAddingNote(true);
      
      const response = await fetch(`/api/staff/${staff.id}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NOTE',
          subject: values.subject,
          message: values.message
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save note');
      }
      
      // Add the new note to the list
      const newNote = await response.json();
      setStaff(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          communications: [newNote, ...(prev.communications || [])]
        };
      });
      
      // Reset form
      noteForm.reset();
      
      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save note');
    } finally {
      setIsAddingNote(false);
    }
}

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'SENT': 'bg-blue-100 text-blue-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'READ': 'bg-purple-100 text-purple-800',
      'FAILED': 'bg-red-100 text-red-800',
      'DRAFT': 'bg-gray-100 text-gray-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons = {
      'SENT': Clock,
      'DELIVERED': Check,
      'READ': Check,
      'FAILED': AlertCircle,
      'DRAFT': Clock
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Loading staff details...</div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-8">
        <Button 
          variant="outline" 
          onClick={() => router.push('/crm/platform/hr/staff')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff List
        </Button>
        <Card>
          <CardContent className="p-16 text-center">
            <div className="text-lg font-medium">Staff member not found</div>
            <p className="text-muted-foreground mt-2">
              The requested staff member could not be found or you do not have access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canSendEmail = staff.communicationPreferences?.email;
  const canSendSMS = staff.communicationPreferences?.sms;
  const hasCommunicationHistory = staff.communications && staff.communications.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => router.push('/crm/platform/hr/staff')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Staff Details Card */}
        <Card className="md:col-span-1">
        <CardHeader className="relative">
    <div className="absolute top-4 right-4">
      <Badge 
        className={
          staff.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }
      >
        {staff.status}
      </Badge>
    </div>
    
    <div>
      <h3 className="text-xl font-bold tracking-tight">Staff Profile</h3>
      <p className="text-sm text-muted-foreground mt-0 mb-4">
        Personal and job information
      </p>
    </div>
  </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={staff.avatar} />
                <AvatarFallback className="text-lg">
                  {staff.firstName[0]}{staff.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{staff.firstName} {staff.lastName}</h3>
                <p className="text-sm text-muted-foreground">{staff.role}</p>
                {staff.subRole && <p className="text-xs text-muted-foreground">{staff.subRole}</p>}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="text-sm">{staff.employeeId}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm">{staff.email}</span>
              </div>
              
              {staff.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm">{staff.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Department:</span>
                <span className="text-sm">{staff.department.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Date of Join:</span>
                <span className="text-sm">{formatDate(staff.dateOfJoin).split(',')[0]}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Communication Preferences</h4>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={canSendEmail ? "default" : "outline"}
                  className={canSendEmail ? "bg-blue-100 text-blue-800" : ""}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email: {canSendEmail ? "Enabled" : "Disabled"}
                </Badge>
                
                <Badge 
                  variant={canSendSMS ? "default" : "outline"}
                  className={canSendSMS ? "bg-green-100 text-green-800" : ""}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  SMS: {canSendSMS ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>

            {staff.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{staff.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

     {/* Communication Tabs */}
<Card className="md:col-span-2">
<Tabs defaultValue="history">
    <CardHeader className="flex justify-between items-start px-4">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Communications</h3>
        <p className="text-sm text-muted-foreground mt-0 mb-0">
          Message history and sending options
        </p>
      </div>
      
      <TabsList className="mt-1">
        <TabsTrigger value="history">
          <Clock className="h-4 w-4 mr-2" />
          History
        </TabsTrigger>
        <TabsTrigger 
          value="send" 
          disabled={!canSendEmail && !canSendSMS}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </TabsTrigger>
        <TabsTrigger value="note">
          <Pencil className="h-4 w-4 mr-2" />
          Leave Note
        </TabsTrigger>
      </TabsList>
    </CardHeader>
    
    {/* Communication History Tab */}
    <TabsContent value="history" className="space-y-4 px-4">
      <CardContent>
        {!hasCommunicationHistory ? (
          <div className="p-8 text-center border rounded-md">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No Communication History</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
              There are no recorded communications with this staff member yet.
              {(canSendEmail || canSendSMS) && " Use the 'Send Message' tab to start a conversation."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.communications.map((comm) => (
                <TableRow key={comm.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{formatDate(comm.sentAt)}</TableCell>
                  <TableCell>
                    {comm.type === 'EMAIL' ? (
                      <Badge variant="outline" className="bg-blue-50">
                        <Mail className="h-3 w-3 mr-1" /> Email
                      </Badge>
                    ) : comm.type === 'SMS' ? (
                      <Badge variant="outline" className="bg-green-50">
                        <Phone className="h-3 w-3 mr-1" /> SMS
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-purple-50">
                        <Pencil className="h-3 w-3 mr-1" /> Note
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{comm.subject || "No Subject"}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {comm.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(comm.status)}>
                      {React.createElement(getStatusIcon(comm.status), { className: "h-3 w-3 mr-1" })}
                      {comm.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </TabsContent>
    
    {/* Send Communication Tab */}
    <TabsContent value="send">
      <CardContent>
        {!canSendEmail && !canSendSMS ? (
          <div className="p-8 text-center border rounded-md">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Cannot Send Communications</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
              This staff member has not enabled any communication preferences.
              Update their profile to enable email or SMS communications.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Communication Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset subject for SMS
                          if (value === 'SMS') {
                            form.setValue('subject', 'SMS Message');
                          }
                        }}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="EMAIL" 
                              disabled={!canSendEmail}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Mail className="h-4 w-4 inline mr-2" />
                            Email
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value="SMS" 
                              disabled={!canSendSMS} 
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Phone className="h-4 w-4 inline mr-2" />
                            SMS
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Only show subject field for Email */}
              {form.watch('type') === 'EMAIL' && (
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your message" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch('type') === 'SMS' 
                        ? 'SMS messages should be concise and under 160 characters for best delivery.' 
                        : 'Enter the email content to be sent to the staff member.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Communication'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </TabsContent>
    
    {/* Leave Note Tab */}
    <TabsContent value="note">
      <CardContent>
        <Form {...noteForm}>
          <form onSubmit={noteForm.handleSubmit(onSubmitNote)} className="space-y-6 px-2">
            <FormField
              control={noteForm.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={noteForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your note" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This note will be saved to the staff member's communication history.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isAddingNote}>
              {isAddingNote ? 'Saving...' : 'Save Note'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </TabsContent>
  </Tabs>
</Card>
      </div>
    </div>
  );
}