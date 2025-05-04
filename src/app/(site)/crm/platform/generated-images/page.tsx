// src/app/admin/crm/platform/generated-images/page.tsx
import { Metadata } from "next";
import GeneratedImagesContent from "@/components/crm/templates/GeneratedImagesContent"
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Generated Images - PixelBreeze",
  description: "All Generated Images",
};

export default function GeneratedImagesPage() {
  return (
    <div className="container mx-auto px-3 py-6">
      <h1 className="text-2xl font-bold mb-6">All Generated Images</h1>
      <Suspense fallback={<GeneratedImagesLoading />}>
        <GeneratedImagesContent />
      </Suspense>
    </div>
  );
}

function GeneratedImagesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}