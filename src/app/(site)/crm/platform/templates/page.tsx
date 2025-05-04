// src/app/admin/crm/platform/templates/page.tsx
import { Metadata } from "next";
import TemplateGrid from "@/components/crm/templates/TemplateGrid"
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Image Templates - PixelBreeze",
  description: "Select an image template to customize",
};

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-3">
      <h1 className="text-2xl font-bold mb-6">Image Templates</h1>
      <Suspense fallback={<TemplatesLoading />}>
        <TemplateGrid />
      </Suspense>
    </div>
  );
}

function TemplatesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}