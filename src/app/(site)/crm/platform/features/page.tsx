// src/app/crm/platform/features/page.tsx
import { Metadata } from "next"
import FeaturesListContent from "@/components/crm/features/features-list-content"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Features - Staffluent Admin",
    description: "View all available features in the system",
}

export default function FeaturesPage() {
    return (
        <div className="px-3">
            <Suspense fallback={<FeaturesLoading />}>
                <FeaturesListContent />
            </Suspense>
        </div>
    );
}

// Loading component to show while the page is loading
function FeaturesLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
        </div>
    );
}