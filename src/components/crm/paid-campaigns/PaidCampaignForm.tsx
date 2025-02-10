import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CampaignParamsDto } from "@/app/api/external/omnigateway/types/paid-campaigns";

const campaignFormSchema = z.object({
  utmSource: z.string().min(1, "Source is required"),
  utmMedium: z.string().min(1, "Medium is required"),
  utmCampaign: z.string().min(1, "Campaign name is required"),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional()
});

interface CampaignFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignParamsDto) => Promise<void>;
  initialData?: Partial<CampaignParamsDto>;
  title: string;
}

export function PaidCampaignForm({ open, onClose, onSubmit, initialData, title }: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: ''
    }
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData || {});
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: z.infer<typeof campaignFormSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="utmSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. facebook" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="utmMedium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medium</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. cpc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="utmCampaign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter campaign name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="utmContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Content identifier (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="utmTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Keywords (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 
                  (initialData ? 'Updating...' : 'Creating...') : 
                  (initialData ? 'Update Campaign' : 'Create Campaign')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}