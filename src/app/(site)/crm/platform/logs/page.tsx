// src/app/admin/crm/platform/logs/page.tsx
import { Metadata } from "next";
import LogsContent from "@/components/crm/templates/LogsContent"
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Logs - PixelBreeze",
  description: "All Logs",
};

export default function GeneratedImagesPage() {
  return (
    <div className="container mx-auto px-3">
      <Suspense fallback={<LogsLoading />}>
        <LogsContent />
      </Suspense>
    </div>
  );
}

function LogsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}