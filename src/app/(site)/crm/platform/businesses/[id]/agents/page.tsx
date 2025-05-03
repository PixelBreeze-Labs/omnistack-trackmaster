// src/app/crm/platform/businesses/[id]/agents/page.tsx
import { Metadata } from "next"
import BusinessAgentsContent from "@/components/crm/business/business-agents-content"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Business Agents - Staffluent Admin",
    description: "Manage intelligent agents for a business",
}

export default function BusinessAgentsPage({ params }: { params: { id: string } }) {
    return (
        <div className="px-3">
            <Suspense fallback={<BusinessAgentsLoading />}>
                <BusinessAgentsContent businessId={params.id} />
            </Suspense>
        </div>
    );
}

// Loading component to show while the page is loading
function BusinessAgentsLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
        </div>
    );
}