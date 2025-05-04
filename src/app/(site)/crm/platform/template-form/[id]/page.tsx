// src/app/admin/crm/platform/template-form/[id]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import TemplateForm from "@/components/crm/templates/TemplateForm";

export const metadata: Metadata = {
  title: "Template Customization - PixelBreeze",
  description: "Customize and generate images from templates",
};

export default function TemplateFormPage({ params }: { params: { id: string } }) {
  const templateId = parseInt(params.id);

  return (
    <div className="container mx-auto px-3 py-8">
      <Suspense fallback={<TemplateFormLoading />}>
        <TemplateForm templateId={templateId} />
      </Suspense>
    </div>
  );
}

function TemplateFormLoading() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}