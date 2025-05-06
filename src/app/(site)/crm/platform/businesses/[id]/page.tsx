// src/app/crm/platform/businesses/[id]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import BusinessDetailsContent from "@/components/crm/business/business-details-content";

export const metadata: Metadata = {
  title: "Business Details - Staffluent Admin",
  description: "View and manage business details",
};

export default function BusinessDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="px-3">
      <Suspense fallback={<BusinessDetailsLoading />}>
        <BusinessDetailsContent businessId={params.id} />
      </Suspense>
    </div>
  );
}

// Loading component to show while the page is loading
function BusinessDetailsLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  );
}