// components/crm/social/operating-entities/OperatingEntityForm.tsx
"use client";
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
import { CreateOperatingEntityDto, OperatingEntityType } from "@/app/api/external/omnigateway/types/operating-entities";
import { useGatewayClientApiKey } from "@/hooks/useGatewayClientApiKey";

const operatingEntityFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.nativeEnum(OperatingEntityType),
  url: z.string().url("Invalid URL").optional().or(z.literal(''))
});

interface OperatingEntityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOperatingEntityDto) => Promise<void>;
  initialData?: Partial<CreateOperatingEntityDto>;
  title: string;
}

export function OperatingEntityForm({ open, onClose, onSubmit, initialData, title }: OperatingEntityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clientId } = useGatewayClientApiKey();

  const form = useForm<z.infer<typeof operatingEntityFormSchema>>({
    resolver: zodResolver(operatingEntityFormSchema),
    defaultValues: {
      name: '',
      type: OperatingEntityType.OTHER,
      url: ''
    }
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData || {
        name: '',
        type: OperatingEntityType.OTHER,
        url: ''
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: z.infer<typeof operatingEntityFormSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...values,
        clientId: clientId as string,
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter entity name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <InputSelect
                      name="type"
                      label=""
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      options={[
                        { value: OperatingEntityType.SOCIAL_MEDIA_PLATFORM, label: "Social Media Platform" },
                        { value: OperatingEntityType.MARKETING, label: "Marketing" },
                        { value: OperatingEntityType.NEWS_PORTAL, label: "News Portal" },
                        { value: OperatingEntityType.OTHER, label: "Other" }
                      ]}
                    />
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
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
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
                  (initialData ? 'Update Entity' : 'Create Entity')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}