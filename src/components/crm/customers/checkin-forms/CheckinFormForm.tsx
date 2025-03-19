// components/crm/customers/checkin-forms/CheckinFormForm.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckinFormConfig } from "@/app/api/external/omnigateway/types/checkin-forms";
import InputSelect from "@/components/Common/InputSelect";
import { useRentalUnits } from "@/hooks/useRentalUnits";
import { useBookings } from "@/hooks/useBookings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the schema for the check-in form
const formSchema = z.object({
  name: z.string().min(2, "Form name must be at least 2 characters"),
  propertyId: z.string().optional(),
  bookingId: z.string().optional(),
  isActive: z.boolean().default(true),
  isPreArrival: z.boolean().default(false),
  requiresAuthentication: z.boolean().default(false),
  receiptEmail: z.string().email("Invalid email").optional().or(z.literal('')),
  expiresAt: z.string().optional(),
  formConfig: z.object({
    defaultLanguage: z.string().default("en"),
    languages: z.array(z.string()).default(["en"]),
    submitButtonText: z.record(z.string(), z.string()).default({ en: "Submit" }),
    fields: z.array(z.any()).default([]),
    sections: z.array(z.any()).default([])
  }),
  metadata: z.record(z.string(), z.any()).optional()
});

interface CheckinFormFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: CheckinFormConfig;
  title: string;
}

export function CheckinFormForm({ open, onClose, onSubmit, initialData, title }: CheckinFormFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { rentalUnits, fetchRentalUnits } = useRentalUnits();
  const { bookings, fetchBookings } = useBookings();
  const [activeTab, setActiveTab] = useState("general");

  // Initialize the form with default values or initial data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      propertyId: '',
      bookingId: '',
      isActive: true,
      isPreArrival: false,
      requiresAuthentication: false,
      receiptEmail: '',
      expiresAt: '',
      formConfig: {
        defaultLanguage: 'en',
        languages: ['en'],
        submitButtonText: { en: 'Submit' },
        fields: [],
        sections: []
      },
      metadata: {}
    }
  });

  // Fetch properties and bookings when the component mounts
  useEffect(() => {
    fetchRentalUnits();
    fetchBookings();
  }, [fetchRentalUnits, fetchBookings]);

  // Reset the form when the dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Transform initialData to match the form structure
        const formData = {
          ...initialData,
          propertyId: initialData.propertyId ? 
            (typeof initialData.propertyId === 'object' ? initialData.propertyId._id : initialData.propertyId) : 
            '',
          bookingId: initialData.bookingId ? 
            (typeof initialData.bookingId === 'object' ? initialData.bookingId._id : initialData.bookingId) : 
            '',
          expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : '',
          formConfig: initialData.formConfig || {
            defaultLanguage: 'en',
            languages: ['en'],
            submitButtonText: { en: 'Submit' },
            fields: [],
            sections: []
          }
        };
        form.reset(formData);
      } else {
        form.reset({
          name: '',
          propertyId: '',
          bookingId: '',
          isActive: true,
          isPreArrival: false,
          requiresAuthentication: false,
          receiptEmail: '',
          expiresAt: '',
          formConfig: {
            defaultLanguage: 'en',
            languages: ['en'],
            submitButtonText: { en: 'Submit' },
            fields: [],
            sections: []
          },
          metadata: {}
        });
      }
    }
  }, [open, initialData, form]);

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // For new forms with no fields/sections defined yet, use default template
      if (!initialData && (!values.formConfig.fields || values.formConfig.fields.length === 0)) {
        values.formConfig.fields = getDefaultFormFields();
        values.formConfig.sections = getDefaultFormSections();
      }
      
      // Create a clean object for submission
      const submitData = {
        ...values,
        // Don't include propertyId if it's empty
        propertyId: values.propertyId ? values.propertyId : undefined,
        // Don't include bookingId if it's empty
        bookingId: values.bookingId ? values.bookingId : undefined
      };
      
      // Filter out undefined values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === "" || submitData[key] === undefined) {
          delete submitData[key];
        }
      });
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get default form fields for new forms
  const getDefaultFormFields = () => {
    return [
      {
        name: 'firstName',
        type: 'text',
        label: { en: 'First Name' },
        placeholder: { en: 'Enter your first name' },
        required: true
      },
      {
        name: 'lastName',
        type: 'text',
        label: { en: 'Last Name' },
        placeholder: { en: 'Enter your last name' },
        required: true
      },
      {
        name: 'email',
        type: 'email',
        label: { en: 'Email Address' },
        placeholder: { en: 'Enter your email address' },
        required: true
      },
      {
        name: 'phoneNumber',
        type: 'tel',
        label: { en: 'Phone Number' },
        placeholder: { en: 'Enter your phone number' },
        required: true
      },
      {
        name: 'addressLine1',
        type: 'text',
        label: { en: 'Address Line 1' },
        placeholder: { en: 'Enter your street address' },
        required: true
      },
      {
        name: 'addressLine2',
        type: 'text',
        label: { en: 'Address Line 2' },
        placeholder: { en: 'Apartment, suite, etc. (optional)' },
        required: false
      },
      {
        name: 'city',
        type: 'text',
        label: { en: 'City' },
        placeholder: { en: 'Enter your city' },
        required: true
      },
      {
        name: 'state',
        type: 'text',
        label: { en: 'State/Province' },
        placeholder: { en: 'Enter your state or province' },
        required: true
      },
      {
        name: 'postalCode',
        type: 'text',
        label: { en: 'Postal Code' },
        placeholder: { en: 'Enter your postal code' },
        required: true
      },
      {
        name: 'idType',
        type: 'select',
        label: { en: 'ID Type' },
        required: true,
        options: [
          { value: 'passport', label: { en: 'Passport' } },
          { value: 'drivers_license', label: { en: 'Driver\'s License' } },
          { value: 'id_card', label: { en: 'ID Card' } },
          { value: 'other', label: { en: 'Other' } }
        ]
      },
      {
        name: 'needsParkingSpot',
        type: 'radio',
        label: { en: 'Do you need a parking spot?' },
        required: true,
        options: [
          { value: 'true', label: { en: 'Yes' } },
          { value: 'false', label: { en: 'No' } }
        ]
      },
      {
        name: 'vehicleMakeModel',
        type: 'text',
        label: { en: 'Vehicle Make and Model' },
        placeholder: { en: 'E.g. Toyota Camry' },
        required: false
      },
      {
        name: 'vehicleLicensePlate',
        type: 'text',
        label: { en: 'Vehicle License Plate' },
        placeholder: { en: 'Enter license plate number' },
        required: false
      },
      {
        name: 'vehicleColor',
        type: 'text',
        label: { en: 'Vehicle Color' },
        placeholder: { en: 'E.g. Blue' },
        required: false
      },
      {
        name: 'expectedArrivalTime',
        type: 'text',
        label: { en: 'Expected Arrival Time' },
        placeholder: { en: 'E.g. 3:00 PM' },
        required: true
      },
      {
        name: 'specialRequests',
        type: 'text',
        label: { en: 'Special Requests' },
        placeholder: { en: 'Any special requests or notes (optional)' },
        required: false
      }
    ];
  };

  // Get default form sections for new forms
  const getDefaultFormSections = () => {
    return [
      {
        name: 'personalInfo',
        title: { en: 'Personal Information' },
        fields: ['firstName', 'lastName', 'email', 'phoneNumber']
      },
      {
        name: 'address',
        title: { en: 'Address Information' },
        fields: ['addressLine1', 'addressLine2', 'city', 'state', 'postalCode']
      },
      {
        name: 'identification',
        title: { en: 'Identification' },
        fields: ['idType']
      },
      {
        name: 'vehicle',
        title: { en: 'Vehicle Information' },
        fields: ['needsParkingSpot', 'vehicleMakeModel', 'vehicleLicensePlate', 'vehicleColor']
      },
      {
        name: 'arrival',
        title: { en: 'Arrival Information' },
        fields: ['expectedArrivalTime', 'specialRequests']
      }
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2" onClick={(e) => e.preventDefault()}>
                <TabsTrigger value="general" type="button">General Settings</TabsTrigger>
                <TabsTrigger value="advanced" type="button">Advanced Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter form name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property (Optional)</FormLabel>
                        <FormControl>
                          <InputSelect
                            name="propertyId"
                            label=""
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            options={[
                              { value: "", label: "Select Property" },
                              ...(rentalUnits?.map(property => ({
                                value: property._id,
                                label: property.name
                              })) || [])
                            ]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking (Optional)</FormLabel>
                        <FormControl>
                          <InputSelect
                            name="bookingId"
                            label=""
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            options={[
                              { value: "", label: "Select Booking" },
                              ...(bookings?.map(booking => ({
                                value: booking._id,
                                label: `#${booking.confirmationCode || booking._id.substring(0, 8)}`
                              })) || [])
                            ]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isPreArrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Pre-Arrival Form</FormLabel>
                          <FormDescription>
                            Send to guests before they arrive
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Form Status</FormLabel>
                          <FormDescription>
                            {field.value ? 'Active and accepting submissions' : 'Inactive and not accepting submissions'}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="receiptEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="Email to receive form submissions" 
                        />
                      </FormControl>
                      <FormDescription>
                        If provided, notifications will be sent to this email when the form is submitted
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </FormControl>
                      <FormDescription>
                        The form will no longer accept submissions after this date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiresAuthentication"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Require Authentication
                        </FormLabel>
                        <FormDescription>
                          If enabled, guests will need to verify their identity before accessing the form
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  (initialData ? 'Updating...' : 'Creating...') : 
                  (initialData ? 'Update Form' : 'Create Form')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}