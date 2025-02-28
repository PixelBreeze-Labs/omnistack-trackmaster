// src/app/crm/platform/businesses/[id]/features/page.tsx
import { Metadata } from "next"
import BusinessFeaturesContent from "@/components/crm/business/business-features-content"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Business Features - Staffluent Admin",
    description: "Manage custom features for a business",
}

export default function BusinessFeaturesPage({ params }: { params: { id: string } }) {
    return (
        <div className="px-3">
            <Suspense fallback={<BusinessFeaturesLoading />}>
                <BusinessFeaturesContent businessId={params.id} />
            </Suspense>
        </div>
    );
}

// Loading component to show while the page is loading
function BusinessFeaturesLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
        </div>
    );
}