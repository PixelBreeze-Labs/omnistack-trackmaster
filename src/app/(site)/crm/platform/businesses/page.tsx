// src/app/crm/platform/businesss/page.tsx
import { Metadata } from "next"
import BusinessesContent from "@/components/crm/business/business-content"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Businesses - TrackMaster CRM",
    description: "Manage your businesses",
}

export default function BusinessesPage() {
    return (
        <div className="px-3">
       <Suspense fallback={<BusinessesLoading />}>
          <BusinessesContent />
        </Suspense>
      </div>
    );
  }

// Loading component to show while the page is loading
function BusinessesLoading() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
      </div>
    );
  }