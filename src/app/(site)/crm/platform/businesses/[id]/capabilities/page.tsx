// src/app/crm/platform/businesses/[id]/capabilities/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import BusinessCapabilitiesContent from "@/components/crm/business/business-capabilities-content";

export const metadata: Metadata = {
  title: "Business Capabilities - Staffluent Admin",
  description: "Manage business capabilities and employee access permissions",
};

export default function BusinessCapabilitiesPage({ params }: { params: { id: string } }) {
  return (
    <div className="px-3">
      <Suspense fallback={<BusinessCapabilitiesLoading />}>
        <BusinessCapabilitiesContent businessId={params.id} />
      </Suspense>
    </div>
  );
}

// Loading component to show while the page is loading
function BusinessCapabilitiesLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  );
}