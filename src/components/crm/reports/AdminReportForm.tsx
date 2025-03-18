import { useState, useEffect, useRef } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ReportStatus } from "@/app/api/external/omnigateway/types/admin-reports";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createCitizensApi } from "@/app/api/external/omnigateway/citizens";
import { createReportTagsApi } from "@/app/api/external/omnigateway/report-tags";
import { useGatewayClientApiKey } from "@/hooks/useGatewayClientApiKey";
import InputSelect from "@/components/Common/InputSelect";
import { X, Tag, Image, Trash2 } from "lucide-react";

const reportFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  status: z.string().default(ReportStatus.PENDING_REVIEW),
  customAuthorName: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  visibleOnWeb: z.boolean().default(true),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  reportTags: z.array(z.string()).optional(),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    accuracy: z.number().optional()
  }).optional()
});

interface AdminReportFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Partial<z.infer<typeof reportFormSchema>>;
  title: string;
}

interface Citizen {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

interface ReportTag {
  _id: string;
  name: string;
  color: string;
}

export function AdminReportForm({ open, onClose, onSubmit, initialData, title }: AdminReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [reportTags, setReportTags] = useState<ReportTag[]>([]);
  const [isLoadingCitizens, setIsLoadingCitizens] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { apiKey } = useGatewayClientApiKey();

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      status: ReportStatus.ACTIVE, // Default to ACTIVE for admin-created reports
      customAuthorName: '',
      isAnonymous: false,
      isFeatured: false,
      visibleOnWeb: true,
      authorId: '',
      tags: [],
      reportTags: [],
      location: {
        lat: undefined,
        lng: undefined
      }
    }
  });

  const fetchCitizens = async () => {
    if (!apiKey) return;
    
    try {
      setIsLoadingCitizens(true);
      const citizensApi = createCitizensApi(apiKey);
      const response = await citizensApi.getCitizens({
        limit: 100 // Get a reasonable number of citizens
      });
      setCitizens(response.data || []);
    } catch (error) {
      console.error('Error fetching citizens:', error);
    } finally {
      setIsLoadingCitizens(false);
    }
  };

  const fetchReportTags = async () => {
    if (!apiKey) return;
    
    try {
      setIsLoadingTags(true);
      const tagsApi = createReportTagsApi(apiKey);
      const response = await tagsApi.getReportTags();
      setReportTags(response.data || []);
    } catch (error) {
      console.error('Error fetching report tags:', error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  useEffect(() => {
    if (open && apiKey) {
      fetchCitizens();
      fetchReportTags();
    }
  }, [open, apiKey]);

  useEffect(() => {
    if (open) {
      form.reset(initialData || {});
      // Clear image previews when form is opened/reset
      setUploadedImages([]);
      setPreviewUrls([]);
    }
  }, [open, initialData, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array and filter for images
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (newFiles.length > 0) {
      // Add to existing images (up to 10 total)
      const updatedImages = [...uploadedImages, ...newFiles].slice(0, 10);
      setUploadedImages(updatedImages);

      // Generate preview URLs for each file
      const newPreviewUrls = updatedImages.map(file => URL.createObjectURL(file));
      
      // Revoke old preview URLs to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setPreviewUrls(newPreviewUrls);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);

    // Revoke the URL of the removed image
    URL.revokeObjectURL(previewUrls[index]);
    
    const updatedPreviewUrls = [...previewUrls];
    updatedPreviewUrls.splice(index, 1);
    setPreviewUrls(updatedPreviewUrls);
  };

  const handleSubmit = async (values: z.infer<typeof reportFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Convert form data to FormData for multipart/form-data
      const formData = new FormData();
      
      // IMPORTANT: Add all basic fields first
      formData.append('title', values.title || '');
      formData.append('content', values.content || '');
      formData.append('category', values.category || '');
      formData.append('status', values.status || ReportStatus.ACTIVE);
      
      // Add boolean fields as strings
      formData.append('isAnonymous', values.isAnonymous ? 'true' : 'false');
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false');
      formData.append('visibleOnWeb', values.visibleOnWeb ? 'true' : 'false');
      
      // Add optional fields if they exist
      if (values.authorId) {
        formData.append('authorId', values.authorId);
      }
      
      if (values.customAuthorName) {
        formData.append('customAuthorName', values.customAuthorName);
      }
      
      // Handle location object
      if (values.location && 
          ((values.location.lat !== undefined && values.location.lat !== null) || 
           (values.location.lng !== undefined && values.location.lng !== null))) {
        formData.append('location', JSON.stringify(values.location));
      }
      
      if (values.reportTags && values.reportTags.length > 0) {
        formData.append('reportTags', JSON.stringify(values.reportTags));
        
      }
      
      // Add media files LAST (important for some backends)
      if (uploadedImages && uploadedImages.length > 0) {
        uploadedImages.forEach(file => {
          formData.append('media', file);
        });
      }
      
      console.log('Submitting form with data:');
      // Log what we're sending (for debugging)
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], 'File:', (pair[1] as File).name, (pair[1] as File).type, (pair[1] as File).size);
        } else {
          console.log(pair[0], pair[1]);
        }
      }
      
      // Send to API
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchReportTags = form.watch("reportTags") || [];

  const selectedTags = watchReportTags.map(tagId => 
    reportTags.find(tag => tag._id === tagId)
  ).filter(Boolean) as ReportTag[];

  const handleRemoveTag = (tagId: string) => {
    const currentTags = form.getValues("reportTags") || [];
    form.setValue("reportTags", currentTags.filter(id => id !== tagId));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter report title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter report content" 
                      className="min-h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <InputSelect
                        name="category"
                        label=""
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        options={[
                          { value: "", label: "Select a category" },
                          { value: "infrastructure", label: "Infrastructure" },
                          { value: "safety", label: "Safety" },
                          { value: "environment", label: "Environment" },
                          { value: "public_services", label: "Public Services" },
                          { value: "health_services", label: "Health Services" },
                          { value: "transportation", label: "Transportation" },
                          { value: "community", label: "Community" }
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <InputSelect
                        name="status"
                        label=""
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        options={[
                          { value: "", label: "Select a status" },
                          { value: ReportStatus.PENDING_REVIEW, label: "Pending Review" },
                          { value: ReportStatus.ACTIVE, label: "Active" },
                          { value: ReportStatus.IN_PROGRESS, label: "In Progress" },
                          { value: ReportStatus.RESOLVED, label: "Resolved" },
                          { value: ReportStatus.CLOSED, label: "Closed" },
                          { value: ReportStatus.NO_RESOLUTION, label: "No Resolution" },
                          { value: ReportStatus.REJECTED, label: "Rejected" }
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Author Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Author Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Citizen</FormLabel>
                      <FormControl>
                        <InputSelect
                          name="authorId"
                          label=""
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          options={[
                            { value: "", label: "Select a citizen (optional)" },
                            ...citizens.map(citizen => ({
                              value: citizen._id,
                              label: `${citizen.name} ${citizen.surname} (${citizen.email})`
                            }))
                          ]}
                        />
                      </FormControl>
                      {isLoadingCitizens && (
                        <div className="text-xs text-muted-foreground">Loading citizens...</div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between pt-8">
                      <div className="space-y-0.5">
                        <FormLabel>Anonymous Report</FormLabel>
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

              {/* Custom author name field */}
              <FormField
                control={form.control}
                name="customAuthorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Author Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter custom author name (optional)" 
                      />
                    </FormControl>
                    <FormDescription>
                      You can provide a display name for the author, regardless of whether the report is anonymous or linked to a citizen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Media</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Upload Images ({uploadedImages.length}/10)
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Up to 10 images
                  </span>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="h-24 w-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Tags</h3>
              </div>

              <FormField
                control={form.control}
                name="reportTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <InputSelect
                          name="reportTagSelect"
                          label=""
                          value=""
                          onChange={(e) => {
                            const tagId = e.target.value;
                            if (tagId) {
                              const currentTags = field.value || [];
                              if (!currentTags.includes(tagId)) {
                                field.onChange([...currentTags, tagId]);
                              }
                            }
                          }}
                          options={[
                            { value: "", label: "Select tags to add" },
                            ...reportTags
                              .filter(tag => !watchReportTags.includes(tag._id))
                              .map(tag => ({
                                value: tag._id,
                                label: tag.name
                              }))
                          ]}
                        />

                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map(tag => (
                            <Badge 
                              key={tag._id} 
                              variant="outline"
                              className="flex items-center gap-1 px-3 py-1"
                              style={{ 
                                backgroundColor: `${tag.color}20`, // Add transparency
                                color: tag.color,
                                borderColor: tag.color
                              }}
                            >
                              <Tag className="h-3 w-3" />
                              {tag.name}
                              <button 
                                type="button"
                                onClick={() => handleRemoveTag(tag._id)}
                                className="ml-1 rounded-full hover:bg-muted p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}

                          {selectedTags.length === 0 && (
                            <div className="text-sm text-muted-foreground">
                              No tags selected
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    {isLoadingTags && (
                      <div className="text-xs text-muted-foreground">Loading tags...</div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-4 pt-2">
                <FormField
                  control={form.control}
                  name="visibleOnWeb"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Visible to Public</FormLabel>
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

              <div className="grid grid-cols-1 gap-4 pt-2">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Feature this Report</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="any"
                        placeholder="e.g. 40.7128"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="any"
                        placeholder="e.g. -74.0060"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  (initialData ? 'Update Report' : 'Create Report')
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}