import { Metadata } from "next";
import { Suspense } from "react";
import TemplateDashboard from "@/components/crm/templates/TemplateDashboard";

export const metadata: Metadata = {
  title: "Template Dashboard - PixelBreeze",
  description: "Analytics and management for generated images",
};

export default function TemplateDashboardPage({ params }: { params: { id: string } }) {
  const templateId = parseInt(params.id);

  return (
    <div className="container mx-auto px-3">
      <Suspense fallback={<DashboardLoading />}>
        <TemplateDashboard templateId={templateId} />
      </Suspense>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}