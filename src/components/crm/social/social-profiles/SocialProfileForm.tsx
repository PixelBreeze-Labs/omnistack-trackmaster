// components/crm/social/social-profiles/SocialProfileForm.tsx
import { useState, useEffect } from "react";
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
import InputSelect from "@/components/Common/InputSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateSocialProfileDto, SocialProfileType } from "@/app/api/external/omnigateway/types/social-profiles";
import { useOperatingEntities } from "@/hooks/useOperatingEntities";
import { useEffect as useReactEffect } from "react";

const socialProfileFormSchema = z.object({
  type: z.nativeEnum(SocialProfileType),
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  url: z.string().url("Invalid URL").optional().or(z.literal('')),
  operatingEntityId: z.string().min(2, "Operating entity is required")
});

interface SocialProfileFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateSocialProfileDto, 'clientId'>) => Promise<void>;
  initialData?: Partial<CreateSocialProfileDto>;
  title: string;
}

export function SocialProfileForm({ open, onClose, onSubmit, initialData, title }: SocialProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { operatingEntities, fetchOperatingEntities } = useOperatingEntities();

  const form = useForm<z.infer<typeof socialProfileFormSchema>>({
    resolver: zodResolver(socialProfileFormSchema),
    defaultValues: {
      type: SocialProfileType.FACEBOOK,
      accountName: '',
      username: '',
      url: '',
      operatingEntityId: ''
    }
  });

  useReactEffect(() => {
    if (open) {
      fetchOperatingEntities();
    }
  }, [open, fetchOperatingEntities]);

  useEffect(() => {
    if (open) {
      form.reset(initialData || {
        type: SocialProfileType.FACEBOOK,
        accountName: '',
        username: '',
        url: '',
        operatingEntityId: ''
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: z.infer<typeof socialProfileFormSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...values,
        url: values.url || undefined
      });
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <InputSelect
                      name="type"
                      label=""
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      options={[
                        { value: SocialProfileType.FACEBOOK, label: "Facebook" },
                        { value: SocialProfileType.INSTAGRAM, label: "Instagram" },
                        { value: SocialProfileType.TIKTOK, label: "TikTok" },
                        { value: SocialProfileType.TWITTER, label: "Twitter" },
                        { value: SocialProfileType.LINKEDIN, label: "LinkedIn" },
                        { value: SocialProfileType.YOUTUBE, label: "YouTube" },
                        { value: SocialProfileType.OTHER, label: "Other" }
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter username (e.g. @example)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/profile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operatingEntityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operating Entity</FormLabel>
                  <FormControl>
                    <InputSelect
                      name="operatingEntityId"
                      label=""
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      options={[
                        { value: "", label: "Select an operating entity" },
                        ...operatingEntities.map(entity => ({
                          value: entity._id,
                          label: entity.name
                        }))
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  (initialData ? 'Update Profile' : 'Create Profile')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}