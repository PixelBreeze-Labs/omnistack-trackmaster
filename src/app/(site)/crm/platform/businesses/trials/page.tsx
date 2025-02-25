// src/app/crm/platform/businesss/trials/page.tsx
import { Metadata } from "next"
import BusinessesTrialsContent from "@/components/crm/business/business-trials-content"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Businesses - TrackMaster CRM",
    description: "Manage your businesses",
}

export default function BusinessesTrialsPage() {
    return (
        <div className="px-3">
       <Suspense fallback={<BusinessesTrialsLoading />}>
          <BusinessesTrialsContent />
        </Suspense>
      </div>
    );
  }

// Loading component to show while the page is loading
function BusinessesTrialsLoading() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
      </div>
    );
  }