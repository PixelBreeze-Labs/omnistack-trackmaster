// components/report-tags/ReportTagForm.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateReportTagDto } from "@/app/api/external/omnigateway/types/report-tags";

const reportTagFormSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
  description: z.string().optional()
});

interface ReportTagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReportTagDto) => Promise<void>;
  initialData?: Partial<CreateReportTagDto>;
  title: string;
}

export function ReportTagForm({ open, onClose, onSubmit, initialData, title }: ReportTagFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reportTagFormSchema>>({
    resolver: zodResolver(reportTagFormSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData || {});
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: z.infer<typeof reportTagFormSchema>) => {
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
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter tag name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter description (optional)" 
                      rows={3} 
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
                  (initialData ? 'Update Tag' : 'Create Tag')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}