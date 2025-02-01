// components/staff/add-staff-modal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { StaffRole, StaffStatus } from '@/types/staff';
import InputSelect from "@/components/Common/InputSelect";

const staffFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  subRole: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  dateOfJoin: z.string(),
  status: z.string(),
  canAccessApp: z.boolean().default(false),
  password: z.union([
    z.string().min(6, "Password must be at least 6 characters"),
    z.string().length(0)
  ]).optional()
}).refine((data) => {
  // If canAccessApp is true, password must be provided and at least 6 characters
  if (data.canAccessApp) {
    return data.password && data.password.length >= 6;
  }
  return true;
}, {
  message: "Password is required and must be at least 6 characters when app access is enabled",
  path: ["password"]
});

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments: Array<{ id: string; name: string }>;
  clientId: string;
}

export function AddStaffModal({ isOpen, onClose, onSuccess, departments, clientId }: AddStaffModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof staffFormSchema>>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      subRole: '',
      departmentId: '',
      dateOfJoin: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      canAccessApp: false,
      password: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof staffFormSchema>) => {
    try {
      setIsSubmitting(true);
      const formattedDate = new Date(values.dateOfJoin).toISOString();
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dateOfJoin: formattedDate, // Use the formatted date
          clientId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create staff member');
      }
      
      toast.success('Staff member created successfully');
      onClose();
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Staff creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter first name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="Enter email address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <InputSelect
                        name={field.name}
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        options={
                          departments && departments.length > 0
                            ? departments.map((dept) => ({
                                value: dept.id,
                                label: dept.name,
                              }))
                            : [{ value: "", label: "Select department" }]
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <InputSelect
                        name={field.name}
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { value: "", label: "Select role" },
                          ...Object.values(StaffRole).map((role) => ({
                            value: role,
                            label: role,
                          }))
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <InputSelect
                        name={field.name}
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { value: "", label: "Select status" },
                          ...Object.values(StaffStatus).map((status) => ({
                            value: status,
                            label: status,
                          }))
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfJoin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Join</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="canAccessApp"
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
                      Can access sales associate app
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('canAccessApp') && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        placeholder="Enter password (min. 6 characters)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                className="bg-primary"
              >
                {isSubmitting ? 'Creating...' : 'Create Staff Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}